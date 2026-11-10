import logging
import math
from decimal import Decimal
from typing import Annotated

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator

try:  # Supports both `uvicorn api:app --app-dir ai` and `import ai.api`.
    from .grading.answer_matching import compare_answers
    from .grading.scoring import calculate_marks
    from .grading.hybrid_evaluator import evaluate_rubric
except ImportError:
    from grading.answer_matching import compare_answers
    from grading.scoring import calculate_marks
    from grading.hybrid_evaluator import evaluate_rubric


logger = logging.getLogger(__name__)
app = FastAPI(title="AI Smart Grading Service", version="1.0.0")


class GradeRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    questionText: Annotated[str, Field(min_length=1, max_length=10000)]
    studentAnswer: Annotated[str, Field(min_length=1, max_length=100000)]
    expectedAnswer: Annotated[str, Field(min_length=1, max_length=100000)]
    markingCriteria: Annotated[str, Field(min_length=1, max_length=100000)]
    keywords: Annotated[list[Annotated[str, Field(min_length=1, max_length=300)]], Field(min_length=1, max_length=100)]
    maxMarks: Annotated[Decimal, Field(gt=0, max_digits=6, decimal_places=2)]

    @field_validator("keywords")
    @classmethod
    def strip_and_validate_keywords(cls, values: list[str]) -> list[str]:
        keywords = [value.strip() for value in values if value.strip()]
        if not keywords:
            raise ValueError("At least one non-empty keyword is required")
        return keywords


class GradeResponse(BaseModel):
    score: float
    confidenceScore: None = None
    evaluation: str
    feedback: None = None
    similarityScore: float
    keywordsFound: int
    totalKeywords: int


class RubricCriterion(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Annotated[str, Field(min_length=1, max_length=200)]
    description: Annotated[str, Field(min_length=1, max_length=5000)] | None = None
    marks: Annotated[Decimal, Field(ge=0, max_digits=6, decimal_places=2)]
    keywords: list[Annotated[str, Field(min_length=1, max_length=300)]] = Field(default_factory=list, max_length=100)
    synonyms: list[Annotated[str, Field(min_length=1, max_length=300)]] = Field(default_factory=list, max_length=100)


class RubricGradeRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    studentAnswer: Annotated[str, Field(max_length=100000)]
    rubricCriteria: Annotated[list[RubricCriterion], Field(min_length=1, max_length=100)]
    maxMarks: Annotated[Decimal, Field(gt=0, max_digits=6, decimal_places=2)]
    allowUnallocatedMarks: bool = False
    allowEvidenceReuse: bool = False

    @field_validator("studentAnswer")
    @classmethod
    def require_answer(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("studentAnswer must contain non-whitespace text")
        return value


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "UP"}


@app.post("/ai/grade", response_model=GradeResponse)
def grade(request: GradeRequest) -> GradeResponse:
    try:
        similarity = float(compare_answers(request.studentAnswer, request.expectedAnswer))
        score, keywords_found = calculate_marks(
            similarity,
            request.studentAnswer,
            request.keywords,
            float(request.maxMarks),
        )
        score = float(score)
        if not math.isfinite(similarity) or not math.isfinite(score):
            raise ValueError("The grading model returned a non-finite value")
    except Exception as exc:
        logger.exception("AI grading failed")
        raise HTTPException(status_code=500, detail="AI grading failed") from exc

    evaluation = (
        f"Semantic similarity: {similarity:.4f}; "
        f"keywords matched: {int(keywords_found)}/{len(request.keywords)}."
    )
    return GradeResponse(
        score=score,
        evaluation=evaluation,
        similarityScore=similarity,
        keywordsFound=int(keywords_found),
        totalKeywords=len(request.keywords),
    )


@app.post("/ai/grade/rubric")
def grade_rubric(request: RubricGradeRequest) -> dict:
    """Additive criterion-based grading route; legacy /ai/grade is unchanged."""
    criteria = [item.model_dump(exclude_none=True) for item in request.rubricCriteria]
    try:
        result = evaluate_rubric(
            request.studentAnswer,
            criteria,
            float(request.maxMarks),
            allow_unallocated_marks=request.allowUnallocatedMarks,
            allow_evidence_reuse=request.allowEvidenceReuse,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Rubric grading failed")
        raise HTTPException(status_code=503, detail="Rubric grading is unavailable") from exc
    return result

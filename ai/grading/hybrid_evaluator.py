"""Conservative rubric evaluation coordinating existing grading components.

This module uses lexical evidence and the existing semantic matcher together.
Its similarity cutoff inherits the provisional threshold in semantic_matching;
the result must be reviewed where signals disagree or a contradiction appears.
"""

import math

try:
    from .concept_matching import evaluate_concept
    from .evidence_extraction import extract_evidence
    from .scoring import score_rubric
    from .semantic_matching import evaluate_semantic_concept
except ImportError:  # Supports `uvicorn api:app --app-dir ai`.
    from grading.concept_matching import evaluate_concept
    from grading.evidence_extraction import extract_evidence
    from grading.scoring import score_rubric
    from grading.semantic_matching import evaluate_semantic_concept


def evaluate_rubric(
    student_answer,
    criteria,
    question_max_marks,
    *,
    allow_unallocated_marks=False,
    allow_evidence_reuse=False,
):
    """Evaluate an answer against explicit professor criteria.

    Each criterion needs ``name`` and ``marks``; a description (or name) is
    compared semantically. Lexical/concept evidence is also required before
    any marks can be awarded. Similarity alone and keywords alone never award
    marks. This is a conservative, uncalibrated evaluator, not a replacement
    for professor approval.
    """
    if not isinstance(student_answer, str):
        raise TypeError("student_answer must be a string")
    if not isinstance(criteria, (list, tuple)) or not criteria:
        raise ValueError("criteria must be a non-empty list")

    # Validate allocation shape before loading/calling the embedding model.
    if any(not isinstance(item, dict) for item in criteria):
        raise ValueError("each criterion must be a mapping")
    try:
        allocated_marks = sum(float(item["marks"]) for item in criteria)
        maximum = float(question_max_marks)
    except (TypeError, ValueError, KeyError) as exc:
        raise ValueError("criteria marks and question_max_marks must be numeric") from exc
    if not math.isfinite(maximum) or maximum < 0:
        raise ValueError("question_max_marks must be finite and non-negative")
    if allocated_marks > maximum:
        raise ValueError("criterion allocations exceed question_max_marks")
    if allocated_marks < maximum and not allow_unallocated_marks:
        raise ValueError("criterion allocations must equal question_max_marks")

    rubric = []
    assessments = {}
    evaluations = []
    for criterion in criteria:
        if not isinstance(criterion, dict):
            raise ValueError("each criterion must be a mapping")
        name = criterion.get("name")
        description = criterion.get("description") or name
        if not isinstance(name, str) or not name.strip():
            raise ValueError("each criterion requires a name")
        if not isinstance(description, str) or not description.strip():
            raise ValueError(f"criterion {name!r} requires a description")
        keywords = criterion.get("keywords", [])
        synonyms = criterion.get("synonyms", [])
        if not isinstance(keywords, (list, tuple)) or not isinstance(synonyms, (list, tuple)):
            raise ValueError(f"criterion {name!r} keywords and synonyms must be lists")

        lexical = evaluate_concept(student_answer, {
            "name": name,
            "keywords": list(keywords),
            "synonyms": list(synonyms),
        })
        semantic = evaluate_semantic_concept(student_answer, {
            "name": name,
            "description": description,
            "keywords": list(keywords),
            "synonyms": list(synonyms),
        })
        found = extract_evidence(
            student_answer,
            description,
            accepted_keywords=keywords,
            accepted_synonyms=synonyms,
            criterion_name=name,
        )["evidence"]
        negated = bool(lexical["negated_terms"] or semantic.get("negated_terms"))
        signals_agree = bool(lexical["matched"] and semantic["matched"] and not negated)
        review_reasons = []
        if negated:
            review_reasons.append("possible_contradiction")
        if semantic.get("review_required"):
            review_reasons.append("semantic_evaluator_requests_review")
        if bool(lexical["matched"]) != bool(semantic["matched"]):
            review_reasons.append("lexical_semantic_disagreement")
        if not found and student_answer.strip():
            review_reasons.append("no_literal_criterion_span")
        review_reasons.append("uncalibrated_ai_requires_professor_approval")

        # A full answer quotation can ground a semantic paraphrase when no
        # literal criterion term is present. It is not asserted to entail it.
        quote = found[0]["quote"] if found else (student_answer if student_answer else None)
        support = 1.0 if signals_agree and quote else 0.0
        if quote:
            assessments[name] = {
                "criterion": name,
                "quote": quote,
                "support": support,
                "explanation": (
                    "Semantic and concept signals support the rubric criterion."
                    if support
                    else "Evidence was located, but correctness is unresolved; professor review is required."
                ),
                # There is no calibrated benchmark to justify auto-finalizing
                # any AI-awarded marks; keep all provisional marks reviewable.
                "review_required": True,
                "review_reasons": review_reasons,
            }
        rubric.append({"name": name, "marks": criterion.get("marks"), "keywords": list(keywords)})
        evaluations.append({
            "criterion": name,
            "description": description,
            "concept": lexical,
            "semantic": semantic,
            "extracted_evidence": found,
            "review_required": True,
            "review_reasons": review_reasons,
        })

    scored = score_rubric(
        student_answer,
        rubric,
        question_max_marks=question_max_marks,
        allow_unallocated_marks=allow_unallocated_marks,
        evidence=assessments,
        allow_evidence_reuse=allow_evidence_reuse,
    )
    scored_by_name = {item["criterion"]: item for item in scored["criteria"]}
    for item in evaluations:
        item["scoring"] = scored_by_name[item["criterion"]]
    scored["criterion_assessments"] = evaluations
    scored["review_required"] = any(item["review_required"] for item in evaluations)
    scored["confidence_score"] = None  # No calibrated confidence model exists.
    scored["feedback"] = "Professor review is required before finalizing this AI assessment."
    return scored

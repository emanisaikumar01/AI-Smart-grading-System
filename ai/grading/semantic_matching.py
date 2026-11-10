from functools import lru_cache

from grading.answer_matching import _load_model
from grading.text_normalization import normalize_text
from grading.concept_matching import is_negated


@lru_cache(maxsize=1)
def get_model():
    return _load_model()


def evaluate_semantic_concept(student_answer, concept):
    """
    Evaluate a marking criterion using semantic similarity
    and basic concept evidence.

    Similarity is supporting evidence, not proof of correctness.
    """

    if not isinstance(student_answer, str):
        raise TypeError("Student answer must be a string")

    criterion = concept.get("description") or concept.get("name", "")

    if not isinstance(criterion, str) or not criterion.strip():
        raise ValueError("Concept requires a name or description")

    normalized_answer = normalize_text(student_answer)
    normalized_criterion = normalize_text(criterion)

    if not normalized_answer:
        return {
            "concept": concept.get("name", criterion),
            "similarity": 0.0,
            "matched": False,
            "review_required": True,
            "reason": "Empty student answer"
        }

    model = get_model()

    embeddings = model.encode(
        [normalized_answer, normalized_criterion],
        convert_to_tensor=True,
        normalize_embeddings=True
    )

    from sentence_transformers import util

    similarity = util.cos_sim(
        embeddings[0],
        embeddings[1]
    ).item()

    # Basic contradiction safeguard for explicitly stated terms
    terms = (
        [concept.get("name", "")]
        + concept.get("keywords", [])
        + concept.get("synonyms", [])
    )

    negated = [
        term for term in terms
        if isinstance(term, str)
        and term.strip()
        and is_negated(
            normalized_answer,
            normalize_text(term)
        )
    ]

    # This is a provisional threshold, not a validated grading cutoff.
    matched = similarity >= 0.65 and not negated

    return {
        "concept": concept.get("name", criterion),
        "similarity": round(similarity, 4),
        "matched": matched,
        "negated_terms": list(dict.fromkeys(negated)),
        "review_required": bool(negated),
        "reason": (
            "Potential contradiction detected"
            if negated
            else "Semantic similarity evaluated"
        )
    }

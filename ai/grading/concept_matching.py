import re

from grading.text_normalization import normalize_text


NEGATION_WORDS = {
    "not",
    "no",
    "never",
    "without",
    "lack",
    "lacks",
    "lacking",
}


def is_negated(text, term):
    """
    Detect common negation patterns around a concept.
    """

    text = text.lower()

    contractions = {
        "don't": "do not",
        "doesn't": "does not",
        "didn't": "did not",
        "isn't": "is not",
        "aren't": "are not",
        "wasn't": "was not",
        "weren't": "were not",
        "can't": "cannot",
        "won't": "will not"
    }

    for contraction, replacement in contractions.items():
        text = re.sub(
            rf"\b{re.escape(contraction)}\b",
            replacement,
            text
        )

    pattern = rf"(?<!\w){re.escape(term)}(?!\w)"
    match = re.search(pattern, text)

    if not match:
        return False

    before = text[:match.start()].split()[-5:]
    after = text[match.end():].split()[:5]

    # "Not only" does not indicate negation
    if "not" in before and "only" in before:
        not_index = len(before) - 1 - before[::-1].index("not")
        only_index = len(before) - 1 - before[::-1].index("only")

        if only_index == not_index + 1:
            before = before[only_index + 1:]

    negation_words = {
        "not", "no", "never", "without",
        "lack", "lacks", "lacking"
    }

    return (
        any(word in negation_words for word in before)
        or any(word in negation_words for word in after)
    )

def evaluate_concept(student_answer, concept):
    normalized_answer = normalize_text(student_answer)

    if not isinstance(concept, dict):
        raise TypeError("concept must be a mapping")
    name = concept.get("name", "")
    if not isinstance(name, str):
        raise TypeError("concept name must be a string")
    keywords = concept.get("keywords", [])
    synonyms = concept.get("synonyms", [])
    if not isinstance(keywords, (list, tuple)) or not isinstance(synonyms, (list, tuple)):
        raise TypeError("concept keywords and synonyms must be lists")

    terms = [name] + keywords + synonyms

    matched_terms = []
    negated_terms = []

    for term in terms:
        if not isinstance(term, str) or not term.strip():
            continue

        normalized_term = normalize_text(term)

        if not normalized_term:
            continue

        pattern = rf"(?<!\w){re.escape(normalized_term)}(?!\w)"

        if re.search(pattern, normalized_answer):
            if is_negated(normalized_answer, normalized_term):
                negated_terms.append(term)
            else:
                matched_terms.append(term)

    matched_terms = list(dict.fromkeys(matched_terms))
    negated_terms = list(dict.fromkeys(negated_terms))

    # Phrase/name evidence must not be counted multiple times through aliases.
    matched_terms = list(dict.fromkeys(matched_terms))
    negated_terms = list(dict.fromkeys(negated_terms))
    matched = bool(matched_terms) and not bool(negated_terms)

    return {
        "concept": name,
        "matched": matched,
        "matched_terms": matched_terms,
        "negated_terms": negated_terms,
        "marks": concept.get("marks", 0)
    }


def evaluate_concepts(student_answer, concepts):
    if not isinstance(student_answer, str):
        raise TypeError("student_answer must be a string")
    if not isinstance(concepts, (list, tuple)):
        raise TypeError("concepts must be a list or tuple")
    results = [
        evaluate_concept(student_answer, concept)
        for concept in concepts
    ]

    return {
        "concept_results": results,
        "matched_concepts": sum(
            result["matched"] for result in results
        ),
        "total_concepts": len(results)
    }

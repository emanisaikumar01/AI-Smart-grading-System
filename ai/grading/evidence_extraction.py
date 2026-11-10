"""Extract verbatim text spans that may support a rubric criterion.

Finding a term is only a retrieval signal. This module does not determine
whether a quotation is relevant, correct, or sufficient for marks.
"""

import re

from grading.text_normalization import normalize_text


def _iter_terms(criterion_description, accepted_keywords, accepted_synonyms):
    values = [criterion_description, *(accepted_keywords or ()), *(accepted_synonyms or ())]
    seen = set()
    for value in values:
        if not isinstance(value, str) or not value.strip():
            continue
        key = normalize_text(value)
        if key and key not in seen:
            seen.add(key)
            yield value.strip()


def _normalized_occurrences(answer, term):
    """Return spans matched by normalized word sequences, retaining source offsets."""
    source_tokens = []
    for match in re.finditer(r"\w+", answer, flags=re.UNICODE):
        normalized_tokens = normalize_text(match.group()).split()
        source_tokens.extend((token, match.start(), match.end()) for token in normalized_tokens)

    target_tokens = normalize_text(term).split()
    if not target_tokens:
        return
    width = len(target_tokens)
    for index in range(len(source_tokens) - width + 1):
        candidate = source_tokens[index:index + width]
        if [item[0] for item in candidate] == target_tokens:
            yield candidate[0][1], candidate[-1][2]


def extract_evidence(
    student_answer,
    criterion_description,
    accepted_keywords=None,
    accepted_synonyms=None,
    *,
    criterion_name=None,
):
    """Extract exact source spans matching criterion text, keywords, or synonyms.

    Returns ``{"criterion": name, "evidence": [...]}``. Every quotation is
    sliced from the original answer and carries original character offsets.
    All returned matches require semantic verification; no score is assigned.
    """
    if not isinstance(student_answer, str):
        raise TypeError("student_answer must be a string")
    if not isinstance(criterion_description, str) or not criterion_description.strip():
        raise ValueError("criterion_description must be a non-empty string")
    for label, values in (("accepted_keywords", accepted_keywords), ("accepted_synonyms", accepted_synonyms)):
        if values is not None and not isinstance(values, (list, tuple)):
            raise TypeError(f"{label} must be a list or tuple")
    if criterion_name is None:
        criterion_name = criterion_description
    if not isinstance(criterion_name, str) or not criterion_name.strip():
        raise ValueError("criterion_name must be a non-empty string")

    evidence = []
    seen = set()
    for term in _iter_terms(criterion_description, accepted_keywords, accepted_synonyms):
        pattern = re.compile(rf"(?<!\w){re.escape(term)}(?!\w)", flags=re.IGNORECASE)
        matches = [(match.start(), match.end(),
                    "exact_phrase" if match.group() == term else "case_insensitive")
                   for match in pattern.finditer(student_answer)]

        if not matches:
            matches = [(start, end, "normalized_phrase")
                       for start, end in _normalized_occurrences(student_answer, term)]

        for start, end, match_type in matches:
            key = (start, end, normalize_text(term))
            if key in seen:
                continue
            seen.add(key)
            evidence.append({
                "criterion": criterion_name,
                "quote": student_answer[start:end],
                "start": start,
                "end": end,
                "matched_term": term,
                "match_type": match_type,
                "requires_semantic_verification": True,
            })

    evidence.sort(key=lambda item: (item["start"], item["end"], item["matched_term"].casefold()))
    return {"criterion": criterion_name, "evidence": evidence}

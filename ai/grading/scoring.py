from difflib import SequenceMatcher
import math
import re


def clean_word(word):
    return re.sub(r'[^a-zA-Z]', '', word.lower())


def word_similarity(word1, word2):
    return SequenceMatcher(
        None,
        word1,
        word2
    ).ratio()


def keyword_found(keyword, student_text):

    keyword_words = [
        clean_word(word)
        for word in keyword.split()
    ]

    student_words = [
        clean_word(word)
        for word in student_text.split()
    ]

    # Remove empty words
    student_words = [
        word for word in student_words
        if word
    ]

    # Check every keyword word
    for keyword_word in keyword_words:

        found = False

        for student_word in student_words:

            similarity = word_similarity(
                keyword_word,
                student_word
            )

            if similarity >= 0.80:

                found = True
                break

        if not found:
            return False

    return True


def calculate_marks(
    similarity_score,
    student_answer,
    keywords,
    total_marks
):

    if not isinstance(student_answer, str):
        raise TypeError("student_answer must be a string")
    if not math.isfinite(float(similarity_score)):
        raise ValueError("similarity_score must be finite")
    if not math.isfinite(float(total_marks)) or float(total_marks) < 0:
        raise ValueError("total_marks must be a finite non-negative number")
    if keywords is None:
        keywords = []
    if not isinstance(keywords, (list, tuple)):
        raise TypeError("keywords must be a list or tuple")

    # Retained for backwards compatibility with the current API contract.
    similarity_part = (
        min(1.0, max(0.0, float(similarity_score))) * 0.70
    )

    # Keyword = 30%
    found_keywords = 0

    for keyword in keywords:

        if keyword_found(
            keyword,
            student_answer
        ):
            found_keywords += 1

    keyword_score = found_keywords / len(keywords) if keywords else 0.0

    keyword_part = (
        keyword_score * 0.30
    )

    final_score = (
        similarity_part +
        keyword_part
    )

    marks = final_score * total_marks

    return round(marks, 2), found_keywords


def score_rubric(
    student_answer,
    criteria,
    *,
    question_max_marks,
    evidence=None,
    allow_unallocated_marks=False,
    allow_evidence_reuse=False,
):
    """Score explicit rubric criteria using externally assessed, quoted evidence.

    This function does not infer semantic correctness. Evidence is a mapping
    from criterion name to ``{"quote", "support", "explanation"}``; each
    quote must occur verbatim in the student's answer. Keyword hits are
    returned as signals only and never affect marks.
    """
    if not isinstance(student_answer, str):
        raise TypeError("student_answer must be a string")
    if not isinstance(criteria, (list, tuple)) or not criteria:
        raise ValueError("criteria must be a non-empty list")
    evidence = {} if evidence is None else evidence
    if not isinstance(evidence, dict):
        raise TypeError("evidence must be a mapping")
    if not isinstance(allow_unallocated_marks, bool) or not isinstance(allow_evidence_reuse, bool):
        raise TypeError("rubric policies must be boolean")
    try:
        question_max_marks = float(question_max_marks)
    except (TypeError, ValueError) as exc:
        raise ValueError("question_max_marks must be numeric") from exc
    if not math.isfinite(question_max_marks) or question_max_marks < 0:
        raise ValueError("question_max_marks must be finite and non-negative")

    seen_names, used_quotes, results = set(), set(), []
    total, awarded = 0.0, 0.0
    for index, criterion in enumerate(criteria):
        if not isinstance(criterion, dict):
            raise ValueError(f"criterion {index} must be a mapping")
        name = criterion.get("name")
        marks = criterion.get("marks")
        if not isinstance(name, str) or not name.strip() or name in seen_names:
            raise ValueError("each criterion requires a unique non-empty name")
        try:
            marks = float(marks)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"criterion {name!r} has invalid marks") from exc
        if not math.isfinite(marks) or marks < 0:
            raise ValueError(f"criterion {name!r} marks must be finite and non-negative")
        seen_names.add(name)
        total += marks
        phrases = criterion.get("keywords", [])
        if not isinstance(phrases, (list, tuple)):
            raise ValueError(f"criterion {name!r} keywords must be a list")
        hits = []
        for phrase in phrases:
            if not isinstance(phrase, str) or not phrase.strip():
                continue
            normalized = phrase.strip().lower()
            if normalized in student_answer.lower():
                hits.append(phrase)
        has_assessment = name in evidence
        raw_assessment = evidence.get(name)
        quote, explanation = None, "No criterion assessment evidence supplied"
        review_required = True
        support = 0.0
        if has_assessment:
            if not isinstance(raw_assessment, dict):
                raise ValueError(f"evidence for {name!r} must be an assessment mapping")
            if raw_assessment.get("criterion") != name:
                raise ValueError(f"evidence for {name!r} must include its criterion name")
            quote = raw_assessment.get("quote")
            explanation = raw_assessment.get("explanation")
            if not isinstance(quote, str) or not quote:
                raise ValueError(f"evidence for {name!r} requires a non-empty quote")
            if quote not in student_answer:
                raise ValueError(f"evidence quote for {name!r} is not present in the student answer")
            if quote in used_quotes and not allow_evidence_reuse:
                raise ValueError(f"evidence quote for {name!r} is already used by another criterion")
            used_quotes.add(quote)
            if not isinstance(explanation, str) or not explanation.strip():
                raise ValueError(f"evidence for {name!r} requires an explanation")
            raw_support = raw_assessment.get("support")
            review_required = raw_assessment.get("review_required", False)
            if not isinstance(review_required, bool):
                raise ValueError(f"evidence review_required for {name!r} must be boolean")
        else:
            raw_support = 0.0
        try:
            support = float(raw_support)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"criterion {name!r} evidence must be numeric") from exc
        if not math.isfinite(support) or not 0 <= support <= 1:
            raise ValueError(f"criterion {name!r} evidence must be between 0 and 1")
        if support > 0 and not has_assessment:
            raise ValueError(f"criterion {name!r} cannot receive support without quoted evidence")
        score = round(marks * support, 2)
        awarded += score
        results.append({
            "criterion": name,
            "max_marks": marks,
            "marks_awarded": score,
            "evidence": {"criterion": name, "quote": quote, "keyword_hits": hits},
            "support": support,
            "explanation": explanation,
            "review_required": review_required,
        })

    unknown_evidence = set(evidence) - seen_names
    if unknown_evidence:
        raise ValueError(f"evidence supplied for unknown criteria: {sorted(unknown_evidence)}")
    if total > question_max_marks:
        raise ValueError("criterion allocations exceed question_max_marks")
    if total < question_max_marks and not allow_unallocated_marks:
        raise ValueError("criterion allocations must equal question_max_marks")
    return {
        "marks_awarded": round(awarded, 2),
        "max_marks": question_max_marks,
        "allocated_marks": round(total, 2),
        "criteria": results,
    }

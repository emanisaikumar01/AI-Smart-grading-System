from grading.evidence_extraction import extract_evidence


def _extract(answer, *, description="photosynthesis", keywords=None, synonyms=None):
    return extract_evidence(
        answer,
        description,
        accepted_keywords=keywords,
        accepted_synonyms=synonyms,
        criterion_name="photosynthesis concept",
    )["evidence"]


def test_exact_phrase_returns_verbatim_span():
    answer = "Plants use sunlight for photosynthesis."
    evidence = _extract(answer, keywords=["use sunlight"])
    assert any(item["quote"] == "use sunlight" and item["match_type"] == "exact_phrase" for item in evidence)


def test_case_insensitive_phrase_match():
    evidence = _extract("Photosynthesis occurs in plants.")
    assert evidence[0]["quote"] == "Photosynthesis"
    assert evidence[0]["match_type"] == "case_insensitive"


def test_punctuation_around_phrase_does_not_break_match():
    answer = "The process (carbon dioxide), plus water, is needed."
    evidence = _extract(answer, description="process not present", keywords=["carbon dioxide"])
    item = next(item for item in evidence if item["matched_term"] == "carbon dioxide")
    assert item["quote"] == "carbon dioxide"
    assert answer[item["start"]:item["end"]] == item["quote"]


def test_multiple_occurrences_are_returned():
    answer = "Water is used; later, WATER is released."
    evidence = _extract(answer, description="unused description", keywords=["water"])
    water = [item for item in evidence if item["matched_term"] == "water"]
    assert [item["quote"] for item in water] == ["Water", "WATER"]


def test_multiple_synonyms_are_searched():
    answer = "Plants use CO2 and water."
    evidence = _extract(
        answer,
        description="unused description",
        synonyms=["carbon dioxide", "water"],
    )
    assert {item["quote"] for item in evidence} == {"CO2", "water"}
    match_types = {item["quote"]: item["match_type"] for item in evidence}
    assert match_types["CO2"] == "normalized_phrase"
    assert match_types["water"] == "exact_phrase"


def test_partial_word_does_not_match():
    assert _extract("A photochemical process occurs.", keywords=["photo"]) == []


def test_empty_answer_has_no_evidence():
    assert _extract("") == []


def test_no_matching_term_returns_empty_list():
    assert _extract("Plants use light and water.", keywords=["carbon dioxide"]) == []


def test_quote_offsets_preserve_original_characters():
    answer = "  Plants use ‘SUNLIGHT’ for food.  "
    item = _extract(answer, description="unused criterion", keywords=["sunlight"])[0]
    assert answer[item["start"]:item["end"]] == item["quote"] == "SUNLIGHT"
    assert item["start"] == answer.index("SUNLIGHT")
    assert item["end"] == item["start"] + len("SUNLIGHT")
    assert item["criterion"] == "photosynthesis concept"
    assert item["requires_semantic_verification"] is True

from grading.concept_matching import evaluate_concept


def test_concept_positive_evidence():
    result = evaluate_concept("Plants release oxygen.", {
        "name": "oxygen", "keywords": ["release oxygen"], "synonyms": []
    })
    assert result["matched"] is True


def test_explicit_negation_is_flagged_as_negated_evidence():
    result = evaluate_concept("Plants do not release oxygen.", {
        "name": "oxygen", "keywords": ["release oxygen"], "synonyms": []
    })
    assert result["matched"] is False
    assert result["negated_terms"]


def test_not_only_is_not_treated_as_negation():
    result = evaluate_concept("Plants not only release oxygen but also glucose.", {
        "name": "oxygen", "keywords": ["release oxygen"], "synonyms": []
    })
    assert result["matched"] is True


def test_empty_answer_has_no_concept_evidence():
    result = evaluate_concept("", {"name": "water", "keywords": ["water"]})
    assert result["matched"] is False

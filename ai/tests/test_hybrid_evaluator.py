from grading import hybrid_evaluator as hybrid


def _semantic_match(answer, concept):
    return {
        "concept": concept["name"], "similarity": 0.9, "matched": True,
        "negated_terms": [], "review_required": False, "reason": "test double",
    }


def test_hybrid_uses_both_lexical_and_semantic_evidence(monkeypatch):
    monkeypatch.setattr(hybrid, "evaluate_semantic_concept", _semantic_match)
    result = hybrid.evaluate_rubric(
        "Plants use sunlight to make food.",
        [{"name": "sunlight", "description": "Plants use sunlight", "marks": 2,
          "keywords": ["sunlight"], "synonyms": []}],
        question_max_marks=2,
    )
    assert result["marks_awarded"] == 2
    assert result["review_required"] is True
    assessment = result["criterion_assessments"][0]
    assert assessment["concept"]["matched"] is True
    assert assessment["semantic"]["matched"] is True
    assert "uncalibrated_ai_requires_professor_approval" in assessment["review_reasons"]
    assert assessment["scoring"]["evidence"]["quote"] == "Plants use sunlight"
    assert result["confidence_score"] is None


def test_hybrid_disagreement_awards_no_marks_and_requires_review(monkeypatch):
    monkeypatch.setattr(hybrid, "evaluate_semantic_concept", lambda answer, concept: {
        "concept": concept["name"], "similarity": 0.2, "matched": False,
        "negated_terms": [], "review_required": False, "reason": "test disagreement",
    })
    result = hybrid.evaluate_rubric(
        "sunlight", [{"name": "sunlight", "marks": 1, "keywords": ["sunlight"]}],
        question_max_marks=1,
    )
    assert result["marks_awarded"] == 0
    assert result["review_required"] is True


def test_hybrid_negation_blocks_marks_and_flags_possible_contradiction(monkeypatch):
    monkeypatch.setattr(hybrid, "evaluate_semantic_concept", _semantic_match)
    result = hybrid.evaluate_rubric(
        "Plants do not use sunlight.",
        [{"name": "sunlight", "marks": 1, "keywords": ["sunlight"]}],
        question_max_marks=1,
    )
    assert result["marks_awarded"] == 0
    assessment = result["criterion_assessments"][0]
    assert assessment["review_required"] is True
    assert "possible_contradiction" in assessment["review_reasons"]

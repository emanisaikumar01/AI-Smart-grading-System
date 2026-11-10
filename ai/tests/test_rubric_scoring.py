import pytest

from grading.scoring import calculate_marks, score_rubric


def _assessment(quote, support=1.0, explanation="The quoted statement supports this criterion.", **extra):
    return {"criterion": "", "quote": quote, "support": support, "explanation": explanation, **extra}


def test_empty_legacy_keyword_list_does_not_divide_by_zero():
    marks, count = calculate_marks(0.8, "an answer", [], 5)
    assert marks == 2.8
    assert count == 0


def test_keyword_hit_is_only_a_signal_and_does_not_award_marks():
    result = score_rubric(
        "sunlight", [{"name": "energy conversion", "marks": 2, "keywords": ["sunlight"]}],
        question_max_marks=2,
    )
    criterion = result["criteria"][0]
    assert criterion["evidence"]["keyword_hits"] == ["sunlight"]
    assert criterion["marks_awarded"] == 0
    assert criterion["support"] == 0
    assert criterion["review_required"] is True


def test_partial_credit_requires_quoted_evidence_and_explanation():
    assessment = _assessment("sunlight", 0.5, "Identifies energy source but omits conversion.")
    assessment["criterion"] = "energy"
    result = score_rubric(
        "Plants use sunlight.", [{"name": "energy", "marks": 2}],
        question_max_marks=2,
        evidence={"energy": assessment},
    )
    criterion = result["criteria"][0]
    assert result["marks_awarded"] == 1
    assert criterion["evidence"]["quote"] == "sunlight"
    assert criterion["support"] == 0.5
    assert criterion["explanation"] == "Identifies energy source but omits conversion."
    assert criterion["review_required"] is False


@pytest.mark.parametrize("answer", ["", "Unrelated response"])
def test_empty_or_unrelated_answer_cannot_receive_marks_without_evidence(answer):
    result = score_rubric(
        answer, [{"name": "water", "marks": 1, "keywords": ["water"]}],
        question_max_marks=1,
    )
    assert result["marks_awarded"] == 0
    assert result["criteria"][0]["support"] == 0


def test_unsupported_quote_is_rejected():
    assessment = _assessment("plants absorb water", 1)
    assessment["criterion"] = "water"
    with pytest.raises(ValueError, match="not present"):
        score_rubric(
            "Plants use water.", [{"name": "water", "marks": 1}], question_max_marks=1,
            evidence={"water": assessment},
        )


def test_support_without_assessment_cannot_award_marks():
    with pytest.raises(ValueError, match="assessment mapping"):
        score_rubric(
            "", [{"name": "water", "marks": 1}], question_max_marks=1,
            evidence={"water": 1.0},
        )


def test_evidence_reuse_is_rejected_by_default_and_allowed_explicitly():
    criteria = [{"name": "first", "marks": 1}, {"name": "second", "marks": 1}]
    evidence = {name: _assessment("water", 0.5, criterion=name) for name in ("first", "second")}
    with pytest.raises(ValueError, match="already used"):
        score_rubric("water", criteria, question_max_marks=2, evidence=evidence)

    result = score_rubric(
        "water", criteria, question_max_marks=2, evidence=evidence, allow_evidence_reuse=True,
    )
    assert result["marks_awarded"] == 1


@pytest.mark.parametrize(
    "allocations,total,allow_unallocated,expected",
    [
        ([1], 2, False, "equal"),  # Below total is rejected unless policy permits it.
        ([2], 2, False, None),
        ([3], 2, True, "exceed"),  # Above total is always rejected.
        ([1], 2, True, None),
    ],
)
def test_criterion_totals_reconcile_with_question_maximum(
    allocations, total, allow_unallocated, expected
):
    criteria = [{"name": f"criterion-{i}", "marks": marks} for i, marks in enumerate(allocations)]
    if expected:
        with pytest.raises(ValueError, match=expected):
            score_rubric(
                "", criteria, question_max_marks=total,
                allow_unallocated_marks=allow_unallocated,
            )
    else:
        result = score_rubric(
            "", criteria, question_max_marks=total,
            allow_unallocated_marks=allow_unallocated,
        )
        assert result["max_marks"] == total


def test_invalid_question_maximum_is_rejected():
    with pytest.raises(ValueError, match="question_max_marks"):
        score_rubric("", [{"name": "x", "marks": 1}], question_max_marks=-1)

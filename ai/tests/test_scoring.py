
from grading.scoring import calculate_marks


def test_calculate_marks():
    similarity_score = 0.687053918838501
    student_answer = (
        "Machine learning enables computers to learn "
        "from data and identify patterns."
    )
    keywords = ["machine learning", "data", "patterns"]
    total_marks = 10

    marks, found_keywords = calculate_marks(
        similarity_score,
        student_answer,
        keywords,
        total_marks
    )

    assert isinstance(marks, float)
    assert 0 <= marks <= total_marks
    assert found_keywords == 3


def test_calculate_marks_returns_keyword_count():
    similarity_score = 0.9
    student_answer = "Python programming language"
    keywords = ["Python", "programming"]
    total_marks = 10

    marks, found_keywords = calculate_marks(
        similarity_score,
        student_answer,
        keywords,
        total_marks
    )

    assert found_keywords == 2
    assert marks > 0


def test_calculate_marks_with_no_matching_keywords():
    similarity_score = 0.5
    student_answer = "Unrelated answer"
    keywords = ["Python", "programming"]
    total_marks = 10

    marks, found_keywords = calculate_marks(
        similarity_score,
        student_answer,
        keywords,
        total_marks
    )

    assert found_keywords == 0
    assert marks == 3.5

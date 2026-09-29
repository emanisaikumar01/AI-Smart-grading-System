from difflib import SequenceMatcher
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

    # Similarity = 70%
    similarity_part = (
        similarity_score * 0.70
    )

    # Keyword = 30%
    found_keywords = 0

    for keyword in keywords:

        if keyword_found(
            keyword,
            student_answer
        ):
            found_keywords += 1

    keyword_score = (
        found_keywords / len(keywords)
    )

    keyword_part = (
        keyword_score * 0.30
    )

    final_score = (
        similarity_part +
        keyword_part
    )

    marks = final_score * total_marks

    return round(marks, 2), found_keywords
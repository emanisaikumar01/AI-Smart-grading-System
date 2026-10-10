from functools import lru_cache


@lru_cache(maxsize=1)
def _load_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer("all-MiniLM-L6-v2")


def compare_answers(student_answer, correct_answer):
    model = _load_model()
    from sentence_transformers import util
    student_embedding = model.encode(student_answer, convert_to_tensor=True)
    correct_embedding = model.encode(correct_answer, convert_to_tensor=True)

    similarity = util.cos_sim(student_embedding, correct_embedding)

    return similarity.item()

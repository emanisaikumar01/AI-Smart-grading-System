from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")


def compare_answers(student_answer, correct_answer):
    student_embedding = model.encode(student_answer, convert_to_tensor=True)
    correct_embedding = model.encode(correct_answer, convert_to_tensor=True)

    similarity = util.cos_sim(student_embedding, correct_embedding)

    return similarity.item()
import sys
sys.path.append("..")

from grading.answer_matching import compare_answers

correct_answer = (
    "Photosynthesis is the process by which green plants make their own food. "
    "Plants use sunlight, water and carbon dioxide to prepare their food."
)

student_answer = (
    "Philadelphia is one process by which green plants make their own food. "
    "Places use sunlight, walls and carbon dioxide to prepare their food."
)

score = compare_answers(student_answer, correct_answer)

print("Similarity Score:", score)
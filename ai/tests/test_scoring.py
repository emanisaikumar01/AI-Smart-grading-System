import sys
sys.path.append("..")

from grading.scoring import calculate_marks

similarity_score = 0.687053918838501
total_marks = 10

marks = calculate_marks(similarity_score, total_marks)

print("Similarity Score:", similarity_score)
print("Marks:", marks, "/", total_marks)
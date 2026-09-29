import sys
import json
import openpyxl
import cv2

from pathlib import Path
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

sys.path.append("..")

from grading.answer_matching import compare_answers
from grading.scoring import calculate_marks
from ocr.text_cleaning import clean_text


MODEL_NAME = "microsoft/trocr-base-handwritten"

print("Loading TrOCR model...")

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)


def split_lines(image_path):

    image = cv2.imread(str(image_path))

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    binary = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        31,
        15
    )

    row_pixels = (binary > 0).sum(axis=1)

    active_rows = row_pixels > 20

    # Ignore top part of page
    active_rows[:150] = False

    groups = []
    start = None

    for i, active in enumerate(active_rows):

        if active and start is None:
            start = i

        elif not active and start is not None:

            if i - start > 5:
                groups.append((start, i))

            start = None

    if start is not None:
        groups.append((start, len(active_rows)))

    line_images = []

    for y1, y2 in groups:

        y1 = max(0, y1 - 15)
        y2 = min(image.shape[0], y2 + 15)

        cropped = image[y1:y2, :]

        # Remove empty left/right space
        crop_gray = cv2.cvtColor(
            cropped,
            cv2.COLOR_BGR2GRAY
        )

        crop_binary = cv2.adaptiveThreshold(
            crop_gray,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            31,
            15
        )

        column_pixels = (crop_binary > 0).sum(axis=0)

        active_columns = column_pixels > 3

        columns = []

        for x, active in enumerate(active_columns):

            if active:
                columns.append(x)

        if columns:

            x1 = max(0, min(columns) - 20)
            x2 = min(
                cropped.shape[1],
                max(columns) + 20
            )

            cropped = cropped[:, x1:x2]

        line_images.append(cropped)

    return line_images


def ocr_answer(image_path):

    lines = split_lines(image_path)

    print("Lines detected:", len(lines))

    full_text = []

    for i, line in enumerate(lines):

        pil_image = Image.fromarray(
            cv2.cvtColor(line, cv2.COLOR_BGR2RGB)
        )

        pixel_values = processor(
            images=pil_image,
            return_tensors="pt"
        ).pixel_values

        generated_ids = model.generate(
            pixel_values,
            max_new_tokens=64,
            num_beams=4
        )

        text = processor.batch_decode(
            generated_ids,
            skip_special_tokens=True
        )[0]

        print(f"Line {i + 1}: {text}")

        full_text.append(text)

    return clean_text(" ".join(full_text))


# Questions
questions = [1, 2]

total_marks_all = 0
total_marks_obtained = 0
results = []


for question_number in questions:

    print("\n================================")
    print("Grading Question", question_number)
    print("================================")

    answer_key_path = Path(
        f"../data/answer_keys/answer{question_number}.json"
    )

    answer_folder = Path(
        f"../data/answersheets/question{question_number}"
    )

    with open(
        answer_key_path,
        "r",
        encoding="utf-8"
    ) as file:

        answer_data = json.load(file)

    question = answer_data["question"]
    correct_answer = answer_data["answer"]

    image_files = list(
        answer_folder.glob("*.png")
    )

    if not image_files:

        print("No answer image found.")
        continue

    image_path = image_files[0]

    print("\nImage:", image_path)

    # OCR using line-by-line processing
    student_answer = ocr_answer(image_path)

    print("\nStudent Answer:")
    print(student_answer)

    print("\nCorrect Answer:")
    print(correct_answer)


    keywords = [
        "photosynthesis",
        "plants",
        "sunlight",
        "water",
        "carbon dioxide"
    ]


    similarity_score = compare_answers(
        student_answer,
        correct_answer
    )


    total_marks = 10

    marks, found_keywords = calculate_marks(
        similarity_score,
        student_answer,
        keywords,
        total_marks
    )


    print(
        "\nSimilarity Score:",
        round(similarity_score, 2)
    )

    print(
        "Important Keywords Found:",
        found_keywords,
        "/",
        len(keywords)
    )

    print(
        "\nMarks:",
        marks,
        "/",
        total_marks
    )


    total_marks_all += total_marks
    total_marks_obtained += marks
    results.append({
    "question_number": question_number,
    "question": question,
    "student_answer": student_answer,
    "correct_answer": correct_answer,
    "similarity_score": round(similarity_score, 2),
    "keywords_found": found_keywords,
    "total_keywords": len(keywords),
    "marks": marks,
    "total_marks": total_marks
})


print("\n")
print("========================================")
print("        FINAL AI GRADING RESULT")
print("========================================")

print(
    "Total Marks:",
    round(total_marks_obtained, 2),
    "/",
    total_marks_all
)


if total_marks_all > 0:

    percentage = (
        total_marks_obtained /
        total_marks_all
    ) * 100

    print(
        "Percentage:",
        round(percentage, 2),
        "%"
    )


print("========================================")
result_data = {
    "questions": results,
    "total_marks_obtained": round(total_marks_obtained, 2),
    "total_marks": total_marks_all,
    "percentage": round(
        (total_marks_obtained / total_marks_all) * 100,
        2
    )
}

results_folder = Path("../data/results")
results_folder.mkdir(
    parents=True,
    exist_ok=True
)

result_file = results_folder / "grading_result.json"

with open(
    result_file,
    "w",
    encoding="utf-8"
) as file:
    json.dump(
        result_data,
        file,
        indent=4
    )

print("\nResult saved to:")
print(result_file)
# Create Excel file
excel_file = results_folder / "grading_results.xlsx"

workbook = openpyxl.Workbook()
sheet = workbook.active

sheet.title = "Grading Results"

# Headers
sheet.append([
    "Question",
    "Student Answer",
    "Correct Answer",
    "Similarity Score",
    "Keywords Found",
    "Total Keywords",
    "Marks",
    "Total Marks"
])

# Add question results
for result in results:

    sheet.append([
        result["question_number"],
        result["student_answer"],
        result["correct_answer"],
        result["similarity_score"],
        result["keywords_found"],
        result["total_keywords"],
        result["marks"],
        result["total_marks"]
    ])

# Add final result
sheet.append([])
sheet.append([
    "FINAL RESULT",
    "",
    "",
    "",
    "",
    "",
    total_marks_obtained,
    total_marks_all
])

sheet.append([
    "Percentage",
    "",
    "",
    "",
    "",
    "",
    round(
        (total_marks_obtained / total_marks_all) * 100,
        2
    ),
    "%"
])

workbook.save(excel_file)

print("\nExcel result saved to:")
print(excel_file)
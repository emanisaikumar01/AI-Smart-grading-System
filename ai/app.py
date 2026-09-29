import streamlit as st
import json
import cv2
import tempfile
import os

from pathlib import Path
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

from grading.answer_matching import compare_answers
from grading.scoring import calculate_marks
from ocr.text_cleaning import clean_text


# -----------------------------
# Page settings
# -----------------------------

st.set_page_config(
    page_title="AI Smart Grading System",
    page_icon="📝"
)

st.title("📝 AI Smart Grading System")

st.write(
    "Upload a handwritten answer and let AI evaluate it."
)

st.divider()


# -----------------------------
# Load TrOCR model
# -----------------------------

@st.cache_resource
def load_model():

    processor = TrOCRProcessor.from_pretrained(
        "microsoft/trocr-base-handwritten"
    )

    model = VisionEncoderDecoderModel.from_pretrained(
        "microsoft/trocr-base-handwritten"
    )

    return processor, model


# -----------------------------
# Detect handwriting lines
# -----------------------------

def split_lines(image_path):

    image = cv2.imread(image_path)

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

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
        groups.append(
            (start, len(active_rows))
        )

    lines = []

    for y1, y2 in groups:

        y1 = max(0, y1 - 15)
        y2 = min(
            image.shape[0],
            y2 + 15
        )

        cropped = image[y1:y2, :]

        lines.append(cropped)

    return lines


# -----------------------------
# OCR the answer
# -----------------------------

def ocr_answer(image_path, processor, model):

    lines = split_lines(image_path)

    full_text = []

    for line in lines:

        pil_image = Image.fromarray(
            cv2.cvtColor(
                line,
                cv2.COLOR_BGR2RGB
            )
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

        full_text.append(text)

    return clean_text(
        " ".join(full_text)
    ), len(lines)


# -----------------------------
# User interface
# -----------------------------

question_number = st.selectbox(
    "Select Question",
    [1, 2]
)

uploaded_file = st.file_uploader(
    "Upload Handwritten Answer",
    type=["png", "jpg", "jpeg"]
)


if uploaded_file is not None:

    st.image(
        uploaded_file,
        caption="Uploaded Answer",
        use_container_width=True
    )

    if st.button("Grade Answer"):

        with st.spinner(
            "AI is reading and grading the answer..."
        ):

            # Save uploaded image temporarily
            suffix = Path(
                uploaded_file.name
            ).suffix

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=suffix
            ) as temp_file:

                temp_file.write(
                    uploaded_file.getbuffer()
                )

                image_path = temp_file.name


            # Load model
            processor, model = load_model()


            # OCR
            student_answer, line_count = ocr_answer(
                image_path,
                processor,
                model
            )


            # Load answer key
            answer_key_path = Path(
                f"data/answer_keys/answer{question_number}.json"
            )

            with open(
                answer_key_path,
                "r",
                encoding="utf-8"
            ) as file:

                answer_data = json.load(file)


            question = answer_data["question"]

            correct_answer = answer_data["answer"]


            # Keywords
            keywords = [
                "photosynthesis",
                "plants",
                "sunlight",
                "water",
                "carbon dioxide"
            ]


            # Semantic similarity
            similarity_score = compare_answers(
                student_answer,
                correct_answer
            )


            # Calculate marks
            marks, found_keywords = calculate_marks(
                similarity_score,
                student_answer,
                keywords,
                10
            )


        # -----------------------------
        # Display results
        # -----------------------------

        st.success("Grading completed!")

        st.subheader("📋 Question")

        st.write(question)


        st.subheader("✍️ Student Answer")

        st.write(student_answer)


        st.subheader("✅ Correct Answer")

        st.write(correct_answer)


        st.divider()


        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric(
                "Similarity",
                f"{similarity_score:.2f}"
            )

        with col2:
            st.metric(
                "Keywords",
                f"{found_keywords}/{len(keywords)}"
            )

        with col3:
            st.metric(
                "Marks",
                f"{marks}/10"
            )


        st.info(
            f"📝 Lines detected: {line_count}"
        )


        # Clean temporary file
        os.remove(image_path)
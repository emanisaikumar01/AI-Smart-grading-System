import os
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

MODEL_NAME = "microsoft/trocr-base-handwritten"

print("Loading TrOCR...")

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)

print("Model loaded!\n")

lines_folder = "../data/test_images/lines"

all_text = []

for i in range(1, 5):

    image_path = os.path.join(
        lines_folder,
        f"line_{i}.png"
    )

    image = Image.open(image_path).convert("RGB")

    pixel_values = processor(
        images=image,
        return_tensors="pt"
    ).pixel_values

    generated_ids = model.generate(
        pixel_values,
        max_length=128
    )

    text = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True
    )[0]

    text = text.strip()

    all_text.append(text)

    print(f"Line {i}: {text}")

# Combine all lines
complete_answer = " ".join(all_text)

print("\n" + "=" * 60)
print("COMPLETE STUDENT ANSWER")
print("=" * 60)
print(complete_answer)
import sys
sys.path.append("..")

from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Load TrOCR
MODEL_NAME = "microsoft/trocr-base-handwritten"

print("Loading TrOCR model...")

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)

# Folder containing line images
lines_folder = Path("../data/test_images/lines")

line_images = sorted(lines_folder.glob("line_*.png"))

full_text = []

for line_image in line_images:

    # Open image
    image = Image.open(line_image).convert("RGB")

    # Convert to grayscale
    gray = ImageOps.grayscale(image)

    # Increase contrast
    gray = ImageEnhance.Contrast(gray).enhance(2.0)

    # Convert back to RGB
    image = gray.convert("RGB")

    # Resize image to make handwriting clearer
    width, height = image.size

    new_width = width * 2
    new_height = height * 2

    image = image.resize(
        (new_width, new_height),
        Image.Resampling.LANCZOS
    )

    # OCR
    pixel_values = processor(
        images=image,
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

    print(f"\n{line_image.name}:")
    print(text)

    full_text.append(text)

# Combine all lines
combined_text = " ".join(full_text)

print("\n========== FULL OCR ANSWER ==========")
print(combined_text)
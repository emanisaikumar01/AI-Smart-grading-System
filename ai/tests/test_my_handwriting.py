import sys
sys.path.append("..")

from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

MODEL_NAME = "microsoft/trocr-base-handwritten"

print("Loading TrOCR...")

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)

print("Model loaded!")

# Use the REAL handwritten image
image_path = "../data/test_images/handwriting.png"

# Load original image WITHOUT preprocessing
image = Image.open(image_path).convert("RGB")

print("Image loaded!")
print("Image size:", image.size)

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

print("\nRecognized text:")
print(text)
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import torch

MODEL_NAME = "microsoft/trocr-base-handwritten"

print("Loading TrOCR model...")

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)

print("Model loaded successfully!")

image_path = "../data/test_images/handwriting.png"

image = Image.open(image_path).convert("RGB")

pixel_values = processor(
    images=image,
    return_tensors="pt"
).pixel_values

with torch.no_grad():
    generated_ids = model.generate(pixel_values)

text = processor.batch_decode(
    generated_ids,
    skip_special_tokens=True
)[0]

print("\nRecognized Text:")
print("----------------")
print(text)
from datasets import load_dataset
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

print("Loading IAM test dataset...")

dataset = load_dataset("Teklia/IAM-line")
test_data = dataset["test"].select(range(10))

MODEL_PATH = "../models/trocr-iam-test"

print("Loading fine-tuned model...")

processor = TrOCRProcessor.from_pretrained(MODEL_PATH)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_PATH)

print("\nTesting OCR...\n")

for i in range(10):

    image = test_data[i]["image"].convert("RGB")
    actual_text = test_data[i]["text"]

    pixel_values = processor(
        images=image,
        return_tensors="pt"
    ).pixel_values

    generated_ids = model.generate(pixel_values)

    predicted_text = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True
    )[0]

    print("Sample", i + 1)
    print("Actual    :", actual_text)
    print("Predicted :", predicted_text)
    print("-" * 60)
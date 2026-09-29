from datasets import load_dataset
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

MODEL_NAME = "microsoft/trocr-base-handwritten"

print("Loading IAM dataset...")
dataset = load_dataset("Teklia/IAM-line")

print("Loading TrOCR...")
processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)

print("Everything loaded successfully!")

# Use a small dataset for the first test
train_data = dataset["train"].select(range(100))

print("Training samples:", len(train_data))

# Check one image
sample = train_data[0]

image = sample["image"].convert("RGB")
text = sample["text"]

print("\nSample text:")
print(text)

# Convert image into TrOCR input
pixel_values = processor(
    images=image,
    return_tensors="pt"
).pixel_values

# Convert text into labels
labels = processor.tokenizer(
    text,
    padding="max_length",
    max_length=128,
    truncation=True,
    return_tensors="pt"
).input_ids

print("\nImage converted successfully!")
print("Pixel values shape:", pixel_values.shape)
print("Labels shape:", labels.shape)

print("\nIAM is ready to be connected to TrOCR training!")
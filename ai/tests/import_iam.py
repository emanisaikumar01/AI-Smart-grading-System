from datasets import load_dataset

print("Loading IAM dataset...")

dataset = load_dataset("Teklia/IAM-line")

print("\nDataset loaded successfully!")
print(dataset)

# Get first sample
sample = dataset["train"][0]

print("\nFirst sample:")
print(sample)

print("\nCorrect transcription:")
print(sample["text"])

print("\nIAM dataset is working correctly!")
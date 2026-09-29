from datasets import load_dataset

print("Loading IAM dataset...")

dataset = load_dataset("Teklia/IAM-line")

print("Dataset loaded successfully!")

train_data = dataset["train"].select(range(100))

print("Number of samples:", len(train_data))

for i in range(5):
    print("\nSample", i + 1)
    print("Text:", train_data[i]["text"])

print("\nIAM preparation completed!")
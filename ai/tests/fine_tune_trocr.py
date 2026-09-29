from datasets import load_dataset
from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments
)
import torch

# --------------------------------
# 1. Load IAM dataset
# --------------------------------

print("Loading IAM dataset...")

dataset = load_dataset("Teklia/IAM-line")

train_data = dataset["train"]
val_data = dataset["validation"]

print("Training samples:", len(train_data))
print("Validation samples:", len(val_data))


# --------------------------------
# 2. Load TrOCR
# --------------------------------

MODEL_NAME = "microsoft/trocr-base-handwritten"

print("\nLoading TrOCR...")

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)


# --------------------------------
# 3. Configure model
# --------------------------------

model.config.decoder_start_token_id = (
    processor.tokenizer.cls_token_id
)

model.config.pad_token_id = (
    processor.tokenizer.pad_token_id
)

model.config.eos_token_id = (
    processor.tokenizer.sep_token_id
)

model.config.max_length = 128


# --------------------------------
# 4. Data Collator
# --------------------------------

def collate_fn(batch):

    images = [
        item["image"].convert("RGB")
        for item in batch
    ]

    texts = [
        item["text"]
        for item in batch
    ]

    pixel_values = processor(
        images=images,
        return_tensors="pt"
    ).pixel_values

    labels = processor.tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=128,
        return_tensors="pt"
    ).input_ids

    # Ignore padding during loss calculation
    labels[labels == processor.tokenizer.pad_token_id] = -100

    return {
        "pixel_values": pixel_values,
        "labels": labels
    }


# --------------------------------
# 5. Training settings
# --------------------------------

training_args = Seq2SeqTrainingArguments(
    output_dir="../models/trocr-iam-test",

    num_train_epochs=3,

    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,

    gradient_accumulation_steps=2,

    learning_rate=5e-5,

    logging_steps=10,

    save_strategy="epoch",

    eval_strategy="epoch",

    predict_with_generate=True,

    fp16=torch.cuda.is_available(),

    remove_unused_columns=False,
    report_to="none"
)


# --------------------------------
# 6. Trainer
# --------------------------------

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,

    train_dataset=train_data,
    eval_dataset=val_data,

    data_collator=collate_fn,

    processing_class=processor
)


# --------------------------------
# 7. Start training
# --------------------------------

print("\nStarting TrOCR fine-tuning...")

trainer.train()

print("\nTraining completed!")

# Save model
trainer.save_model("../models/trocr-iam-full")
processor.save_pretrained("../models/trocr-iam-full")

print("\nModel saved successfully!")
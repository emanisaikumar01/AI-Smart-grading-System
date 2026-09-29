from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image


MODEL_NAME = "microsoft/trocr-base-handwritten"

processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)


def ocr_image(image_path):
    image = Image.open(image_path).convert("RGB")

    pixel_values = processor(
        images=image,
        return_tensors="pt"
    ).pixel_values

    generated_ids = model.generate(pixel_values)

    text = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True
    )[0]

    return text
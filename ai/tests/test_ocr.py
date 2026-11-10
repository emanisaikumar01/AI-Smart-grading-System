
from pathlib import Path

import pytest
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

MODEL_NAME = "microsoft/trocr-base-handwritten"


@pytest.mark.integration
def test_ocr_recognition():
    image_path = (
        Path(__file__).resolve().parents[1]
        / "data"
        / "test_images"
        / "handwriting.png"
    )

    assert image_path.is_file(), f"Image not found: {image_path}"

    processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
    model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)

    image = Image.open(image_path).convert("RGB")

    pixel_values = processor(
        images=image,
        return_tensors="pt"
    ).pixel_values

    with torch.no_grad():
        generated_ids = model.generate(pixel_values)

    recognized_text = processor.batch_decode(
        generated_ids,
        skip_special_tokens=True
    )[0]

    print("Recognized text:", recognized_text)
    assert isinstance(recognized_text, str)
    assert len(recognized_text.strip()) > 0

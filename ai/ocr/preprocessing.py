from PIL import Image, ImageEnhance, ImageOps


def preprocess_image(image_path):
    # Open image
    image = Image.open(image_path).convert("RGB")

    # Convert to grayscale
    image = ImageOps.grayscale(image)

    # Improve contrast
    image = ImageEnhance.Contrast(image).enhance(2.0)

    # Convert back to RGB because TrOCR expects RGB
    image = image.convert("RGB")

    return image
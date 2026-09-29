import re


def clean_text(text):

    # Remove unwanted symbols
    text = text.replace('"', '')
    text = text.replace('#', '')

    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)

    # Remove spaces before punctuation
    text = re.sub(r'\s+([.,!?])', r'\1', text)

    # Remove spaces after opening punctuation
    text = re.sub(r'([("])\s+', r'\1', text)

    return text.strip()
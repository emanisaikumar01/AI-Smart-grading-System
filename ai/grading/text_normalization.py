import re
import unicodedata


SYNONYMS = {
    "co2": "carbon dioxide",
    "h2o": "water",
    "o2": "oxygen",
}


def normalize_text(text):
    if not isinstance(text, str):
        raise TypeError("Input text must be a string")

    text = unicodedata.normalize("NFKC", text)
    text = text.lower()
    # Expand common contractions before removing punctuation
    text = re.sub(r"\bdon't\b", "do not", text)
    text = re.sub(r"\bdoesn't\b", "does not", text)
    text = re.sub(r"\bdidn't\b", "did not", text)
    text = re.sub(r"\bisn't\b", "is not", text)
    text = re.sub(r"\baren't\b", "are not", text)
    text = re.sub(r"\bwasn't\b", "was not", text)
    text = re.sub(r"\bweren't\b", "were not", text)
    text = re.sub(r"\bcan't\b", "cannot", text)
    text = re.sub(r"\bwon't\b", "will not", text)

    # Normalize common scientific abbreviations
    for term, replacement in SYNONYMS.items():
        text = re.sub(
            rf"\b{re.escape(term)}\b",
            replacement,
            text
        )

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove unnecessary punctuation, preserving word boundaries
    text = re.sub(r"[^\w\s]", " ", text)

    return re.sub(r"\s+", " ", text).strip()

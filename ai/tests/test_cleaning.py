import sys
sys.path.append("..")

from ocr.text_cleaning import clean_text

text = 'Philadelphia is one process by which green plants make their own food . " Places use sunlight , walls and carbon # dioxide to prepare their food .'

cleaned = clean_text(text)

print("Original:")
print(text)

print("\nCleaned:")
print(cleaned)
import cv2
import os

# Input image
image_path = "data/answersheets/question2/answer.png"

# Output folder
output_folder = "../data/test_images/lines"

os.makedirs(output_folder, exist_ok=True)

# Read image
image = cv2.imread(image_path)

if image is None:
    print("Error: Could not read image.")
    exit()

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Threshold dark handwriting
binary = cv2.adaptiveThreshold(
    gray,
    255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY_INV,
    31,
    15
)

# Count dark pixels in each row
row_pixels = (binary > 0).sum(axis=1)

# Ignore top part of image
# This removes the dark page/shadow at the top
ignore_top = 150

active_rows = row_pixels > 20
active_rows[:ignore_top] = False

# Find groups of handwriting rows
groups = []
start = None

for i, active in enumerate(active_rows):

    if active and start is None:
        start = i

    elif not active and start is not None:

        if i - start > 5:
            groups.append((start, i))

        start = None

# Handle last group
if start is not None:
    groups.append((start, len(active_rows)))

print("Detected groups:", groups)

# Save each line
print("Lines detected:", len(groups))

for i, (y1, y2) in enumerate(groups):

    # Add vertical padding
    y1 = max(0, y1 - 15)
    y2 = min(image.shape[0], y2 + 15)

    # Crop the line
    cropped = image[y1:y2, :]

    # Convert cropped image to grayscale
    crop_gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)

    # Threshold again to find handwriting
    crop_binary = cv2.adaptiveThreshold(
        crop_gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        31,
        15
    )

    # Find columns containing handwriting
    column_pixels = (crop_binary > 0).sum(axis=0)

    active_columns = column_pixels > 3

    # Find left and right boundaries
    columns = []

    for x, active in enumerate(active_columns):
        if active:
            columns.append(x)

    if columns:

        x1 = max(0, min(columns) - 20)
        x2 = min(cropped.shape[1], max(columns) + 20)

        cropped = cropped[:, x1:x2]

    # Save line
    filename = f"{output_folder}/line_{i + 1}.png"

    cv2.imwrite(filename, cropped)

    print("Saved:", filename)
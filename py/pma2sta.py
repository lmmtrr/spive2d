"""
PNG Alpha Channel Converter (Premultiplied to Straight)
Description:
- Batch converts RGBA PNG files from premultiplied alpha to straight alpha.
- Non-PNG files are copied to the output directory unchanged.
- Preserves directory structure and processes all subdirectories recursively.

Usage:
1. Put all your assets (PNGs and other files) into the './input' folder.
2. Run this script: python pma2sta.py
3. Find your converted PNGs and copied files in the './output' folder.
"""

from PIL import Image
import numpy as np
import os
import shutil


def convert_premultiplied_to_straight(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    rgb = data[:, :, :3].astype(np.float32)
    alpha = data[:, :, 3] / 255.0
    alpha[alpha == 0] = 1
    straight_rgb = rgb / alpha[:, :, np.newaxis]
    straight_rgb = np.clip(straight_rgb, 0, 255).astype(np.uint8)
    result = np.dstack((straight_rgb, data[:, :, 3]))
    result_image = Image.fromarray(result, "RGBA")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    result_image.save(output_path)


def main():
    input_directory = "./input"
    output_directory = "./output"
    for root, dirs, files in os.walk(input_directory):
        for file in files:
            input_path = os.path.join(root, file)
            relative_path = os.path.relpath(root, input_directory)
            output_path = os.path.join(output_directory, relative_path, file)
            if file.lower().endswith(".png"):
                convert_premultiplied_to_straight(input_path, output_path)
                print(f"Converted: {input_path} -> {output_path}")
            else:
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                shutil.copy2(input_path, output_path)
                print(f"Copied: {input_path} -> {output_path}")


if __name__ == "__main__":
    main()

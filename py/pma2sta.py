"""
PNG Alpha Channel Converter (Premultiplied to Straight)
Description:
- Batch converts RGBA PNG files from premultiplied alpha to straight alpha
- Preserves directory structure
- Processes all subdirectories recursively
- Outputs results to parallel directory structure under './output'

Usage:
1. Place source PNG files in './input' directory
2. Run script to process all PNG files
3. Converted files will be in './output' directory
"""

from PIL import Image
import numpy as np
import os


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
            if file.lower().endswith(".png"):
                input_path = os.path.join(root, file)
                relative_path = os.path.relpath(root, input_directory)
                output_path = os.path.join(output_directory, relative_path, file)
                convert_premultiplied_to_straight(input_path, output_path)
                print(f"Converted: {input_path} -> {output_path}")


if __name__ == "__main__":
    main()

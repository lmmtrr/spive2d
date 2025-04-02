"""
Atlas Image Resizing Tool
Description:
- Processes .atlas files and resizes referenced PNG images to specified dimensions
- Preserves directory structure
- Processes all subdirectories recursively
- Copies unchanged images directly to output

Usage:
1. Place .atlas files and associated PNGs in ./input directory
2. Run script to process all files
3. Converted files will be in './output' directory
"""

import os
import re
import shutil
from PIL import Image


def extract_file_sizes(atlas_file):
    file_sizes = []
    with open(atlas_file, "r", encoding="utf-8") as file:
        lines = file.readlines()
        i = 0
        while i < len(lines):
            if lines[i].endswith(".png\n"):
                filename = lines[i].strip()
                size_line = lines[i + 1]
                size_values = re.findall(r"\d+", size_line)
                if len(size_values) >= 2:
                    width = int(size_values[0])
                    height = int(size_values[1])
                    file_sizes.append((filename, width, height))
                    i += 2
                else:
                    i += 1
            else:
                i += 1
    return file_sizes


def process_atlas_directory(input_base, output_base):
    for root, dirs, files in os.walk(input_base):
        for file in files:
            if file.endswith(".atlas"):
                atlas_path = os.path.join(root, file)
                file_specs = extract_file_sizes(atlas_path)
                relative_path = os.path.relpath(root, input_base)
                output_root = os.path.join(output_base, relative_path)
                for filename, width, height in file_specs:
                    input_img = os.path.join(root, filename)
                    output_img = os.path.join(output_root, filename)
                    if not os.path.exists(input_img):
                        print(f"Missing image: {input_img}")
                        continue
                    os.makedirs(os.path.dirname(output_img), exist_ok=True)
                    with Image.open(input_img) as img:
                        if img.size == (width, height):
                            shutil.copy2(input_img, output_img)
                        else:
                            resized = img.resize((width, height), Image.NEAREST)
                            resized.save(output_img)
                            print(f"Resized {filename} to {width}x{height}")


def main():
    input_directory = "./input"
    output_directory = "./output"
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    process_atlas_directory(input_directory, output_directory)
    print("Processing complete.")


if __name__ == "__main__":
    main()

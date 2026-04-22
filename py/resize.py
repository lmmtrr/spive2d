"""
Atlas Image Resizing Tool
Description:
- Resizes PNG images to match the dimensions specified in .atlas files.
- All files (including .atlas, .skel, .json, etc.) are copied to the output directory.
- Preserves directory structure and processes all subdirectories recursively.

Usage:
1. Put .atlas files and all associated assets into the './input' folder.
2. Run this script: python resize.py
3. Find your resized images and copied assets in the './output' folder.
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
    resize_map = {}
    # First pass: collect resize requirements from all .atlas files
    for root, dirs, files in os.walk(input_base):
        for file in files:
            if file.endswith(".atlas"):
                atlas_path = os.path.join(root, file)
                rel_dir = os.path.relpath(root, input_base)
                file_specs = extract_file_sizes(atlas_path)
                for filename, width, height in file_specs:
                    resize_map[(rel_dir, filename)] = (width, height)

    # Second pass: process all files in the input directory
    for root, dirs, files in os.walk(input_base):
        for file in files:
            input_path = os.path.join(root, file)
            rel_dir = os.path.relpath(root, input_base)
            output_path = os.path.join(output_base, rel_dir, file)
            
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Check if this file needs resizing
            if (rel_dir, file) in resize_map:
                width, height = resize_map[(rel_dir, file)]
                try:
                    with Image.open(input_path) as img:
                        if img.size == (width, height):
                            shutil.copy2(input_path, output_path)
                        else:
                            resized = img.resize((width, height), Image.NEAREST)
                            resized.save(output_path)
                            print(f"Resized: {input_path} -> {width}x{height}")
                except Exception as e:
                    print(f"Error processing {input_path}: {e}. Copying original.")
                    shutil.copy2(input_path, output_path)
            else:
                # Copy all other files (including .atlas, .skel, etc.)
                shutil.copy2(input_path, output_path)


def main():
    input_directory = "./input"
    output_directory = "./output"
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    process_atlas_directory(input_directory, output_directory)
    print("Processing complete.")


if __name__ == "__main__":
    main()

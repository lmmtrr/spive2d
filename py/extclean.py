"""
File Extension Cleanup Tool
Description:
- Removes redundant extensions (e.g., .skel.bytes -> .skel, .atlas.asset -> .atlas).
- All other files are copied to the output directory unchanged.
- Preserves directory structure and processes all subdirectories recursively.

Usage:
1. Put your files with extra extensions (and other assets) into the './input' folder.
2. Run this script: python extclean.py
3. Find your renamed files and copied assets in the './output' folder.
"""

import os
import shutil
import re


def should_rename_file(filename):
    patterns = [
        (r"(.+\.skel)\..+$", r"\1"),
        (r"(.+\.atlas)\..+$", r"\1"),
        (r"(.+\.json)\..+$", r"\1"),
        (r"(.+\.moc3)\..+$", r"\1"),
        (r"(.+\.moc)\..+$", r"\1"),
    ]
    for pattern, replacement in patterns:
        if re.match(pattern, filename):
            new_name = re.sub(pattern, replacement, filename)
            return True, new_name

    return False, filename


def process_directory(input_base, output_base):
    renamed_count = 0
    copied_count = 0
    for root, _, files in os.walk(input_base):
        for file in files:
            input_file_path = os.path.join(root, file)
            relative_path = os.path.relpath(root, input_base)
            output_root = os.path.join(output_base, relative_path)
            should_rename, new_filename = should_rename_file(file)
            output_file_path = os.path.join(output_root, new_filename)
            os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
            shutil.copy2(input_file_path, output_file_path)
            if should_rename:
                print(f"Renamed: {file} -> {new_filename}")
                renamed_count += 1
            else:
                copied_count += 1
    return renamed_count, copied_count


def main():
    input_directory = "./input"
    output_directory = "./output"
    if not os.path.exists(input_directory):
        print(f"Input directory '{input_directory}' does not exist.")
        print("Please create the input directory and place your files there.")
        return
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    print("Starting file extension cleanup...")
    renamed_count, copied_count = process_directory(input_directory, output_directory)
    print("\nProcessing complete:")
    print(f"- Files renamed: {renamed_count}")
    print(f"- Files copied unchanged: {copied_count}")
    print(f"- Total files processed: {renamed_count + copied_count}")


if __name__ == "__main__":
    main()

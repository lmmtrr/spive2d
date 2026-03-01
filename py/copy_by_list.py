"""
File Filtering and Copy Tool
Description:
- Reads a list of keywords from spive2d_list.txt
- Scans the ./input directory recursively
- Copies files containing any of the keywords to ./output
- Preserves the original directory structure

Usage:
1. Place spive2d_list.txt in the same directory as this script
2. Place source files in ./input directory
3. Run script to filter and copy files
4. Copied files will be in './output' directory
"""

import os
import shutil


def load_filter_list(list_path):
    with open(list_path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def copy_filtered_files(input_dir, output_dir, filter_list):
    count = 0
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            src_path = os.path.join(root, file)
            rel_path = os.path.relpath(src_path, input_dir)
            if any(s in rel_path for s in filter_list):
                dest_path = os.path.join(output_dir, rel_path)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                shutil.copy2(src_path, dest_path)
                print(f"Copied: {rel_path}")
                count += 1
    print(f"\nProcessing complete: Copied {count} files.")


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    list_path = os.path.join(script_dir, "spive2d_list.txt")
    input_dir = os.path.join(script_dir, "input")
    output_dir = os.path.join(script_dir, "output")
    if not os.path.exists(list_path):
        print(f"Error: {list_path} not found.")
        return
    if not os.path.exists(input_dir):
        print(f"Error: {input_dir} not found.")
        return
    try:
        filter_list = load_filter_list(list_path)
        print(f"Loaded {len(filter_list)} patterns from spive2d_list.txt")
    except Exception as e:
        print(f"Error loading list file: {e}")
        return
    copy_filtered_files(input_dir, output_dir, filter_list)


if __name__ == "__main__":
    main()

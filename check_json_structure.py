import os
import json
import sys

CARD_JSON_DIR = os.path.join('src', 'data', 'card_json')
EXPECTED_TOP_LEVEL_KEYS = {'upright', 'reversed'}

def check_structure(file_path):
    """Checks if the JSON file has the expected top-level keys."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Check if the top-level keys are exactly 'upright' and 'reversed'
        actual_keys = set(data.keys())
        if actual_keys == EXPECTED_TOP_LEVEL_KEYS:
            return True
        else:
            # print(f"Debug: {os.path.basename(file_path)} keys: {actual_keys}") # Optional debug print
            return False
    except json.JSONDecodeError:
        print(f"Error decoding JSON in file: {file_path}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Error processing file {file_path}: {e}", file=sys.stderr)
        return False

def main():
    """Finds and prints JSON files with incorrect structure."""
    incorrect_structure_files = []
    if not os.path.isdir(CARD_JSON_DIR):
        print(f"Error: Directory not found: {CARD_JSON_DIR}", file=sys.stderr)
        return

    for filename in os.listdir(CARD_JSON_DIR):
        if filename.endswith('.json'):
            file_path = os.path.join(CARD_JSON_DIR, filename)
            if not check_structure(file_path):
                incorrect_structure_files.append(filename)

    if incorrect_structure_files:
        print("Files with incorrect structure (top-level keys are not exactly 'upright' and 'reversed'):")
        for filename in sorted(incorrect_structure_files):
            print(f"- {filename}")
    else:
        print("All JSON files in src/data/card_json/ seem to have the correct structure.")

if __name__ == "__main__":
    main() 
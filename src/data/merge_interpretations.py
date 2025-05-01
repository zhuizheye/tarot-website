import json
import os
import glob

def merge_json_files(input_dir, output_file):
    """
    Merges all JSON files from the input directory into a single JSON file.

    Args:
        input_dir (str): The directory containing individual card JSON files.
        output_file (str): The path for the merged output JSON file.
    """
    merged_data = {}
    json_files = glob.glob(os.path.join(input_dir, '*.json'))

    if not json_files:
        print(f"No JSON files found in {input_dir}")
        return

    for file_path in json_files:
        try:
            # Extract card name from filename (e.g., The_Fool.json -> The Fool)
            filename = os.path.basename(file_path)
            card_name_key = os.path.splitext(filename)[0].replace('_', ' ')

            with open(file_path, 'r', encoding='utf-8') as f:
                card_data = json.load(f)
                merged_data[card_name_key] = card_data
                print(f"Successfully processed: {filename}")
        except json.JSONDecodeError:
            print(f"Error decoding JSON from file: {file_path}")
        except Exception as e:
            print(f"An error occurred processing file {file_path}: {e}")

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            # Ensure non-ASCII characters are correctly written and format nicely
            json.dump(merged_data, f, ensure_ascii=False, indent=2)
        print(f"Successfully merged {len(merged_data)} files into {output_file}")
    except Exception as e:
        print(f"An error occurred writing the output file {output_file}: {e}")

if __name__ == '__main__':
    # Assuming the script is in src/data/, card_json is a subdirectory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    input_directory = os.path.join(current_dir, 'card_json')
    output_json_file = os.path.join(current_dir, 'interpretations.json')

    # Delete the old interpretations.json if it exists, before creating the new one
    if os.path.exists(output_json_file):
        try:
            os.remove(output_json_file)
            print(f"Removed old file: {output_json_file}")
        except Exception as e:
            print(f"Error removing old file {output_json_file}: {e}")

    merge_json_files(input_directory, output_json_file) 
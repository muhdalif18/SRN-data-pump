import json
from pathlib import Path
import openpyxl

input_path = Path("test-data/devuserstds.xlsx")
output_path = Path("test-data/users_dev.json")

if not input_path.exists():
    raise FileNotFoundError(f"Input file not found: {input_path}")

wb = openpyxl.load_workbook(input_path, data_only=True)

sheet = wb.active
rows = list(sheet.iter_rows(values_only=True))
if not rows:
    raise ValueError("Excel file is empty")

header = [str(cell).strip() if cell is not None else "" for cell in rows[0]]
keys = []
for col in header:
    if not col:
        keys.append(None)
        continue
    key = col.strip().lower().replace(" ", "_")
    if key == "login_id":
        key = "loginId"
    elif key == "roles":
        key = "role"
    keys.append(key)

items = []
for row in rows[1:]:
    if all(cell is None or str(cell).strip() == "" for cell in row):
        continue
    item = {}
    for key, cell in zip(keys, row):
        if key and cell is not None:
            item[key] = str(cell).strip()
    if item.get("nama"):
        items.append(item)

output_path.write_text(json.dumps(items, indent=2), encoding="utf-8")
print(f"Wrote {len(items)} credentials to {output_path}")

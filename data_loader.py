import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "parking.json"


def load_parking_data():
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)

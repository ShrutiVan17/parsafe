"""
ParSafe processed-snapshot reconstruction.

The original external ingestion notebooks are not retained in this repository.
This script documents and reproduces the normalization/validation stage that
can be supported from the retained processed project data.

It does NOT pretend to recreate the original LADOT, Places, or Routes API calls.
"""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
INPUT = ROOT / "backend" / "data" / "parking.json"
OUTPUT = ROOT / "backend" / "data" / "parking.normalized.json"


REQUIRED_FIELDS = [
    "parking_id",
    "name",
    "address",
    "latitude",
    "longitude",
    "parking_type",
    "occupancy_state",
    "ticket_risk",
    "source",
    "walking_minutes",
    "walking_meters",
    "route_status",
    "parking_score",
    "parking_summary",
]


def normalize(record):
    item = dict(record)

    for field in REQUIRED_FIELDS:
        item.setdefault(field, None)

    for field in [
        "latitude",
        "longitude",
        "walking_minutes",
        "walking_meters",
        "parking_score",
    ]:
        value = item.get(field)

        if value in ("", "unknown", None):
            item[field] = None
            continue

        try:
            item[field] = float(value)
        except (TypeError, ValueError):
            item[field] = None

    return item


def main():
    data = json.loads(INPUT.read_text(encoding="utf-8"))
    normalized = [normalize(record) for record in data]

    OUTPUT.write_text(
        json.dumps(normalized, indent=2),
        encoding="utf-8",
    )

    print(f"Wrote {len(normalized)} records to {OUTPUT}")


if __name__ == "__main__":
    main()

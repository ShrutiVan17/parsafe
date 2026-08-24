import json
from itertools import product
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from app.data_loader import load_parking_data
from app.ranking import rank_parking
from app.retrieval import retrieve_parking, build_grounded_answer


def key(max_walk, risk, occupancy, parking_type):
    return f"{max_walk}|{risk}|{occupancy}|{parking_type}"


def main():
    data = load_parking_data()

    matrix = {}

    for max_walk in range(4, 16):
        for risk, occupancy, parking_type in product(
            ["any", "low", "medium"],
            ["any", "available", "not_occupied"],
            ["any", "street_meter", "garage_or_lot"],
        ):
            preferences = {
                "maxWalk": max_walk,
                "risk": risk,
                "occupancy": occupancy,
                "type": parking_type,
            }

            matrix[key(max_walk, risk, occupancy, parking_type)] = (
                rank_parking(data, preferences, top_n=5)
            )

    queries = [
        "Find me a low-risk parking option with a short walk",
        "Find available parking within 7 minutes",
        "Find a parking garage",
        "Find a street meter with low risk",
    ]

    preset_queries = {}

    for query in queries:
        documents = retrieve_parking(data, query, limit=3)

        preset_queries[query] = {
            "answer": build_grounded_answer(query, documents),
            "sources": [
                {
                    "parking_id": item.get("parking_id"),
                    "name": item.get("name"),
                    "walking_minutes": item.get("walking_minutes"),
                    "occupancy_state": item.get("occupancy_state"),
                    "ticket_risk": item.get("ticket_risk"),
                    "parking_score": item.get("parking_score"),
                    "source": item.get("source"),
                }
                for item in documents
            ],
        }

    walking = [
        float(row["walking_minutes"])
        for row in data
        if row.get("walking_minutes") is not None
    ]

    stats = {
        "records": len(data),
        "available": sum(
            1
            for row in data
            if str(row.get("occupancy_state", "")).lower() == "available"
        ),
        "lowRisk": sum(
            1
            for row in data
            if str(row.get("ticket_risk", "")).lower() == "low"
        ),
        "avgWalk": round(sum(walking) / len(walking), 1) if walking else 0,
    }

    output = {
        "generatedFrom": "backend/data/parking.json",
        "stats": stats,
        "rankingMatrix": matrix,
        "presetQueries": preset_queries,
    }

    target = ROOT / "public" / "static-demo.json"
    target.write_text(
        json.dumps(output, indent=2),
        encoding="utf-8",
    )

    print(f"Wrote {target}")


if __name__ == "__main__":
    main()

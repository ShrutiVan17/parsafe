from app.retrieval import retrieve_parking, build_grounded_answer


SAMPLE = [
    {
        "parking_id": "a",
        "name": "Meter A",
        "address": "1 Main St",
        "parking_type": "street_meter",
        "walking_minutes": 5,
        "ticket_risk": "low",
        "occupancy_state": "available",
        "parking_score": 3.5,
        "source": "LADOT",
        "parking_summary": "Short walk and low risk.",
    },
    {
        "parking_id": "b",
        "name": "Garage B",
        "address": "2 Main St",
        "parking_type": "garage_or_lot",
        "walking_minutes": 9,
        "ticket_risk": "medium",
        "occupancy_state": "unknown",
        "parking_score": 4.5,
        "source": "Places",
        "parking_summary": "Garage option.",
    },
]


def test_safe_short_query_prefers_low_risk_short_walk():
    docs = retrieve_parking(SAMPLE, "safe short walk", limit=2)
    assert docs[0]["parking_id"] == "a"


def test_grounded_answer_mentions_best_document():
    docs = retrieve_parking(SAMPLE, "available parking", limit=2)
    answer = build_grounded_answer("available parking", docs)
    assert "Meter A" in answer
    assert "5" in answer


def test_available_constraint_is_hard_filter():
    docs = retrieve_parking(SAMPLE, "available parking", limit=5)
    assert all(
        item["occupancy_state"] == "available"
        for item in docs
    )


def test_walk_constraint_is_hard_filter():
    docs = retrieve_parking(SAMPLE, "parking within 6 minutes", limit=5)
    assert all(
        float(item["walking_minutes"]) <= 6
        for item in docs
    )

from app.ranking import rank_parking


SAMPLE = [
    {
        "parking_id": "a",
        "parking_type": "street_meter",
        "walking_minutes": 5,
        "ticket_risk": "low",
        "occupancy_state": "available",
        "parking_score": 3.5,
    },
    {
        "parking_id": "b",
        "parking_type": "garage_or_lot",
        "walking_minutes": 7,
        "ticket_risk": "medium",
        "occupancy_state": "unknown",
        "parking_score": 4.2,
    },
    {
        "parking_id": "c",
        "parking_type": "street_meter",
        "walking_minutes": 9,
        "ticket_risk": "low",
        "occupancy_state": "occupied",
        "parking_score": 4.0,
    },
]


def test_ranking_uses_saved_score():
    result = rank_parking(SAMPLE, {}, top_n=3)
    assert [item["parking_id"] for item in result] == ["a", "c", "b"]


def test_max_walk_filter():
    result = rank_parking(SAMPLE, {"maxWalk": 6}, top_n=5)
    assert [item["parking_id"] for item in result] == ["a"]


def test_low_risk_filter():
    result = rank_parking(SAMPLE, {"risk": "low"}, top_n=5)
    assert {item["parking_id"] for item in result} == {"a", "c"}


def test_available_filter():
    result = rank_parking(SAMPLE, {"occupancy": "available"}, top_n=5)
    assert [item["parking_id"] for item in result] == ["a"]


def test_type_filter():
    result = rank_parking(
        SAMPLE,
        {"type": "garage_or_lot"},
        top_n=5,
    )
    assert [item["parking_id"] for item in result] == ["b"]

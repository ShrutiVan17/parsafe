from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_invalid_risk_is_rejected():
    response = client.post(
        "/rank",
        json={
            "maxWalk": 10,
            "risk": "banana",
            "occupancy": "any",
            "type": "any",
        },
    )
    assert response.status_code == 422


def test_invalid_walk_range_is_rejected():
    response = client.post(
        "/rank",
        json={
            "maxWalk": -1,
            "risk": "any",
            "occupancy": "any",
            "type": "any",
        },
    )
    assert response.status_code == 422


def test_empty_query_is_rejected():
    response = client.post(
        "/ask",
        json={"query": ""},
    )
    assert response.status_code == 422

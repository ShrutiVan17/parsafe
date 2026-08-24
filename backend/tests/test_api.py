from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_rank_endpoint():
    response = client.post(
        "/rank",
        json={
            "maxWalk": 10,
            "risk": "any",
            "occupancy": "any",
            "type": "any",
        },
    )
    assert response.status_code == 200
    assert len(response.json()["items"]) <= 5


def test_stats_endpoint():
    response = client.get("/stats")
    assert response.status_code == 200
    body = response.json()
    assert body["records"] > 0


def test_ask_endpoint():
    response = client.post(
        "/ask",
        json={"query": "low risk short walk"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "answer" in body
    assert "sources" in body

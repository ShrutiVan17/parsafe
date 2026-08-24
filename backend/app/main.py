from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import ALLOWED_ORIGINS
from .data_loader import load_parking_data
from .gemini import generate_grounded_answer, gemini_available
from .ranking import rank_parking
from .models import RankRequest, QueryRequest
from .retrieval import retrieve_parking, build_grounded_answer

app = FastAPI(
    title="ParSafe API",
    version="1.0.0",
    description="Parking ranking, analytics, and retrieval-grounded recommendation API.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

parking_data = load_parking_data()



@app.get("/health")
def health():
    return {
        "status": "ok",
        "records": len(parking_data),
        "geminiEnabled": gemini_available(),
    }


@app.get("/stats")
def stats():
    available = sum(
        1
        for row in parking_data
        if str(row.get("occupancy_state", "")).lower() == "available"
    )

    low_risk = sum(
        1
        for row in parking_data
        if str(row.get("ticket_risk", "")).lower() == "low"
    )

    walking_values = []

    for row in parking_data:
        try:
            walking_values.append(float(row.get("walking_minutes")))
        except (TypeError, ValueError):
            continue

    avg_walk = (
        sum(walking_values) / len(walking_values)
        if walking_values
        else 0
    )

    return {
        "records": len(parking_data),
        "available": available,
        "lowRisk": low_risk,
        "avgWalk": round(avg_walk, 1),
    }


@app.post("/rank")
def rank(request: RankRequest):
    return {
        "items": rank_parking(
            parking_data,
            preferences=request.model_dump(),
            top_n=5,
        )
    }


@app.post("/ask")
def ask(request: QueryRequest):
    documents = retrieve_parking(
        parking_data,
        request.query,
        limit=3,
    )

    answer = generate_grounded_answer(request.query, documents)
    mode = "gemini-grounded" if answer else "deterministic-grounded"

    if not answer:
        answer = build_grounded_answer(
            request.query,
            documents,
        )

    return {
        "mode": mode,
        "answer": answer,
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

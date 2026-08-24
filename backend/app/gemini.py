from typing import Iterable

from .config import (
    USE_VERTEX_GEMINI,
    GOOGLE_CLOUD_PROJECT,
    GOOGLE_CLOUD_LOCATION,
    GEMINI_MODEL,
)


def _context(documents: Iterable[dict]) -> str:
    lines = []

    for index, item in enumerate(documents, start=1):
        lines.append(
            f"[{index}] {item.get('name')} | "
            f"{item.get('address')} | "
            f"walk={item.get('walking_minutes')} min | "
            f"occupancy={item.get('occupancy_state')} | "
            f"ticket_risk={item.get('ticket_risk')} | "
            f"score={item.get('parking_score')} | "
            f"source={item.get('source')}"
        )

    return "\n".join(lines)


def gemini_available() -> bool:
    return bool(USE_VERTEX_GEMINI and GOOGLE_CLOUD_PROJECT)


def generate_grounded_answer(query: str, documents: list[dict]) -> str | None:
    if not gemini_available():
        return None

    try:
        from google import genai
    except ImportError:
        return None

    client = genai.Client(
        vertexai=True,
        project=GOOGLE_CLOUD_PROJECT,
        location=GOOGLE_CLOUD_LOCATION,
    )

    prompt = f"""
You are the ParSafe parking recommendation assistant.

Use only the retrieved parking records below.
Do not invent price, availability, rating, safety, or live conditions.
If a value is unknown, say it is unknown.
Recommend one best option and at most two alternatives.
Keep the answer concise and explain the recommendation using the retrieved fields.

User question:
{query}

Retrieved records:
{_context(documents)}
""".strip()

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return getattr(response, "text", None)

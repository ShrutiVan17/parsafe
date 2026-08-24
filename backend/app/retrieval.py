import re


def _extract_max_walk(query):
    patterns = [
        r"(?:within|under|less than|max(?:imum)?|up to)\s+(\d+(?:\.\d+)?)\s*(?:min|minute|minutes)",
        r"(\d+(?:\.\d+)?)\s*(?:min|minute|minutes)\s*(?:walk|walking)",
    ]

    for pattern in patterns:
        match = re.search(pattern, query)
        if match:
            return float(match.group(1))

    return None


def _explicit_constraints(query):
    q = query.lower()

    return {
        "available_only": any(
            phrase in q
            for phrase in [
                "available only",
                "must be available",
                "available parking",
                "open spot",
            ]
        ),
        "low_risk_only": any(
            phrase in q
            for phrase in [
                "low risk only",
                "must be low risk",
                "low-risk",
                "low risk",
                "safe parking",
            ]
        ),
        "garage_only": "garage only" in q or "parking garage" in q,
        "street_only": "street only" in q or "street meter" in q,
        "max_walk": _extract_max_walk(q),
    }


def _passes_constraints(item, constraints):
    if constraints["available_only"]:
        if str(item.get("occupancy_state", "")).lower() != "available":
            return False

    if constraints["low_risk_only"]:
        if str(item.get("ticket_risk", "")).lower() != "low":
            return False

    if constraints["garage_only"]:
        if item.get("parking_type") != "garage_or_lot":
            return False

    if constraints["street_only"]:
        if item.get("parking_type") != "street_meter":
            return False

    max_walk = constraints["max_walk"]
    if max_walk is not None:
        try:
            if float(item.get("walking_minutes")) > max_walk:
                return False
        except (TypeError, ValueError):
            return False

    return True


def retrieve_parking(data, query, limit=3):
    query = str(query or "").lower().strip()
    tokens = [token for token in query.split() if len(token) > 3]
    constraints = _explicit_constraints(query)

    constrained = [
        item
        for item in data
        if _passes_constraints(item, constraints)
    ]

    ranked = []

    for item in constrained:
        try:
            parking_score = float(item.get("parking_score"))
        except (TypeError, ValueError):
            parking_score = 6.0

        relevance = max(0.0, 6.0 - parking_score)

        searchable = " ".join(
            str(item.get(field, ""))
            for field in [
                "name",
                "address",
                "parking_type",
                "occupancy_state",
                "ticket_risk",
                "source",
                "parking_summary",
            ]
        ).lower()

        for token in tokens:
            if token in searchable:
                relevance += 0.5

        if (
            any(word in query for word in ["short", "near", "close"])
            and float(item.get("walking_minutes", 99)) <= 7
        ):
            relevance += 2.0

        if (
            "available" in query
            and str(item.get("occupancy_state", "")).lower() == "available"
        ):
            relevance += 1.5

        row = dict(item)
        row["_relevance"] = relevance
        ranked.append(row)

    ranked.sort(
        key=lambda row: (
            -float(row["_relevance"]),
            float(row.get("parking_score", 999)),
        )
    )

    return ranked[:limit]


def build_grounded_answer(query, documents):
    if not documents:
        return (
            "No saved parking record satisfies the requested constraints "
            "in the current ParSafe snapshot."
        )

    best = documents[0]
    alternatives = [item["name"] for item in documents[1:3]]

    answer = (
        f"{best['name']} is the strongest retrieved match. "
        f"It is {best['walking_minutes']} minutes away, "
        f"has {best['ticket_risk']} ticket risk, "
        f"occupancy {best['occupancy_state']}, "
        f"and a saved parking score of {best['parking_score']}."
    )

    if alternatives:
        answer += " Alternatives: " + " and ".join(alternatives) + "."

    return answer

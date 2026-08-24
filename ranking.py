def _value(value):
    return getattr(value, "value", value)


def _risk_allowed(value, preference):
    preference = _value(preference)
    value = str(value or "").lower()

    if preference == "any":
        return True
    if preference == "low":
        return value == "low"
    if preference == "medium":
        return value in {"low", "medium"}

    return False


def _occupancy_allowed(value, preference):
    preference = _value(preference)
    value = str(value or "").lower()

    if preference == "any":
        return True
    if preference == "available":
        return value == "available"
    if preference == "not_occupied":
        return value != "occupied"

    return False


def rank_parking(data, preferences=None, top_n=5):
    preferences = preferences or {}

    max_walk = float(preferences.get("maxWalk", 99))
    risk = preferences.get("risk", "any")
    occupancy = preferences.get("occupancy", "any")
    parking_type = _value(preferences.get("type", "any"))

    results = []

    for item in data:
        try:
            walking_minutes = float(item.get("walking_minutes"))
            parking_score = float(item.get("parking_score"))
        except (TypeError, ValueError):
            continue

        if walking_minutes > max_walk:
            continue

        if not _risk_allowed(item.get("ticket_risk"), risk):
            continue

        if not _occupancy_allowed(item.get("occupancy_state"), occupancy):
            continue

        if parking_type != "any" and item.get("parking_type") != parking_type:
            continue

        result = dict(item)
        explanation = []

        if walking_minutes <= 7:
            explanation.append(
                f"Short walking time at {walking_minutes:g} minutes."
            )

        if str(item.get("ticket_risk", "")).lower() == "low":
            explanation.append(
                "Ticket risk is marked low in the saved parking data."
            )

        if str(item.get("occupancy_state", "")).lower() == "available":
            explanation.append(
                "Occupancy is marked available in this snapshot."
            )

        explanation.append(
            f"Saved parking score is {parking_score:.3f}; lower scores rank ahead."
        )

        result["explanation"] = explanation
        results.append(result)

    results.sort(
        key=lambda row: (
            float(row["parking_score"]),
            float(row["walking_minutes"]),
        )
    )

    return results[:top_n]

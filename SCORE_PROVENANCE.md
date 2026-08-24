# Parking Score Provenance

The retained ParSafe dataset already contains a `parking_score` field for each processed parking record.

The current repository uses that saved score for ranking because the exact original weighting formula is not preserved in the retained project files.

The retained dataset also includes inputs such as:

- walking time
- walking distance
- occupancy state
- ticket risk
- price field
- rating field
- parking type
- data source

The repository does **not** invent or reverse-engineer an undocumented weighting formula.

Current ranking behavior is intentionally simple and reproducible:

1. Apply user filters.
2. Sort remaining records by the saved `parking_score` in ascending order.
3. Use walking time as the tie-breaker.
4. Return the top five records.

This keeps the current implementation faithful to the retained project output while making the limitation explicit.

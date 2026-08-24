# Data Pipeline Provenance

The repository contains the retained processed ParSafe parking snapshot.

The original external ingestion code used during development is not preserved here, so the repository does not claim to reproduce the historical LADOT, Google Places, or Google Routes API calls.

What is reproducible from the retained project files:

```text
retained processed snapshot
        |
        v
schema validation
        |
        v
type normalization
        |
        v
ranking / filtering
        |
        v
retrieval-grounded recommendation
```

The normalization stage is documented in:

```text
backend/pipeline/rebuild_processed_snapshot.py
```

The retained project data already includes:

- parking IDs
- parking names and addresses
- coordinates
- parking type
- occupancy state
- ticket risk
- data source
- walking minutes and meters
- route status
- saved parking score
- parking summary

This keeps the repository reproducible without claiming that reconstructed code is the exact original cloud ingestion implementation.

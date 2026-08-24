# ParSafe Architecture

## Current application

```text
React / Vite
     |
     v
API Client
     |
     v
Python / FastAPI
     |
     +----------------------+----------------------+
     |                      |                      |
     v                      v                      v
Ranking Service      Retrieval Service       Analytics
     |                      |                      |
     +----------------------+----------------------+
                            |
                            v
                  Canonical Parking Data
```

The Python backend is the only source of ranking and retrieval business logic.

## Static GitHub Pages demo

GitHub Pages cannot run FastAPI.

To keep the portfolio page usable without duplicating business logic, Python generates:

```text
public/demo-data.json
```

from the canonical backend dataset and ranking service.

Static mode shows:

- generated top-five results
- generated analytics
- interface and animations

Interactive re-ranking and retrieval are disabled until the Python API is available.

## Canonical data

```text
backend/data/parking.json
```

Static demo data is generated with:

```bash
python backend/scripts/build_demo_data.py
```

Do not edit `public/demo-data.json` manually.

## Optional cloud extension

The backend contains an optional grounded Gemini integration.

```text
Retrieved parking records
        |
        v
Grounded prompt
        |
        v
Gemini on Vertex AI
```

The integration is disabled by default and requires environment configuration.

Other cloud services such as Maps / Routes, Secret Manager, or scheduled refresh jobs should be added to the Python/backend layer, not directly to the browser.

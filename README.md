# ParSafe Project

ParSafe is a React + Python parking decision application built around a retained processed parking dataset.

## Architecture

```text
React / Vite
    |
    v
Python / FastAPI
    |
    +---- validated ranking
    +---- constraint-aware retrieval
    +---- analytics
    +---- optional grounded Gemini generation
    |
    v
Canonical parking dataset
```

The Python backend is the source of ranking and retrieval business logic.

## Static GitHub Pages mode

GitHub Pages cannot run FastAPI.

To keep the public demo interactive without duplicating ranking logic in JavaScript, Python pre-generates:

```text
public/static-demo.json
```

This contains:

- ranking results for all UI filter combinations
- analytics
- a small set of example retrieval questions

The React app reads those generated outputs when the API is offline.

Regenerate static demo data with:

```bash
python backend/scripts/build_demo_data.py
```

## Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install:

```bash
pip install -r requirements.txt
```

Run:

```bash
python run.py
```

API:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

## Frontend

Create `.env` in the project root:

```text
VITE_API_URL=http://localhost:8000
```

Install and run:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

GitHub Actions runs backend tests before building or deploying the frontend.

## Build

```bash
python backend/scripts/build_demo_data.py
npm install
npm run build
```

## Docker backend

```bash
cd backend
docker build -t parsafe-api .
docker run -p 8000:8080 parsafe-api
```

## Optional Gemini on Vertex AI

The Python backend contains an optional grounded Gemini integration.

Copy:

```text
backend/.env.example
```

to:

```text
backend/.env
```

Set the Google Cloud project values and:

```text
USE_VERTEX_GEMINI=true
```

Without Gemini enabled, the backend returns deterministic retrieval-grounded recommendations.

## Parking score provenance

The retained dataset already contains `parking_score`.

The exact original weighting formula is not preserved, so the repository does not invent one.

Current ranking:

1. validate user preferences
2. apply filters
3. sort by saved `parking_score`
4. break ties with walking time
5. return the top five

See:

```text
SCORE_PROVENANCE.md
```

## Data pipeline provenance

The repository does not claim to contain the exact original external API ingestion notebook.

A supported processed-snapshot normalization step is documented in:

```text
backend/pipeline/rebuild_processed_snapshot.py
```

See:

```text
PIPELINE_PROVENANCE.md
```

## GitHub Pages

The workflow is:

```text
.github/workflows/deploy.yml
```

On GitHub:

1. Open `Settings`.
2. Open `Pages`.
3. Set source to `GitHub Actions`.
4. Push to `main`.
5. Wait for `Test and Deploy ParSafe` to complete.

## Documentation

```text
ARCHITECTURE.md
SCORE_PROVENANCE.md
PIPELINE_PROVENANCE.md
```

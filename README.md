# ParSafe

ParSafe is a React + FastAPI parking decision project built around a retained processed parking dataset.

## Repository structure

```text
.
├── src/                    React frontend
│   ├── components/
│   └── styles/
├── public/                 Static assets for GitHub Pages
│   └── static-demo.json
├── backend/                FastAPI backend
│   ├── app/
│   ├── data/
│   ├── pipeline/
│   ├── scripts/
│   └── tests/
├── docs/                   Architecture and provenance notes
├── .github/workflows/      GitHub Pages deployment
├── index.html
├── package.json
└── vite.config.js
```

## Frontend

```bash
npm install
npm run dev
```

GitHub Pages builds the Vite app through `.github/workflows/deploy.yml`.

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

Install and run:

```bash
pip install -r requirements.txt
python run.py
```

API docs:

```text
http://localhost:8000/docs
```

To connect the frontend locally, create a root `.env` file with:

```text
VITE_API_URL=http://localhost:8000
```

## Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

## Static GitHub Pages demo

GitHub Pages cannot run FastAPI, so the repository includes a pre-generated static demo file at:

```text
public/static-demo.json
```

To regenerate it from the Python ranking and retrieval code:

```bash
python backend/scripts/build_demo_data.py
```

## Docker

```bash
cd backend
docker build -t parsafe-api .
docker run -p 8000:8080 parsafe-api
```

## Optional Gemini integration

Backend configuration is documented in:

```text
backend/.env.example
```

Gemini is optional. Without it, the API uses deterministic retrieval-grounded responses.

## Documentation

See:

```text
docs/ARCHITECTURE.md
docs/PIPELINE_PROVENANCE.md
docs/SCORE_PROVENANCE.md
```

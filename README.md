# ParSafe Project — GCP + React + Retrieval + AI

ParSafe is a parking decision project built around a Google Cloud workflow and a processed parking dataset.

This repository combines:

- the retained ParSafe parking dataset
- an explainable top-5 ranking layer
- a React/Vite interactive application
- a Node/Express API
- a RAG-style retrieval flow
- optional Gemini on Vertex AI generation
- optional Vertex AI embedding retrieval
- a Google Maps-ready front end
- historical evidence of the original Google Cloud project setup

## Current project status

The original Google Cloud free-trial environment is no longer active.

The historical Google Cloud project still exists as `parksafe`, and the retained console screenshot in this repository shows that the project had API credentials, a Maps Platform API key, and a Compute Engine default service account configured in May 2026.

The screenshot does **not** expose any API key value.

The application therefore supports two states:

1. **Local/demo mode** — works without active GCP billing.
2. **GCP mode** — can be re-enabled in the same Google Cloud project after billing/services are restored.

## Historical GCP setup evidence

See:

```text
docs/evidence/gcp-parksafe-project-credentials-2026.png
```

The screenshot shows:

- Google Cloud project: `parksafe`
- API credential: `API key 2`
- Maps credential: `Maps Platform API Key`
- credentials created May 21, 2026
- a Compute Engine default service account
- the Google Cloud free-trial expiration notice

This is included as documentation of the project environment. It should not be interpreted as proof that every service in the architecture is currently live.

## Original cloud workflow

```text
LADOT parking data
        |
        +------------------+
                           |
Google Places / Routes ----+
                           |
                           v
                  Data preparation
                           |
                           v
                  Parking scoring
                           |
                           v
                Agent-ready dataset
                           |
              +------------+------------+
              |                         |
              v                         v
        Search / retrieval         React application
              |
              v
     Gemini recommendation layer
```

### GCP components used / designed into the project

- **Vertex AI Workbench** — cloud development and experimentation
- **Gemini on Vertex AI** — AI recommendation layer
- **Google Places / Routes** — parking-location and route enrichment
- **Secret Manager** — credential-management workflow
- **Cloud Scheduler** — recurring refresh workflow support
- **Google Maps Platform** — map visualization / routing layer

Elastic Cloud Serverless was also part of the searchable parking-data workflow.

## What the current application can demonstrate

### Explainable ranking

Users can filter or prioritize:

- maximum walking time
- ticket risk
- occupancy
- parking type

The app then returns the best parking options using the retained project dataset and explains why each option ranked where it did.

### Analytics

The React interface summarizes:

- record count
- average walking time
- available parking records
- ticket-risk distribution
- occupancy distribution

### RAG-style parking assistant

```text
Question
   |
   v
Retrieve relevant parking records
   |
   v
Ground answer in retrieved records
   |
   +--> Local deterministic answer
   |
   `--> Gemini on Vertex AI when enabled
```

The LLM is not intended to invent parking conditions. The retrieved records are the grounding context.

### Semantic retrieval

The backend includes an optional Vertex AI embedding path using:

```text
gemini-embedding-001
```

For the small retained dataset, local retrieval is sufficient for the demo. Vertex embeddings are included as the cloud upgrade path.

## Repository structure

```text
ParSafe-GCP-Portfolio/
│
├── client/
│   └── React / Vite application
│
├── server/
│   ├── local retrieval
│   ├── explainable ranking
│   ├── Vertex AI Gemini integration
│   └── Vertex embedding integration
│
├── data/
│   ├── parsafe_agent_ready_data.csv
│   └── parsafe_agent_ready_data.json
│
├── docs/
│   └── evidence/
│       └── gcp-parksafe-project-credentials-2026.png
│
├── GCP_SETUP.md
├── GCP_STATUS.md
└── README.md
```

## Run without GCP

Install Node.js 20+.

```bash
npm install
npm run install:all
npm run dev
```

Open:

```text
http://localhost:5173
```

This mode does not require Google Cloud credentials.

## Re-enable the existing GCP project later

Do **not** create a second Gmail account just for this repository.

After the existing `parksafe` project has active billing again:

1. Enable Vertex AI API.
2. Authenticate locally with Application Default Credentials.
3. Copy `server/.env.example` to `server/.env`.
4. Set the existing Google Cloud project ID.
5. Turn on Gemini only after the local application is working.
6. Enable Maps JavaScript API / Routes API only when needed.
7. Use a restricted browser API key for the React map.
8. Keep secret values outside GitHub.

## Security

Never commit:

- raw API key values
- service-account private keys
- `.env` files
- unrestricted credentials

The included screenshot shows credential **names**, not the secret values.

## Portfolio explanation

A concise way to describe the repository:

> ParSafe was originally developed using a Google Cloud workflow. My free-trial environment later expired, so I preserved the processed project data and rebuilt the application layer locally for reproducibility. The repository also documents the original GCP setup and contains optional Vertex AI integration paths that can be re-enabled when the cloud project is active.

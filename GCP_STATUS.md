# GCP Environment Status

## Existing project

Google Cloud project visible in the retained console screenshot:

```text
parksafe
```

## Evidence retained

The repository contains a screenshot from the Google Cloud Console credentials page showing:

- API key 2
- Maps Platform API Key
- May 21, 2026 creation dates
- a Compute Engine default service account
- the free-trial expiration banner

File:

```text
docs/evidence/gcp-parksafe-project-credentials-2026.png
```

## Current state

The free trial has ended, so cloud-backed features should not be described as currently live unless billing/services are restored and tested.

The React application and local retrieval/ranking workflow can still run without GCP.

## What to say in an interview

The original project used a Google Cloud setup, but the free-trial environment later expired. The repository preserves the processed dataset, the project architecture, and a locally reproducible application. Optional Vertex AI integrations are kept separate so the cloud layer can be re-enabled without changing the core application.

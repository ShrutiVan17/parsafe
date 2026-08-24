# Restore GCP Features in the Existing `parksafe` Project

You already have a Google Cloud project named `parksafe`. A new Gmail account is not required.

Use this sequence only if you decide to reactivate cloud-backed features.

1. Open the existing `parksafe` project.
2. Restore/upgrade billing on that project.
3. Confirm that the Vertex AI API is enabled.
4. Authenticate locally with Google Cloud Application Default Credentials.
5. Test Gemini generation with `USE_VERTEX_GEMINI=true`.
6. Enable semantic retrieval only after Gemini works.
7. Enable Maps JavaScript API and Routes API if the live map/route layer is needed.
8. Create or reuse a browser Maps key, but restrict it to the APIs and deployment domains required.
9. Use Secret Manager for deployment secrets.
10. Add Cloud Scheduler only if you restore a live refresh endpoint/job.

The local app does not require any of these cloud services to run.

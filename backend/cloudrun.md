# Deploy (Cloud Run + Cloud SQL Postgres)

## Env vars
- `DATABASE_URL`: exemplo via socket do Cloud Run:
  - `postgresql://USER:PASSWORD@localhost/DB?host=/cloudsql/PROJECT:REGION:INSTANCE&schema=public`
- `CORS_ORIGIN`: domínio do frontend
- `ADMIN_EMAILS`: `email1,email2`

## Auth
O backend valida `Authorization: Bearer <idToken>` via ADC (firebase-admin `verifyIdToken`).
Em Cloud Run, use uma service account com acesso ao projeto/Identity Platform.


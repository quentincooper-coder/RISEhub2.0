# RISE Hub 2.0 access gate

The access gate uses a shared project password and a signed 7-day HttpOnly session cookie. It does not require a username or registration.

## Vercel configuration

Encrypted values are configured for the RISE Hub 2.0 project in Production and Preview:

- `RISEHUB_ACCESS_PASSWORD`: configured directly in Vercel; never commit it to the repository.
- `RISEHUB_SESSION_SECRET`: a unique cryptographically random key of at least 32 characters, stored only in Vercel.

The middleware-style Next.js proxy protects all pages and API routes, except the login page, login endpoint and public login logo. Missing configuration returns 503 (fail-closed).

## Verification checklist

- Unauthenticated `/dashboard`, `/backlog`, `/initiatives`, and a specific initiative details page redirect to `/login`.
- Unauthenticated `/api/backlog`, `/api/notes`, and `/api/documents/file` return 401 without exposing data.
- Incorrect password yields 401 and a visible error message.
- Correct password creates a Secure (production), HttpOnly, SameSite=Lax cookie with a 7-day expiration and redirects to dashboard.
- A tampered or expired cookie cannot grant access.
- Stored documents must only be available through authenticated private-document routes, not through public Blob URLs.
- RISE Hub 1.0 remains unchanged.

A shared password cannot distinguish individual users. Rate-limiting at the Vercel edge and individual identity-based authentication are recommended before handling confidential or regulated information.

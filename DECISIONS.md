# Architecture Decisions

## SQLite first persistence
SQLite keeps local setup easy while introducing real persistence and queryable stats.

## Two-stage scoring
AI-generated rubric scores with deterministic heuristic fallback preserve availability under model/API errors.

## API key and CORS hardening
Even for portfolio environments, authenticated routes and allowlisted origins reduce accidental exposure.

## Monorepo layout
Backend/frontend/infra in one repository improves onboarding and CI cohesion.

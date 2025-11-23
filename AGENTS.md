# Repository Guidelines

## Project Structure & Module Organization
The repository houses a Next.js 15 frontend in `frontend/` and a placeholder `backend/` for future services. Within `frontend/src`, routes live in `app/`, reusable UI widgets in `components/ui`, domain helpers in `lib/`, stores in `stores/`, and colocated assets in `assets/`; static files that should be served as-is belong in `public/`. Keep new server modules under `backend/src` (with matching `backend/tests`) to preserve the current front/back separation and avoid cross-imports.

## Build, Test, and Development Commands
Install dependencies with `cd frontend && npm install` (or `pnpm install`). Use `npm run dev` to start the local Next dev server on port 3000, `npm run build` to create a production bundle, and `npm run start` to serve that bundle. Run `npm run lint` before every commit; it executes ESLint with the Next config plus Tailwind rules, catching unused imports, incorrect hooks usage, and class typos.

## Coding Style & Naming Conventions
Code is TypeScript-first. Components/hooks are PascalCase (`MetricCard.tsx`, `useStore.ts`) while helpers are camelCase. Follow the established 4-space indentation, single quotes, and trailing commas enforced by ESLint. Keep functional components at the top level with `'use client'` when stateful, lean on absolute imports via `@/`, and organize Tailwind utility strings from layout → spacing → color for consistency.

## Testing Guidelines
No automated test runner is configured yet; introduce Vitest + React Testing Library as you add features. Place specs alongside modules (`Component.test.tsx`) or inside `src/__tests__` for broader suites. Cover data fallbacks, chart rendering, and Zustand store transitions. Until an `npm run test` script exists, document manual verification steps in PRs and consider wiring `vitest run --coverage` so CI can gate regressions.

## Commit & Pull Request Guidelines
Commits should be small, single-topic, and use imperative subjects with a Conventional Commit prefix (`feat:`, `fix:`, `chore:`). Provide bodies that explain *why* changes were made. Pull requests need a summary, screenshots or CLI snippets of testing, environment/configuration callouts (e.g., new `.env` keys), and linked issues (`Fixes #123`). Request review only after linting (and future tests) pass locally.

## Environment & Configuration Tips
Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=<backend-endpoint>` for dashboard fetchers—never commit credentials. Record any additional secrets in `.env.example` and describe setup steps in your PR. When wiring backend APIs, document ports and auth requirements so other agents can reproduce without guesswork.

## What you need to do as the coding agent
You are building the backend and frontend for an AI-powered tax assistant called Veronero.

Frontend already exists in some sort (Nest is only for backend).

Backend tech: NestJS + TypeScript, PostgreSQL, Redis and BullMQ (for queues), Auth0 for authentication.

Focus on:

API architecture

Database models & migrations

Auth0 integration

Domain modules (tax cards, expenses, tax scenarios, life events, calendar, chat)

Async processing / workers

Use clean, modular architecture (modules, services, controllers, guards, interceptors).

Frontend Development

Integrate frontend with auth service in backend and Auth0

Follow the steps that I give you, fully implementing and testing each step before moving on.
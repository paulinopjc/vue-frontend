# Vue Frontend

A Vue 3 SPA that provides a unified interface for both the Task Manager API and the Expense Tracker API. Two separate apps — tasks and expenses — share one codebase, with independent authentication, routing, and state management for each.

![Vue 3](https://img.shields.io/badge/Vue-3-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![Tests](https://img.shields.io/badge/Tests-18-green) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## Technical Overview

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Language | TypeScript 6 |
| State management | Pinia |
| Routing | Vue Router 4 |
| HTTP client | Axios |
| Styling | Tailwind CSS v3 |
| Build tool | Vite 8 |
| Testing | Vitest + Vue Test Utils |
| Deployment | Vercel |

---

## Architecture

Each app (tasks, expenses) is self-contained within the router and store layer. They share UI components and a single Axios factory, but their auth tokens, API clients, and route guards are independent.

```
src/
├── api/           # Axios factory + typed API modules for each backend
├── composables/   # useAuth (per-app), useNotification
├── components/    # Shared UI + per-app components (tasks/, expenses/, layout/, shared/)
├── stores/        # Pinia stores — taskAuth, tasks, expenseAuth, expenses, reports
├── types/         # TypeScript interfaces for all data models
└── views/         # Route-mapped views split into tasks/ and expenses/
```

**Axios factory (`src/api/client.ts`):**

Every API module calls `createApiClient(baseURL, tokenKey)` instead of constructing an Axios instance directly. The factory wires two interceptors:

- **Request:** reads the token from `localStorage` by key and injects `Authorization: Bearer <token>`
- **Response:** on 401, clears the token and redirects to the relevant login route

This means auth handling is defined once. Adding a third backend in the future is one call.

**Route guards:**

Navigation guards in `src/router/index.ts` check `localStorage` directly for `task_token` or `expense_token` rather than importing stores. This avoids initialising Pinia before it is ready and keeps the guard logic straightforward.

```
beforeEach → check meta.requiresTaskAuth or meta.requiresExpenseAuth
           → read localStorage for the relevant token
           → redirect to /tasks/login or /expenses/login if missing
```

---

## Routes

### Task Manager

| Path | View | Auth |
|------|------|------|
| `/tasks/login` | LoginView | No |
| `/tasks/register` | RegisterView | No |
| `/tasks` | TaskListView | Yes |
| `/tasks/create` | TaskCreateView | Yes |
| `/tasks/:id/edit` | TaskEditView | Yes |

### Expense Tracker

| Path | View | Auth |
|------|------|------|
| `/expenses/login` | LoginView | No |
| `/expenses/register` | RegisterView | No |
| `/expenses` | ExpenseListView | Yes |
| `/expenses/create` | ExpenseCreateView | Yes |
| `/expenses/:id` | ExpenseDetailView | Yes |
| `/expenses/reports` | ReportsView | Yes |

---

## TDD Approach

**18 automated tests** across 6 test files.

| Suite | What it covers |
|-------|---------------|
| `api/client.test.ts` | Axios instance creation, Bearer token injection via request interceptor |
| `stores/taskAuth.test.ts` | Login sets token and user, logout clears state, loadFromStorage restores from localStorage, isAuthenticated reflects token |
| `stores/expenses.test.ts` | fetchExpenses populates list, submit/approve/reject update status, CRUD operations |
| `components/TaskCard.test.ts` | Renders title, status, priority, assignee, due date, action buttons |
| `components/ExpenseCard.test.ts` | Renders title, formatted amount, date |
| `components/StatusBadge.test.ts` | Renders correct label and colour class for each status |

**Testing strategy:**

- `setActivePinia(createPinia())` in `beforeEach` — fresh store state per test, no leakage
- `localStorage.clear()` in `beforeEach` — prevents auth token bleed between tests
- `@vue/test-utils` `mount()` for component tests — real DOM rendering in jsdom
- Mock Axios responses inline per test — no shared mock state

Run all tests:

```bash
npm run test
```

---

## Security

- [x] **Token storage** — Bearer tokens stored in `localStorage` under per-app keys (`task_token`, `expense_token`); never in cookies or memory only
- [x] **401 auto-logout** — Axios response interceptor clears token and redirects to login on any 401; stale tokens cannot persist
- [x] **No token cross-contamination** — each app uses its own token key and API client instance; a logout from one app does not affect the other
- [x] **Security headers (Vercel)** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (1-year HSTS) configured in `vercel.json`
- [x] **SPA routing** — `vercel.json` rewrites all routes to `index.html`; deep links work without exposing server directory structure

---

## Performance

**Cursor-based pagination** in both the task and expense stores. Each `fetchTasks` / `fetchExpenses` call accepts an `append` flag — when true, results are pushed onto the existing list rather than replacing it, and the `nextCursor` value is stored for the next request. The "Load more" button is hidden when `nextCursor` is null.

This avoids offset pagination's N+1 scan problem — cost stays constant regardless of how many pages the user has already loaded.

---

## Setup

### Prerequisites

Node.js 20+

### Installation

```bash
# Clone the repo
git clone https://github.com/paulinopjc/vue-frontend vue-frontend
cd vue-frontend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env.development.local
# Edit .env.development.local and set backend URLs if different from defaults:
# VITE_TASK_API_URL=http://localhost:8088/api
# VITE_EXPENSE_API_URL=http://localhost:8090/api

# Start dev server
npm run dev
```

### Running Tests

```bash
npm run test
```

### Production Build

```bash
npm run build
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_TASK_API_URL` | `http://localhost:8088/api` | Task Manager API base URL |
| `VITE_EXPENSE_API_URL` | `http://localhost:8090/api` | Expense Tracker API base URL |

The app runs at `http://localhost:5173` locally, or at the Vercel deployment URL in production.

---

## Related APIs

| API | Local | Production |
|-----|-------|------------|
| Task Manager API | http://localhost:8088/api | https://task-manager-api-3gab.onrender.com/api |
| Expense Tracker API | http://localhost:8090/api | https://expense-tracker-api-ndhp.onrender.com/api |

---

## License

MIT — see [LICENSE](LICENSE)

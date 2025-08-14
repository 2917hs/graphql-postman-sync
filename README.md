# GraphQL Postman Collection Generator

Generate a Postman collection from a GraphQL schema (queries and mutations), with placeholders for variables. You can write the collection locally or push it to Postman via API.

---

## Features

- Load GraphQL schema from `.graphql` or `.json`.
- Auto-generate folders for Queries and Mutations.
- Add placeholder values for all GraphQL arguments.
- Save locally as `postman_collection.json`.
- Optionally create/update a Postman collection via API.

---

## Prerequisites

- Node.js 18+ (recommended Node 20)
- npm 8+

---

## Folder Structure

```
graphql-postman-sync/
├── src/
│   ├── index.ts
│   ├── config/
│   │   ├── dev.config.ts
│   │   └── prod.config.ts
│   ├── schema/
│   │   └── loader.ts
│   └── postman/
│       ├── collectionBuilder.ts
│       ├── requestBuilder.ts
│       └── importer.ts
├── schema/
│   └── schema.graphql
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup (from scratch)

1) Clone and enter the project
```bash
git clone <repo-url>
cd graphql-to-postman/graphql-postman-sync
```

2) Install dependencies
```bash
npm ci
```

3) Configure environment
- Create a `.env` file in `graphql-postman-sync` with:
```
POSTMAN_API_KEY=<your_postman_api_key>
WORKSPACE_ID=<optional_workspace_id>
```
- Edit `src/config/dev.config.ts` and `src/config/prod.config.ts` as needed:
  - `schemaPath`: points to your GraphQL schema file
  - `graphql_url`: your endpoint URL (used in Postman requests)
  - `collectionName`: the target collection name

---

## Running locally

Generate the collection JSON locally (no Postman API calls):
```bash
LOCAL_ONLY=1 OUT_FILE=postman_collection.json npm start
```
Output: `graphql-postman-sync/postman_collection.json`

Switch between environments (uses `src/config/<env>.config.ts`):
```bash
APP_ENV=prod LOCAL_ONLY=1 npm start
```
If `APP_ENV` is not set, `dev` is used by default.

Push to Postman (requires `POSTMAN_API_KEY` in `.env` or env):
```bash
npm start
```

Optional environment overrides:
- `OUT_FILE=custom.json` to change output filename
- `WORKSPACE_ID` to target a specific workspace

---

## GitHub Actions (CI)

This repo includes a workflow at `.github/workflows/generate-postman.yml`:

- On push to `main`, it builds and uploads `postman_collection.json` as an artifact.
- If `POSTMAN_API_KEY` is configured as a repo secret, it also pushes to Postman.
- You can trigger manually with an `environment` input (`dev` or `prod`).

Required repo secrets for pushing:
- `POSTMAN_API_KEY` (required to push)
- `WORKSPACE_ID` (optional)

---

## Troubleshooting

- "Please set POSTMAN_API_KEY": add it to `.env` or set as environment variable when running.
- Workspace access warnings: if the provided `WORKSPACE_ID` is not accessible, the script will try to create/use a default workspace.
- Schema not found: ensure `schemaPath` in the selected config points to an existing file.

---

## Notes

- Supports both GraphQL SDL (`.graphql`) and introspection JSON (`.json`).
- Requests default to a minimal selection set (`__typename`)—customize in `src/postman/requestBuilder.ts`.
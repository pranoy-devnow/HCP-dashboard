# Services

All backend/API communication must go through service files in this folder.

## Rules

- **Do not** call `fetch`, `axios`, or other HTTP clients from components or pages.
- Each service file encapsulates one domain (e.g. `caseFilesService.ts`, `alertsService.ts`).
- Use try/catch and log meaningful errors inside services.
- Types for API requests and responses live in `@/types/`.

## Structure

| Service | Purpose | When backend is ready |
|--------|---------|------------------------|
| `api.ts` | `getApiBaseUrl()`, `apiRequest()` for shared fetch config and error handling | Use in all services for HTTP calls |
| `caseFilesService.ts` | Case files list and detail | `getCaseFiles()` → GET /api/case-files, `getCaseFileById(id)` → GET /api/case-files/:id |
| `authService.ts` | Session (login/logout) | `setSession()` after POST /api/auth/login; optional token refresh |
| `alertsService.ts` | Clinical alerts and read state | `getAlerts()` / `getAlertsByCaseId()` → GET /api/alerts |

## Usage

Import from the specific service or from the index:

```ts
import { getCaseFileById, getCaseFiles } from "@/services/caseFilesService"
// or
import { getCaseFileById, getCaseFiles } from "@/services"
```

Components and pages should call these functions instead of importing directly from `@/lib` for data that will eventually come from an API.

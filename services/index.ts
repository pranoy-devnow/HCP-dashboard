/**
 * Services index. Import from here or from the specific service file.
 * All backend/API communication must go through these services.
 */

export {
  getCaseFiles,
  getCaseFileById,
  getBabyTitle,
} from "./caseFilesService"

export {
  getSession,
  setSession,
  clearSession,
} from "./authService"

export {
  getAlerts,
  getAlertsByCaseId,
  loadAlertsReadIds,
  saveAlertsReadIds,
  markAlertRead,
} from "./alertsService"

export { loadPendingConsultReadIds, markPendingConsultRead } from "./pendingConsultReadService"

export { getApiBaseUrl, apiRequest } from "./api"

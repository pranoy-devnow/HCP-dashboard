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
  resetAlertsReadState,
} from "./alertsService"

export {
  loadPendingConsultReadIds,
  markPendingConsultRead,
  MY_DAY_DEMO_PENDING_UNREAD,
  resetPendingConsultsToUnreadCount,
} from "./pendingConsultReadService"

export { getClinicalNotesByCaseId } from "./clinicalNotesService"

export { fetchDashboardData, getParsedDashboardData } from "./dashboardDataService"

export { getApiBaseUrl, apiRequest } from "./api"

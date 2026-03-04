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
  getNotifications,
  loadReadIds,
  saveReadIds,
} from "./notificationsService"

export {
  getSession,
  setSession,
  clearSession,
} from "./authService"

export { getCourses } from "./learningService"

export { getApiBaseUrl, apiRequest } from "./api"

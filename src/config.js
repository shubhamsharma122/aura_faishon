/* ------------------------------------------------------------------
   Backend connection.
   The API URL lives in code — no Vite environment variables needed.
   Change API_ORIGIN when the backend is deployed.
------------------------------------------------------------------- */

export const API_ORIGIN = 'http://localhost:4000'
export const API_BASE_URL = `${API_ORIGIN}/api/v1`
export const API_TIMEOUT_MS = 12000

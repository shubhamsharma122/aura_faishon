import { API_BASE_URL, API_TIMEOUT_MS } from '../config'

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const apiRequest = async (path, { method = 'GET', body, token, timeout = API_TIMEOUT_MS } = {}) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    })

    const payload = await res.json().catch(() => ({}))
    if (!res.ok || payload.success === false) {
      throw new ApiError(payload.message || `Request failed (${res.status}).`, res.status, payload.data ?? null)
    }
    return payload
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err.name === 'AbortError') {
      throw new ApiError('The API took too long to respond. Is the backend running?', 0)
    }
    throw new ApiError(
      `Cannot reach the API at ${API_BASE_URL}. Start it with \`npm start\` in sports_hub_backend.`,
      0,
    )
  } finally {
    clearTimeout(timer)
  }
}

import { apiRequest } from '../services/api'

const KEY = 'sh:session'
const EVENT = 'sh:session'

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@aura.com').toLowerCase()

export const isAdmin = (user) =>
  Boolean(user) &&
  (user.role === 'admin' || (Boolean(user.email) && user.email.toLowerCase() === ADMIN_EMAIL))

const read = () => {
  try {
    const raw = localStorage.getItem(KEY)
    const session = raw ? JSON.parse(raw) : null
    return session && session.user && session.user.email ? session : null
  } catch {
    return null
  }
}

export const getUser = () => read()?.user || null

export const getToken = () => read()?.token || null

const notify = () => window.dispatchEvent(new window.Event(EVENT))

const persist = ({ token, user }) => {
  const session = {
    token,
    user: {
      id: user.id || user._id || '',
      name: user.name || 'Member',
      email: String(user.email || '').toLowerCase(),
      role: user.role || 'customer',
    },
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    /* storage unavailable — session still lives in memory this view */
  }
  notify()
  return session.user
}

export const registerUser = async ({ name, email, password }) => {
  const { data } = await apiRequest('/auth/register', {
    method: 'POST',
    body: { name: name.trim(), email: email.trim().toLowerCase(), password },
  })
  return persist(data)
}

export const signInUser = async ({ email, password }) => {
  const { data } = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
  })
  return persist(data)
}

export const signOutUser = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  notify()
}

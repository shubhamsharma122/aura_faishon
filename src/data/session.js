const KEY = 'sh:session'
const DUMMY_KEY = 'sh:dummy-users'
const EVENT = 'sh:session'

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@aura.com').toLowerCase()

// Dummy users stored in localStorage for offline/demo use
const defaultDummyUsers = [
  { id: 'admin-001', name: 'Admin User', email: ADMIN_EMAIL, password: 'admin123', role: 'admin' },
  { id: 'user-001', name: 'Demo User', email: 'demo@aura.com', password: 'demo123', role: 'customer' },
]

function getDummyUsers() {
  try {
    const raw = localStorage.getItem(DUMMY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  // Seed default dummy users on first run (deep copy to prevent mutation)
  const seeded = JSON.parse(JSON.stringify(defaultDummyUsers))
  setDummyUsers(seeded)
  return seeded
}

function setDummyUsers(users) {
  try {
    localStorage.setItem(DUMMY_KEY, JSON.stringify(users))
  } catch { /* ignore */ }
}

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
  const emailLower = email.trim().toLowerCase()
  const users = getDummyUsers()
  if (users.find((u) => u.email === emailLower)) {
    const err = new Error('An account with this email already exists.')
    err.status = 409
    throw err
  }
  const newUser = {
    id: 'user-' + Date.now(),
    name: name.trim(),
    email: emailLower,
    password,
    role: 'customer',
  }
  users.push(newUser)
  setDummyUsers(users)
  return persist({ token: 'local-token', user: newUser })
}

export const signInUser = async ({ email, password }) => {
  const emailLower = email.trim().toLowerCase()
  const users = getDummyUsers()
  const found = users.find((u) => u.email === emailLower && u.password === password)
  if (!found) {
    const err = new Error('Invalid email or password.')
    err.status = 401
    throw err
  }
  return persist({ token: 'local-token', user: found })
}

export const signOutUser = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  notify()
}

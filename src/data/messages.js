const KEY = 'sh:messages'
const EVENT = 'sh:messages'

const normalize = (message) => ({ ...message, read: Boolean(message.read) })

const read = () => {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(normalize) : []
  } catch {
    return []
  }
}

const write = (messages) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(messages))
  } catch {
    /* storage unavailable — the session keeps working */
  }
  window.dispatchEvent(new window.Event(EVENT))
}

export const listMessages = () => read()

export const unreadMessageCount = () => read().filter((m) => !m.read).length

export const addMessage = (payload) => {
  const record = {
    id: `msg_${Date.now().toString(36)}`,
    sentAt: new Date().toISOString(),
    read: false,
    ...payload,
  }
  write([record, ...read()])
  return record
}

export const markMessage = (id, readState = true) => {
  write(read().map((m) => (m.id === id ? { ...m, read: readState } : m)))
}

export const deleteMessage = (id) => {
  write(read().filter((m) => m.id !== id))
}

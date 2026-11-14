import { storeDefaults } from './seed'

/* ------------------------------------------------------------------
   Store settings — seeded defaults plus admin overrides. The whole
   storefront (footer, contact, cart delivery threshold, WhatsApp)
   reads through getSettings(), so admin changes apply immediately.
------------------------------------------------------------------- */

const KEY = 'sh:settings'
const EVENT = 'sh:settings'

const readStored = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export const getSettings = () => ({ ...storeDefaults, ...readStored() })

export const saveSettings = (patch) => {
  const next = { ...readStored(), ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new window.Event(EVENT))
  return { ...storeDefaults, ...next }
}

export const resetSettings = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new window.Event(EVENT))
  return { ...storeDefaults }
}

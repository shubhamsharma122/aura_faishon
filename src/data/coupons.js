import { coupons as seedCoupons } from './seed'

/* ------------------------------------------------------------------
   Coupons — seeded codes plus admin edits stored in localStorage.
   The cart validates against this list, so new/edited codes work
   immediately without a reload.
------------------------------------------------------------------- */

const KEY = 'sh:coupons'
const EVENT = 'sh:coupons'

let cache = null

const readStored = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seedCoupons.map((c) => ({ ...c }))
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedCoupons.map((c) => ({ ...c }))
  } catch {
    return seedCoupons.map((c) => ({ ...c }))
  }
}

const persist = (list) => {
  cache = list
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* in-memory list still works this session */
  }
  window.dispatchEvent(new window.Event(EVENT))
}

export const listCoupons = () => {
  if (!cache) cache = readStored()
  return cache
}

export const saveCoupon = (input) => {
  const code = (input.code || '').trim().toUpperCase()
  if (!code) throw new Error('Coupon code is required.')
  const coupon = {
    code,
    type: input.type === 'flat' ? 'flat' : 'percent',
    value: Math.max(0, Number(input.value) || 0),
    minOrder: Math.max(0, Number(input.minOrder) || 0),
    active: input.active !== false,
    label: (input.label || '').trim(),
  }
  const list = listCoupons()
  const exists = list.some((c) => c.code === code)
  persist(exists ? list.map((c) => (c.code === code ? coupon : c)) : [coupon, ...list])
  return coupon
}

export const toggleCoupon = (code) => {
  persist(listCoupons().map((c) => (c.code === code ? { ...c, active: !c.active } : c)))
}

export const deleteCoupon = (code) => {
  persist(listCoupons().filter((c) => c.code !== code))
}

export const resetCoupons = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  cache = null
  window.dispatchEvent(new window.Event(EVENT))
}

/* Local wishlist — guest-only, persisted in localStorage. */
const KEY = 'sh:wishlist'

export const getWishlist = () => {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export const isWishlisted = (id) => getWishlist().includes(id)

export const toggleWishlist = (id) => {
  const current = getWishlist()
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new window.Event('sh:wishlist'))
  return next
}

export const wishlistCount = () => getWishlist().length

import { useSyncExternalStore } from 'react'
import { categories, products as baseProducts } from './products'
import { pickImages } from './productImages'

/* ------------------------------------------------------------------
   Storefront catalog = static seed + browser-local admin overrides.
   Admin edits live in localStorage so product changes survive reloads
   and are visible on the shop, search and product pages.
------------------------------------------------------------------- */

const KEY = 'sh:catalog'
const EVENT = 'sh:catalog'

const EMPTY = { created: [], updated: {}, deleted: [] }

const readStored = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    return {
      created: Array.isArray(parsed.created) ? parsed.created : [],
      updated: parsed.updated && typeof parsed.updated === 'object' ? parsed.updated : {},
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
    }
  } catch {
    return { ...EMPTY }
  }
}

let state = readStored()
let cache = null

const notify = () => {
  window.dispatchEvent(new window.Event(EVENT))
}

const persist = (next) => {
  state = next
  cache = null
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable — the in-memory catalog still renders this session */
  }
  notify()
}

const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || ''
const categoryGradient = (slug) =>
  categories.find((c) => c.slug === slug)?.gradient || ['#0E4637', '#08251F']

const slugify = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const number = (value, fallback = 0) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export const normalizeProduct = (input = {}, existingId) => {
  const id =
    existingId ||
    input.id ||
    `pc_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  const name = (input.name || '').trim() || 'Untitled product'
  const category = input.category || 'accessories'
  const picked =
    Array.isArray(input.images) && input.images.length
      ? input.images
      : pickImages(id, input.subcategory)
  const images = input.image
    ? [input.image, ...picked.filter((src) => src !== input.image)]
    : picked
  const price = Math.max(0, number(input.price, 0))

  return {
    _id: id,
    id,
    slug: input.slug || slugify(name) || id,
    name,
    brand: (input.brand || '').trim() || 'Aura Fashion',
    category,
    categoryName: categoryName(category),
    subcategory: input.subcategory || '',
    price,
    mrp: Math.max(price, number(input.mrp, price)),
    stock: Math.max(0, number(input.stock, 0)),
    rating: number(input.rating, 4.5),
    reviews: number(input.reviews, 0),
    sizes: Array.isArray(input.sizes) ? input.sizes.filter(Boolean) : null,
    colors:
      Array.isArray(input.colors) && input.colors.length
        ? input.colors
        : ['#0E4637', '#FF6B2C', '#101828'],
    description: input.description || '',
    features: Array.isArray(input.features) ? input.features.filter(Boolean) : [],
    tags: Array.isArray(input.tags) ? input.tags : [],
    badge: input.badge || null,
    featured: Boolean(input.featured),
    bestseller: Boolean(input.bestseller),
    isNew: Boolean(input.isNew),
    createdAt: input.createdAt || new Date().toISOString(),
    gradient: input.gradient || categoryGradient(category),
    image: images[0] || null,
    images,
  }
}

export const listProducts = () => {
  if (cache) return cache
  const deleted = new Set(state.deleted)
  const updated = state.updated
  const base = baseProducts
    .filter((p) => !deleted.has(p.id))
    .map((p) => (updated[p.id] ? { ...p, ...updated[p.id] } : p))
  const created = state.created.map((p) => ({ ...p }))
  cache = [...base, ...created]
  return cache
}

export const findProduct = (idOrSlug) =>
  listProducts().find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null

export const saveProduct = (input) => {
  const id = input.id
  const createdMatch = id ? state.created.find((p) => p.id === id) : null
  const baseMatch = !createdMatch && id ? baseProducts.find((p) => p.id === id) : null

  if (createdMatch) {
    const product = normalizeProduct({ ...createdMatch, ...input }, id)
    persist({
      ...state,
      created: state.created.map((p) => (p.id === id ? product : p)),
    })
    return product
  }

  if (baseMatch) {
    const product = normalizeProduct({ ...baseMatch, ...input }, id)
    persist({ ...state, updated: { ...state.updated, [id]: product } })
    return product
  }

  const product = normalizeProduct(input)
  persist({ ...state, created: [product, ...state.created] })
  return product
}

export const deleteProduct = (id) => {
  if (state.created.some((p) => p.id === id)) {
    persist({ ...state, created: state.created.filter((p) => p.id !== id) })
    return
  }
  persist({ ...state, deleted: [...new Set([...state.deleted, id])] })
}

export const restoreCatalog = () => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  state = readStored()
  cache = null
  notify()
}

export const searchProducts = (q) => {
  const t = (q || '').trim().toLowerCase()
  if (!t) return []
  return listProducts().filter((p) => {
    const hay = [p.name, p.brand, p.subcategory, p.categoryName, ...(p.tags || [])]
      .join(' ')
      .toLowerCase()
    return hay.includes(t)
  })
}

export const brandsList = () => [...new Set(listProducts().map((p) => p.brand))].sort()

export const lowStockProducts = (threshold = 5) =>
  listProducts()
    .filter((p) => p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock)

const subscribe = (callback) => {
  const onChange = () => {
    state = readStored()
    cache = null
    callback()
  }
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

export const useCatalog = () => useSyncExternalStore(subscribe, listProducts, listProducts)

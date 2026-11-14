/* ------------------------------------------------------------------
   Local product imagery from public/images/products/.
   Original Aura Fashion product images: watch, polo, cap, perfume,
   loafers, pants, sunglasses.
------------------------------------------------------------------- */

const IMG = '/images/products/'

const local = (file) => `${IMG}${file}`

const PRODUCT_IMAGES = [
  local('watch.png'),
  local('polo.png'),
  local('cap.png'),
  local('perfume.png'),
  local('loafers.png'),
  local('pants.png'),
  local('sunglasses.png'),
]

const PREVIEW_IMAGES = [
  local('watch-preview.jpg'),
  local('polo-preview.jpg'),
  local('cap-preview.jpg'),
  local('perfume-preview.jpg'),
  local('loafers-preview.jpg'),
  local('pants-preview.jpg'),
  local('sunglasses-preview.jpg'),
]

const ALL_IMAGES = [...PRODUCT_IMAGES, ...PREVIEW_IMAGES]

export const IMAGES_BY_SUBCATEGORY = {
  'Polo Shirts': ALL_IMAGES,
  'T-Shirts': ALL_IMAGES,
  Trousers: ALL_IMAGES,
  Shirts: ALL_IMAGES,
  Watches: ALL_IMAGES,
  Sunglasses: ALL_IMAGES,
  Caps: ALL_IMAGES,
  Bags: ALL_IMAGES,
  Loafers: ALL_IMAGES,
  Sneakers: ALL_IMAGES,
  Sandals: ALL_IMAGES,
  'Eau de Parfum': ALL_IMAGES,
  'Body Mist': ALL_IMAGES,
}

const hash = (value = '') =>
  [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7)

/** Deterministic image rotation so a product keeps the same photos on reload. */
export function pickImages(id, subcategory, count = 3) {
  const pool = IMAGES_BY_SUBCATEGORY[subcategory] || ALL_IMAGES
  if (!pool.length) return []
  const start = hash(id) % pool.length
  const total = Math.min(count, pool.length)
  return Array.from({ length: total }, (_, i) => pool[(start + i) % pool.length])
}

export const isUnsplash = (src = '') => src.includes('images.unsplash.com')
export const isProductShot = (src = '') => src.startsWith('/images/products/')

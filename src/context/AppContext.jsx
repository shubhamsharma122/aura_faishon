import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { findProduct } from '../data/catalog'
import { listCoupons } from '../data/coupons'
import { getSettings, saveSettings as saveSettingsStore } from '../data/settings'

/* ------------------------------------------------------------------
   Cart — guest-only, fully local. No accounts, no network calls.
   Items are persisted in localStorage so a refresh keeps the bag.
------------------------------------------------------------------- */
export const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

const CART_KEY = 'sh:cart:guest'

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const persist = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    /* storage may be unavailable — cart still works for the session */
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [coupon, setCoupon] = useState(null)

  useEffect(() => {
    persist(items)
  }, [items])

  const add = useCallback(
    (productOrId, { qty = 1, size, color, custom = null } = {}) => {
      const product = productOrId ? findProduct(productOrId) : null

      if (!product && !custom) return

      const key = custom
        ? `custom:${custom.kind || 'design'}:${size || 'std'}:${Date.now().toString(36)}`
        : `${product.id}:${size || 'std'}`

      setItems((current) => {
        const existing = current.find((it) => it.cartKey === key)
        if (existing) {
          return current.map((it) =>
            it.cartKey === key ? { ...it, qty: Math.min(it.qty + qty, 20) } : it,
          )
        }

        const item = custom
          ? {
              cartKey: key,
              productId: 'custom',
              name: `${custom.name} (${size || 'std'})`,
              price: custom.price,
              mrp: custom.price,
              qty,
              size: size || null,
              color: custom.baseColor || null,
              gradient: null,
              image: custom.preview || null,
              type: 'custom',
              kind: custom.kind || 'custom',
              design: custom,
            }
          : {
              cartKey: key,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              mrp: product.mrp,
              qty,
              size: size || null,
              color: color || product.colors?.[0] || null,
              gradient: product.gradient || null,
              image: null,
              type: 'product',
              kind: product.subcategory || product.category || null,
              design: null,
            }

        return [...current, item]
      })

      toast.success(custom ? 'Custom design added to cart' : 'Added to cart')
    },
    [],
  )

  const updateQty = useCallback((key, qty) => {
    setItems((current) => {
      if (qty < 1) return current.filter((it) => it.cartKey !== key)
      return current.map((it) => (it.cartKey === key ? { ...it, qty: Math.min(qty, 20) } : it))
    })
  }, [])

  const remove = useCallback((key) => {
    setItems((current) => current.filter((it) => it.cartKey !== key))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setCoupon(null)
  }, [])

  const count = items.reduce((n, it) => n + it.qty, 0)
  const subtotal = items.reduce((n, it) => n + it.price * it.qty, 0)
  const mrpTotal = items.reduce((n, it) => n + (it.mrp || it.price) * it.qty, 0)
  const flatDiscount = mrpTotal - subtotal

  const couponDiscount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
    : 0

  const applyCoupon = useCallback(
    async (code) => {
      const clean = (code || '').trim().toUpperCase()
      if (!clean) throw new Error('Enter a coupon code.')
      const found = listCoupons().find((c) => c.code === clean && c.active)
      if (!found) throw new Error('That coupon code is not valid.')
      if (subtotal < found.minOrder) {
        throw new Error(`This coupon needs an order above ₹${found.minOrder}.`)
      }
      setCoupon(found)
      return found
    },
    [subtotal],
  )

  const value = useMemo(
    () => ({
      items,
      add,
      updateQty,
      remove,
      clear,
      count,
      subtotal,
      flatDiscount,
      mrpTotal,
      coupon,
      applyCoupon,
      setCoupon,
      couponDiscount,
    }),
    [
      items,
      add,
      updateQty,
      remove,
      clear,
      count,
      subtotal,
      flatDiscount,
      mrpTotal,
      coupon,
      applyCoupon,
      couponDiscount,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/* ------------------------------------------------------------------
   Store settings — local defaults only.
------------------------------------------------------------------- */
export const SettingsContext = createContext(null)
export const useSettingsStore = () => useContext(SettingsContext)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(getSettings)

  useEffect(() => {
    const sync = () => setSettings(getSettings())
    window.addEventListener('sh:settings', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('sh:settings', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const save = useCallback((patch) => {
    const next = saveSettingsStore(patch)
    setSettings(next)
    return next
  }, [])

  const value = useMemo(() => ({ settings, save }), [settings, save])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

/* Toaster default config — square, monochrome. */
export const toastOpts = {
  duration: 2600,
  position: 'top-center',
  style: {
    background: '#000000',
    color: '#ffffff',
    fontFamily: 'Poppins, Helvetica, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    letterSpacing: '.06em',
    borderRadius: '0',
  },
}

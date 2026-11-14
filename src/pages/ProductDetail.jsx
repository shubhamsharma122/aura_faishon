import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  FaHeart, FaRegHeart, FaCartPlus, FaBolt, FaCheck, FaTruck, FaShieldAlt, FaInfoCircle,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import ProductImage from '../components/ui/ProductImage'
import ProductCard from '../components/ui/ProductCard'
import { Stars, StockBadge, QtyStepper, SectionHeading } from '../components/ui/misc'
import Modal from '../components/ui/Modal'
import { inr, discountPct, cn } from '../utils/format'
import { useCart, useSettingsStore } from '../context/AppContext'
import { useCatalog } from '../data/catalog'
import { isWishlisted, toggleWishlist } from '../data/wishlist'

const sizeChart = {
  S: '36" – 38"',
  M: '38" – 40"',
  L: '40" – 42"',
  XL: '42" – 44"',
  XXL: '44" – 46"',
  'Short Handle': 'Approx. 33.5"',
  'Long Handle': 'Approx. 34.5"',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const nav = useNavigate()
  const products = useCatalog()
  const { add } = useCart()
  const { settings } = useSettingsStore()
  const [searchParams] = useSearchParams()
  const intent = searchParams.get('intent')
  const intentQty = Number(searchParams.get('intentQty') || 1)
  const intentSize = searchParams.get('intentSize') || ''
  const intentHandled = useRef('')

  const product = useMemo(
    () => products.find((p) => p.id === slug || p.slug === slug),
    [slug, products],
  )
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [variant, setVariant] = useState(0)
  const [chartOpen, setChartOpen] = useState(false)
  const [loved, setLoved] = useState(false)

  useEffect(() => {
    if (!product) return
    // Reset selections when navigating between products.
    /* eslint-disable react-hooks/set-state-in-effect */
    setQty(1)
    setSize(product.sizes?.[0] || '')
    setVariant(0)
    setLoved(isWishlisted(product.id))
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [product])

  useEffect(() => {
    if (!product || !intent) return
    if (intentHandled.current === intent) return
    intentHandled.current = intent
    const s = intentSize || product.sizes?.[0] || undefined
    if (product.sizes?.length && s && !product.sizes.includes(s)) return
    add(product.id, { qty: Math.max(1, intentQty), size: s })
    if (intent === 'buyNow') nav('/checkout')
    else nav(`/product/${product.slug}`, { replace: true })
  }, [product, intent, intentQty, intentSize, add, nav])

  if (!product) {
    return (
      <div className="container-x py-24 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="section-title mt-3">Product not found</h1>
        <p className="mt-3 text-sm text-muted">This product may have been removed.</p>
        <Link to="/shop" className="btn-primary mt-6">Back to shop</Link>
      </div>
    )
  }

  const pct = discountPct(product.mrp, product.price)
  const out = product.stock <= 0
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const onLove = () => {
    const next = toggleWishlist(product.id)
    setLoved(next.includes(product.id))
    toast(next.includes(product.id) ? 'Saved to wishlist' : 'Removed from wishlist')
  }

  const doAdd = () => {
    if (out) return toast.error('This item is out of stock.')
    if (product.sizes?.length && !size) return toast.error('Please select a size.')
    add(product.id, { qty, size })
  }

  const buyNow = () => {
    if (out) return toast.error('This item is out of stock.')
    if (product.sizes?.length && !size) return toast.error('Please select a size.')
    add(product.id, { qty, size })
    nav('/checkout')
  }

  return (
    <div className="container-x py-8 lg:py-12">
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          brand: { '@type': 'Brand', name: product.brand },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviews,
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: product.price,
            availability: out ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          },
        })}
      </script>

      <p className="eyebrow">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span className="mx-2 text-ink/30">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-ink">{product.categoryName}</Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>{product.subcategory}</span>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square bg-mist">
            <ProductImage product={product} variant={variant} className="h-full w-full p-10 sm:p-16" />
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {product.badge && <span className="chip border-ink bg-white">{product.badge}</span>}
              {pct > 0 && <span className="chip border-ink bg-ink text-white">−{pct}%</span>}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                aria-label={`View ${v + 1}`}
                className={cn(
                  'aspect-square bg-mist p-3 transition',
                  variant === v ? 'border border-ink' : 'border border-transparent hover:border-ink/20',
                )}
              >
                <ProductImage product={product} variant={v} className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="eyebrow">{product.brand} · {product.subcategory}</p>
          <h1 className="mt-3 font-display text-3xl uppercase leading-[1.08] tracking-[.01em] sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <Stars rating={product.rating} />
            <span className="text-[11px] text-muted">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-2xl">{inr(product.price)}</span>
            {pct > 0 && <span className="text-sm text-faint line-through">{inr(product.mrp)}</span>}
            {pct > 0 && <span className="chip border-ink bg-ink text-white">Save {pct}%</span>}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Inclusive of all taxes · Free delivery above {inr(settings?.freeDeliveryAbove || 999)}
          </p>

          <div className="mt-5">
            <StockBadge stock={product.stock} />
          </div>

          {product.sizes?.length > 0 && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">Select size</span>
                <button
                  type="button"
                  onClick={() => setChartOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[.14em] text-muted hover:text-ink"
                >
                  <FaInfoCircle size={10} /> Size chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      'min-w-[3.25rem] border px-3 py-2.5 font-display text-[11px] uppercase tracking-wide transition',
                      size === s ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink/70 hover:border-ink',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <button type="button" onClick={doAdd} disabled={out} className="btn-primary min-w-[170px] flex-1">
              <FaCartPlus size={11} /> {out ? 'Out of stock' : 'Add to cart'}
            </button>
            <button type="button" onClick={buyNow} disabled={out} className="btn-outline min-w-[170px] flex-1">
              <FaBolt size={11} /> Buy now
            </button>
            <button
              type="button"
              onClick={onLove}
              aria-label="Wishlist"
              className="flex h-11 w-11 items-center justify-center border border-ink/20 text-ink transition hover:border-ink"
            >
              {loved ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            </button>
          </div>

          <div className="mt-8 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-3">
            {[
              { icon: <FaTruck />, title: 'Free delivery', copy: 'Above ₹999' },
              { icon: <FaShieldAlt />, title: 'Cash on delivery', copy: 'Pay on arrival' },
              { icon: <FaCheck />, title: '7-day returns', copy: 'Unused & tagged' },
            ].map((x) => (
              <div key={x.title} className="flex flex-col items-center bg-white px-3 py-4 text-center">
                <span className="mb-2 text-ink/50">{x.icon}</span>
                <p className="font-display text-[10px] uppercase tracking-[.14em]">{x.title}</p>
                <p className="mt-1 text-[10px] text-muted">{x.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-ink/10 pt-6">
            <h2 className="font-display text-sm uppercase tracking-[.14em]">About this product</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>
            {product.features?.length > 0 && (
              <ul className="mt-4 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <FaCheck size={10} className="mt-1 shrink-0 text-ink" /> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-ink/10 pt-12">
          <SectionHeading
            eyebrow="More to explore"
            title={`More ${product.categoryName}`}
            action={<Link to={`/shop?category=${product.category}`} className="btn-link">View all</Link>}
          />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Modal open={chartOpen} onClose={() => setChartOpen(false)} title="Size chart" maxWidth="max-w-sm">
        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left">
                <th className="py-2 font-display text-[10px] uppercase tracking-[.14em] text-muted">Size</th>
                <th className="py-2 font-display text-[10px] uppercase tracking-[.14em] text-muted">Approx.</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sizeChart).map(([k, v]) => (
                <tr key={k} className="border-b border-ink/10">
                  <td className="py-2.5">{k}</td>
                  <td className="py-2.5 text-muted">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            Between sizes? Size up for a relaxed match-day fit. Message us on WhatsApp for help.
          </p>
        </div>
      </Modal>
    </div>
  )
}

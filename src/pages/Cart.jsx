import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaTag, FaArrowRight, FaShoppingBag } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useCart, useSettingsStore } from '../context/AppContext'
import { ThumbImage } from '../components/ui/ProductImage'
import { QtyStepper, EmptyState } from '../components/ui/misc'
import { inr } from '../utils/format'

export default function Cart() {
  const {
    items, updateQty, remove, clear, subtotal, flatDiscount, mrpTotal,
    coupon, applyCoupon, setCoupon, couponDiscount,
  } = useCart()
  const { settings } = useSettingsStore()
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)

  const freeAt = settings?.freeDeliveryAbove ?? 999
  const shipping = subtotal - couponDiscount >= freeAt ? 0 : 49
  const total = Math.max(0, subtotal - couponDiscount + shipping)
  const remaining = freeAt - subtotal
  const progress = Math.min(100, (subtotal / freeAt) * 100)

  const applyCouponCode = async () => {
    if (!code.trim()) return
    setChecking(true)
    try {
      const c = await applyCoupon(code)
      toast.success(`Coupon ${c.code} applied`)
      setCode('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setChecking(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-14 lg:py-20">
        <p className="eyebrow">Shopping bag</p>
        <h1 className="section-title mt-3">Your bag</h1>
        <div className="mt-10">
          <EmptyState
            icon={<FaShoppingBag size={26} />}
            title="Your bag is empty"
            subtitle="Browse the collection or design a custom jersey — everything you need for match day."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/shop" className="btn-primary">Shop all</Link>
                <Link to="/customize" className="btn-outline">Design a jersey</Link>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="flex flex-col gap-2 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Shopping bag</p>
          <h1 className="section-title mt-3">Your bag</h1>
        </div>
        <p className="text-[11px] uppercase tracking-[.14em] text-muted">
          {items.length} item{items.length > 1 ? 's' : ''} · Cash on delivery available
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.55fr_.9fr] lg:gap-14">
        {/* Items */}
        <div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {items.map((it) => (
              <li key={it.cartKey} className="flex gap-4 py-5 sm:gap-6">
                <Link to={it.slug ? `/product/${it.slug}` : '/cart'} className="h-28 w-24 shrink-0 bg-mist sm:h-36 sm:w-28">
                  <ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={it.slug ? `/product/${it.slug}` : '/cart'}
                        className="block font-display text-[12px] uppercase tracking-wide text-ink hover:text-muted sm:text-sm"
                      >
                        {it.name}
                      </Link>
                      <p className="mt-1.5 text-[11px] uppercase tracking-[.14em] text-muted">
                        {it.size ? `Size ${it.size}` : 'One size'}
                        {it.type === 'custom' ? ' · Custom design' : ''}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-sm">{inr(it.price * it.qty)}</p>
                      {it.mrp > it.price && (
                        <p className="mt-0.5 text-[11px] text-faint line-through">{inr(it.mrp * it.qty)}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <QtyStepper small value={it.qty} onChange={(q) => updateQty(it.cartKey, q)} />
                    <button
                      type="button"
                      onClick={() => remove(it.cartKey)}
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[.14em] text-muted transition hover:text-ink"
                    >
                      <FaTrash size={9} /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link to="/shop" className="btn-link">
              <FaArrowRight size={9} className="rotate-180" /> Continue shopping
            </Link>
            <button type="button" onClick={clear} className="text-[10px] uppercase tracking-[.14em] text-muted underline hover:text-ink">
              Clear bag
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="border border-ink/10 p-6 lg:sticky lg:top-8">
            <h2 className="font-display text-sm uppercase tracking-[.14em]">Order summary</h2>

            <div className="mt-5 border border-ink/10 bg-mist p-4">
              {remaining > 0 ? (
                <>
                  <p className="text-[11px] leading-relaxed text-ink/70">
                    You’re <b className="text-ink">{inr(remaining)}</b> away from free delivery.
                  </p>
                  <div className="mt-3 h-px w-full bg-ink/15">
                    <div className="h-px bg-ink transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </>
              ) : (
                <p className="text-[11px] uppercase tracking-[.14em] text-ink">Free delivery unlocked</p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="cart-coupon" className="field-label">Coupon code</label>
              <div className="flex">
                <input
                  id="cart-coupon"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCouponCode()}
                  placeholder="e.g. SHUB10"
                  className="field border-r-0 uppercase"
                />
                <button
                  type="button"
                  onClick={applyCouponCode}
                  disabled={checking}
                  className="shrink-0 border border-ink bg-ink px-5 font-display text-[10px] uppercase tracking-[.14em] text-white transition hover:bg-white hover:text-ink"
                >
                  {checking ? '…' : 'Apply'}
                </button>
              </div>
              {coupon && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[.14em] text-ink">
                  <FaTag size={9} /> {coupon.code} applied
                  <button
                    type="button"
                    onClick={() => setCoupon(null)}
                    className="ml-auto text-muted underline hover:text-ink"
                  >
                    Remove
                  </button>
                </p>
              )}
            </div>

            <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
              <div className="flex justify-between text-muted">
                <dt>MRP</dt>
                <dd className="line-through">{inr(mrpTotal)}</dd>
              </div>
              {flatDiscount > 0 && (
                <div className="flex justify-between text-muted">
                  <dt>Product discount</dt>
                  <dd>− {inr(flatDiscount)}</dd>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-muted">
                  <dt>Coupon ({coupon.code})</dt>
                  <dd>− {inr(couponDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <dt>Delivery</dt>
                <dd>{shipping === 0 ? 'Free' : inr(shipping)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4">
              <span className="font-display text-[11px] uppercase tracking-[.14em]">Total</span>
              <span className="font-display text-2xl">{inr(total)}</span>
            </div>
            <p className="mt-1 text-right text-[10px] uppercase tracking-[.14em] text-faint">
              Inclusive of all taxes
            </p>

            <button type="button" onClick={() => nav('/checkout')} className="btn-primary mt-6 w-full">
              Checkout <FaArrowRight size={9} />
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[.14em] text-faint">
              Pay cash on delivery · No account needed
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

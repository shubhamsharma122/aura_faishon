import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaCheck, FaMoneyBillWave, FaLock, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useCart, useSettingsStore } from '../context/AppContext'
import { createOrder } from '../data/orders'
import { ThumbImage } from '../components/ui/ProductImage'
import { inr, cn } from '../utils/format'

const emptyAddress = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: 'Purnea',
  state: 'Bihar',
  pincode: '',
}

const STEPS = ['Address', 'Review', 'Payment']

export default function Checkout() {
  const { items, subtotal, flatDiscount, mrpTotal, coupon, couponDiscount, clear } = useCart()
  const { settings } = useSettingsStore()
  const nav = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyAddress)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)
  const [note, setNote] = useState('')

  const freeAt = settings?.freeDeliveryAbove ?? 999
  const shipping = subtotal - couponDiscount >= freeAt ? 0 : 49
  const total = Math.max(0, subtotal - couponDiscount + shipping)

  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items])

  useEffect(() => {
    if (items.length === 0 && !placing) nav('/cart', { replace: true })
  }, [items.length, nav, placing])

  if (items.length === 0) return null

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!/^[+\d][\d\s-]{9,14}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.'
    if (!form.line1.trim()) errs.line1 = 'Address is required.'
    if (!form.city.trim()) errs.city = 'City is required.'
    if (!form.state.trim()) errs.state = 'State is required.'
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit PIN code.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goReview = () => {
    if (!validate()) return toast.error('Please complete the delivery details.')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const placeOrder = () => {
    setPlacing(true)
    try {
      const order = createOrder({
        items,
        address: form,
        coupon,
        paymentMethod: 'COD',
        note,
      })
      clear()
      toast.success('Order placed — pay on delivery')
      nav(`/order/${order.no}`, { replace: true })
    } catch (err) {
      setPlacing(false)
      toast.error(err?.message || 'Could not place the order. Please try again.')
    }
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="border-b border-ink/10 pb-6">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="section-title mt-3">Checkout</h1>
      </div>

      {/* Steps */}
      <ol className="mt-6 flex items-center gap-2 sm:gap-4">
        {STEPS.map((label, i) => {
          const n = i + 1
          const done = step > n
          const active = step === n
          return (
            <li key={label} className="flex flex-1 items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => (n < step ? setStep(n) : undefined)}
                className={cn(
                  'flex items-center gap-2 text-[10px] uppercase tracking-[.14em] transition',
                  active ? 'text-ink' : done ? 'text-ink/60' : 'text-ink/30',
                  n < step ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center border text-[10px]',
                    active ? 'border-ink bg-ink text-white' : done ? 'border-ink text-ink' : 'border-ink/20',
                  )}
                >
                  {done ? <FaCheck size={9} /> : n}
                </span>
                {label}
              </button>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ink/10" />}
            </li>
          )
        })}
      </ol>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.55fr_.9fr] lg:gap-14">
        <div>
          {/* Step 1 — address */}
          {step === 1 && (
            <section className="border border-ink/10 p-6 sm:p-8">
              <h2 className="font-display text-sm uppercase tracking-[.14em]">Delivery address</h2>
              <p className="mt-2 text-[11px] text-muted">
                Guest checkout — no account needed. We’ll use this number to confirm delivery.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id="ck-name" label="Full name" required value={form.name} onChange={set('name')} error={errors.name} placeholder="Your name" />
                <Field id="ck-phone" label="Phone" required value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="10-digit mobile" inputMode="tel" />
                <div className="sm:col-span-2">
                  <Field id="ck-line1" label="Address" required value={form.line1} onChange={set('line1')} error={errors.line1} placeholder="House no, street, area" />
                </div>
                <div className="sm:col-span-2">
                  <Field id="ck-line2" label="Landmark (optional)" value={form.line2} onChange={set('line2')} placeholder="Near Clock Tower" />
                </div>
                <Field id="ck-city" label="City" required value={form.city} onChange={set('city')} error={errors.city} />
                <Field id="ck-state" label="State" required value={form.state} onChange={set('state')} error={errors.state} />
                <Field
                  id="ck-pin"
                  label="PIN code"
                  required
                  value={form.pincode}
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }))}
                  error={errors.pincode}
                  placeholder="854301"
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>

              <button type="button" onClick={goReview} className="btn-primary mt-8 w-full sm:w-auto">
                Continue to review <FaArrowRight size={9} />
              </button>
            </section>
          )}

          {/* Step 2 — review */}
          {step === 2 && (
            <section className="border border-ink/10 p-6 sm:p-8">
              <h2 className="font-display text-sm uppercase tracking-[.14em]">Review order</h2>

              <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {items.map((it) => (
                  <li key={it.cartKey} className="flex items-center gap-4 py-4">
                    <div className="h-20 w-16 shrink-0 bg-mist">
                      <ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[11px] uppercase tracking-wide">{it.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[.14em] text-muted">
                        {it.size ? `Size ${it.size} · ` : ''}Qty {it.qty}
                        {it.type === 'custom' ? ' · Custom' : ''}
                      </p>
                    </div>
                    <span className="font-display text-sm">{inr(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border border-ink/10 bg-mist p-4">
                <p className="flex items-start gap-2 text-sm leading-relaxed text-ink/70">
                  <FaMapMarkerAlt size={11} className="mt-1 shrink-0 text-ink" />
                  <span>
                    <b className="font-display text-[10px] uppercase tracking-[.14em] text-ink">Deliver to</b>
                    <br />
                    {form.name} · {form.phone}
                    <br />
                    {form.line1}
                    {form.line2 ? `, ${form.line2}` : ''}, {form.city}, {form.state} — {form.pincode}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-3 text-[10px] uppercase tracking-[.14em] text-muted underline hover:text-ink"
                >
                  Edit address
                </button>
              </div>

              <div className="mt-6">
                <label htmlFor="ck-note" className="field-label">Order note (optional)</label>
                <textarea
                  id="ck-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Delivery instructions, preferred time, team name…"
                  className="field resize-none"
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(1)} className="btn-outline">
                  Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">
                  Continue to payment <FaArrowRight size={9} />
                </button>
              </div>
            </section>
          )}

          {/* Step 3 — payment */}
          {step === 3 && (
            <section className="border border-ink/10 p-6 sm:p-8">
              <h2 className="font-display text-sm uppercase tracking-[.14em]">Payment</h2>

              <label className="mt-6 flex cursor-pointer items-start gap-4 border border-ink p-5">
                <input type="radio" name="payment" checked readOnly className="mt-0.5 h-4 w-4 accent-ink" />
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <b className="font-display text-[11px] uppercase tracking-[.14em]">Cash on delivery</b>
                    <span className="chip border-ink">Available</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">
                    Pay {inr(total)} in cash when your order arrives. We’ll call {form.phone} before dispatch.
                  </span>
                </span>
              </label>

              <div className="mt-4 border border-ink/10 p-4 text-sm leading-relaxed text-muted">
                UPI and card payments are coming soon. For now we accept cash on delivery across Bihar.
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="btn-primary mt-8 w-full py-4"
              >
                <FaLock size={10} />
                {placing ? 'Placing order…' : `Place order — ${inr(total)}`}
              </button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[.14em] text-faint">
                By placing this order you agree to our 7-day return policy.
              </p>
            </section>
          )}
        </div>

        {/* Summary */}
        <aside>
          <div className="border border-ink/10 p-6 lg:sticky lg:top-8">
            <h2 className="font-display text-sm uppercase tracking-[.14em]">Summary</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[.14em] text-faint">
              {count} item{count > 1 ? 's' : ''}
            </p>

            <dl className="mt-5 space-y-2.5 text-sm">
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

            <div className="mt-5 flex items-start gap-2 border-t border-ink/10 pt-4 text-[11px] leading-relaxed text-muted">
              <FaMoneyBillWave size={11} className="mt-0.5 shrink-0" />
              Cash on delivery · Free delivery above {inr(freeAt)}
            </div>

            <Link to="/cart" className="btn-link mt-5">
              Edit bag
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({ id, label, required, error, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="text-ink"> *</span>}
      </label>
      <input
        id={id}
        className={cn('field', error && 'border-ink bg-ink/[.02]')}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-[11px] text-ink">{error}</p>}
    </div>
  )
}

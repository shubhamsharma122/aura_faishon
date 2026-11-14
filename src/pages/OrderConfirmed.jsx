import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaCheck, FaWhatsapp, FaPrint, FaArrowRight, FaTruck } from 'react-icons/fa'
import { ThumbImage } from '../components/ui/ProductImage'
import { StatusBadge } from '../components/ui/misc'
import { getOrder } from '../data/orders'
import { useSettingsStore } from '../context/AppContext'
import { inr, formatDate } from '../utils/format'

const FLOW = ['Pending', 'Confirmed', 'Shipped', 'Delivered']

function Progress({ status }) {
  const idx = FLOW.indexOf(status)
  return (
    <ol className="mt-8 flex items-start gap-2">
      {FLOW.map((s, i) => (
        <li key={s} className="flex flex-1 items-start gap-2">
          <div className="flex flex-1 flex-col items-start gap-2">
            <div className="flex w-full items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center border text-[9px] ${
                  i <= idx ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink/30'
                }`}
              >
                {i < idx ? <FaCheck size={8} /> : i + 1}
              </span>
              {i < FLOW.length - 1 && <span className={`h-px flex-1 ${i < idx ? 'bg-ink' : 'bg-ink/15'}`} />}
            </div>
            <span className={`text-[9px] uppercase tracking-[.14em] ${i <= idx ? 'text-ink' : 'text-ink/30'}`}>
              {s}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function OrderConfirmed() {
  const { no } = useParams()
  const { settings } = useSettingsStore()
  const order = useMemo(() => getOrder(no), [no])

  if (!order) {
    return (
      <div className="container-x flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <p className="eyebrow">Order lookup</p>
        <h1 className="section-title mt-3">Order not found</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          We couldn’t find order <b className="text-ink">{no}</b>. Orders are stored on this device — if you
          checked out elsewhere, message us on WhatsApp and we’ll find it.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${settings?.whatsapp || '918210293271'}?text=Hi, I need help with order ${no}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <FaWhatsapp size={13} /> Message us
          </a>
          <Link to="/shop" className="btn-outline">Continue shopping</Link>
        </div>
      </div>
    )
  }

  const waLink = `https://wa.me/${settings?.whatsapp || '918210293271'}?text=${encodeURIComponent(
    `Hi Aura Fashion, I just placed order ${order.no} (${inr(order.totals.total)}). Please confirm it.`,
  )}`

  return (
    <div className="container-x max-w-3xl py-10 lg:py-14">
      {/* Success banner */}
      <div className="bg-ink px-6 py-10 text-center text-white sm:px-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center border border-white/30">
          <FaCheck size={20} />
        </span>
        <p className="mt-5 text-[10px] uppercase tracking-[.3em] text-white/50">Order confirmed</p>
        <h1 className="mt-3 font-display text-3xl uppercase leading-none tracking-[.02em] sm:text-4xl">
          Thank you.
        </h1>
        <p className="mt-3 text-sm text-white/60">
          Order <b className="text-white">{order.no}</b> · {formatDate(order.placedAt, { withTime: true })}
        </p>
      </div>

      <div className="border-x border-b border-ink/10 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge status={order.status} />
          <p className="text-[10px] uppercase tracking-[.14em] text-muted">
            {order.paymentMethod === 'COD' ? 'Cash on delivery' : order.paymentMethod}
          </p>
        </div>

        <Progress status={order.status} />

        <div className="mt-7 flex items-start gap-3 border border-ink/15 bg-mist p-4">
          <FaTruck size={13} className="mt-0.5 shrink-0 text-ink" />
          <p className="text-sm leading-relaxed text-ink/70">
            Keep <b className="text-ink">{inr(order.totals.total)}</b> ready. We’ll call{' '}
            <b className="text-ink">{order.customer?.phone}</b> before delivery.
          </p>
        </div>

        {/* Items */}
        <h2 className="mt-8 font-display text-[11px] uppercase tracking-[.14em]">Items</h2>
        <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
          {order.items.map((it, i) => (
            <li key={`${it.cartKey || it.name}-${i}`} className="flex items-center gap-4 py-4">
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

        {/* Totals */}
        <dl className="mt-6 space-y-2.5 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Subtotal</dt>
            <dd>{inr(order.totals.subtotal)}</dd>
          </div>
          {order.totals.discount > 0 && (
            <div className="flex justify-between text-muted">
              <dt>Discount</dt>
              <dd>− {inr(order.totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-muted">
            <dt>Delivery</dt>
            <dd>{order.totals.shipping === 0 ? 'Free' : inr(order.totals.shipping)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
            <dt className="font-display text-[11px] uppercase tracking-[.14em]">Total</dt>
            <dd className="font-display text-xl">{inr(order.totals.total)}</dd>
          </div>
        </dl>

        {/* Address */}
        {order.address && (
          <div className="mt-7 border-t border-ink/10 pt-6">
            <h2 className="font-display text-[11px] uppercase tracking-[.14em]">Delivering to</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {order.address.name} · {order.address.phone}
              <br />
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ''}, {order.address.city},{' '}
              {order.address.state} — {order.address.pincode}
            </p>
          </div>
        )}

        {order.note && (
          <div className="mt-6 border-t border-ink/10 pt-6">
            <h2 className="font-display text-[11px] uppercase tracking-[.14em]">Note</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{order.note}</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <FaWhatsapp size={13} /> Confirm on WhatsApp
          </a>
          <button type="button" onClick={() => window.print()} className="btn-outline">
            <FaPrint size={11} /> Print
          </button>
          <Link to="/shop" className="btn-outline">
            Continue shopping <FaArrowRight size={9} />
          </Link>
        </div>
      </div>

      <div className="mt-6 border border-ink/10 p-6">
        <h2 className="font-display text-[11px] uppercase tracking-[.14em]">Ordered a custom design?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Our studio will confirm artwork on WhatsApp within 24 hours. Printing takes 5–7 working days after
          approval.
        </p>
        <Link to="/customize" className="btn-link mt-4">
          Design another <FaArrowRight size={9} />
        </Link>
      </div>
    </div>
  )
}

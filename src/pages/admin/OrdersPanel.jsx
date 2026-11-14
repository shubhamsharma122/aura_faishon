import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import { ThumbImage } from '../../components/ui/ProductImage'
import { StatusBadge } from '../../components/ui/misc'
import { ORDER_STATUSES, updateOrderStatus } from '../../data/orders'
import { formatDate, inr } from '../../utils/format'
import { EmptyPanel, PanelHeader, SearchBox, TableScroll, td, th } from './shared'

function StatusSelect({ order, className }) {
  return (
    <select
      value={order.status}
      onChange={(e) => {
        updateOrderStatus(order.no, e.target.value)
        toast.success(`${order.no} marked ${e.target.value.toLowerCase()}`)
      }}
      aria-label={`Update status for ${order.no}`}
      className={className}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}

function OrderDetail({ order }) {
  return (
    <div className="max-h-[74vh] overflow-y-auto p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[.14em] text-faint">{formatDate(order.placedAt, { withTime: true })}</p>
          <p className="mt-1 text-sm">{order.customer?.name || order.address?.name} · {order.paymentMethod}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <StatusSelect
            order={order}
            className="border border-ink/20 bg-white px-2 py-1.5 text-[10px] uppercase tracking-wide focus:outline-none"
          />
        </div>
      </div>

      <h3 className="mt-6 font-display text-[11px] uppercase tracking-[.14em]">Items</h3>
      <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
        {order.items?.map((it, i) => (
          <li key={`${it.cartKey || it.name}-${i}`} className="flex items-center gap-3 py-3">
            <div className="h-14 w-11 shrink-0 bg-mist">
              <ThumbImage src={it.image} gradient={it.gradient} name={it.name} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px]">{it.name}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[.14em] text-muted">
                {it.size ? `Size ${it.size} · ` : ''}Qty {it.qty}{it.type === 'custom' ? ' · Custom' : ''}
              </p>
            </div>
            <span className="font-display text-[12px]">{inr(it.price * it.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="border border-ink/10 bg-mist p-4">
          <p className="text-[10px] uppercase tracking-[.14em] text-faint">Deliver to</p>
          <p className="mt-2 text-[12px]">{order.address?.name}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            {[order.address?.line1, order.address?.line2, order.address?.city, order.address?.state, order.address?.pincode]
              .filter(Boolean)
              .join(', ')}
          </p>
          <p className="mt-1 text-[11px] text-muted">{order.address?.phone}</p>
        </div>

        <dl className="space-y-1.5 text-[12px]">
          <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{inr(order.totals?.subtotal || 0)}</dd></div>
          {order.totals?.discount > 0 && (
            <div className="flex justify-between text-muted"><dt>Discount</dt><dd>− {inr(order.totals.discount)}</dd></div>
          )}
          <div className="flex justify-between text-muted">
            <dt>Delivery</dt><dd>{order.totals?.shipping === 0 ? 'Free' : inr(order.totals?.shipping || 0)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 font-display"><dt>Total</dt><dd>{inr(order.totals?.total || 0)}</dd></div>
        </dl>
      </div>

      {order.note && (
        <div className="mt-4 border border-ink/10 p-4">
          <p className="text-[10px] uppercase tracking-[.14em] text-faint">Customer note</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/75">{order.note}</p>
        </div>
      )}

      <div className="mt-5">
        <Link to={`/order/${order.no}`} className="btn-outline">
          Open customer receipt
        </Link>
      </div>
    </div>
  )
}

export default function OrdersPanel({ orders }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [activeNo, setActiveNo] = useState(null)

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return [...orders]
      .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
      .filter((o) => {
        if (status !== 'All' && o.status !== status) return false
        if (!t) return true
        return [o.no, o.customer?.name, o.customer?.phone, o.address?.city]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(t)
      })
  }, [orders, q, status])

  const active = orders.find((o) => o.no === activeNo) || null

  return (
    <div>
      <PanelHeader
        eyebrow="Fulfilment"
        title="Orders"
        sub="Move orders through packing and delivery. Status changes appear on the customer receipt."
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <SearchBox value={q} onChange={setQ} placeholder="Search order, customer or city" className="sm:max-w-sm sm:flex-1" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter orders by status" className="field sm:max-w-[200px]">
          <option value="All">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-[.14em] text-muted">
        Showing {filtered.length} of {orders.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyPanel>No orders match this filter.</EmptyPanel>
        </div>
      ) : (
        <div className="mt-3">
          <TableScroll>
            <thead className="bg-mist text-[10px] uppercase tracking-[.14em] text-muted">
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Customer</th>
                <th className={th}>Items</th>
                <th className={th}>Total</th>
                <th className={th}>Payment</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {filtered.map((o) => (
                <tr key={o.no} className="hover:bg-mist/60">
                  <td className={td}>
                    <button
                      type="button"
                      onClick={() => setActiveNo(o.no)}
                      className="font-display text-[11px] uppercase tracking-wide hover:underline"
                    >
                      {o.no}
                    </button>
                    <p className="mt-1 text-[10px] text-muted">{formatDate(o.placedAt)}</p>
                  </td>
                  <td className={td}>
                    <p className="text-[12px]">{o.customer?.name || o.address?.name || '—'}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{o.customer?.phone}</p>
                  </td>
                  <td className={td}>
                    <p className="max-w-[220px] truncate text-[11px] text-ink/75">{o.items?.[0]?.name || '—'}</p>
                    {o.items?.length > 1 && <p className="mt-0.5 text-[10px] text-faint">+{o.items.length - 1} more</p>}
                  </td>
                  <td className={td}>
                    <p className="font-display text-[12px]">{inr(o.totals?.total || 0)}</p>
                  </td>
                  <td className={td}>
                    <p className="text-[10px] uppercase tracking-[.14em] text-muted">{o.paymentMethod}</p>
                  </td>
                  <td className={td}>
                    <StatusSelect
                      order={o}
                      className="border border-ink/20 bg-white px-2 py-1.5 text-[10px] uppercase tracking-wide focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        </div>
      )}

      <Modal open={Boolean(active)} onClose={() => setActiveNo(null)} title={active ? `Order ${active.no}` : ''} maxWidth="max-w-2xl">
        {active && <OrderDetail order={active} />}
      </Modal>
    </div>
  )
}

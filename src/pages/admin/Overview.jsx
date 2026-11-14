import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { formatDate, inr } from '../../utils/format'
import { StatusBadge } from '../../components/ui/misc'
import { EmptyPanel, PanelHeader, Stat, TableScroll, td, th } from './shared'

const OPEN_STATUSES = ['Pending', 'Confirmed', 'Packed']

export default function Overview({ orders, products, requests, messages, onNavigate }) {
  const recent = useMemo(
    () => [...orders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)).slice(0, 6),
    [orders],
  )
  const live = orders.filter((o) => o.status !== 'Cancelled')
  const revenue = live.reduce((sum, o) => sum + (o.totals?.total || 0), 0)
  const avg = live.length ? Math.round(revenue / live.length) : 0
  const openOrders = orders.filter((o) => OPEN_STATUSES.includes(o.status)).length
  const lowStock = [...products].filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 6)
  const unread = messages.filter((m) => !m.read).length
  const openRequests = requests.filter((r) => !['Delivered', 'Cancelled'].includes(r.status)).length

  const stats = [
    { label: 'Revenue', value: inr(revenue), hint: 'Excludes cancelled orders' },
    { label: 'Orders', value: orders.length, hint: `${live.length} live` },
    { label: 'Avg. order', value: inr(avg), hint: 'Across live orders' },
    { label: 'To fulfil', value: openOrders, hint: 'Pending, confirmed or packed' },
    { label: 'Low stock', value: lowStock.length, hint: '5 units or fewer' },
    { label: 'Unread messages', value: unread, hint: `${openRequests} open custom requests` },
  ]

  return (
    <div>
      <PanelHeader
        eyebrow="Today"
        title="Store overview"
        sub="A snapshot of what needs attention — orders, stock and customer messages."
      >
        <button type="button" onClick={() => onNavigate('products')} className="btn-primary">
          Add product <FaArrowRight size={9} />
        </button>
      </PanelHeader>

      <div className="mt-6 grid gap-px bg-ink/10 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ['orders', 'Manage orders'],
          ['products', 'Manage catalog'],
          ['messages', 'Read messages'],
          ['coupons', 'Edit coupons'],
          ['settings', 'Store settings'],
        ].map(([id, label]) => (
          <button key={id} type="button" onClick={() => onNavigate(id)} className="btn-outline">
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-display text-[11px] uppercase tracking-[.14em]">Recent orders</h3>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-[10px] uppercase tracking-[.14em] text-muted hover:text-ink"
            >
              View all
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="mt-3">
              <EmptyPanel>No orders yet.</EmptyPanel>
            </div>
          ) : (
            <div className="mt-3">
              <TableScroll>
                <thead className="bg-mist text-[10px] uppercase tracking-[.14em] text-muted">
                  <tr>
                    <th className={th}>Order</th>
                    <th className={th}>Date</th>
                    <th className={th}>Customer</th>
                    <th className={th}>Total</th>
                    <th className={th}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {recent.map((o) => (
                    <tr key={o.no} className="hover:bg-mist/60">
                      <td className={td}>
                        <Link to={`/order/${o.no}`} className="font-display text-[11px] uppercase tracking-wide hover:underline">
                          {o.no}
                        </Link>
                      </td>
                      <td className={td}>{formatDate(o.placedAt)}</td>
                      <td className={td}>
                        <p className="text-[12px]">{o.customer?.name || o.address?.name || '—'}</p>
                        <p className="mt-0.5 text-[11px] text-muted">{o.customer?.phone}</p>
                      </td>
                      <td className={td}>{inr(o.totals?.total || 0)}</td>
                      <td className={td}><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </TableScroll>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-display text-[11px] uppercase tracking-[.14em]">Low stock</h3>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="text-[10px] uppercase tracking-[.14em] text-muted hover:text-ink"
            >
              Restock
            </button>
          </div>
          {lowStock.length === 0 ? (
            <div className="mt-3">
              <EmptyPanel>Every product has healthy stock.</EmptyPanel>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-ink/10 border border-ink/10">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[12px]">{p.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[.14em] text-muted">{p.subcategory}</p>
                  </div>
                  <span className={p.stock === 0 ? 'text-[11px] uppercase tracking-[.14em] text-ink' : 'text-[11px] uppercase tracking-[.14em] text-muted'}>
                    {p.stock === 0 ? 'Out' : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

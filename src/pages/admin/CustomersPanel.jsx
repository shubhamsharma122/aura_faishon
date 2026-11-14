import React, { useMemo, useState } from 'react'
import { formatDate, inr } from '../../utils/format'
import { EmptyPanel, PanelHeader, SearchBox, Stat, TableScroll, td, th } from './shared'

export default function CustomersPanel({ orders }) {
  const [q, setQ] = useState('')

  const customers = useMemo(() => {
    const map = new Map()
    for (const o of orders) {
      const name = o.customer?.name || o.address?.name || 'Guest'
      const phone = o.customer?.phone || o.address?.phone || ''
      const key = (phone || name).toLowerCase()
      const current = map.get(key) || {
        key,
        name,
        phone,
        city: o.address?.city || '',
        orders: 0,
        spend: 0,
        last: null,
      }
      current.orders += 1
      if (o.status !== 'Cancelled') current.spend += o.totals?.total || 0
      if (!current.last || new Date(o.placedAt) > new Date(current.last)) current.last = o.placedAt
      map.set(key, current)
    }
    return [...map.values()].sort((a, b) => b.spend - a.spend)
  }, [orders])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return customers
    return customers.filter((c) => [c.name, c.phone, c.city].join(' ').toLowerCase().includes(t))
  }, [customers, q])

  const repeat = customers.filter((c) => c.orders > 1).length
  const lifetime = customers.reduce((sum, c) => sum + c.spend, 0)

  return (
    <div>
      <PanelHeader
        eyebrow="Relationship"
        title="Customers"
        sub="Built from orders placed on this device. Use it to spot repeat buyers and follow up on deliveries."
      />

      <div className="mt-5 grid gap-px bg-ink/10 sm:grid-cols-3">
        <Stat label="Customers" value={customers.length} hint="Unique phone numbers" />
        <Stat label="Repeat buyers" value={repeat} hint="More than one order" />
        <Stat label="Lifetime value" value={inr(lifetime)} hint="Excludes cancelled" />
      </div>

      <div className="mt-5">
        <SearchBox value={q} onChange={setQ} placeholder="Search customer, phone or city" className="sm:max-w-sm" />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyPanel>No customers match this search.</EmptyPanel>
        </div>
      ) : (
        <div className="mt-3">
          <TableScroll>
            <thead className="bg-mist text-[10px] uppercase tracking-[.14em] text-muted">
              <tr>
                <th className={th}>Customer</th>
                <th className={th}>City</th>
                <th className={th}>Orders</th>
                <th className={th}>Spend</th>
                <th className={th}>Last order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {filtered.map((c) => (
                <tr key={c.key} className="hover:bg-mist/60">
                  <td className={td}>
                    <p className="text-[12px]">{c.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{c.phone || '—'}</p>
                  </td>
                  <td className={td}><span className="text-[11px] text-muted">{c.city || '—'}</span></td>
                  <td className={td}><span className="font-display text-[12px]">{c.orders}</span></td>
                  <td className={td}><span className="font-display text-[12px]">{inr(c.spend)}</span></td>
                  <td className={td}><span className="text-[11px] text-muted">{formatDate(c.last)}</span></td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        </div>
      )}
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { StatusBadge } from '../../components/ui/misc'
import {
  REQUEST_STATUSES, deleteCustomRequest, updateRequestStatus,
} from '../../data/orders'
import { formatDate, inr } from '../../utils/format'
import { EmptyPanel, PanelHeader, SearchBox } from './shared'

export default function RequestsPanel({ requests }) {
  const confirm = useConfirm()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return [...requests]
      .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
      .filter((r) => {
        if (status !== 'All' && r.status !== status) return false
        if (!t) return true
        return [r.no, r.name, r.teamName, r.playerName].filter(Boolean).join(' ').toLowerCase().includes(t)
      })
  }, [requests, q, status])

  const remove = async (request) => {
    const ok = await confirm({
      title: 'Delete request?',
      message: `Custom request ${request.no} will be removed from this device.`,
      confirmLabel: 'Delete',
    })
    if (!ok) return
    deleteCustomRequest(request.no)
    toast.success('Request deleted')
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Studio"
        title="Custom requests"
        sub="Team jerseys and kit briefs submitted through the order form. Move each brief through artwork and printing."
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <SearchBox value={q} onChange={setQ} placeholder="Search request, team or player" className="sm:max-w-sm sm:flex-1" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter requests by status" className="field sm:max-w-[200px]">
          <option value="All">All statuses</option>
          {REQUEST_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-[.14em] text-muted">
        Showing {filtered.length} of {requests.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyPanel>No custom requests yet. Submissions from the Simple order form appear here.</EmptyPanel>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => (
            <article key={r.no} className="border border-ink/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[11px] uppercase tracking-wide">{r.no}</p>
                  <p className="mt-1 text-[10px] text-muted">{formatDate(r.placedAt, { withTime: true })}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <p className="mt-4 text-sm">{r.name}</p>
              <p className="mt-1 text-[11px] text-muted">
                {[r.garment?.type, r.garment?.fabric, `${r.qty} pcs`, r.garment?.collar].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-1 text-[11px] text-muted">Estimate {inr(r.estimate || 0)}</p>
              {(r.playerName || r.number) && (
                <p className="mt-2 text-[11px] text-muted">
                  Player: {r.playerName || '—'}{r.number ? ` · #${r.number}` : ''}
                </p>
              )}
              {r.teamName && <p className="mt-1 text-[11px] text-muted">Team: {r.teamName}</p>}
              {r.logo?.name && <p className="mt-1 text-[11px] text-muted">Logo: {r.logo.name}</p>}
              {r.notes && <p className="mt-2 text-[11px] leading-relaxed text-ink/70">{r.notes}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
                <label htmlFor={`status-${r.no}`} className="sr-only">Request status</label>
                <select
                  id={`status-${r.no}`}
                  value={r.status}
                  onChange={(e) => {
                    updateRequestStatus(r.no, e.target.value)
                    toast.success(`${r.no} marked ${e.target.value.toLowerCase()}`)
                  }}
                  className="border border-ink/20 bg-white px-2 py-1.5 text-[10px] uppercase tracking-wide focus:outline-none"
                >
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="button" onClick={() => remove(r)} className="ml-auto text-[10px] uppercase tracking-[.14em] text-muted underline hover:text-ink">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

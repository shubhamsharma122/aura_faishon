import React, { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { deleteMessage, markMessage } from '../../data/messages'
import { formatDate } from '../../utils/format'
import { EmptyPanel, PanelHeader } from './shared'

export default function MessagesPanel({ messages }) {
  const confirm = useConfirm()
  const [filter, setFilter] = useState('all')

  const unread = messages.filter((m) => !m.read).length
  const filtered = useMemo(
    () => (filter === 'unread' ? messages.filter((m) => !m.read) : messages),
    [messages, filter],
  )

  const remove = async (message) => {
    const ok = await confirm({
      title: 'Delete message?',
      message: `The message from ${message.name || 'this customer'} will be removed from this device.`,
      confirmLabel: 'Delete',
    })
    if (!ok) return
    deleteMessage(message.id)
    toast.success('Message deleted')
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Inbox"
        title="Messages"
        sub="Enquiries from the contact form and store page. Mark each one read once you have replied."
      >
        <div className="flex gap-1 border border-ink/15">
          {[
            ['all', `All (${messages.length})`],
            ['unread', `Unread (${unread})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`px-3 py-2 font-display text-[10px] uppercase tracking-[.14em] transition-colors ${
                filter === id ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </PanelHeader>

      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyPanel>
            {filter === 'unread' ? 'Nothing unread — the inbox is clear.' : 'No messages yet. Contact form submissions appear here.'}
          </EmptyPanel>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {filtered.map((m) => (
            <article
              key={m.id}
              className={`border p-5 ${m.read ? 'border-ink/10' : 'border-ink bg-mist/60'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[11px] uppercase tracking-wide">
                    {m.name || 'Guest'}
                    {!m.read && <span className="ml-2 align-middle text-[8px] uppercase tracking-[.14em] text-ink">New</span>}
                  </p>
                  <p className="mt-1 text-[10px] text-muted">{formatDate(m.sentAt, { withTime: true })}</p>
                </div>
                {m.subject && (
                  <span className="border border-ink/20 px-2 py-0.5 text-[9px] uppercase tracking-wide text-ink/70">
                    {m.subject}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink/75">{m.message}</p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
                {m.email && <a href={`mailto:${m.email}`} className="hover:text-ink">{m.email}</a>}
                {m.phone && <a href={`tel:${m.phone}`} className="hover:text-ink">{m.phone}</a>}
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-ink/10 pt-3 text-[10px] uppercase tracking-[.14em]">
                <button
                  type="button"
                  onClick={() => {
                    markMessage(m.id, !m.read)
                    toast.success(m.read ? 'Marked unread' : 'Marked read')
                  }}
                  className="underline hover:text-ink"
                >
                  {m.read ? 'Mark unread' : 'Mark read'}
                </button>
                <button type="button" onClick={() => remove(m)} className="ml-auto text-muted underline hover:text-ink">
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

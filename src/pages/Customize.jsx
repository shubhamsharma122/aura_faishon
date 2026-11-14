import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FaPalette, FaClipboardList, FaArrowRight } from 'react-icons/fa'
import Designer from './Designer'
import SimpleForm from './SimpleForm'
import { cn } from '../utils/format'

const TRUST = [
  { t: 'Artwork approved in 24 hrs', d: 'We confirm the design on WhatsApp' },
  { t: '5–7 day turnaround', d: 'Rush delivery available on request' },
  { t: 'COD & bulk pricing', d: 'Teams of 10+ save extra' },
]

export default function Customize() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'form' ? 'form' : 'designer'

  const setTab = (next) => {
    const p = new URLSearchParams(params)
    if (next === 'form') p.set('tab', 'form')
    else p.delete('tab')
    setParams(p)
  }

  return (
    <div className="container-x py-10 lg:py-14">
      {/* Header */}
      <div className="grid gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
        <div>
          <p className="eyebrow">Jersey studio</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl uppercase leading-[1.02] tracking-[.01em] sm:text-5xl">
            Your team.
            <br />
            Your colours.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
            Names, numbers, crests and sponsor marks — printed on match-grade fabric. Design it live on the
            canvas, or send a simple brief and let the studio do the rest.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-px bg-ink/10">
            <button
              type="button"
              onClick={() => setTab('designer')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-4 font-display text-[10px] uppercase tracking-[.14em] transition',
                tab === 'designer' ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-mist',
              )}
            >
              <FaPalette size={11} /> Design online
            </button>
            <button
              type="button"
              onClick={() => setTab('form')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-4 font-display text-[10px] uppercase tracking-[.14em] transition',
                tab === 'form' ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-mist',
              )}
            >
              <FaClipboardList size={11} /> Simple form
            </button>
          </div>
          <p className="text-[10px] uppercase tracking-[.14em] text-faint">
            From ₹449 · Free artwork mock-up · No advance for COD
          </p>
        </div>
      </div>

      {/* Trust strip */}
      <div className="mt-6 grid gap-px bg-ink/10 sm:grid-cols-3">
        {TRUST.map((x) => (
          <div key={x.t} className="bg-white px-5 py-4">
            <p className="font-display text-[10px] uppercase tracking-[.14em]">{x.t}</p>
            <p className="mt-1 text-[11px] text-muted">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'designer' ? (
          <Designer />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-ink/10 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[.14em] text-muted">
                No design skills needed — tell us what you want.
              </p>
              <button type="button" onClick={() => setTab('designer')} className="btn-link">
                Try the designer instead <FaArrowRight size={9} />
              </button>
            </div>
            <SimpleForm />
          </>
        )}
      </div>

      <div className="mt-10 border-t border-ink/10 pt-6">
        <p className="text-[11px] leading-relaxed text-muted">
          Need help with sizing or artwork?{' '}
          <Link to="/contact" className="underline hover:text-ink">
            Talk to the studio
          </Link>
          . Bulk orders of 10+ are quoted individually.
        </p>
      </div>
    </div>
  )
}

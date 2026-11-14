import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaPaperPlane, FaCheck, FaUpload, FaArrowRight } from 'react-icons/fa'
import { createCustomRequest } from '../data/orders'
import { garmentTypes, shirtColors } from './Designer'
import { inr } from '../utils/format'

const tshirtTypes = garmentTypes.map((g) => g.label)
const fabrics = [...new Set(garmentTypes.map((g) => g.fabric))]
const collars = ['Round Neck', 'Polo', 'V Neck', 'Sublimated Jersey']
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

export default function SimpleForm({ initialDesign = null }) {
  const [form, setForm] = useState({
    tshirtType: initialDesign?.tshirtType || 'Round-Neck T-Shirt',
    fabric: initialDesign?.fabric || 'Combed Cotton 180 GSM',
    color: initialDesign?.color || '#0E4637',
    neckType: initialDesign?.neckType || '',
    sizes: initialDesign?.sizes || ['M'],
    qty: initialDesign?.qty || 1,
    playerName: initialDesign?.playerName || '',
    number: initialDesign?.number || '',
    teamName: initialDesign?.teamName || '',
    logo: initialDesign?.logo || null,
    notes: initialDesign?.notes || '',
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const fileRef = useRef(null)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const onLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please upload an image file.')
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, logo: { name: file.name, src: reader.result } }))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const toggleSize = (s) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }))

  const validate = () => {
    const errs = {}
    if (!form.tshirtType) errs.tshirtType = 'Select a garment.'
    if (!form.fabric) errs.fabric = 'Select a fabric.'
    if (!form.sizes.length) errs.sizes = 'Choose at least one size.'
    if (Number(form.qty) < 1) errs.qty = 'Enter a valid quantity.'
    if (!form.teamName.trim() && !form.playerName.trim()) errs.playerName = 'Add a player or team name.'
    if (/[<>]/.test(form.playerName + form.teamName + form.notes)) errs.playerName = 'Remove special characters like < >.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return toast.error('Please fix the highlighted fields.')
    setBusy(true)
    const price = garmentTypes.find((g) => g.label === form.tshirtType)?.price || 449
    const record = createCustomRequest({
      name: `${form.teamName || form.playerName} — ${form.tshirtType}`,
      garment: { type: form.tshirtType, fabric: form.fabric, sizes: form.sizes, collar: form.neckType || 'Standard', color: form.color },
      qty: Number(form.qty),
      unitPrice: price,
      estimate: price * Number(form.qty),
      playerName: form.playerName,
      number: form.number,
      teamName: form.teamName,
      logo: form.logo ? { name: form.logo.name } : null,
      notes: form.notes,
    })
    setTimeout(() => {
      setBusy(false)
      setSubmitted(record)
      toast.success('Request received')
    }, 350)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg border border-ink/10 p-8 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center border border-ink">
          <FaCheck size={18} />
        </span>
        <h2 className="mt-6 font-display text-2xl uppercase leading-none tracking-[.02em]">Request received</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Reference <b className="text-ink">{submitted.no}</b>. The studio will review your brief and confirm
          artwork and the final quote on WhatsApp within 24 hours.
        </p>
        <div className="mt-6 border border-ink/10 bg-mist p-4 text-left">
          <p className="text-[10px] uppercase tracking-[.14em] text-muted">What happens next</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Pending → In review → Artwork approved → Printing → Shipped
          </p>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => setSubmitted(null)} className="btn-outline">
            New request
          </button>
          <Link to="/shop" className="btn-primary">
            Continue shopping <FaArrowRight size={9} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:gap-10">
      <form onSubmit={submit} className="space-y-4">
        {/* 1 */}
        <section className="border border-ink/10 p-6">
          <h3 className="font-display text-[11px] uppercase tracking-[.14em]">01 · Pick your garment</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sf-type" className="field-label">Garment *</label>
              <select id="sf-type" value={form.tshirtType} onChange={set('tshirtType')} className="field">
                {tshirtTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sf-fabric" className="field-label">Fabric *</label>
              <select id="sf-fabric" value={form.fabric} onChange={set('fabric')} className="field">
                {fabrics.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sf-neck" className="field-label">Collar / neck style</label>
              <select id="sf-neck" value={form.neckType} onChange={set('neckType')} className="field">
                <option value="">Standard</option>
                {collars.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="field-label">Base colour</p>
              <div className="flex flex-wrap gap-2">
                {shirtColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    style={{ background: c }}
                    className={`h-8 w-8 border ${
                      form.color === c ? 'border-ink ring-1 ring-ink' : 'border-transparent hover:border-ink/30'
                    } ${c === '#FFFFFF' || c === '#F1F5F9' ? 'border-ink/15' : ''}`}
                    aria-label={`Colour ${c}`}
                  />
                ))}
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  aria-label="Custom base colour"
                  className="h-8 w-9 cursor-pointer border border-ink/15"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2 */}
        <section className="border border-ink/10 p-6">
          <h3 className="font-display text-[11px] uppercase tracking-[.14em]">02 · Sizes & quantity</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="field-label">Sizes required *</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`min-w-[2.5rem] border px-2.5 py-2 font-display text-[10px] uppercase tracking-wide transition ${
                      form.sizes.includes(s) ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink/70 hover:border-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {errors.sizes && <p className="mt-1.5 text-[11px] text-ink">{errors.sizes}</p>}
            </div>
            <div>
              <label htmlFor="sf-qty" className="field-label">Quantity (approx. per size) *</label>
              <input
                id="sf-qty"
                type="number"
                min="1"
                max="500"
                value={form.qty}
                onChange={set('qty')}
                className="field"
              />
              {errors.qty && <p className="mt-1.5 text-[11px] text-ink">{errors.qty}</p>}
              <p className="mt-1.5 text-[11px] text-muted">Bulk orders of 10+ get a discount — we’ll confirm the quote.</p>
            </div>
          </div>
        </section>

        {/* 3 */}
        <section className="border border-ink/10 p-6">
          <h3 className="font-display text-[11px] uppercase tracking-[.14em]">03 · Text on the shirt</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="sf-player" className="field-label">Player name</label>
              <input id="sf-player" value={form.playerName} onChange={set('playerName')} placeholder="e.g. RAMESH" className="field" />
              {errors.playerName && <p className="mt-1.5 text-[11px] text-ink">{errors.playerName}</p>}
            </div>
            <div>
              <label htmlFor="sf-number" className="field-label">Number</label>
              <input id="sf-number" value={form.number} onChange={set('number')} placeholder="07" maxLength="2" className="field" />
            </div>
            <div>
              <label htmlFor="sf-team" className="field-label">Team name</label>
              <input id="sf-team" value={form.teamName} onChange={set('teamName')} placeholder="e.g. PANTHERS" className="field" />
            </div>
          </div>
        </section>

        {/* 4 */}
        <section className="border border-ink/10 p-6">
          <h3 className="font-display text-[11px] uppercase tracking-[.14em]">04 · Logo & notes</h3>
          <div className="mt-5 space-y-5">
            <div>
              <p className="field-label">Logo / artwork (optional)</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline w-full">
                <FaUpload size={10} /> {form.logo ? `Replace logo — ${form.logo.name}` : 'Upload logo or team crest'}
              </button>
              {form.logo && (
                <img src={form.logo.src} alt="Logo preview" className="mt-3 h-16 border border-ink/10 bg-mist object-contain p-1" />
              )}
            </div>
            <div>
              <label htmlFor="sf-notes" className="field-label">Special instructions</label>
              <textarea
                id="sf-notes"
                value={form.notes}
                onChange={set('notes')}
                rows={3}
                placeholder="Font style, sponsor name, date needed by, stitching preferences…"
                className="field resize-none"
              />
            </div>
          </div>
        </section>

        <button type="submit" disabled={busy} className="btn-primary w-full py-4">
          <FaPaperPlane size={11} /> {busy ? 'Submitting…' : 'Submit request'}
        </button>
      </form>

      {/* Preview */}
      <aside>
        <div className="border border-ink/10 lg:sticky lg:top-8">
          <div className="flex aspect-square items-center justify-center bg-mist p-8">
            <svg viewBox="0 0 320 320" className="w-full max-w-[260px]" role="img" aria-label="Jersey preview">
              <path
                d="M160 36 L108 28 L72 52 L77 96 L108 90 L108 283 L212 283 L212 90 L243 96 L248 52 L212 28 Z"
                fill={form.color}
                stroke="rgba(0,0,0,.22)"
                strokeWidth="2"
              />
              <text x="160" y="132" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" textAnchor="middle" fill="#fff">
                {(form.teamName || form.playerName || 'YOUR NAME').toUpperCase().slice(0, 12)}
              </text>
              {form.number && (
                <text x="160" y="210" fontFamily="Helvetica, Arial, sans-serif" fontSize="54" fontWeight="800" textAnchor="middle" fill="#fff">
                  {form.number}
                </text>
              )}
            </svg>
          </div>

          <dl className="divide-y divide-ink/10 border-t border-ink/10">
            {[
              ['Garment', form.tshirtType],
              ['Fabric', form.fabric],
              ['Sizes', form.sizes.join(', ') || '—'],
              ['Quantity', `${form.qty} approx.`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                <dt className="text-[10px] uppercase tracking-[.14em] text-muted">{k}</dt>
                <dd className="max-w-[60%] truncate text-right text-ink">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4">
              <dt className="text-[10px] uppercase tracking-[.14em] text-muted">Estimate</dt>
              <dd className="font-display text-lg">
                {inr((garmentTypes.find((g) => g.label === form.tshirtType)?.price || 449) * Number(form.qty || 0))}
              </dd>
            </div>
          </dl>

          <p className="border-t border-ink/10 px-5 py-4 text-[11px] leading-relaxed text-muted">
            We confirm the design and final quote on WhatsApp within 24 hours. No advance needed for cash on
            delivery.
          </p>
        </div>
      </aside>
    </div>
  )
}

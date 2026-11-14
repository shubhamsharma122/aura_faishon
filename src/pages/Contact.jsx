import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaPhoneAlt, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheck, FaArrowRight,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useSettingsStore } from '../context/AppContext'
import { addMessage } from '../data/messages'
import { cn } from '../utils/format'

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const { settings } = useSettingsStore()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Your name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (form.phone && !/^[+\d][\d\s-]{9,14}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.'
    if (form.message.trim().length < 10) errs.message = 'Please write at least 10 characters.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return toast.error('Please fix the highlighted fields.')
    setBusy(true)
    addMessage(form)
    setTimeout(() => {
      setBusy(false)
      setSent(true)
      toast.success('Message sent — we’ll reply within store hours.')
    }, 350)
  }

  const cards = [
    {
      icon: <FaPhoneAlt size={13} />,
      label: 'Call / SMS',
      value: settings?.phone,
      hint: 'Mon – Sat, 10am – 9pm',
      href: `tel:${settings?.phone?.replace(/\s/g, '')}`,
    },
    {
      icon: <FaWhatsapp size={15} />,
      label: 'WhatsApp',
      value: 'Chat with us',
      hint: 'Fastest replies, 9am – 10pm',
      href: `https://wa.me/${settings?.whatsapp}?text=${encodeURIComponent('Hi Aura Fashion!')}`, 
    },
    {
      icon: <FaEnvelope size={13} />,
      label: 'Email',
      value: settings?.email,
      hint: 'Orders, bulk quotes & feedback',
      href: `mailto:${settings?.email}`,
    },
  ]

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="max-w-2xl border-b border-ink/10 pb-8">
        <p className="eyebrow">Contact</p>
        <h1 className="section-title mt-3">Talk to the team</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Questions about a bat, a full cricket kit, a custom team jersey, or anything at all — we answer fast,
          usually within the hour during store hours.
        </p>
      </div>

      <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-3">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-white p-6 transition-colors hover:bg-mist"
          >
            <span className="flex h-10 w-10 items-center justify-center border border-ink/20 text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
              {c.icon}
            </span>
            <p className="mt-5 text-[10px] uppercase tracking-[.14em] text-faint">{c.label}</p>
            <p className="mt-1.5 font-display text-sm uppercase tracking-wide">{c.value}</p>
            <p className="mt-1 text-[11px] text-muted">{c.hint}</p>
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2">
        <Link
          to="/shop?category=clothing"
          className="group flex flex-col bg-white p-6 transition-colors hover:bg-mist sm:p-8"
        >
          <p className="eyebrow">Clothing</p>
          <h2 className="mt-3 font-display text-xl uppercase leading-none tracking-[.02em]">
            Curated collections
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Polo shirts, trousers, tees and more — walk in for a fitting or browse our full collection online.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[.14em] text-ink transition-colors group-hover:text-muted">
            Shop clothing <FaArrowRight size={9} />
          </span>
        </Link>

        <Link
          to="/customize"
          className="group flex flex-col bg-white p-6 transition-colors hover:bg-mist sm:p-8"
        >
          <p className="eyebrow">Custom order</p>
          <h2 className="mt-3 font-display text-xl uppercase leading-none tracking-[.02em]">
            Made to your specifications
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Custom sizes, colours, and materials. Bring a reference or start from scratch — we craft your
            order, share a proof, then deliver.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[.14em] text-ink transition-colors group-hover:text-muted">
            Start a custom order <FaArrowRight size={9} />
          </span>
        </Link>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Form */}
        <div>
          {sent ? (
            <div className="flex h-full flex-col items-start justify-center border border-ink/10 p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center border border-ink">
                <FaCheck size={18} />
              </span>
              <h2 className="mt-6 font-display text-2xl uppercase leading-none tracking-[.02em]">
                Message received
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                Thanks {form.name.split(' ')[0]} — we’ll reply on WhatsApp or email within store hours. For
                anything urgent, call us directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setForm(EMPTY)
                }}
                className="btn-outline mt-7"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-ink/10 p-6 sm:p-8">
              <h2 className="font-display text-sm uppercase tracking-[.14em]">Send a message</h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="field-label">Your name *</label>
                  <input id="ct-name" value={form.name} onChange={set('name')} placeholder="Your name" className={cn('field', errors.name && 'border-ink')} />
                  {errors.name && <p className="mt-1.5 text-[11px] text-ink">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="ct-phone" className="field-label">Phone</label>
                  <input id="ct-phone" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className={cn('field', errors.phone && 'border-ink')} />
                  {errors.phone && <p className="mt-1.5 text-[11px] text-ink">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-email" className="field-label">Email *</label>
                  <input id="ct-email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={cn('field', errors.email && 'border-ink')} />
                  {errors.email && <p className="mt-1.5 text-[11px] text-ink">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-subject" className="field-label">Subject</label>
                  <input id="ct-subject" value={form.subject} onChange={set('subject')} placeholder="e.g. Bulk order for school team" className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-message" className="field-label">Message *</label>
                  <textarea id="ct-message" value={form.message} onChange={set('message')} rows={5} placeholder="Tell us what you need…" className={cn('field resize-none', errors.message && 'border-ink')} />
                  {errors.message && <p className="mt-1.5 text-[11px] text-ink">{errors.message}</p>}
                </div>
              </div>

              <button type="submit" disabled={busy} className="btn-primary mt-7 w-full">
                <FaPaperPlane size={11} /> {busy ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>

        {/* Store info */}
        <div>
          <div className="border border-ink/10 p-6 sm:p-8">
            <h2 className="font-display text-sm uppercase tracking-[.14em]">Visit the store</h2>
            <p className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-muted">
              <FaMapMarkerAlt size={12} className="mt-1 shrink-0 text-ink" />
              {settings?.address}
            </p>
            <p className="mt-3 flex items-start gap-3 text-sm text-muted">
              <FaClock size={12} className="mt-1 shrink-0 text-ink" />
              {settings?.timings}
            </p>
            <p className="mt-3 flex items-start gap-3 text-sm text-muted">
              <FaPhoneAlt size={11} className="mt-1 shrink-0 text-ink" />
              {settings?.phone}
            </p>

            <div className="mt-6 aspect-[4/3] w-full overflow-hidden border border-ink/10 bg-mist">
              <iframe
                src={settings?.mapEmbed}
                title="Aura Fashion location"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={`https://wa.me/${settings?.whatsapp}?text=${encodeURIComponent('Hi Aura Fashion, is this product in stock?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 w-full"
            >
              <FaWhatsapp size={13} /> Check stock on WhatsApp
            </a>
          </div>

          <div className="mt-4 border border-ink/10 p-6">
            <p className="eyebrow">Bulk & team orders</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Ordering 10+ jerseys or a full team kit? Send your sizes and deadline and we’ll quote on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${settings?.whatsapp}?text=${encodeURIComponent('Hi, I have a bulk/team order enquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link mt-4"
            >
              Start a bulk enquiry <FaArrowRight size={9} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

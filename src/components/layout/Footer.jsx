import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useSettingsStore } from '../../context/AppContext'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'Clothing', to: '/shop?category=clothing' },
      { label: 'Accessories', to: '/shop?category=accessories' },
      { label: 'Footwear', to: '/shop?category=footwear' },
      { label: 'New in', to: '/shop?sort=newest' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'Custom jerseys', to: '/customize' },
      { label: 'Design online', to: '/customize' },
      { label: 'Simple order form', to: '/customize?tab=form' },
      { label: 'About us', to: '/about' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'Delivery & COD', to: '/contact' },
      { label: 'Returns', to: '/contact' },
      { label: 'Size guide', to: '/contact' },
    ],
  },
]

export default function Footer() {
  const { settings } = useSettingsStore()
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Please enter a valid email.')
    setEmail('')
    toast.success('You’re on the list.')
  }

  return (
    <footer className="mt-20 border-t border-ink/10 bg-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-block">
            <span className="block font-display text-xl uppercase leading-none tracking-[.22em]">Aura Fashion</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Contemporary fashion for the modern individual — curated clothing, accessories, and lifestyle essentials.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <a
              href={`https://wa.me/${settings?.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
            >
              <FaWhatsapp size={13} />
            </a>
            <a
              href={settings?.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
            >
              <FaInstagram size={13} />
            </a>
            <a
              href={settings?.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
            >
              <FaFacebookF size={12} />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="eyebrow">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-x border-t border-ink/10 py-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="font-display text-sm uppercase tracking-[.14em]">The match-day list</h3>
            <p className="mt-1 text-sm text-muted">New drops, restocks and team offers. No noise.</p>
          </div>
          <form onSubmit={subscribe} className="flex items-center gap-0 border-b border-ink pb-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className="w-full bg-transparent text-sm placeholder:text-ink/30 focus:outline-none"
            />
            <button type="submit" aria-label="Subscribe" className="flex h-8 w-8 items-center justify-center text-ink hover:text-muted">
              <FaArrowRight size={12} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-x flex flex-col gap-3 py-5 text-[10px] uppercase tracking-[.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Aura Fashion. All rights reserved.</p>
          <p>{settings?.address}</p>
        </div>
      </div>
    </footer>
  )
}

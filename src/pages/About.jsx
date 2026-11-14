import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa'
import { useSettingsStore } from '../context/AppContext'
import ProductCutout from '../components/ui/ProductCutout'
import { useCatalog } from '../data/catalog'

const MILESTONES = [
  ['2018', 'Aura Fashion opens with a curated collection of contemporary clothing.'],
  ['2020', 'The accessories line launches — today our most requested category.'],
  ['2023', '1,000th order delivered across the region.'],
  ['2025', '500+ products online with cash on delivery across Bihar and India.'],
]

const VALUES = [
  { n: '01', title: 'Real store, real stock', copy: 'Touch, feel and try before you buy. The MG Road shop always carries the range we list online.' },
  { n: '02', title: 'Straightforward prices', copy: 'No inflated MRPs and fake discounts. Fair, clear pricing — with room to talk on bulk.' },
  { n: '03', title: 'Custom jersey experts', copy: 'From village tournaments to district leagues, we’ve printed for 200+ teams across Purnea.' },
  { n: '04', title: 'For every player', copy: 'First-time gully cricketers and academy professionals get the same attention and advice.' },
]

export default function About() {
  const { settings } = useSettingsStore()
  const products = useCatalog()
  const bat = products.find((p) => p.subcategory === 'Bats') || products[0]
  const helmet = products.find((p) => p.subcategory === 'Helmets') || products[1]

  return (
    <div className="container-x py-10 lg:py-14">
      {/* Intro */}
      <div className="grid gap-10 border-b border-ink/10 pb-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
        <div>
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl uppercase leading-[1.02] tracking-[.01em] sm:text-5xl">
            The store behind Purnea’s match days.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">
            {settings?.name} started with a simple idea: the district deserved proper sports equipment and
            honest advice — without travelling to Patna or ordering blind from another city.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            Eight years on, we still do the same thing. We stock what we’d play with, price it fairly, and help
            you choose the right gear for the level you’re actually at.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Shop the store <FaArrowRight size={9} />
            </Link>
            <Link to="/contact" className="btn-outline">Visit us</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-ink/10">
          <div className="flex flex-col justify-between bg-mist p-5">
            <p className="eyebrow">Since</p>
            <p className="mt-8 font-display text-4xl leading-none">2018</p>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">MG Road, near Clock Tower</p>
          </div>
          <div className="flex items-center justify-center bg-cardgrey p-4">
            <ProductCutout product={bat} className="h-32 w-full" />
          </div>
          <div className="flex flex-col justify-between bg-cardgrey p-5">
            <p className="eyebrow">Printed for</p>
            <p className="mt-8 font-display text-4xl leading-none">200+</p>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">Teams across North Bihar</p>
          </div>
          <div className="flex items-center justify-center bg-mist p-4">
            <ProductCutout product={helmet} className="h-32 w-full" />
          </div>
        </div>
      </div>

      {/* Story + timeline */}
      <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="bg-ink p-8 text-white sm:p-10">
          <p className="text-[10px] uppercase tracking-[.3em] text-white/40">Our promise</p>
          <blockquote className="mt-6 font-display text-2xl uppercase leading-[1.15] tracking-[.01em] sm:text-3xl">
            “If it helps someone play better, we stock it. If they’re just starting, we guide them.”
          </blockquote>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            Whether it’s a ₹250 tennis ball or a ₹5,000 English willow bat, every customer gets the same
            attention — because we know who that gear is going to be used against.
          </p>
          <Link to="/shop" className="btn-light mt-8">
            Browse the collection <FaArrowRight size={9} />
          </Link>
        </div>

        <div>
          <p className="eyebrow">The timeline</p>
          <ol className="mt-5 border-t border-ink/10">
            {MILESTONES.map(([year, text]) => (
              <li key={year} className="grid grid-cols-[64px_1fr] gap-4 border-b border-ink/10 py-5">
                <span className="font-display text-lg leading-none">{year}</span>
                <span className="text-sm leading-relaxed text-muted">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Values */}
      <section className="mt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">What we stand for</p>
            <h2 className="section-title mt-3">More than a shop</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.n} className="flex flex-col bg-white p-6">
              <p className="eyebrow text-faint">{v.n}</p>
              <h3 className="mt-6 font-display text-sm uppercase tracking-wide">{v.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 flex flex-col items-start justify-between gap-6 bg-mist p-8 sm:flex-row sm:items-center sm:p-12">
        <div>
          <p className="eyebrow">Come say hello</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-none tracking-[.01em]">Drop in, say hi</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{settings?.address}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="btn-primary">
            Contact us <FaArrowRight size={9} />
          </Link>
          <a
            href={`https://wa.me/${settings?.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <FaWhatsapp size={13} /> WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}

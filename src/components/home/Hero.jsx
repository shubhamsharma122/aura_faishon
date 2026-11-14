import React, { useEffect, useState } from 'react'
import ProductRail from './ProductRail'
import { homeLooks, homeProducts } from '../../data/homepage'

/* Four visible positions + one entering and one leaving slot.
   Positions are % of the hero stage, so the composition scales with it. */
const SLOTS = [
  { x: 74, h: 82, b: 7, blur: 0, opacity: 1, z: 10 },
  { x: 48, h: 52, b: 24, blur: 3.5, opacity: 0.85, z: 3 },
  { x: 30, h: 42, b: 34, blur: 4.5, opacity: 0.7, z: 2 },
  { x: 14, h: 34, b: 40, blur: 5.5, opacity: 0.55, z: 1 },
  { x: 3, h: 27, b: 44, blur: 6, opacity: 0, z: 1 },
  { x: 96, h: 78, b: 9, blur: 1, opacity: 0, z: 9 },
]

export default function Hero() {
  const [active, setActive] = useState(1)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    if (paused || reduceMotion) return undefined
    const id = setInterval(() => setActive((a) => (a + 1) % homeLooks.length), 2000)
    return () => clearInterval(id)
  }, [paused, reduceMotion])

  const current = homeLooks[active]

  return (
    <section className="bg-mist lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <div className="grid lg:min-h-0 lg:flex-1 lg:grid-cols-[76%_24%] lg:overflow-hidden">
        {/* Hero stage */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          className="relative min-h-[70vh] overflow-hidden bg-mist sm:min-h-[600px] lg:min-h-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
          }}
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured looks"
        >
          {/* Static editorial copy */}
          <div className="absolute left-[5%] top-[9.5%] z-20 max-w-[330px]">
            <h1 className="font-display text-[26px] font-medium uppercase leading-[1.08] tracking-[.01em] text-ink sm:text-[30px]">
              Dressed for the moment.
            </h1>
            <p className="mt-2.5 max-w-[340px] text-[13px] font-light leading-[1.5] text-muted sm:text-[14px]">
              Refined essentials made for warm days, late evenings, and everywhere in between.
            </p>
          </div>

          {/* Model staircase */}
          <div className="absolute inset-0">
            {homeLooks.map((look, i) => {
              const offset = (i - active + homeLooks.length) % homeLooks.length
              const slot = SLOTS[offset]
              const visible = slot.opacity > 0.4
              return (
                <button
                  key={look.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show look ${i + 1}: ${look.name}`}
                  className="absolute -translate-x-1/2 border-0 bg-transparent p-0 transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
                  style={{
                    left: `${slot.x}%`,
                    bottom: `${slot.b}%`,
                    height: `${slot.h}%`,
                    zIndex: slot.z,
                    opacity: slot.opacity,
                    filter: slot.blur ? `blur(${slot.blur}px)` : 'none',
                    pointerEvents: visible ? 'auto' : 'none',
                  }}
                  tabIndex={visible ? 0 : -1}
                >
                  <img
                    src={look.image}
                    alt={look.alt}
                    draggable={false}
                    decoding="async"
                    className="block h-full w-auto max-w-none object-contain object-bottom"
                  />
                </button>
              )
            })}
          </div>

          {/* Look label */}
          <div className="absolute bottom-[8%] left-[5%] z-20">
            <p
              className="font-display text-[22px] uppercase leading-none tracking-[.01em] sm:text-[26px]"
              aria-live="polite"
            >
              Look <span className="mx-2 font-light text-ink/25">|</span> {active + 1}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[.3px] text-faint sm:text-[12px]">
              Effortlessly refined
            </p>
          </div>
        </div>

        {/* Product showcase — manual scroll, no marquee */}
        <aside className="h-[520px] min-h-0 border-t border-ink/10 bg-white lg:h-full lg:border-t-0">
          <ProductRail products={homeProducts} />
        </aside>
      </div>
      <span className="sr-only">{current.name}</span>
    </section>
  )
}

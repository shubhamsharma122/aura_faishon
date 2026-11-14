import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { searchProducts } from '../../data/catalog'
import ProductCutout from '../ui/ProductCutout'
import { inr } from '../../utils/format'

export default function SearchBar({ autoFocus = false, onDone }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const nav = useNavigate()
  const boxRef = useRef(null)
  const inputRef = useRef(null)
  const results = q.trim() ? searchProducts(q).slice(0, 6) : []

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 60)
  }, [autoFocus])

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (to) => {
    setOpen(false)
    setQ('')
    nav(to)
    onDone?.()
  }

  const submit = (e) => {
    e?.preventDefault()
    if (active >= 0 && results[active]) return go(`/product/${results[active].slug}`)
    if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`)
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      onDone?.()
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink pb-3">
        <FaSearch size={15} className="shrink-0 text-ink/50" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search bats, jerseys, shoes…"
          className="w-full bg-transparent font-display text-lg text-ink placeholder:text-ink/30 focus:outline-none sm:text-2xl"
          aria-label="Search products"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="text-ink/40 hover:text-ink">
            <FaTimes size={13} />
          </button>
        )}
      </form>

      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 border border-ink/10 bg-white">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">No matches for “{q}”.</p>
          ) : (
            <ul>
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/product/${p.slug}`)}
                    className={`flex w-full items-center gap-4 px-4 py-3 text-left transition ${
                      active === i ? 'bg-ink text-white' : 'hover:bg-mist'
                    }`}
                  >
                    <span className="h-12 w-12 shrink-0 bg-white/60 p-1">
                      <ProductCutout product={p} className="h-full w-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[11px] uppercase tracking-wide">
                        {p.name}
                      </span>
                      <span className={`block text-[11px] ${active === i ? 'text-white/60' : 'text-muted'}`}>
                        {p.brand} · {p.subcategory}
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-xs">{inr(p.price)}</span>
                  </button>
                </li>
              ))}
              <li className="border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => go(`/shop?q=${encodeURIComponent(q.trim())}`)}
                  className="w-full px-4 py-3 text-left font-display text-[10px] uppercase tracking-[.14em] text-muted hover:text-ink"
                >
                  View all results for “{q}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { cn } from '../../utils/format'

export function PanelHeader({ eyebrow, title, sub, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-5">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-2xl uppercase leading-none tracking-[.02em]">{title}</h2>
        {sub && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function Stat({ label, value, hint }) {
  return (
    <div className="bg-white p-5">
      <p className="text-[10px] uppercase tracking-[.14em] text-faint">{label}</p>
      <p className="mt-2 font-display text-2xl leading-none">{value}</p>
      {hint && <p className="mt-2 text-[10px] uppercase tracking-[.14em] text-muted">{hint}</p>}
    </div>
  )
}

export function SearchBox({ value, onChange, placeholder = 'Search', className }) {
  return (
    <div className={cn('flex items-center gap-2 border border-ink/20 px-3 py-2.5', className)}>
      <FaSearch size={10} className="shrink-0 text-ink/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-sm placeholder:text-ink/30 focus:outline-none"
      />
    </div>
  )
}

export function Field({ label, id, children, hint, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[10px] leading-relaxed text-faint">{hint}</p>}
    </div>
  )
}

export function EmptyPanel({ children }) {
  return (
    <div className="border border-dashed border-ink/20 p-10 text-center text-sm text-muted">
      {children}
    </div>
  )
}

export function TableScroll({ children }) {
  return (
    <div className="overflow-x-auto border border-ink/10">
      <table className="w-full min-w-[720px] text-left text-sm">{children}</table>
    </div>
  )
}

export const th = 'px-4 py-3 font-medium'
export const td = 'px-4 py-4 align-top'

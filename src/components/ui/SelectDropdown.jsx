import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaChevronDown, FaTimes, FaSearch } from 'react-icons/fa'
import { cn } from '../../utils/format'

const normalise = (options = []) =>
  options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))

/**
 * Square, editorial select. Supports single or multi selection, optional
 * inline search, and top/bottom menu placement.
 */
export default function SelectDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select',
  className = '',
  itemStyle = '',
  menuStyle = '',
  leftIcon,
  isSearch = false,
  multiple = false,
  isMandatory = false,
  labelClassName = '',
  menuPosition = 'bottom',
  compact = false,
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const boxRef = useRef(null)
  const searchRef = useRef(null)

  const items = useMemo(() => normalise(options), [options])
  const selected = multiple ? (Array.isArray(value) ? value : []) : value
  const selectedItems = items.filter((i) => (multiple ? selected.includes(i.value) : i.value === selected))

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    if (isSearch) setTimeout(() => searchRef.current?.focus(), 30)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, isSearch])

  const filtered = search.trim()
    ? items.filter((i) => i.label.toLowerCase().includes(search.trim().toLowerCase()))
    : items

  const pick = (item) => {
    if (multiple) {
      const next = selected.includes(item.value)
        ? selected.filter((v) => v !== item.value)
        : [...selected, item.value]
      onChange?.(next)
    } else {
      onChange?.(item.value)
      setOpen(false)
    }
    setSearch('')
  }

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      {label && (
        <span className={cn('field-label', labelClassName)}>
          {label}
          {isMandatory && <span className="text-ink"> *</span>}
        </span>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between gap-3 border border-ink/20 bg-white text-left transition hover:border-ink focus:border-ink focus:outline-none',
          compact ? 'px-3 py-2.5 text-xs' : 'px-4 py-3 text-sm',
          disabled && 'cursor-not-allowed opacity-40',
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {leftIcon && <span className="shrink-0 text-ink/50">{leftIcon}</span>}
          {selectedItems.length === 0 ? (
            <span className="truncate text-ink/40">{placeholder}</span>
          ) : multiple ? (
            <span className="flex flex-wrap gap-1">
              {selectedItems.map((s) => (
                <span key={s.value} className="inline-flex items-center gap-1 border border-ink/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  {s.label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange?.(selected.filter((v) => v !== s.value))
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
                    aria-label={`Remove ${s.label}`}
                  >
                    <FaTimes size={7} />
                  </span>
                </span>
              ))}
            </span>
          ) : (
            <span className="truncate text-ink">{selectedItems[0]?.label}</span>
          )}
        </span>
        <FaChevronDown size={10} className={cn('shrink-0 text-ink/50 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-50 w-full border border-ink/15 bg-white',
            menuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
            menuStyle,
          )}
          role="listbox"
        >
          {isSearch && (
            <div className="flex items-center gap-2 border-b border-ink/10 px-3 py-2">
              <FaSearch size={10} className="text-ink/40" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-xs focus:outline-none"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-xs text-ink/40">No options</p>
            ) : (
              filtered.map((item) => {
                const active = multiple ? selected.includes(item.value) : item.value === selected
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => pick(item)}
                    role="option"
                    aria-selected={active}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition hover:bg-ink hover:text-white',
                      active && 'bg-ink/[.06] font-medium',
                      itemStyle,
                    )}
                  >
                    {item.label}
                    {active && <span className="text-[10px]">✓</span>}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

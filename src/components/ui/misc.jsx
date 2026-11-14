import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar, FaMinus, FaPlus } from 'react-icons/fa'
import { inr, discountPct, cn } from '../../utils/format'

export function Stars({ rating = 0, size = 'text-[11px]', className }) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5 text-ink', className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        if (rating >= i) return <FaStar key={i} className={size} />
        if (rating >= i - 0.5) return <FaStarHalfAlt key={i} className={size} />
        return <FaRegStar key={i} className={cn(size, 'text-ink/20')} />
      })}
    </span>
  )
}

export function StockBadge({ stock }) {
  if (stock <= 0)
    return <span className="chip border-ink/30 text-ink/50">Out of stock</span>
  if (stock <= 10)
    return <span className="chip border-ink text-ink">Only {stock} left</span>
  return <span className="chip border-ink/20 text-ink/60">In stock</span>
}

export function DiscountBadge({ mrp, price }) {
  const pct = discountPct(mrp, price)
  if (!pct) return null
  return <span className="chip border-ink bg-ink text-white">−{pct}%</span>
}

export function QtyStepper({ value = 1, onChange, small = false, min = 1, max = 20 }) {
  const btn = small ? 'h-8 w-8' : 'h-11 w-11'
  return (
    <div className={cn('inline-flex items-center border border-ink/20', small ? 'h-8' : 'h-11')}>
      <button
        type="button"
        onClick={() => onChange?.(Math.max(min, value - 1))}
        className={cn('flex items-center justify-center text-ink/60 transition hover:bg-ink hover:text-white', btn)}
        aria-label="Decrease quantity"
      >
        <FaMinus size={9} />
      </button>
      <span className={cn('flex min-w-[2.5rem] items-center justify-center font-display text-xs tabular-nums', small && 'min-w-[2rem]')}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange?.(Math.min(max, value + 1))}
        className={cn('flex items-center justify-center text-ink/60 transition hover:bg-ink hover:text-white', btn)}
        aria-label="Increase quantity"
      >
        <FaPlus size={9} />
      </button>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, sub, action, align = 'left', className }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'items-center text-center sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className="section-title mt-3">{title}</h2>}
        {sub && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn('animate-pulse bg-ink/[.06]', className)}
      aria-hidden="true"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-ink/10">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export function Spinner({ className, label }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <span className="h-7 w-7 animate-spin border border-ink/20 border-t-ink" aria-hidden="true" />
      {label && <span className="eyebrow">{label}</span>}
    </div>
  )
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center border border-ink/10 px-6 py-20 text-center">
      {icon && <span className="mb-5 text-ink/30">{icon}</span>}
      <h3 className="font-display text-xl uppercase tracking-[.02em]">{title}</h3>
      {subtitle && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

const STATUS_STYLES = {
  Pending: 'border-ink/30 text-ink/60',
  Confirmed: 'border-ink text-ink',
  Shipped: 'border-ink bg-ink text-white',
  Delivered: 'border-ink bg-ink text-white',
  Cancelled: 'border-ink/20 text-ink/40 line-through',
}

export function StatusBadge({ status }) {
  return (
    <span className={cn('chip', STATUS_STYLES[status] || 'border-ink/30 text-ink/60')}>
      {status}
    </span>
  )
}

export function Price({ price, mrp, className }) {
  const pct = discountPct(mrp, price)
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className="font-display text-sm">{inr(price)}</span>
      {pct > 0 && <span className="text-xs text-faint line-through">{inr(mrp)}</span>}
    </span>
  )
}

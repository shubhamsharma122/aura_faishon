import React from 'react'
import { Skeleton } from './misc'
import { cn } from '../../utils/format'

/** Full-page loader used when a lazy route is being fetched. */
export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="h-8 w-8 animate-spin border border-ink/15 border-t-ink" aria-hidden="true" />
      <p className="eyebrow">{label}</p>
    </div>
  )
}

/** Skeleton block used as the route-level Suspense fallback. */
export function InlinePageLoader() {
  return (
    <div className="container-x py-12" aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-5 h-10 w-2/3 max-w-xl" />
      <Skeleton className="mt-8 aspect-[16/9] w-full" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ErrorState({ error, onRetry, title = 'Something went wrong', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center border border-ink/10 px-6 py-16 text-center', className)}>
      <p className="eyebrow">Error</p>
      <h3 className="mt-3 font-display text-xl uppercase tracking-[.02em]">{title}</h3>
      {error?.message && <p className="mt-2 max-w-md text-sm text-muted">{error.message}</p>}
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-6">
          Try again
        </button>
      )}
    </div>
  )
}

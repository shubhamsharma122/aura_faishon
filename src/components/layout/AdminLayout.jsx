import React, { Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { InlinePageLoader } from '../ui/Async'
import { toastOpts } from '../../context/AppContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <ScrollToTop />
      <header className="border-b border-ink bg-ink text-white">
        <div className="container-x flex h-14 items-center justify-between gap-4">
          <Link to="/admin" className="flex items-baseline gap-3">
            <span className="font-display text-sm uppercase tracking-[.18em]">Aura Fashion</span>
            <span className="text-[10px] uppercase tracking-[.14em] text-white/50">Admin</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.14em] text-white/70 transition-colors hover:text-white"
          >
            <FaArrowLeft size={8} /> Back to store
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <Suspense fallback={<InlinePageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster toastOptions={toastOpts} />
    </div>
  )
}

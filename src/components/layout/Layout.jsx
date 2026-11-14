import React, { Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import { InlinePageLoader } from '../ui/Async'
import { toastOpts } from '../../context/AppContext'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, search])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div
      className={`flex min-h-screen flex-col ${
        isHome ? 'lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden' : ''
      }`}
    >
      <ScrollToTop />
      <Header />
      <main className={isHome ? 'flex min-h-0 flex-1 flex-col' : 'flex-1'}>
        <Suspense fallback={<InlinePageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      {!isHome && <Footer />}
      {!isHome && <WhatsAppFloat />}
      <Toaster toastOptions={toastOpts} />
    </div>
  )
}
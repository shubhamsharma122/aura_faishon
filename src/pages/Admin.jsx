import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight, FaBoxOpen, FaChartBar, FaCog, FaEnvelope, FaLock, FaPalette,
  FaShoppingBag, FaSignOutAlt, FaTag, FaUsers,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { ADMIN_EMAIL, getUser, isAdmin, signOutUser } from '../data/session'
import { listCustomRequests, listOrders } from '../data/orders'
import { listMessages } from '../data/messages'
import { listProducts } from '../data/catalog'
import { listCoupons } from '../data/coupons'
import { getSettings } from '../data/settings'
import { cn } from '../utils/format'
import Overview from './admin/Overview'
import OrdersPanel from './admin/OrdersPanel'
import ProductsPanel from './admin/ProductsPanel'
import CustomersPanel from './admin/CustomersPanel'
import RequestsPanel from './admin/RequestsPanel'
import MessagesPanel from './admin/MessagesPanel'
import CouponsPanel from './admin/CouponsPanel'
import SettingsPanel from './admin/SettingsPanel'

const DATA_EVENTS = ['sh:orders', 'sh:requests', 'sh:messages', 'sh:catalog', 'sh:coupons', 'sh:settings']

function Gate({ user, onSignOut }) {
  return (
    <div className="container-x py-10 lg:py-14">
      <div className="mx-auto max-w-lg border border-ink/10 p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center border border-ink">
          <FaLock size={16} />
        </span>
        <p className="eyebrow mt-6">Admin portal</p>
        <h1 className="mt-3 font-display text-2xl uppercase leading-none tracking-[.02em]">Restricted area</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {user
            ? `You’re signed in as ${user.email}, which doesn’t have admin access.`
            : 'Sign in with the store admin account to continue.'}
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-faint">
          Signing in returns you to the store. After signing in, open Admin from the header.
        </p>
        <div className="mt-6 space-y-3">
          {user ? (
            <button type="button" onClick={onSignOut} className="btn-primary w-full">
              Sign out and switch account
            </button>
          ) : (
            <Link to="/login" className="btn-primary w-full">
              Sign in <FaArrowRight size={10} />
            </Link>
          )}
          <Link to="/" className="btn-outline w-full">Back to store</Link>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-faint">
          Admin email: {ADMIN_EMAIL}. This portal reads data stored in this browser only — it is not a
          substitute for server-side access control.
        </p>
      </div>
    </div>
  )
}

export default function Admin() {
  const [user, setUser] = useState(getUser)
  const [section, setSection] = useState('overview')
  const [, setTick] = useState(0)

  useEffect(() => {
    const sync = () => setUser(getUser())
    window.addEventListener('sh:session', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('sh:session', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    DATA_EVENTS.forEach((event) => window.addEventListener(event, bump))
    window.addEventListener('storage', bump)
    return () => {
      DATA_EVENTS.forEach((event) => window.removeEventListener(event, bump))
      window.removeEventListener('storage', bump)
    }
  }, [])

  const data = {
    orders: listOrders(),
    products: listProducts(),
    requests: listCustomRequests(),
    messages: listMessages(),
    coupons: listCoupons(),
    settings: getSettings(),
  }

  const customerCount = useMemo(() => {
    const keys = new Set()
    for (const order of data.orders) {
      const phone = order.customer?.phone || order.address?.phone
      const name = order.customer?.name || order.address?.name
      const key = (phone || name || '').trim().toLowerCase()
      if (key) keys.add(key)
    }
    return keys.size
  }, [data.orders])

  const signOut = () => {
    signOutUser()
    toast.success('Signed out')
  }

  if (!isAdmin(user)) return <Gate user={user} onSignOut={signOut} />

  const unread = data.messages.filter((m) => !m.read).length

  const sections = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'orders', label: 'Orders', icon: FaShoppingBag, count: data.orders.length },
    { id: 'products', label: 'Products', icon: FaBoxOpen, count: data.products.length },
    { id: 'customers', label: 'Customers', icon: FaUsers, count: customerCount },
    { id: 'requests', label: 'Custom requests', icon: FaPalette, count: data.requests.length },
    { id: 'messages', label: 'Messages', icon: FaEnvelope, count: unread },
    { id: 'coupons', label: 'Coupons', icon: FaTag, count: data.coupons.length },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ]

  return (
    <div className="container-x py-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="section-title mt-3">Store control room</h1>
          <p className="mt-2 text-sm text-muted">
            Signed in as {user.email} · data lives in this browser
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={signOut} className="btn-outline">
            <FaSignOutAlt size={10} /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav
          aria-label="Admin sections"
          className="flex gap-1 overflow-x-auto border-b border-ink/10 pb-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:pr-5 lg:pb-0"
        >
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 whitespace-nowrap px-3 py-2.5 text-left font-display text-[10px] uppercase tracking-[.14em] transition-colors',
                  section === s.id ? 'bg-ink text-white' : 'text-muted hover:bg-mist hover:text-ink',
                )}
              >
                <Icon size={11} className="shrink-0" />
                <span>{s.label}</span>
                {s.count != null && (
                  <span className={cn('ml-auto pl-3 text-[9px] tabular-nums', section === s.id ? 'text-white/60' : 'text-faint')}>
                    {s.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="min-w-0">
          {section === 'overview' && (
            <Overview
              orders={data.orders}
              products={data.products}
              requests={data.requests}
              messages={data.messages}
              onNavigate={setSection}
            />
          )}
          {section === 'orders' && <OrdersPanel orders={data.orders} />}
          {section === 'products' && <ProductsPanel products={data.products} />}
          {section === 'customers' && <CustomersPanel orders={data.orders} />}
          {section === 'requests' && <RequestsPanel requests={data.requests} />}
          {section === 'messages' && <MessagesPanel messages={data.messages} />}
          {section === 'coupons' && <CouponsPanel coupons={data.coupons} />}
          {section === 'settings' && <SettingsPanel settings={data.settings} />}
        </div>
      </div>
    </div>
  )
}

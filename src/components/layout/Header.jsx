import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaSearch, FaHeart, FaShoppingBag, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa'
import SearchBar from './SearchBar'
import { useCart } from '../../context/AppContext'
import { getUser, isAdmin } from '../../data/session'
import { listProducts } from '../../data/catalog'
import { getWishlist, toggleWishlist } from '../../data/wishlist'
import ProductCutout from '../ui/ProductCutout'
import { inr } from '../../utils/format'

const utilityNav = [
  { label: 'Womenswear', to: '/shop?category=clothing' },
  { label: 'Menswear', to: '/shop' },
  { label: 'Kidswear', to: '/shop' },
]

const primaryNav = [
  { label: 'Sale', to: '/shop' },
  { label: 'New in', to: '/shop?sort=newest' },
  { label: 'Brands', to: '/shop' },
  { label: 'Clothing', to: '/shop?category=clothing' },
  { label: 'Shoes', to: '/shop?category=footwear' },
  { label: 'Bags', to: '/shop?subcategory=Bags' },
  { label: 'Accessories', to: '/shop?category=accessories' },
  { label: 'Watches', to: '/shop' },
  { label: 'Lifestyle', to: '/shop' },
]

const Wordmark = () => (
  <Link
    to="/"
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
    aria-label="Aura Fashion home"
  >
    <span className="block font-display text-[18px] uppercase leading-none tracking-[.16em] text-ink sm:text-[22px] lg:text-[24px]">
      Aura Fashion
    </span>
  </Link>
)

export default function Header() {
  const { count } = useCart()
  const { pathname, search } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [wishlist, setWishlist] = useState(getWishlist)
  const [user, setUser] = useState(getUser)

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
    const sync = () => setWishlist(getWishlist())
    window.addEventListener('sh:wishlist', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('sh:wishlist', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    // Close overlays whenever the route changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchOpen(false)
    setMenuOpen(false)
    setWishOpen(false)
  }, [pathname, search])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
        setWishOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const saved = listProducts().filter((p) => wishlist.includes(p.id))

  return (
    <>
      <header className="relative z-40 bg-white">
        <div className="px-5 sm:px-8 lg:px-[3.8%]">
          {/* Utility row */}
          <div className="relative flex h-12 items-center justify-between lg:h-11">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="-ml-2 flex h-9 w-9 items-center justify-center md:hidden"
              >
                <FaBars size={15} />
              </button>

              <nav className="hidden items-center gap-3.5 md:flex lg:gap-[14px]" aria-label="Departments">
                {utilityNav.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="font-display text-[11px] font-medium uppercase tracking-[.2px] text-ink transition-colors hover:text-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Wordmark />

            <div className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-4">
              {isAdmin(user) ? (
                <Link
                  to="/admin"
                  className="hidden font-display text-[11px] font-medium uppercase tracking-[.2px] text-ink transition-colors hover:text-muted md:inline"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden font-display text-[11px] font-medium uppercase tracking-[.2px] text-ink transition-colors hover:text-muted md:inline"
                >
                  {user ? user.name.split(' ')[0] : 'Login'}
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:text-muted"
              >
                <FaSearch size={15} />
              </button>

              <button
                type="button"
                onClick={() => setWishOpen(true)}
                aria-label="Wishlist"
                className="relative flex h-8 w-8 items-center justify-center text-ink transition-colors hover:text-muted"
              >
                <FaHeart size={15} />
                {wishlist.length > 0 && (
                  <span className="absolute -right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center bg-ink px-1 text-[8px] font-medium leading-none text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <Link
                to="/cart"
                className="flex items-center gap-1.5 font-display text-[11px] font-medium uppercase tracking-[.2px] text-ink transition-colors hover:text-muted"
              >
                <FaShoppingBag size={13} className="sm:hidden" />
                <span className="hidden sm:inline">Cart ({count})</span>
                <span className="sm:hidden">({count})</span>
              </Link>
            </div>
          </div>

          {/* Category row */}
          <nav
            className="hidden h-[30px] items-center justify-center gap-7 md:flex lg:gap-8"
            aria-label="Categories"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="whitespace-nowrap font-body text-[13px] font-normal text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-white animate-fadeIn">
          <div className="mx-auto w-full max-w-[1440px] px-5 pt-8 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Search</p>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="flex h-10 w-10 items-center justify-center text-ink hover:bg-mist"
              >
                <FaTimes size={15} />
              </button>
            </div>
            <div className="mx-auto mt-10 max-w-3xl">
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <SearchBar autoFocus onDone={() => setSearchOpen(false)} />
              <div className="mt-10">
                <p className="eyebrow">Popular searches</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Cricket bat', 'Jersey', 'Helmet', 'Football', 'Shoes', 'Kit bag'].map((t) => (
                    <Link
                      key={t}
                      to={`/shop?q=${encodeURIComponent(t)}`}
                      onClick={() => setSearchOpen(false)}
                      className="chip hover:bg-ink hover:text-white"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist drawer */}
      {wishOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-ink/40 animate-fadeIn" onClick={() => setWishOpen(false)} aria-hidden="true" />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white animate-fadeIn">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-sm uppercase tracking-[.14em]">Wishlist ({saved.length})</h2>
              <button
                type="button"
                onClick={() => setWishOpen(false)}
                aria-label="Close wishlist"
                className="flex h-9 w-9 items-center justify-center hover:bg-mist"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {saved.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <FaHeart size={22} className="mx-auto text-ink/20" />
                  <p className="mt-4 font-display text-sm uppercase tracking-[.14em]">Nothing saved yet</p>
                  <p className="mt-2 text-sm text-muted">Tap the heart on any product to keep it here.</p>
                  <Link to="/shop" onClick={() => setWishOpen(false)} className="btn-outline mt-6">
                    Browse the shop
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-ink/10">
                  {saved.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 px-6 py-4">
                      <Link to={`/product/${p.slug}`} className="h-16 w-14 shrink-0 bg-mist p-1">
                        <ProductCutout product={p} className="h-full w-full" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/product/${p.slug}`} className="block truncate font-display text-[11px] uppercase tracking-wide">
                          {p.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-muted">{inr(p.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWishlist(toggleWishlist(p.id))}
                        className="text-[10px] uppercase tracking-[.14em] text-muted hover:text-ink"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {saved.length > 0 && (
              <div className="border-t border-ink/10 p-6">
                <Link to="/shop" onClick={() => setWishOpen(false)} className="btn-primary w-full">
                  Shop the edit <FaArrowRight size={10} />
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white animate-fadeIn md:hidden">
          <div className="flex h-12 items-center justify-between px-5">
            <span className="font-display text-sm uppercase tracking-[.16em]">Aura Fashion</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center"
            >
              <FaTimes size={16} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col overflow-y-auto px-5 pt-4">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="border-b border-ink/10 py-4 font-display text-lg uppercase tracking-[.02em]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6 grid gap-3 pb-8">
              <Link to="/customize" className="btn-outline">Custom jerseys</Link>
              {isAdmin(user) ? (
                <Link to="/admin" className="btn-outline">Admin portal</Link>
              ) : (
                <Link to="/login" className="btn-outline">{user ? user.name.split(' ')[0] : 'Login'}</Link>
              )}
              <Link to="/contact" className="btn-outline">Contact</Link>
            </div>
          </nav>
          <div className="flex items-center justify-between border-t border-ink/10 px-5 py-5">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                setWishOpen(true)
              }}
              className="btn-link"
            >
              Wishlist ({wishlist.length})
            </button>
            <Link to="/cart" className="btn-primary">
              Cart ({count})
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

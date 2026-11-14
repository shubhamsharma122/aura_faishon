import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FaArrowRight, FaCheck, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getUser, isAdmin, registerUser, signInUser, signOutUser } from '../data/session'
import { cn } from '../utils/format'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: '', email: '', password: '' }

export default function Login() {
  const nav = useNavigate()
  const { state } = useLocation()
  const [user, setUser] = useState(getUser)
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  const from = state?.from || '/'
  // Signing in returns to the store. The admin portal is opened from the
  // header or the signed-in card — never as an automatic redirect.
  const afterSignIn = from === '/admin' ? '/' : from
  const isRegister = mode === 'register'

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const switchMode = (next) => {
    setMode(next)
    setErrors({})
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (isRegister && !form.name.trim()) errs.name = 'Enter your name.'
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Enter a valid email.'
    if (form.password.length < 6) errs.password = 'Use at least 6 characters.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setBusy(true)
    try {
      const next = isRegister
        ? await registerUser({ name: form.name, email: form.email, password: form.password })
        : await signInUser({ email: form.email, password: form.password })
      setUser(next)
      toast.success(isRegister ? `Welcome, ${next.name.split(' ')[0]}` : 'Signed in')
      nav(afterSignIn, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Could not reach the account service.')
      if (err.status === 409) setErrors({ email: err.message })
      if (err.status === 401) setErrors({ password: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="grid border border-ink/10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Editorial side */}
        <div className="hidden flex-col justify-between bg-mist p-10 lg:flex">
          <div>
            <p className="eyebrow">Account</p>
            <h1 className="mt-4 max-w-sm font-display text-4xl uppercase leading-[1.02] tracking-[.01em]">
              Your locker, your kit.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Keep your cart, wishlist and order details in one place. Your password is verified by the
              Aura Fashion API, and your session token stays in this browser.
            </p>
          </div>
          <div className="mt-14">
            <p className="text-[10px] uppercase tracking-[.14em] text-faint">Need a hand?</p>
            <Link to="/contact" className="btn-link mt-3">
              Talk to the team <FaArrowRight size={9} />
            </Link>
          </div>
        </div>

        {/* Form side */}
        <div className="p-6 sm:p-10">
          {user ? (
            <div className="flex h-full flex-col justify-center">
              <span className="flex h-12 w-12 items-center justify-center border border-ink">
                <FaCheck size={18} />
              </span>
              <p className="mt-6 eyebrow">Signed in</p>
              <h2 className="mt-2 font-display text-3xl uppercase leading-none tracking-[.02em]">
                Hi, {user.name.split(' ')[0]}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                You’re signed in as <span className="text-ink">{user.email}</span>. Your cart and wishlist
                are waiting for you.
              </p>
              <div className="mt-8 space-y-3">
                <Link to="/shop" className="btn-primary w-full">
                  Continue shopping <FaArrowRight size={10} />
                </Link>
                {isAdmin(user) && (
                  <Link to="/admin" className="btn-outline w-full">
                    Open admin portal <FaArrowRight size={10} />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    signOutUser()
                    setUser(null)
                    toast.success('Signed out')
                  }}
                  className="btn-outline w-full"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="eyebrow">{isRegister ? 'Create account' : 'Welcome back'}</p>
              <h2 className="mt-3 font-display text-3xl uppercase leading-none tracking-[.02em]">
                {isRegister ? 'Join the club' : 'Sign in'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {isRegister
                  ? 'Set up your account in seconds and keep your details ready for checkout.'
                  : 'Use your email to pick up where you left off.'}
              </p>

              <div className="mt-6 flex border-b border-ink/15">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className={cn(
                    'flex-1 border-b-2 px-4 py-3 font-display text-[10px] uppercase tracking-[.14em] transition-colors',
                    !isRegister ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink',
                  )}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={cn(
                    'flex-1 border-b-2 px-4 py-3 font-display text-[10px] uppercase tracking-[.14em] transition-colors',
                    isRegister ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink',
                  )}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
                {isRegister && (
                  <div>
                    <label htmlFor="login-name" className="field-label">Full name *</label>
                    <div className="relative">
                      <FaUser size={11} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
                      <input
                        id="login-name"
                        value={form.name}
                        onChange={set('name')}
                        placeholder="Your name"
                        autoComplete="name"
                        className={cn('field pl-10', errors.name && 'border-ink')}
                      />
                    </div>
                    {errors.name && <p className="mt-1.5 text-[11px] text-ink">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="field-label">Email *</label>
                  <div className="relative">
                    <FaEnvelope size={11} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
                    <input
                      id="login-email"
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={cn('field pl-10', errors.email && 'border-ink')}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-[11px] text-ink">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="login-password" className="field-label">Password *</label>
                  <div className="relative">
                    <FaLock size={11} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="At least 6 characters"
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      className={cn('field pl-10 pr-11', errors.password && 'border-ink')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-ink/40 transition-colors hover:text-ink"
                    >
                      {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-[11px] text-ink">{errors.password}</p>}
                </div>

                <button type="submit" disabled={busy} className="btn-primary w-full">
                  {busy ? (isRegister ? 'Creating account…' : 'Signing in…') : isRegister ? 'Create account' : 'Sign in'}
                  <FaArrowRight size={10} />
                </button>
              </form>

              <p className="mt-4 text-[11px] leading-relaxed text-faint">
                Passwords are hashed and verified by the Aura Fashion API. Your session token is stored in
                this browser and expires after 7 days.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-[11px] text-muted">
                <Link to="/contact" className="transition-colors hover:text-ink">Need help?</Link>
                <Link to={from} className="transition-colors hover:text-ink">Continue as guest</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

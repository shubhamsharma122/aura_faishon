import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow">Error 404</p>
      <p className="mt-6 font-display text-[26vw] leading-[.8] tracking-[-.04em] text-ink/10 sm:text-[12rem]">
        404
      </p>
      <h1 className="mt-6 max-w-lg font-display text-2xl uppercase leading-[1.1] tracking-[.01em] sm:text-3xl">
        That one went out of bounds.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back in the game.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back to home <FaArrowRight size={9} />
        </Link>
        <Link to="/shop" className="btn-outline">Shop all</Link>
      </div>
    </div>
  )
}

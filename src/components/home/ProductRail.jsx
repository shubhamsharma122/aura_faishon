import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'

function RailCard({ product, index }) {
  const [loved, setLoved] = useState(false)

  const onAdd = () => {
    toast.success(`${product.name} added to bag`)
  }

  return (
    <article
      className="group relative flex shrink-0 flex-col snap-start overflow-hidden px-[7%] pb-4 pt-5"
      style={{
        flexBasis: 'calc(100% / 3)',
        height: 'calc(100% / 3)',
        background: index % 2 === 0 ? '#E6E6E6' : '#FFFFFF',
      }}
    >
      <button
        type="button"
        onClick={() => setLoved((v) => !v)}
        aria-label={loved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        aria-pressed={loved}
        className="absolute left-3.5 top-3.5 z-10 text-ink transition-transform duration-200 hover:scale-110"
      >
        {loved ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
      </button>

      <Link
        to="/shop"
        className="flex min-h-0 flex-1 items-center justify-center"
        aria-label={`Shop ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.alt || product.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <Link
            to="/shop"
            className="block font-display text-[10px] uppercase leading-tight tracking-[.02em] text-ink transition-colors hover:text-muted sm:text-[11px]"
          >
            {product.name}
          </Link>
          <p className="mt-1 truncate text-[10px] leading-tight text-muted sm:text-[11px]">{product.variant}</p>
          <p className="mt-1.5 font-display text-[11px] leading-none text-ink sm:text-[12px]">{product.priceLabel}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${product.name} to bag`}
          className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-ink/55 transition-transform duration-300 hover:text-ink group-hover:rotate-90"
        >
          <FaPlus size={11} />
        </button>
      </div>
    </article>
  )
}

export default function ProductRail({ products = [] }) {
  if (!products.length) return null

  return (
    <div
      className="product-rail h-full overflow-y-auto overscroll-contain snap-y snap-proximity"
      aria-label="Featured products"
    >
      {products.map((product, index) => (
        <RailCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}

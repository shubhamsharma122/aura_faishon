import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'
import ProductImage from './ProductImage'
import { Price } from './misc'
import { useCart } from '../../context/AppContext'
import { isWishlisted, toggleWishlist } from '../../data/wishlist'
import { discountPct } from '../../utils/format'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const navigate = useNavigate()
  const [loved, setLoved] = useState(() => isWishlisted(product.id))
  const pct = discountPct(product.mrp, product.price)

  const onLove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const next = toggleWishlist(product.id)
    setLoved(next.includes(product.id))
    toast(next.includes(product.id) ? 'Saved to wishlist' : 'Removed from wishlist')
  }

  const onAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.sizes?.length) {
      navigate(`/product/${product.slug}`)
      toast('Choose a size first')
      return
    }
    add(product.id, { qty: 1 })
  }

  return (
    <article className="group relative">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <ProductImage
            product={product}
            className="h-full w-full p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="chip border-ink bg-white">{product.badge}</span>
            )}
            {pct > 0 && <span className="chip border-ink bg-ink text-white">−{pct}%</span>}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={onLove}
        aria-label={loved ? 'Remove from wishlist' : 'Save to wishlist'}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/80 text-ink backdrop-blur-sm transition hover:bg-white"
      >
        {loved ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
      </button>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/product/${product.slug}`}
            className="block truncate font-display text-[11px] uppercase tracking-[.22em] text-ink hover:text-muted"
          >
            {product.name}
          </Link>
          <p className="mt-1 truncate text-[11px] text-muted">
            {product.brand} · {product.subcategory}
          </p>
          <Price price={product.price} mrp={product.mrp} className="mt-1.5" />
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${product.name} to cart`}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-ink/20 text-ink/60 transition hover:border-ink hover:bg-ink hover:text-white"
        >
          <FaPlus size={9} />
        </button>
      </div>
    </article>
  )
}

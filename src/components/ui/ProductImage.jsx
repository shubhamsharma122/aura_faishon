import React, { useEffect, useState } from 'react'
import ProductCutout, { kindFor } from './ProductCutout'
import { isProductShot, isUnsplash } from '../../data/productImages'

const fitClass = (src) => {
  if (isUnsplash(src)) return 'object-cover'
  if (isProductShot(src)) return 'object-contain mix-blend-multiply'
  return 'object-contain'
}

/**
 * ProductImage — renders internet product photography with a graceful
 * fallback to the local SVG cut-out when an image cannot be loaded.
 * `variant` rotates through the product's image set so the detail-page
 * thumbnails read as different shots of the same item.
 */
export default function ProductImage({
  product,
  variant = 0,
  className = '',
  imgClassName = '',
  loading = 'lazy',
}) {
  const [failed, setFailed] = useState(false)
  const images = product?.images?.length
    ? product.images
    : product?.image
      ? [product.image]
      : []
  const src = images.length ? images[variant % images.length] : null

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!product) return null

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`}>
        <ProductCutout
          product={product}
          variant={variant}
          className={`h-full w-full object-contain ${imgClassName}`}
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={src}
        alt={product.name}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`h-full w-full ${fitClass(src)} ${imgClassName}`}
      />
    </div>
  )
}

/** Small square thumbnail used in the cart, checkout and order pages. */
export function ThumbImage({ src, gradient, name, className = '' }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (src && !failed) {
    return (
      <div className={`overflow-hidden bg-mist ${className}`}>
        <img
          src={src}
          alt={name || 'Product'}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`h-full w-full p-1 ${fitClass(src)}`}
        />
      </div>
    )
  }

  const kind = kindFor(name || '')
  return (
    <div className={`flex items-center justify-center bg-mist ${className}`}>
      <ProductCutout
        kind={kind}
        name={name}
        product={gradient ? { name, gradient } : undefined}
        className="h-full w-full p-1"
      />
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaFilter, FaTimes, FaSortAmountDown, FaArrowRight, FaSearch } from 'react-icons/fa'
import ProductCard from '../components/ui/ProductCard'
import SelectDropdown from '../components/ui/SelectDropdown'
import { EmptyState } from '../components/ui/misc'
import { categories, subcategoriesFor } from '../data/products'
import { useCatalog } from '../data/catalog'
import { cn } from '../utils/format'

const sizesAll = ['S', 'M', 'L', 'XL', 'XXL', 'Short Handle', 'Long Handle', 'UK 7', 'UK 8', 'UK 9', 'UK 10']

const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹4,000', min: 2000, max: 4000 },
  { label: 'Over ₹4,000', min: 4000, max: Infinity },
]

const sorters = [
  { value: 'popular', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
]

const FilterGroup = ({ title, children }) => (
  <div className="border-b border-ink/10 py-5 last:border-0">
    <p className="eyebrow mb-3">{title}</p>
    {children}
  </div>
)

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export default function Shop() {
  const products = useCatalog()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const subcategory = params.get('subcategory') || ''
  const brand = params.get('brand') || ''
  const priceKey = params.get('price') || ''
  const sort = params.get('sort') || 'popular'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const [mobileFilters, setMobileFilters] = useState(false)
  const [cats, setCats] = useState(category ? category.split(',') : [])
  const [sizesSel, setSizesSel] = useState([])
  const [range, setRange] = useState(priceKey ? Number(priceKey) : 0)

  const filtered = useMemo(() => {
    let list = [...products]
    if (q) {
      const t = q.toLowerCase()
      list = list.filter((p) =>
        [p.name, p.brand, p.subcategory, p.categoryName, (p.tags || []).join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(t),
      )
    }
    if (cats.length) list = list.filter((p) => cats.includes(p.category))
    if (subcategory) list = list.filter((p) => p.subcategory === subcategory)
    if (brand) list = list.filter((p) => p.brand === brand)
    if (sizesSel.length) list = list.filter((p) => !p.sizes || p.sizes.some((s) => sizesSel.includes(s)))
    const r = priceRanges[range - 1]
    if (r) list = list.filter((p) => p.price >= r.min && p.price < r.max)
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => b.reviews - a.reviews)
    }
    return list
  }, [q, cats, subcategory, brand, sizesSel, range, sort, products])

  const activeCat = categories.find((c) => c.slug === (cats.length === 1 ? cats[0] : category))
  const activeSubs = subcategoriesFor(cats.length === 1 ? cats[0] : category)
  const brandList = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products])

  const clearAll = () => {
    setParams(new URLSearchParams())
    setCats([])
    setSizesSel([])
    setRange(0)
  }

  const hasFilters = q || cats.length || subcategory || brand || sizesSel.length || priceKey

  const Filters = (
    <div>
      <FilterGroup title="Search">
        <div className="flex items-center gap-2 border border-ink/20 px-3 py-2.5">
          <FaSearch size={10} className="text-ink/40" />
          <input
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Search the shop"
            aria-label="Search the shop"
            className="w-full bg-transparent text-sm placeholder:text-ink/30 focus:outline-none"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Category">
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={cats.includes(c.slug)}
                onChange={(e) => {
                  const next = e.target.checked ? [...cats, c.slug] : cats.filter((x) => x !== c.slug)
                  setCats(next)
                  set('category', next.join(','))
                }}
                className="h-3.5 w-3.5 accent-ink"
              />
              {c.name}
            </label>
          ))}
        </div>
      </FilterGroup>

      {activeCat && activeSubs.length > 0 && (
        <FilterGroup title="Sub-category">
          <div className="flex flex-wrap gap-1.5">
            {activeSubs.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set('subcategory', subcategory === s ? '' : s)}
                className={cn('chip transition', subcategory === s ? 'border-ink bg-ink text-white' : 'hover:border-ink')}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
            <input type="radio" name="price" checked={range === 0} onChange={() => setRange(0)} className="h-3.5 w-3.5 accent-ink" />
            All prices
          </label>
          {priceRanges.map((r, i) => (
            <label key={r.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
              <input
                type="radio"
                name="price"
                checked={range === i + 1}
                onChange={() => setRange(i + 1)}
                className="h-3.5 w-3.5 accent-ink"
              />
              {r.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
          {brandList.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={brand === b}
                onChange={(e) => set('brand', e.target.checked ? b : '')}
                className="h-3.5 w-3.5 accent-ink"
              />
              {b}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-1.5">
          {sizesAll.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSizesSel((prev) => toggle(prev, s))}
              className={cn('chip transition', sizesSel.includes(s) ? 'border-ink bg-ink text-white' : 'hover:border-ink')}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      {hasFilters && (
        <div className="py-4">
          <button type="button" onClick={clearAll} className="btn-link text-ink">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )

  const activeChips = [
    q && `“${q}”`,
    ...cats.map((c) => categories.find((x) => x.slug === c)?.name).filter(Boolean),
    subcategory,
    brand,
    ...sizesSel,
    range > 0 && priceRanges[range - 1]?.label,
  ].filter(Boolean)

  const heading = activeCat?.name || (q ? 'Search results' : 'Shop all')

  return (
    <div className="container-x py-8 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span className="mx-2 text-ink/30">/</span>
            <span>{activeCat?.name || (q ? 'Search' : 'Shop')}</span>
          </p>
          <h1 className="section-title mt-3">{heading}</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[.14em] text-muted">
            {filtered.length} product{filtered.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileFilters(true)} className="btn-outline py-3 lg:hidden">
            <FaFilter size={9} /> Filters {activeChips.length > 0 && `(${activeChips.length})`}
          </button>
          <SelectDropdown
            value={sort}
            onChange={(v) => set('sort', v)}
            options={sorters}
            leftIcon={<FaSortAmountDown size={10} />}
            compact
            className="w-48"
            placeholder="Sort by"
          />
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-5">
          {activeChips.map((c) => (
            <span key={c} className="chip">{c}</span>
          ))}
          <button type="button" onClick={clearAll} className="ml-1 text-[10px] uppercase tracking-[.14em] text-muted underline hover:text-ink">
            Clear
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-8">{Filters}</div>
        </aside>

        {mobileFilters && (
          <div className="fixed inset-0 z-[75] lg:hidden">
            <div
              className="absolute inset-0 bg-ink/40"
              onClick={() => setMobileFilters(false)}
              role="presentation"
            />
            <aside className="absolute left-0 top-0 h-full w-80 max-w-[88vw] overflow-y-auto bg-white p-5 animate-fadeUp">
              <div className="mb-2 flex items-center justify-between border-b border-ink/10 pb-4">
                <h2 className="font-display text-sm uppercase tracking-[.14em]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center hover:bg-mist"
                >
                  <FaTimes size={13} />
                </button>
              </div>
              {Filters}
              <div className="sticky bottom-0 border-t border-ink/10 bg-white py-4">
                <button type="button" onClick={() => setMobileFilters(false)} className="btn-primary w-full">
                  Show {filtered.length} results <FaArrowRight size={9} />
                </button>
              </div>
            </aside>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<FaTimes size={24} />}
              title="No products match"
              subtitle="Try removing a filter or searching for something else."
              action={<button type="button" onClick={clearAll} className="btn-primary">Clear filters</button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

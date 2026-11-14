import React, { useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import ProductImage from '../../components/ui/ProductImage'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { categories, subcategoriesFor } from '../../data/products'
import { deleteProduct, restoreCatalog, saveProduct } from '../../data/catalog'
import { cn, inr } from '../../utils/format'
import { EmptyPanel, Field, PanelHeader, SearchBox, TableScroll, td, th } from './shared'

const parseList = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

const parseLines = (value) =>
  (value || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

const emptyForm = {
  name: '',
  brand: 'Aura Fashion',
  category: 'accessories',
  subcategory: '',
  price: '',
  mrp: '',
  stock: '0',
  sizes: '',
  image: '',
  description: '',
  features: '',
  featured: false,
  bestseller: false,
  isNew: false,
}

function ProductForm({ product, onClose }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState(() =>
    product
      ? {
          ...emptyForm,
          ...product,
          price: String(product.price ?? ''),
          mrp: String(product.mrp ?? ''),
          stock: String(product.stock ?? 0),
          sizes: (product.sizes || []).join(', '),
          features: (product.features || []).join('\n'),
          image: product.image || '',
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }))
  }

  const onCategory = (e) => {
    const category = e.target.value
    setForm((f) => ({ ...f, category, subcategory: subcategoriesFor(category).includes(f.subcategory) ? f.subcategory : '' }))
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Product name is required.'
    if (!form.price || Number(form.price) < 1) errs.price = 'Enter a price above zero.'
    if (form.mrp && Number(form.mrp) < Number(form.price)) errs.mrp = 'MRP cannot be below the selling price.'
    if (Number(form.stock) < 0) errs.stock = 'Stock cannot be negative.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    saveProduct({
      ...(product || {}),
      name: form.name,
      brand: form.brand,
      category: form.category,
      subcategory: form.subcategory,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      stock: Number(form.stock) || 0,
      sizes: parseList(form.sizes),
      image: form.image.trim(),
      description: form.description,
      features: parseLines(form.features),
      featured: form.featured,
      bestseller: form.bestseller,
      isNew: form.isNew,
    })
    toast.success(isEdit ? 'Product updated' : 'Product added')
    onClose()
  }

  const subcategories = subcategoriesFor(form.category)

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit product' : 'Add product'} maxWidth="max-w-3xl">
      <form onSubmit={submit} noValidate>
        <div className="max-h-[72vh] overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product name *" id="pf-name" className="sm:col-span-2" hint={errors.name}>
              <input id="pf-name" value={form.name} onChange={set('name')} className={cn('field', errors.name && 'border-ink')} placeholder="e.g. Aura Fashion Pro Team Jersey" />
            </Field>

            <Field label="Brand" id="pf-brand">
              <input id="pf-brand" value={form.brand} onChange={set('brand')} className="field" placeholder="Aura Fashion" />
            </Field>

            <Field label="Category *" id="pf-category">
              <select id="pf-category" value={form.category} onChange={onCategory} className="field">
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Subcategory" id="pf-subcategory">
              <select id="pf-subcategory" value={form.subcategory} onChange={set('subcategory')} className="field">
                <option value="">No subcategory</option>
                {subcategories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Sizes (comma separated)" id="pf-sizes" hint="Leave blank for one-size items.">
              <input id="pf-sizes" value={form.sizes} onChange={set('sizes')} className="field" placeholder="S, M, L, XL" />
            </Field>

            <Field label="Selling price (₹) *" id="pf-price" hint={errors.price}>
              <input id="pf-price" type="number" min="0" value={form.price} onChange={set('price')} className={cn('field', errors.price && 'border-ink')} />
            </Field>

            <Field label="MRP (₹)" id="pf-mrp" hint={errors.mrp || 'Defaults to the selling price.'}>
              <input id="pf-mrp" type="number" min="0" value={form.mrp} onChange={set('mrp')} className={cn('field', errors.mrp && 'border-ink')} />
            </Field>

            <Field label="Stock on hand" id="pf-stock" hint={errors.stock}>
              <input id="pf-stock" type="number" min="0" value={form.stock} onChange={set('stock')} className={cn('field', errors.stock && 'border-ink')} />
            </Field>

            <Field label="Image URL" id="pf-image" hint="Optional. Blank uses store photography for the subcategory.">
              <input id="pf-image" value={form.image} onChange={set('image')} className="field" placeholder="https://…" />
            </Field>

            <Field label="Description" id="pf-description" className="sm:col-span-2">
              <textarea id="pf-description" value={form.description} onChange={set('description')} rows={3} className="field resize-y" />
            </Field>

            <Field label="Features (one per line)" id="pf-features" className="sm:col-span-2">
              <textarea id="pf-features" value={form.features} onChange={set('features')} rows={3} className="field resize-y" placeholder={'100% combed cotton\nRegular fit'} />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap gap-5 border-t border-ink/10 pt-5">
            {[
              ['featured', 'Featured on home'],
              ['bestseller', 'Bestseller'],
              ['isNew', 'New arrival'],
            ].map(([key, label]) => (
              <label key={key} htmlFor={`pf-${key}`} className="flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[.14em] text-muted">
                <input id={`pf-${key}`} type="checkbox" checked={form[key]} onChange={set(key)} className="h-3.5 w-3.5 accent-ink" />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-ink/10 px-6 py-4">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function ProductsPanel({ products }) {
  const confirm = useConfirm()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [editing, setEditing] = useState(undefined)

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return products.filter((p) => {
      if (cat && p.category !== cat) return false
      if (!t) return true
      return [p.name, p.brand, p.subcategory].join(' ').toLowerCase().includes(t)
    })
  }, [products, q, cat])

  const remove = async (product) => {
    const ok = await confirm({
      title: 'Remove product?',
      message: `“${product.name}” will be hidden from the storefront. You can bring it back with Restore catalog.`,
      confirmLabel: 'Remove',
    })
    if (!ok) return
    deleteProduct(product.id)
    toast.success('Product removed')
  }

  const restore = async () => {
    const ok = await confirm({
      title: 'Restore catalog?',
      message: 'All product edits, additions and removals will be reset to the seeded catalog.',
      confirmLabel: 'Restore',
    })
    if (!ok) return
    restoreCatalog()
    toast.success('Catalog restored')
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Catalog"
        title="Products"
        sub={`${products.length} products in the store. Edits apply to the shopfront immediately.`}
      >
        <button type="button" onClick={() => setEditing(null)} className="btn-primary">
          <FaPlus size={9} /> Add product
        </button>
      </PanelHeader>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <SearchBox value={q} onChange={setQ} placeholder="Search name, brand or subcategory" className="sm:max-w-sm sm:flex-1" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category" className="field sm:max-w-[220px]">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button type="button" onClick={restore} className="btn-outline sm:ml-auto">
          Restore catalog
        </button>
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-[.14em] text-muted">
        Showing {filtered.length} of {products.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyPanel>No products match this search.</EmptyPanel>
        </div>
      ) : (
        <div className="mt-3">
          <TableScroll>
            <thead className="bg-mist text-[10px] uppercase tracking-[.14em] text-muted">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Category</th>
                <th className={th}>Price</th>
                <th className={th}>Stock</th>
                <th className={th}>Tags</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-mist/60">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <ProductImage product={p} className="h-14 w-12 shrink-0 bg-mist" />
                      <div className="min-w-0">
                        <p className="max-w-[240px] truncate text-[12px]">{p.name}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[.14em] text-muted">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    <p className="text-[11px]">{p.categoryName}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{p.subcategory || '—'}</p>
                  </td>
                  <td className={td}>
                    <p className="font-display text-[12px]">{inr(p.price)}</p>
                    {p.mrp > p.price && <p className="mt-0.5 text-[10px] text-faint line-through">{inr(p.mrp)}</p>}
                  </td>
                  <td className={td}>
                    <span className={p.stock <= 5 ? 'text-[11px] uppercase tracking-[.14em] text-ink' : 'text-[11px] uppercase tracking-[.14em] text-muted'}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                    </span>
                  </td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1">
                      {p.featured && <span className="border border-ink/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink/70">Featured</span>}
                      {p.bestseller && <span className="border border-ink/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink/70">Best</span>}
                      {p.isNew && <span className="border border-ink/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-ink/70">New</span>}
                      {!p.featured && !p.bestseller && !p.isNew && <span className="text-[10px] text-faint">—</span>}
                    </div>
                  </td>
                  <td className={td}>
                    <div className="flex gap-3 text-[10px] uppercase tracking-[.14em]">
                      <button type="button" onClick={() => setEditing(p)} className="underline hover:text-ink">Edit</button>
                      <button type="button" onClick={() => remove(p)} className="text-muted underline hover:text-ink">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        </div>
      )}

      {editing !== undefined && (
        <ProductForm product={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  )
}

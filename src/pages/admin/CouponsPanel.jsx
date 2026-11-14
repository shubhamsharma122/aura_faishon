import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { deleteCoupon, resetCoupons, saveCoupon, toggleCoupon } from '../../data/coupons'
import { cn, inr } from '../../utils/format'
import { EmptyPanel, Field, PanelHeader, TableScroll, td, th } from './shared'

const emptyCoupon = { code: '', type: 'percent', value: '10', minOrder: '0', label: '', active: true }

function CouponForm({ coupon, onClose }) {
  const isEdit = Boolean(coupon)
  const [form, setForm] = useState(() =>
    coupon
      ? {
          ...coupon,
          value: String(coupon.value ?? ''),
          minOrder: String(coupon.minOrder ?? 0),
        }
      : emptyCoupon,
  )
  const [error, setError] = useState('')

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.code.trim()) {
      setError('Enter a coupon code.')
      return
    }
    if (!form.value || Number(form.value) <= 0) {
      setError('Enter a discount value above zero.')
      return
    }
    saveCoupon({
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      label: form.label,
      active: form.active,
    })
    toast.success(isEdit ? 'Coupon updated' : 'Coupon created')
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit coupon' : 'New coupon'} maxWidth="max-w-lg">
      <form onSubmit={submit} noValidate>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Field label="Code *" id="cf-code" className="sm:col-span-2" hint={error}>
            <input
              id="cf-code"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              className={cn('field uppercase', error && 'border-ink')}
              placeholder="SHUB10"
              disabled={isEdit}
            />
          </Field>
          <Field label="Type" id="cf-type">
            <select id="cf-type" value={form.type} onChange={set('type')} className="field">
              <option value="percent">Percent off</option>
              <option value="flat">Flat amount off</option>
            </select>
          </Field>
          <Field label={form.type === 'percent' ? 'Percent (%) *' : 'Amount (₹) *'} id="cf-value">
            <input id="cf-value" type="number" min="0" value={form.value} onChange={set('value')} className="field" />
          </Field>
          <Field label="Minimum order (₹)" id="cf-min">
            <input id="cf-min" type="number" min="0" value={form.minOrder} onChange={set('minOrder')} className="field" />
          </Field>
          <Field label="Description" id="cf-label">
            <input id="cf-label" value={form.label} onChange={set('label')} className="field" placeholder="10% off your order" />
          </Field>
          <label htmlFor="cf-active" className="flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[.14em] text-muted sm:col-span-2">
            <input id="cf-active" type="checkbox" checked={form.active} onChange={set('active')} className="h-3.5 w-3.5 accent-ink" />
            Active and usable at checkout
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-ink/10 px-6 py-4">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary">{isEdit ? 'Save coupon' : 'Create coupon'}</button>
        </div>
      </form>
    </Modal>
  )
}

export default function CouponsPanel({ coupons }) {
  const confirm = useConfirm()
  const [editing, setEditing] = useState(undefined)

  const remove = async (coupon) => {
    const ok = await confirm({
      title: 'Delete coupon?',
      message: `${coupon.code} will stop working at checkout.`,
      confirmLabel: 'Delete',
    })
    if (!ok) return
    deleteCoupon(coupon.code)
    toast.success('Coupon deleted')
  }

  const reset = async () => {
    const ok = await confirm({
      title: 'Restore default coupons?',
      message: 'Custom coupons will be removed and the seeded codes restored.',
      confirmLabel: 'Restore',
    })
    if (!ok) return
    resetCoupons()
    toast.success('Coupons restored')
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Promotions"
        title="Coupons"
        sub="Codes are validated live in the cart. New or edited coupons work immediately."
      >
        <button type="button" onClick={() => setEditing(null)} className="btn-primary">
          <FaPlus size={9} /> New coupon
        </button>
      </PanelHeader>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={reset} className="text-[10px] uppercase tracking-[.14em] text-muted underline hover:text-ink">
          Restore defaults
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="mt-3">
          <EmptyPanel>No coupons yet. Create one to offer a discount at checkout.</EmptyPanel>
        </div>
      ) : (
        <div className="mt-3">
          <TableScroll>
            <thead className="bg-mist text-[10px] uppercase tracking-[.14em] text-muted">
              <tr>
                <th className={th}>Code</th>
                <th className={th}>Discount</th>
                <th className={th}>Min order</th>
                <th className={th}>Description</th>
                <th className={th}>Status</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-mist/60">
                  <td className={td}><span className="font-display text-[12px] uppercase tracking-wide">{c.code}</span></td>
                  <td className={td}>
                    <span className="text-[12px]">{c.type === 'percent' ? `${c.value}% off` : `${inr(c.value)} off`}</span>
                  </td>
                  <td className={td}><span className="text-[11px] text-muted">{c.minOrder ? inr(c.minOrder) : 'None'}</span></td>
                  <td className={td}><span className="text-[11px] text-muted">{c.label || '—'}</span></td>
                  <td className={td}>
                    <button
                      type="button"
                      onClick={() => {
                        toggleCoupon(c.code)
                        toast.success(c.active ? `${c.code} paused` : `${c.code} activated`)
                      }}
                      className={cn(
                        'border px-2 py-1 text-[9px] uppercase tracking-wide',
                        c.active ? 'border-ink text-ink' : 'border-ink/20 text-ink/40',
                      )}
                    >
                      {c.active ? 'Active' : 'Paused'}
                    </button>
                  </td>
                  <td className={td}>
                    <div className="flex gap-3 text-[10px] uppercase tracking-[.14em]">
                      <button type="button" onClick={() => setEditing(c)} className="underline hover:text-ink">Edit</button>
                      <button type="button" onClick={() => remove(c)} className="text-muted underline hover:text-ink">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        </div>
      )}

      {editing !== undefined && <CouponForm coupon={editing} onClose={() => setEditing(undefined)} />}
    </div>
  )
}

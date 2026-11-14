import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { resetSettings, saveSettings } from '../../data/settings'
import { Field, PanelHeader } from './shared'

const shape = (settings) => ({
  name: settings.name || '',
  tagline: settings.tagline || '',
  phone: settings.phone || '',
  whatsapp: settings.whatsapp || '',
  email: settings.email || '',
  address: settings.address || '',
  timings: settings.timings || '',
  freeDeliveryAbove: String(settings.freeDeliveryAbove ?? 999),
  codAvailable: settings.codAvailable !== false,
  instagram: settings.instagram || '',
  facebook: settings.facebook || '',
})

export default function SettingsPanel({ settings }) {
  const confirm = useConfirm()
  const [form, setForm] = useState(() => shape(settings))

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Store name is required.')
      return
    }
    saveSettings({
      ...form,
      name: form.name.trim(),
      whatsapp: form.whatsapp.replace(/[^\d]/g, ''),
      freeDeliveryAbove: Math.max(0, Number(form.freeDeliveryAbove) || 0),
    })
    toast.success('Store settings saved')
  }

  const reset = async () => {
    const ok = await confirm({
      title: 'Reset store settings?',
      message: 'Contact details, delivery threshold and social links will return to the seeded defaults.',
      confirmLabel: 'Reset',
    })
    if (!ok) return
    setForm(shape(resetSettings()))
    toast.success('Settings reset')
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Store"
        title="Settings"
        sub="These details power the footer, contact page, delivery threshold and WhatsApp links across the store."
      >
        <button type="button" onClick={reset} className="btn-outline">Reset defaults</button>
      </PanelHeader>

      <form onSubmit={submit} className="mt-6 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name *" id="sf-name">
            <input id="sf-name" value={form.name} onChange={set('name')} className="field" />
          </Field>
          <Field label="Tagline" id="sf-tagline">
            <input id="sf-tagline" value={form.tagline} onChange={set('tagline')} className="field" />
          </Field>
          <Field label="Phone" id="sf-phone">
            <input id="sf-phone" value={form.phone} onChange={set('phone')} className="field" />
          </Field>
          <Field label="WhatsApp (digits only)" id="sf-whatsapp" hint="Include the country code, e.g. 918210293271.">
            <input id="sf-whatsapp" value={form.whatsapp} onChange={set('whatsapp')} className="field" />
          </Field>
          <Field label="Email" id="sf-email">
            <input id="sf-email" type="email" value={form.email} onChange={set('email')} className="field" />
          </Field>
          <Field label="Free delivery above (₹)" id="sf-free">
            <input id="sf-free" type="number" min="0" value={form.freeDeliveryAbove} onChange={set('freeDeliveryAbove')} className="field" />
          </Field>
          <Field label="Address" id="sf-address" className="sm:col-span-2">
            <input id="sf-address" value={form.address} onChange={set('address')} className="field" />
          </Field>
          <Field label="Opening hours" id="sf-timings" className="sm:col-span-2">
            <input id="sf-timings" value={form.timings} onChange={set('timings')} className="field" />
          </Field>
          <Field label="Instagram URL" id="sf-instagram">
            <input id="sf-instagram" value={form.instagram} onChange={set('instagram')} className="field" />
          </Field>
          <Field label="Facebook URL" id="sf-facebook">
            <input id="sf-facebook" value={form.facebook} onChange={set('facebook')} className="field" />
          </Field>
        </div>

        <label htmlFor="sf-cod" className="mt-5 flex cursor-pointer items-center gap-2 border-t border-ink/10 pt-5 text-[11px] uppercase tracking-[.14em] text-muted">
          <input id="sf-cod" type="checkbox" checked={form.codAvailable} onChange={set('codAvailable')} className="h-3.5 w-3.5 accent-ink" />
          Cash on delivery available
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button type="submit" className="btn-primary">Save settings</button>
        </div>
      </form>
    </div>
  )
}

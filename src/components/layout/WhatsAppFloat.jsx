import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useSettingsStore } from '../../context/AppContext'

export default function WhatsAppFloat() {
  const { settings } = useSettingsStore()
  return (
    <a
      href={`https://wa.me/${settings?.whatsapp || '918210293271'}?text=Hi Aura Fashion, I need help with an order.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center bg-ink text-white transition-colors hover:bg-muted"
    >
      <FaWhatsapp size={20} />
    </a>
  )
}

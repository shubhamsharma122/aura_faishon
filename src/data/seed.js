export const storeDefaults = {
  name: 'Aura Fashion',
  tagline: 'Contemporary Style for the Modern Individual',
  phone: '+91 82102 93271',
  whatsapp: '918210293271',
  email: 'hello@aurafashion.com',
  address: 'Main Street, City, State — 000001',
  mapEmbed: 'https://www.google.com/maps?q=Purnea,Bihar,India&z=13&output=embed',
  timings: 'Mon – Sat: 10:00 AM – 9:00 PM · Sun: 11:00 AM – 7:00 PM',
  freeDeliveryAbove: 999,
  codAvailable: true,
  instagram: 'https://instagram.com/aurafashion',
  facebook: 'https://facebook.com/aurafashion',
}

export const coupons = [
  { code: 'SHUB10', type: 'percent', value: 10, minOrder: 0, active: true, label: '10% off your order' },
  { code: 'WIN20', type: 'percent', value: 20, minOrder: 1500, active: true, label: '20% off orders above ₹1500' },
  { code: 'JERSEY50', type: 'flat', value: 50, minOrder: 500, active: true, label: '₹50 off custom orders' },
]

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Clothing', to: '/shop?category=clothing' },
  { label: 'Accessories', to: '/shop?category=accessories' },
  { label: 'Footwear', to: '/shop?category=footwear' },
  { label: 'Custom Order', to: '/customize' },
  { label: 'Contact', to: '/contact' },
]

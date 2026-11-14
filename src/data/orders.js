/* ------------------------------------------------------------------
   Local orders — guest checkout with no backend.
   Orders live in localStorage so the confirmation page can look them up
   after a refresh. A couple of demo orders are included for testing.
------------------------------------------------------------------- */

const ORDERS_KEY = 'sh:orders'
const REQUESTS_KEY = 'sh:custom-requests'
const ORDER_STATUS_KEY = 'sh:order-status'
const REQUEST_STATUS_KEY = 'sh:request-status'

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
export const REQUEST_STATUSES = ['Pending', 'In review', 'Approved', 'Printing', 'Shipped', 'Delivered', 'Cancelled']

const FREE_DELIVERY_ABOVE = 999
const SHIPPING_FEE = 49

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — the in-memory value still renders this session */
  }
}

const orderNo = () => {
  const stamp = Date.now().toString().slice(-6)
  const salt = Math.floor(Math.random() * 90 + 10)
  return `AF-${stamp}-${salt}`
}

export const computeTotals = ({ items = [], coupon = null }) => {
  const subtotal = items.reduce((n, it) => n + it.price * it.qty, 0)
  const mrpTotal = items.reduce((n, it) => n + (it.mrp || it.price) * it.qty, 0)
  const flatDiscount = Math.max(0, mrpTotal - subtotal)
  const couponDiscount = coupon
    ? coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
    : 0
  const shipping = subtotal - couponDiscount >= FREE_DELIVERY_ABOVE ? 0 : SHIPPING_FEE
  const total = Math.max(0, subtotal - couponDiscount + shipping)
  return {
    subtotal,
    mrpTotal,
    discount: flatDiscount + couponDiscount,
    flatDiscount,
    couponDiscount,
    shipping,
    total,
  }
}

export const createOrder = ({ items, address, coupon = null, paymentMethod = 'COD', note = '' }) => {
  const totals = computeTotals({ items, coupon })
  const order = {
    no: orderNo(),
    placedAt: new Date().toISOString(),
    status: 'Pending',
    items: items.map((it) => ({ ...it })),
    address: { ...address },
    customer: { name: address?.name || '', phone: address?.phone || '' },
    couponCode: coupon?.code || null,
    paymentMethod,
    note,
    totals,
  }
  const orders = read(ORDERS_KEY)
  write(ORDERS_KEY, [order, ...orders])
  window.dispatchEvent(new window.Event('sh:orders'))
  return order
}

export const demoOrders = [
  {
    no: 'AF-DEMO-001',
    placedAt: new Date('2026-10-18T09:24:00.000Z').toISOString(),
    status: 'Shipped',
    items: [
      {
        cartKey: 'demo-1',
        productId: 'p001',
        slug: 'chronograph-leather-watch',
        name: 'Chronograph Leather Watch',
        price: 195,
        mrp: 295,
        qty: 1,
        size: null,
        gradient: ['#1a1a2e', '#16213e'],
        type: 'product',
      },
      {
        cartKey: 'demo-2',
        productId: 'p004',
        slug: 'rectangular-sunglasses',
        name: 'Rectangular Sunglasses',
        price: 65,
        mrp: 95,
        qty: 2,
        size: null,
        gradient: ['#1a1a2e', '#2c3e50'],
        type: 'product',
      },
    ],
    address: {
      label: 'Home',
      name: 'Amit Singh',
      phone: '9876543210',
      line1: 'House 12, Nehru Nagar Colony',
      line2: 'Near Clock Tower',
      city: 'City',
      state: 'State',
      pincode: '000001',
    },
    customer: { name: 'Amit Singh', phone: '9876543210' },
    couponCode: null,
    paymentMethod: 'COD',
    note: '',
    totals: {
      subtotal: 325,
      mrpTotal: 485,
      discount: 160,
      flatDiscount: 160,
      couponDiscount: 0,
      shipping: 0,
      total: 325,
    },
  },
  {
    no: 'AF-DEMO-002',
    placedAt: new Date('2026-10-29T12:10:00.000Z').toISOString(),
    status: 'Pending',
    items: [
      {
        cartKey: 'demo-3',
        productId: 'p009',
        slug: 'textured-knit-polo',
        name: 'Textured Knit Polo',
        price: 89,
        mrp: 130,
        qty: 2,
        size: 'L',
        gradient: ['#27AE60', '#177A3F'],
        type: 'product',
      },
    ],
    address: {
      label: 'Home',
      name: 'Priya Verma',
      phone: '9812345670',
      line1: 'Ward 7, Line Bazar',
      line2: 'Opposite Gandhi Maidan',
      city: 'City',
      state: 'State',
      pincode: '000001',
    },
    customer: { name: 'Priya Verma', phone: '9812345670' },
    couponCode: null,
    paymentMethod: 'COD',
    note: 'Please call before delivery.',
    totals: {
      subtotal: 178,
      mrpTotal: 260,
      discount: 82,
      flatDiscount: 82,
      couponDiscount: 0,
      shipping: 0,
      total: 178,
    },
  },
  {
    no: 'AF-DEMO-003',
    placedAt: new Date('2026-10-21T08:05:00.000Z').toISOString(),
    status: 'Delivered',
    items: [
      {
        cartKey: 'demo-4',
        productId: 'p019',
        slug: 'suede-penny-loafers',
        name: 'Suede Penny Loafers',
        price: 165,
        mrp: 240,
        qty: 1,
        size: 'UK 8',
        gradient: ['#8B7355', '#5C4033'],
        type: 'product',
      },
      {
        cartKey: 'demo-5',
        productId: 'p023',
        slug: 'opera-eau-de-parfum',
        name: 'Opera Eau de Parfum',
        price: 85,
        mrp: 130,
        qty: 1,
        size: null,
        gradient: ['#C0392B', '#7C2018'],
        type: 'product',
      },
    ],
    address: {
      label: 'Home',
      name: 'Md. Irfan',
      phone: '9934567012',
      line1: 'Araria Road, Near Bus Stand',
      line2: '',
      city: 'City',
      state: 'State',
      pincode: '000002',
    },
    customer: { name: 'Md. Irfan', phone: '9934567012' },
    couponCode: null,
    paymentMethod: 'COD',
    note: '',
    totals: {
      subtotal: 250,
      mrpTotal: 370,
      discount: 120,
      flatDiscount: 120,
      couponDiscount: 0,
      shipping: 0,
      total: 250,
    },
  },
  {
    no: 'AF-DEMO-004',
    placedAt: new Date('2026-10-27T16:40:00.000Z').toISOString(),
    status: 'Confirmed',
    items: [
      {
        cartKey: 'demo-6',
        productId: 'p012',
        slug: 'tailored-summer-pants',
        name: 'Tailored Summer Pants',
        price: 110,
        mrp: 165,
        qty: 1,
        size: 'M',
        gradient: ['#D4C5B2', '#B8A896'],
        type: 'product',
      },
      {
        cartKey: 'demo-7',
        productId: 'p007',
        slug: 'vintage-corduroy-cap',
        name: 'Vintage Corduroy Cap',
        price: 19,
        mrp: 35,
        qty: 1,
        size: null,
        gradient: ['#8B7355', '#5C4033'],
        type: 'product',
      },
    ],
    address: {
      label: 'Home',
      name: 'Sneha Kumari',
      phone: '9876501234',
      line1: 'House 21, Sahkari Colony',
      line2: 'Behind Women\u2019s College',
      city: 'City',
      state: 'State',
      pincode: '000001',
    },
    customer: { name: 'Sneha Kumari', phone: '9876501234' },
    couponCode: null,
    paymentMethod: 'COD',
    note: '',
    totals: {
      subtotal: 129,
      mrpTotal: 200,
      discount: 71,
      flatDiscount: 71,
      couponDiscount: 0,
      shipping: 0,
      total: 129,
    },
  },
  {
    no: 'AF-DEMO-005',
    placedAt: new Date('2026-10-24T11:15:00.000Z').toISOString(),
    status: 'Cancelled',
    items: [
      {
        cartKey: 'demo-8',
        productId: 'p021',
        slug: 'minimalist-white-sneakers',
        name: 'Minimalist White Sneakers',
        price: 120,
        mrp: 180,
        qty: 1,
        size: 'UK 9',
        gradient: ['#F5F5F5', '#E0E0E0'],
        type: 'product',
      },
    ],
    address: {
      label: 'Home',
      name: 'Rohit Yadav',
      phone: '9701122334',
      line1: 'Khuskibagh, Block 4',
      line2: '',
      city: 'City',
      state: 'State',
      pincode: '000001',
    },
    customer: { name: 'Rohit Yadav', phone: '9701122334' },
    couponCode: null,
    paymentMethod: 'COD',
    note: 'Ordered by mistake.',
    totals: {
      subtotal: 120,
      mrpTotal: 180,
      discount: 60,
      flatDiscount: 60,
      couponDiscount: 0,
      shipping: 49,
      total: 169,
    },
  },
]

export const listOrders = () => {
  const stored = read(ORDERS_KEY)
  const seen = new Set(stored.map((o) => o.no))
  const statuses = read(ORDER_STATUS_KEY, {})
  return [...stored, ...demoOrders.filter((o) => !seen.has(o.no))].map((o) =>
    statuses[o.no] ? { ...o, status: statuses[o.no] } : o,
  )
}

export const getOrder = (no) => listOrders().find((o) => o.no === no) || null

export const updateOrderStatus = (no, status) => {
  if (!ORDER_STATUSES.includes(status)) return null
  write(ORDER_STATUS_KEY, { ...read(ORDER_STATUS_KEY, {}), [no]: status })
  window.dispatchEvent(new window.Event('sh:orders'))
  return status
}

export const createCustomRequest = (payload) => {
  const request = {
    no: `CR-${Date.now().toString().slice(-6)}`,
    placedAt: new Date().toISOString(),
    status: 'Pending',
    ...payload,
  }
  const requests = read(REQUESTS_KEY)
  write(REQUESTS_KEY, [request, ...requests])
  window.dispatchEvent(new window.Event('sh:requests'))
  return request
}

export const listCustomRequests = () => {
  const statuses = read(REQUEST_STATUS_KEY, {})
  return read(REQUESTS_KEY).map((r) => (statuses[r.no] ? { ...r, status: statuses[r.no] } : r))
}

export const updateRequestStatus = (no, status) => {
  if (!REQUEST_STATUSES.includes(status)) return null
  write(REQUEST_STATUS_KEY, { ...read(REQUEST_STATUS_KEY, {}), [no]: status })
  window.dispatchEvent(new window.Event('sh:requests'))
  return status
}

export const deleteCustomRequest = (no) => {
  write(REQUESTS_KEY, read(REQUESTS_KEY).filter((r) => r.no !== no))
  window.dispatchEvent(new window.Event('sh:requests'))
}

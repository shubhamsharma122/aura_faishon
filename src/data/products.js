import { pickImages } from './productImages'

const d = (y, m, day) => new Date(Date.UTC(y, m - 1, day)).toISOString()

export const categories = [
  {
    slug: 'clothing',
    name: 'Clothing',
    tagline: 'Polo shirts, trousers, and everyday essentials',
    subcategories: ['Polo Shirts', 'T-Shirts', 'Trousers', 'Shirts'],
    gradient: ['#1a1a2e', '#16213e'],
    icon: 'shirt',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    tagline: 'Watches, sunglasses, caps & more',
    subcategories: ['Watches', 'Sunglasses', 'Caps', 'Bags'],
    gradient: ['#2c3e50', '#1a1a2e'],
    icon: 'watch',
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    tagline: 'Loafers, sneakers & casual shoes',
    subcategories: ['Loafers', 'Sneakers', 'Sandals'],
    gradient: ['#8B7355', '#5C4033'],
    icon: 'shoe',
  },
  {
    slug: 'fragrance',
    name: 'Fragrance',
    tagline: 'Eau de parfum and signature scents',
    subcategories: ['Eau de Parfum', 'Body Mist'],
    gradient: ['#C0392B', '#7C2018'],
    icon: 'perfume',
  },
]

const P = (p) => {
  const images = p.images ?? pickImages(p.id, p.subcategory)
  return {
    _id: p.id,
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    categoryName: categories.find((c) => c.slug === p.category)?.name,
    subcategory: p.subcategory,
    price: p.price,
    mrp: p.mrp,
    stock: p.stock,
    rating: p.rating ?? Math.round((4 + Math.random() * 0.9) * 10) / 10,
    reviews: p.reviews ?? Math.floor(8 + Math.random() * 120),
    sizes: p.sizes ?? null,
    colors: p.colors ?? ['#0E4637', '#FF6B2C', '#101828'],
    description: p.description,
    features: p.features ?? [],
    tags: p.tags ?? [],
    badge: p.badge ?? null,
    featured: p.featured ?? false,
    bestseller: p.bestseller ?? false,
    isNew: p.isNew ?? false,
    createdAt: p.createdAt ?? d(2025, 6, 1),
    gradient: p.gradient ?? ['#0E4637', '#08251F'],
    image: p.image ?? images[0] ?? null,
    images,
  }
}

const seedCatalog = [
  // === ACCESSORIES: Watches ===
  P({ id: 'p001', slug: 'chronograph-leather-watch', name: 'Chronograph Leather Watch', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Watches', price: 195, mrp: 295, stock: 25, images: ['/images/products/watch.png', '/images/products/watch-preview.jpg'], description: 'Elegant chronograph watch with a blue dial and brown leather strap. Perfect for both casual and formal occasions.', features: ['Blue dial face', 'Genuine leather strap', 'Chronograph function', 'Water resistant'], tags: ['popular'], badge: 'Bestseller', bestseller: true, featured: true, gradient: ['#1a1a2e', '#16213e'] }),

  P({ id: 'p002', slug: 'minimalist-steel-watch', name: 'Minimalist Steel Watch', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Watches', price: 145, mrp: 220, stock: 30, description: 'Clean, minimalist watch with a stainless steel bracelet and white dial.', features: ['Stainless steel bracelet', 'White dial', 'Japanese movement', 'Sapphire crystal'], tags: [], gradient: ['#2c3e50', '#1a1a2e'] }),

  P({ id: 'p003', slug: 'vintage-bronze-watch', name: 'Vintage Bronze Watch', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Watches', price: 175, mrp: 260, stock: 18, description: 'Retro-inspired watch with a bronze-toned case and tan leather strap.', features: ['Bronze case', 'Tan leather strap', 'Date window', 'Vintage styling'], tags: [], badge: 'New', isNew: true, gradient: ['#8B7355', '#5C4033'] }),

  // === ACCESSORIES: Sunglasses ===
  P({ id: 'p004', slug: 'rectangular-sunglasses', name: 'Rectangular Sunglasses', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Sunglasses', price: 65, mrp: 95, stock: 40, images: ['/images/products/sunglasses.png', '/images/products/sunglasses-preview.jpg'], description: 'Classic rectangular sunglasses with black frames and gold detailing. UV400 protection for all-day comfort.', features: ['UV400 protection', 'Black frames', 'Gold detailing', 'Polarized lenses'], tags: ['popular'], bestseller: true, featured: true, gradient: ['#1a1a2e', '#2c3e50'] }),

  P({ id: 'p005', slug: 'round-vintage-sunglasses', name: 'Round Vintage Sunglasses', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Sunglasses', price: 55, mrp: 85, stock: 35, description: 'Retro round-frame sunglasses with gradient lenses and metal arms.', features: ['Round metal frame', 'Gradient lenses', 'UV protection', 'Lightweight design'], tags: [], gradient: ['#2c3e50', '#34495e'] }),

  P({ id: 'p006', slug: 'aviator-sunglasses', name: 'Aviator Sunglasses', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Sunglasses', price: 70, mrp: 110, stock: 28, description: 'Timeless aviator-style sunglasses with gold-tone metal frame and green lenses.', features: ['Gold-tone frame', 'Green gradient lenses', 'Nose pads', 'Classic aviator shape'], tags: [], gradient: ['#8B7355', '#1a1a2e'] }),

  // === ACCESSORIES: Caps ===
  P({ id: 'p007', slug: 'vintage-corduroy-cap', name: 'Vintage Corduroy Cap', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Caps', price: 19, mrp: 35, stock: 50, images: ['/images/products/cap.png', '/images/products/cap-preview.jpg'], description: 'Brown corduroy cap with a small embroidered heart detail. Soft, comfortable fit for everyday wear.', features: ['Corduroy fabric', 'Embroidered heart', 'Adjustable strap', 'Structured crown'], tags: ['popular'], featured: true, gradient: ['#8B7355', '#5C4033'] }),

  P({ id: 'p008', slug: 'classic-cotton-cap', name: 'Classic Cotton Cap', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Caps', price: 15, mrp: 28, stock: 60, description: 'Simple cotton cap in neutral tones with an adjustable buckle back.', features: ['100% cotton', 'Adjustable buckle', 'Six-panel design', 'Breathable fabric'], tags: [], gradient: ['#34495e', '#2c3e50'] }),

  // === CLOTHING: Polo Shirts ===
  P({ id: 'p009', slug: 'textured-knit-polo', name: 'Textured Knit Polo', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Polo Shirts', price: 89, mrp: 130, stock: 35, sizes: ['S', 'M', 'L', 'XL', 'XXL'], images: ['/images/products/polo.png', '/images/products/polo-preview.jpg'], description: 'Sage green textured knit polo shirt with a refined collar and short sleeves. Perfect for warm days.', features: ['Textured knit fabric', 'Sage green colour', 'Refined collar', 'Short sleeves'], tags: ['popular'], badge: 'Bestseller', bestseller: true, featured: true, gradient: ['#27AE60', '#177A3F'] }),

  P({ id: 'p010', slug: 'classic-polo-navy', name: 'Classic Polo Shirt', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Polo Shirts', price: 75, mrp: 110, stock: 40, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Navy blue classic polo with a smooth pique knit and button placket.', features: ['Pique knit cotton', 'Navy blue', 'Button placket', 'Ribbed collar'], tags: [], gradient: ['#1E3A8A', '#101828'] }),

  P({ id: 'p011', slug: 'cream-knit-polo', name: 'Cream Knit Polo', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Polo Shirts', price: 95, mrp: 140, stock: 22, sizes: ['S', 'M', 'L', 'XL'], description: 'Soft cream-coloured knit polo with a relaxed fit and subtle texture.', features: ['Soft knit fabric', 'Cream colour', 'Relaxed fit', 'Subtle texture'], tags: [], badge: 'New', isNew: true, gradient: ['#F5F0E8', '#D4C5B2'] }),

  // === CLOTHING: Trousers ===
  P({ id: 'p012', slug: 'tailored-summer-pants', name: 'Tailored Summer Pants', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Trousers', price: 110, mrp: 165, stock: 30, sizes: ['S', 'M', 'L', 'XL'], images: ['/images/products/pants.png', '/images/products/pants-preview.jpg'], description: 'Stone beige tailored trousers with a slim fit and lightweight fabric. Ideal for summer styling.', features: ['Lightweight fabric', 'Stone beige colour', 'Slim fit', 'Tailored waist'], tags: ['popular'], bestseller: true, featured: true, gradient: ['#D4C5B2', '#B8A896'] }),

  P({ id: 'p013', slug: 'chino-trousers-khaki', name: 'Chino Trousers', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Trousers', price: 95, mrp: 140, stock: 35, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Classic khaki chinos with a comfortable stretch and tapered leg.', features: ['Stretch cotton blend', 'Khaki colour', 'Tapered leg', 'Side pockets'], tags: [], gradient: ['#C8A951', '#8F7428'] }),

  P({ id: 'p014', slug: 'linen-trousers-sand', name: 'Linen Trousers', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Trousers', price: 120, mrp: 180, stock: 20, sizes: ['S', 'M', 'L', 'XL'], description: 'Relaxed-fit linen trousers in sand colour with an elasticated waistband.', features: ['100% linen', 'Sand colour', 'Elasticated waist', 'Relaxed fit'], tags: [], gradient: ['#E8DCC8', '#C8B89A'] }),

  // === CLOTHING: T-Shirts ===
  P({ id: 'p015', slug: 'organic-cotton-tee-white', name: 'Organic Cotton Tee', brand: 'Aura Fashion', category: 'clothing', subcategory: 'T-Shirts', price: 35, mrp: 55, stock: 80, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Essential white organic cotton t-shirt with a relaxed fit and crew neck.', features: ['100% organic cotton', 'White colour', 'Crew neck', 'Relaxed fit'], tags: ['popular'], bestseller: true, gradient: ['#F5F5F5', '#E0E0E0'] }),

  P({ id: 'p016', slug: 'vintage-wash-tee', name: 'Vintage Wash Tee', brand: 'Aura Fashion', category: 'clothing', subcategory: 'T-Shirts', price: 40, mrp: 65, stock: 45, sizes: ['S', 'M', 'L', 'XL'], description: 'Soft vintage-wash t-shirt with a slightly faded look and comfortable drape.', features: ['Vintage wash finish', 'Soft cotton blend', 'Slightly oversized', 'Rounded hem'], tags: [], gradient: ['#8B7355', '#5C4033'] }),

  // === CLOTHING: Shirts ===
  P({ id: 'p017', slug: 'oxford-button-down', name: 'Oxford Button-Down Shirt', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Shirts', price: 85, mrp: 125, stock: 28, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Classic Oxford button-down shirt in light blue with a tailored fit.', features: ['Oxford cloth', 'Light blue', 'Button-down collar', 'Tailored fit'], tags: [], gradient: ['#87CEEB', '#4682B4'] }),

  P({ id: 'p018', slug: 'camp-collar-shirt-mauve', name: 'Camp Collar Shirt', brand: 'Aura Fashion', category: 'clothing', subcategory: 'Shirts', price: 78, mrp: 115, stock: 32, sizes: ['S', 'M', 'L', 'XL'], description: 'Mauve camp-collar shirt with a relaxed silhouette and short sleeves.', features: ['Camp collar design', 'Mauve colour', 'Short sleeves', 'Relaxed silhouette'], tags: [], badge: 'New', isNew: true, gradient: ['#C9A0DC', '#9B72B0'] }),

  // === FOOTWEAR: Loafers ===
  P({ id: 'p019', slug: 'suede-penny-loafers', name: 'Suede Penny Loafers', brand: 'Aura Fashion', category: 'footwear', subcategory: 'Loafers', price: 165, mrp: 240, stock: 20, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'], images: ['/images/products/loafers.png', '/images/products/loafers-preview.jpg'], description: 'Sand tan suede penny loafers with a comfortable leather sole. Timeless style for any occasion.', features: ['Genuine suede upper', 'Leather sole', 'Penny strap detail', 'Sand tan colour'], tags: ['popular'], badge: 'Bestseller', bestseller: true, featured: true, gradient: ['#8B7355', '#5C4033'] }),

  P({ id: 'p020', slug: 'leather-moccasin-loafers', name: 'Leather Moccasin Loafers', brand: 'Aura Fashion', category: 'footwear', subcategory: 'Loafers', price: 155, mrp: 230, stock: 25, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'], description: 'Brown leather moccasin loafers with hand-stitched detailing and a flexible sole.', features: ['Full-grain leather', 'Hand-stitched detail', 'Flexible sole', 'Brown colour'], tags: [], gradient: ['#5C4033', '#3E2723'] }),

  // === FOOTWEAR: Sneakers ===
  P({ id: 'p021', slug: 'minimalist-white-sneakers', name: 'Minimalist White Sneakers', brand: 'Aura Fashion', category: 'footwear', subcategory: 'Sneakers', price: 120, mrp: 180, stock: 35, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'], description: 'Clean white leather sneakers with a minimal design and cushioned insole.', features: ['White leather upper', 'Cushioned insole', 'Rubber sole', 'Minimal design'], tags: ['popular'], bestseller: true, gradient: ['#F5F5F5', '#E0E0E0'] }),

  P({ id: 'p022', slug: 'canvas-low-top-sneakers', name: 'Canvas Low-Top Sneakers', brand: 'Aura Fashion', category: 'footwear', subcategory: 'Sneakers', price: 65, mrp: 95, stock: 40, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'], description: 'Classic canvas low-top sneakers in navy with white rubber sole.', features: ['Canvas upper', 'Navy colour', 'White rubber sole', 'Lace-up closure'], tags: [], gradient: ['#1E3A8A', '#101828'] }),

  // === FRAGRANCE: Eau de Parfum ===
  P({ id: 'p023', slug: 'opera-eau-de-parfum', name: 'Opera Eau de Parfum', brand: 'Aura Fashion', category: 'fragrance', subcategory: 'Eau de Parfum', price: 85, mrp: 130, stock: 30, images: ['/images/products/perfume.png', '/images/products/perfume-preview.jpg'], description: 'Red glass Opera perfume bottle with a white label. A signature scent with warm, woody notes.', features: ['60ml bottle', 'Warm woody notes', 'Red glass bottle', 'Long-lasting fragrance'], tags: ['popular'], badge: 'Bestseller', bestseller: true, featured: true, gradient: ['#C0392B', '#7C2018'] }),

  P({ id: 'p024', slug: 'midnight-woods-parfum', name: 'Midnight Woods Parfum', brand: 'Aura Fashion', category: 'fragrance', subcategory: 'Eau de Parfum', price: 95, mrp: 145, stock: 22, description: 'Deep, mysterious fragrance with notes of sandalwood, amber, and vanilla.', features: ['50ml bottle', 'Sandalwood & amber', 'Vanilla base notes', 'Evening wear'], tags: [], gradient: ['#1a1a2e', '#2c3e50'] }),

  P({ id: 'p025', slug: 'citrus-breeze-parfum', name: 'Citrus Breeze Eau de Parfum', brand: 'Aura Fashion', category: 'fragrance', subcategory: 'Eau de Parfum', price: 75, mrp: 115, stock: 28, description: 'Fresh, bright fragrance with bergamot, lemon, and a hint of sea salt.', features: ['50ml bottle', 'Bergamot & lemon', 'Sea salt accord', 'Daytime wear'], tags: [], badge: 'New', isNew: true, gradient: ['#F1C40F', '#B98A08'] }),

  // === ACCESSORIES: Bags ===
  P({ id: 'p026', slug: 'leather-crossbody-bag', name: 'Leather Crossbody Bag', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Bags', price: 110, mrp: 165, stock: 18, description: 'Compact leather crossbody bag with adjustable strap and zip closure.', features: ['Genuine leather', 'Adjustable strap', 'Zip closure', 'Compact size'], tags: [], gradient: ['#5C4033', '#3E2723'] }),

  P({ id: 'p027', slug: 'canvas-tote-bag', name: 'Canvas Tote Bag', brand: 'Aura Fashion', category: 'accessories', subcategory: 'Bags', price: 45, mrp: 70, stock: 40, description: 'Durable canvas tote bag with leather handles and interior pockets.', features: ['Canvas body', 'Leather handles', 'Interior pockets', 'Magnetic closure'], tags: [], gradient: ['#D4C5B2', '#B8A896'] }),

  // === FOOTWEAR: Sandals ===
  P({ id: 'p028', slug: 'leather-strap-sandals', name: 'Leather Strap Sandals', brand: 'Aura Fashion', category: 'footwear', subcategory: 'Sandals', price: 85, mrp: 130, stock: 25, sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'], description: 'Brown leather strap sandals with cushioned footbed and adjustable buckle.', features: ['Genuine leather straps', 'Cushioned footbed', 'Adjustable buckle', 'Brown colour'], tags: [], gradient: ['#8B7355', '#5C4033'] }),

  // === CLOTHING: More T-Shirts ===
  P({ id: 'p029', slug: 'striped-crew-neck-tee', name: 'Striped Crew Neck Tee', brand: 'Aura Fashion', category: 'clothing', subcategory: 'T-Shirts', price: 42, mrp: 65, stock: 50, sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Navy and white striped crew neck t-shirt with a relaxed fit.', features: ['Cotton blend', 'Navy & white stripes', 'Crew neck', 'Relaxed fit'], tags: [], gradient: ['#1E3A8A', '#F5F5F5'] }),

  P({ id: 'p030', slug: 'henley-shirt-olive', name: 'Henley Shirt', brand: 'Aura Fashion', category: 'clothing', subcategory: 'T-Shirts', price: 48, mrp: 75, stock: 35, sizes: ['S', 'M', 'L', 'XL'], description: 'Olive green long-sleeve henley shirt with button placket and ribbed cuffs.', features: ['Long sleeve', 'Olive green', 'Button placket', 'Ribbed cuffs'], tags: [], gradient: ['#27AE60', '#177A3F'] }),
]

/* ------------------------------------------------------------------
   Generated expansion: additional fashion products to fill out the catalog.
   Deterministic (index-based), so slugs/ids/prices stay stable between reloads.
------------------------------------------------------------------ */
const FASHION_PAL = [['#1a1a2e', '#16213e'], ['#2c3e50', '#34495e'], ['#8B7355', '#5C4033'], ['#C0392B', '#7C2018'], ['#27AE60', '#177A3F'], ['#1E3A8A', '#101828'], ['#D4C5B2', '#B8A896'], ['#F5F0E8', '#D4C5B2']]

const ri = (i, m) => (i * 37 + 11) % m
const priceOf = (lo, hi, i) => {
  const span = hi - lo
  const v = lo + Math.round((span * ri(i, 13)) / 12)
  return Math.max(Math.round(v / 5) * 5, 15)
}

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const SHOE_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10']
const ONE_SIZE = ['One Size']

const PRICE = {
  'Polo Shirts': [65, 140], 'T-Shirts': [25, 65], Trousers: [80, 180], Shirts: [60, 130],
  Watches: [120, 300], Sunglasses: [40, 120], Caps: [12, 40], Bags: [35, 170],
  Loafers: [120, 250], Sneakers: [55, 190], Sandals: [50, 140],
  'Eau de Parfum': [60, 150], 'Body Mist': [25, 60],
}

const G = {
  'Polo Shirts': { cat: 'clothing', n: 4, suffix: 'Polo Shirt', sizes: APPAREL_SIZES, brands: ['Aura Fashion'], names: ['Classic Fit', 'Slim Knit', 'Relaxed Weave', 'Merino Blend'], desc: 'Refined polo shirt with a comfortable fit and quality fabric.', feat: ['Quality cotton blend', 'Ribbed collar', 'Button placket'] },
  'T-Shirts': { cat: 'clothing', n: 4, suffix: 'T-Shirt', sizes: APPAREL_SIZES, brands: ['Aura Fashion'], names: ['Essential', 'Relaxed', 'Oversized', 'Fitted'], desc: 'Everyday t-shirt made from soft, breathable cotton.', feat: ['Soft cotton', 'Crew neck', 'Comfortable fit'] },
  Trousers: { cat: 'clothing', n: 4, suffix: 'Trousers', sizes: APPAREL_SIZES, brands: ['Aura Fashion'], names: ['Slim Fit', 'Wide Leg', 'Tailored', 'Chino'], desc: 'Well-tailored trousers for a polished everyday look.', feat: ['Tailored fit', 'Quality fabric', 'Side pockets'] },
  Shirts: { cat: 'clothing', n: 4, suffix: 'Shirt', sizes: APPAREL_SIZES, brands: ['Aura Fashion'], names: ['Oxford', 'Linen', 'Denim', 'Flannel'], desc: 'Classic shirt in a versatile style for any occasion.', feat: ['Quality fabric', 'Button-down collar', 'Chest pocket'] },
  Watches: { cat: 'accessories', n: 4, suffix: 'Watch', sizes: ONE_SIZE, brands: ['Aura Fashion'], names: ['Classic', 'Modern', 'Vintage', 'Sport'], desc: 'Elegant timepiece with quality movement and refined design.', feat: ['Quality movement', 'Water resistant', 'Date window'] },
  Sunglasses: { cat: 'accessories', n: 4, suffix: 'Sunglasses', sizes: ONE_SIZE, brands: ['Aura Fashion'], names: ['Wayfarer', 'Cat Eye', 'Oversized', 'Square'], desc: 'Stylish sunglasses with UV protection and premium lenses.', feat: ['UV400 protection', 'Polarized lenses', 'Lightweight frame'] },
  Caps: { cat: 'accessories', n: 3, suffix: 'Cap', sizes: ONE_SIZE, brands: ['Aura Fashion'], names: ['Dad Cap', 'Snapback', 'Trucker', 'Flat Brim'], desc: 'Casual cap with adjustable strap and embroidered detail.', feat: ['Adjustable strap', 'Embroidered logo', 'Structured crown'] },
  Bags: { cat: 'accessories', n: 3, suffix: 'Bag', sizes: ONE_SIZE, brands: ['Aura Fashion'], names: ['Messenger', 'Backpack', 'Clutch', 'Bucket'], desc: 'Versatile bag with quality materials and practical design.', feat: ['Quality materials', 'Multiple compartments', 'Adjustable strap'] },
  Loafers: { cat: 'footwear', n: 3, suffix: 'Loafers', sizes: SHOE_SIZES, brands: ['Aura Fashion'], names: ['Penny', 'Horsebit', 'Tassel', 'Bit'], desc: 'Classic loafers with genuine leather upper and comfortable sole.', feat: ['Genuine leather', 'Leather sole', 'Comfortable fit'] },
  Sneakers: { cat: 'footwear', n: 3, suffix: 'Sneakers', sizes: SHOE_SIZES, brands: ['Aura Fashion'], names: ['Low Top', 'High Top', 'Slip On', 'Retro'], desc: 'Clean sneakers with cushioned insole and durable outsole.', feat: ['Cushioned insole', 'Rubber outsole', 'Lace-up closure'] },
  Sandals: { cat: 'footwear', n: 3, suffix: 'Sandals', sizes: SHOE_SIZES, brands: ['Aura Fashion'], names: ['Slide', 'Strap', 'Wedge', 'Flat'], desc: 'Comfortable sandals with quality straps and cushioned footbed.', feat: ['Quality straps', 'Cushioned footbed', 'Adjustable buckle'] },
  'Eau de Parfum': { cat: 'fragrance', n: 3, suffix: 'Eau de Parfum', sizes: ONE_SIZE, brands: ['Aura Fashion'], names: ['Noir', 'Blanc', 'Rose', 'Amber'], desc: 'Signature fragrance with a unique blend of notes.', feat: ['50ml bottle', 'Long-lasting', 'Unique blend'] },
  'Body Mist': { cat: 'fragrance', n: 2, suffix: 'Body Mist', sizes: ONE_SIZE, brands: ['Aura Fashion'], names: ['Fresh', 'Floral', 'Citrus'], desc: 'Light body mist for everyday freshness.', feat: ['100ml spray', 'Light scent', 'Everyday wear'] },
}

const generatedCatalog = () => {
  const out = []
  for (const sub of Object.keys(G)) {
    const s = G[sub]
    const [lo, hi] = PRICE[sub]
    for (let k = 0; k < s.n; k++) {
      const i = out.length
      const brand = s.brands[i % s.brands.length]
      const name = `${brand} ${s.names[i % s.names.length]} ${s.suffix}`
      const mrp = priceOf(lo, hi, i)
      const price = Math.max(15, Math.round((mrp * (72 + ri(i, 12))) / 100 / 5) * 5)
      const mkBestseller = i % 9 === 0
      const mkNew = !mkBestseller && i % 7 === 0
      const mkFeatured = !mkBestseller && !mkNew && i % 13 === 0
      out.push(
        P({
          id: `p1${String(i).padStart(2, '0')}`,
          slug: name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name,
          brand,
          category: s.cat,
          subcategory: sub,
          price,
          mrp,
          stock: i % 23 === 0 ? (i % 2 === 0 ? 0 : 2) : (i * 7) % 41 + 4,
          sizes: s.sizes,
          description: `${s.desc} The ${name} is a curated addition to the Aura Fashion collection.`,
          features: s.feat,
          bestseller: mkBestseller,
          featured: mkFeatured,
          isNew: mkNew,
          badge: mkNew ? 'New' : null,
          createdAt: d(2025, (i % 11) + 1, (i * 5) % 27 + 1),
          gradient: FASHION_PAL[i % FASHION_PAL.length],
        }),
      )
    }
  }
  return out
}

export const products = [...seedCatalog, ...generatedCatalog()]

export const getCategories = () => categories

/* ------------------------------------------------------------------
   Static dummy catalog helpers. Everything resolves against the local
   `products` array — no API, no localStorage catalog cache and no admin
   editing layer.
------------------------------------------------------------------- */
export const getCatalog = () => products
export const getProducts = () => products
export const getProduct = (idOrSlug) =>
  products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)

export const featuredProducts = () => products.filter((p) => p.featured)
export const bestsellerProducts = () =>
  products.filter((p) => p.bestseller || p.badge === 'Bestseller')
export const newArrivals = () =>
  [...products].filter((p) => p.isNew).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

export const searchProducts = (q) => {
  const t = (q || '').trim().toLowerCase()
  if (!t) return []
  return products.filter((p) => {
    const hay = [p.name, p.brand, p.subcategory, p.categoryName, ...(p.tags || [])]
      .join(' ')
      .toLowerCase()
    return hay.includes(t)
  })
}

export const brands = () => [...new Set(products.map((p) => p.brand))].sort()
export const subcategoriesFor = (category) =>
  categories.find((c) => c.slug === category)?.subcategories || []
import React from 'react'

/* ------------------------------------------------------------------
   Stylised SVG product cut-outs.
   No external image assets — every product is drawn from a small set of
   geometric silhouettes so the catalogue renders instantly and offline.
------------------------------------------------------------------- */

const KIND_BY_SUBCATEGORY = {
  Bats: 'bat',
  Balls: 'ball',
  'Tennis Balls': 'tennisball',
  'Leather Balls': 'leatherball',
  Pads: 'pads',
  'Batting Gloves': 'gloves',
  'Keeping Gloves': 'gloves',
  Helmets: 'helmet',
  Stumps: 'stumps',
  'Box Guards': 'guard',
  'Thigh Pads': 'guard',
  'Arm Guards': 'guard',
  'Chest Guards': 'guard',
  'Cricket Shoes': 'shoe',
  'Sweatbands & Socks': 'socks',
  'Kit Bags': 'bag',
  'T-Shirts': 'tshirt',
  Shirts: 'shirt',
  Lowers: 'lower',
  Jerseys: 'jersey',
  Football: 'football',
  Badminton: 'badminton',
  Basketball: 'basketball',
}

const KIND_BY_WORD = [
  [/bat/i, 'bat'],
  [/helmet|mask/i, 'helmet'],
  [/glove/i, 'gloves'],
  [/pad|guard|box/i, 'guard'],
  [/stump|bail/i, 'stumps'],
  [/shoe|stud|spike/i, 'shoe'],
  [/sock|sweatband/i, 'socks'],
  [/bag/i, 'bag'],
  [/jersey/i, 'jersey'],
  [/shirt|tee|t-shirt|polo/i, 'tshirt'],
  [/lower|track|pant|trouser/i, 'lower'],
  [/football/i, 'football'],
  [/basketball/i, 'basketball'],
  [/badminton|racket|shuttle/i, 'badminton'],
  [/leather ball/i, 'leatherball'],
  [/ball/i, 'ball'],
]

export const kindFor = (productOrName) => {
  if (!productOrName) return 'default'
  if (typeof productOrName === 'object') {
    return KIND_BY_SUBCATEGORY[productOrName.subcategory] || 'default'
  }
  const hit = KIND_BY_WORD.find(([re]) => re.test(productOrName))
  return hit ? hit[1] : 'default'
}

const detail = 'rgba(0,0,0,.18)'
const highlight = 'rgba(255,255,255,.7)'

function Shape({ kind, primary, secondary }) {
  switch (kind) {
    case 'bat':
      return (
        <g transform="rotate(-18 160 160)">
          <rect x="146" y="40" width="28" height="58" rx="4" fill={secondary} />
          <rect x="138" y="94" width="44" height="30" rx="6" fill={secondary} />
          <path d="M138 116 h44 l10 46 v104 q0 14 -14 14 h-36 q-14 0 -14 -14 V162 z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M160 126 v142" stroke={detail} strokeWidth="2" />
          <rect x="150" y="34" width="20" height="18" rx="9" fill="#111" />
        </g>
      )
    case 'ball':
      return (
        <g>
          <circle cx="160" cy="160" r="82" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M126 90 q34 70 0 140" fill="none" stroke={highlight} strokeWidth="4" strokeDasharray="7 7" />
          <path d="M194 90 q-34 70 0 140" fill="none" stroke={highlight} strokeWidth="4" strokeDasharray="7 7" />
        </g>
      )
    case 'leatherball':
      return (
        <g>
          <circle cx="160" cy="160" r="82" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M160 78 q-28 82 0 164" fill="none" stroke={highlight} strokeWidth="5" />
          <path d="M146 88 v22 M146 130 v22 M146 172 v22 M146 214 v22" stroke={highlight} strokeWidth="3" />
        </g>
      )
    case 'tennisball':
      return (
        <g>
          <circle cx="160" cy="160" r="82" fill="#D9F044" stroke={detail} strokeWidth="2" />
          <path d="M112 96 q40 64 0 128" fill="none" stroke="#fff" strokeWidth="7" />
          <path d="M208 96 q-40 64 0 128" fill="none" stroke="#fff" strokeWidth="7" />
        </g>
      )
    case 'pads':
      return (
        <g>
          <g transform="rotate(-9 120 170)">
            <rect x="70" y="70" width="74" height="190" rx="20" fill={primary} stroke={detail} strokeWidth="2" />
            <path d="M84 96 h46 M84 128 h46 M84 160 h46 M84 192 h46" stroke={highlight} strokeWidth="5" strokeLinecap="round" />
          </g>
          <g transform="rotate(9 200 170)">
            <rect x="176" y="70" width="74" height="190" rx="20" fill={primary} stroke={detail} strokeWidth="2" />
            <path d="M190 96 h46 M190 128 h46 M190 160 h46 M190 192 h46" stroke={highlight} strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      )
    case 'gloves':
      return (
        <g>
          <path d="M78 150 q-8 -52 30 -60 l54 -8 q30 -4 30 26 l4 96 q2 28 -26 32 l-56 8 q-32 4 -36 -26 z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M88 132 q30 -14 62 -18 M88 164 q30 -14 62 -18 M88 196 q30 -14 62 -18" stroke={highlight} strokeWidth="4" strokeLinecap="round" />
          <path d="M230 150 q8 -52 -30 -60 l-16 -3 q-18 -3 -20 16 l-4 36 z" fill={secondary} stroke={detail} strokeWidth="2" />
          <rect x="72" y="228" width="90" height="26" rx="8" fill={secondary} />
        </g>
      )
    case 'helmet':
      return (
        <g>
          <path d="M160 54 q-78 0 -84 96 l-2 44 h172 l-2 -44 q-6 -96 -84 -96z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M92 156 q-22 22 -8 54 l22 30 22 -14 -10 -40z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M228 156 q22 22 8 54 l-22 30 -22 -14 10 -40z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M108 198 h104 M116 216 h88 M126 234 h68 M140 252 h40" stroke="#111" strokeWidth="4" strokeLinecap="round" opacity=".7" />
          <path d="M160 62 v58" stroke={highlight} strokeWidth="4" />
          <path d="M92 144 h136" stroke={highlight} strokeWidth="4" opacity=".5" />
        </g>
      )
    case 'stumps':
      return (
        <g>
          <rect x="98" y="88" width="20" height="178" rx="4" fill={primary} stroke={detail} strokeWidth="2" />
          <rect x="150" y="88" width="20" height="178" rx="4" fill={primary} stroke={detail} strokeWidth="2" />
          <rect x="202" y="88" width="20" height="178" rx="4" fill={primary} stroke={detail} strokeWidth="2" />
          <rect x="94" y="78" width="56" height="14" rx="7" fill={secondary} />
          <rect x="172" y="78" width="56" height="14" rx="7" fill={secondary} />
          <path d="M98 110 v130 M170 110 v130" stroke={highlight} strokeWidth="3" opacity=".5" />
        </g>
      )
    case 'guard':
      return (
        <g>
          <path d="M160 58 q46 14 76 12 l-6 94 q-4 58 -70 88 q-66 -30 -70 -88 l-6 -94 q30 2 76 -12z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M160 84 v120 M124 116 h72 M124 156 h72" stroke={highlight} strokeWidth="4" opacity=".55" strokeLinecap="round" />
          <path d="M104 86 q-18 30 -12 84" fill="none" stroke={secondary} strokeWidth="8" strokeLinecap="round" />
          <path d="M216 86 q18 30 12 84" fill="none" stroke={secondary} strokeWidth="8" strokeLinecap="round" />
        </g>
      )
    case 'shoe':
      return (
        <g>
          <path d="M56 196 q0 -40 34 -46 l50 -8 q18 -2 26 16 l18 34 q42 4 62 26 l8 30 q2 12 -10 12 H66 q-12 0 -12 -12z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M62 238 h206 q10 0 10 10 t-10 10 H66 q-12 0 -12 -12z" fill={secondary} />
          <path d="M116 158 l18 26 M142 152 l18 26 M168 148 l18 26" stroke={highlight} strokeWidth="5" strokeLinecap="round" />
          <path d="M72 226 h180" stroke={detail} strokeWidth="2" />
        </g>
      )
    case 'socks':
      return (
        <g>
          <path d="M104 62 h48 v150 q0 22 -22 34 l-34 20 q-18 10 -28 -8 q-10 -18 8 -28 l22 -12 q6 -4 6 -12z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M176 62 h48 v150 q0 22 -22 34 l-34 20 q-18 10 -28 -8 q-10 -18 8 -28 l22 -12 q6 -4 6 -12z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M104 92 h48 M176 92 h48" stroke={highlight} strokeWidth="6" />
        </g>
      )
    case 'bag':
      return (
        <g>
          <rect x="52" y="120" width="216" height="120" rx="18" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M108 122 v-18 q0 -18 18 -18 h68 q18 0 18 18 v18" fill="none" stroke={secondary} strokeWidth="12" strokeLinecap="round" />
          <path d="M52 164 h216" stroke={highlight} strokeWidth="4" opacity=".5" />
          <rect x="140" y="152" width="40" height="24" rx="6" fill={secondary} />
          <path d="M78 210 h48 M194 210 h48" stroke={highlight} strokeWidth="6" strokeLinecap="round" />
        </g>
      )
    case 'jersey':
    case 'tshirt':
      return (
        <g>
          <path d="M160 68 L108 54 L66 84 L78 136 L108 126 V262 h104 V126 l30 10 12 -52 -42 -30 z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M160 68 q-18 18 -30 22 q14 16 30 16 t30 -16 q-12 -4 -30 -22z" fill={secondary} />
          <path d="M78 136 l30 -10" stroke={highlight} strokeWidth="5" strokeLinecap="round" />
          <path d="M242 136 l-30 -10" stroke={highlight} strokeWidth="5" strokeLinecap="round" />
          <text x="160" y="206" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="46" fontWeight="700" fill={highlight}>07</text>
        </g>
      )
    case 'shirt':
      return (
        <g>
          <path d="M160 66 L106 52 L62 82 L74 142 L106 130 V268 h108 V130 l32 12 12 -60 -44 -30 z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M160 66 l-20 22 l20 22 l20 -22z" fill={secondary} />
          <path d="M160 110 v150" stroke={detail} strokeWidth="2" />
          <circle cx="160" cy="148" r="3" fill={highlight} />
          <circle cx="160" cy="186" r="3" fill={highlight} />
          <circle cx="160" cy="224" r="3" fill={highlight} />
        </g>
      )
    case 'lower':
      return (
        <g>
          <path d="M106 62 h108 l-8 208 h-40 l-6 -130 l-6 130 h-40z" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M106 92 h108" stroke={highlight} strokeWidth="6" />
          <path d="M160 92 v178" stroke={detail} strokeWidth="2" />
          <path d="M118 72 q42 16 84 0" fill="none" stroke={secondary} strokeWidth="8" />
        </g>
      )
    case 'football':
      return (
        <g>
          <circle cx="160" cy="160" r="84" fill="#F2F2F2" stroke={detail} strokeWidth="2" />
          <path d="M160 118 l38 28 -14 46 h-48 l-14 -46z" fill={primary} />
          <path d="M160 76 v42 M84 142 l50 4 M236 142 l-50 4 M112 244 l24 -52 M208 244 l-24 -52" stroke={primary} strokeWidth="8" />
          <path d="M100 100 l28 30 M220 100 l-28 30 M160 220 v24" stroke={primary} strokeWidth="8" />
        </g>
      )
    case 'basketball':
      return (
        <g>
          <circle cx="160" cy="160" r="84" fill="#D9772B" stroke={detail} strokeWidth="2" />
          <path d="M76 160 h168 M160 76 v168" stroke="#3A1C0B" strokeWidth="5" />
          <path d="M104 96 q56 64 0 128 M216 96 q-56 64 0 128" fill="none" stroke="#3A1C0B" strokeWidth="5" />
        </g>
      )
    case 'badminton':
      return (
        <g transform="rotate(-28 160 160)">
          <ellipse cx="160" cy="112" rx="54" ry="72" fill="none" stroke={primary} strokeWidth="9" />
          <path d="M120 72 v80 M140 54 v116 M160 44 v132 M180 54 v116 M200 72 v80" stroke={secondary} strokeWidth="3" opacity=".8" />
          <path d="M160 184 v84" stroke={primary} strokeWidth="10" strokeLinecap="round" />
          <rect x="148" y="256" width="24" height="34" rx="8" fill={secondary} />
        </g>
      )
    default:
      return (
        <g>
          <rect x="70" y="86" width="180" height="150" rx="8" fill={primary} stroke={detail} strokeWidth="2" />
          <path d="M70 136 h180" stroke={highlight} strokeWidth="4" opacity=".5" />
          <rect x="128" y="56" width="64" height="40" rx="6" fill={secondary} />
        </g>
      )
  }
}

export default function ProductCutout({ product, kind, variant = 0, className = '', name }) {
  const resolvedKind = kind || (product ? kindFor(product) : kindFor(name || ''))
  const gradient = product?.gradient || ['#111111', '#3A3A3A']
  const primary = gradient[0]
  const secondary = gradient[1] || '#222222'
  const filter = variant ? `hue-rotate(${variant * 42}deg)` : undefined

  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label={product?.name || name || 'Product illustration'}
      style={{ filter }}
    >
      <Shape kind={resolvedKind} primary={primary} secondary={secondary} />
    </svg>
  )
}

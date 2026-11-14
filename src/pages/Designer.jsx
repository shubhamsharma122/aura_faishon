import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as fabric from 'fabric'
import toast from 'react-hot-toast'
import {
  FaImage, FaFont, FaTrash, FaPlus, FaLayerGroup, FaArrowsAlt, FaArrowRight,
} from 'react-icons/fa'
import { useCart } from '../context/AppContext'
import { inr } from '../utils/format'

/* ---------- product template paths (500×500 template) ---------- */
const tshirtFront = 'M250 56 L168 44 L112 82 L120 148 L170 140 L170 442 L330 442 L330 140 L380 148 L388 82 L332 44 Z'
const tshirtBack = 'M250 38 L160 46 L112 84 L388 84 L340 46 Z M112 84 L120 148 L168 140 L168 442 L332 442 L332 140 L380 148 L388 84 Z'

export const garmentTypes = [
  { id: 'Round-Neck T-Shirt', label: 'Round-Neck T-Shirt', price: 449, fabric: 'Combed Cotton 180 GSM', paths: { front: tshirtFront, back: tshirtBack } },
  { id: 'Polo T-Shirt', label: 'Polo T-Shirt', price: 599, fabric: 'Pique Cotton', paths: { front: 'M250 46 L176 40 L116 78 L124 146 L170 138 L170 442 L330 442 L330 138 L376 146 L384 78 L324 40 Z', back: 'M250 30 L162 40 L116 82 L384 82 L338 40 Z M116 82 L124 146 L170 138 L170 442 L332 442 L332 138 L376 146 L384 82 Z' } },
  { id: 'Team Jersey (Sublimated)', label: 'Team Jersey (Sublimated)', price: 649, fabric: 'Sublimation Mesh', paths: { front: tshirtFront, back: tshirtBack } },
  { id: 'Pro Player Jersey', label: 'Pro Player Jersey', price: 799, fabric: 'Dry-Fit Micro Mesh', paths: { front: tshirtFront, back: tshirtBack } },
  { id: 'Track Lower', label: 'Track Lower', price: 599, fabric: 'Rapid-Dry Fabric', paths: { front: 'M250 74 C238 74 196 82 166 108 L144 168 L112 158 L92 436 L156 436 L184 300 C196 292 228 288 250 288 Z M250 74 C262 74 304 82 334 108 L356 168 L388 158 L408 436 L344 436 L316 300 C304 292 272 288 250 288 Z', back: 'M250 74 C238 74 196 82 166 108 L144 168 L112 158 L92 436 L156 436 L184 300 C196 292 228 288 250 288 Z M250 74 C262 74 304 82 334 108 L356 168 L388 158 L408 436 L344 436 L316 300 C304 292 272 288 250 288 Z' } },
  { id: 'Batting Gloves', label: 'Batting Gloves', price: 899, fabric: 'PP + Leather Palm', paths: { front: 'M168 108 C128 120 116 170 122 224 L116 300 C118 328 138 348 166 348 L208 342 L220 254 L228 176 C228 134 208 100 168 108 Z M332 108 C372 120 384 170 378 224 L384 300 C382 328 362 348 334 348 L292 342 L280 254 L272 176 C272 134 292 100 332 108 Z', back: 'M168 108 C128 120 116 170 122 224 L116 300 C118 328 138 348 166 348 L208 342 L220 254 L228 176 C228 134 208 100 168 108 Z M332 108 C372 120 384 170 378 224 L384 300 C382 328 362 348 334 348 L292 342 L280 254 L272 176 C272 134 292 100 332 108 Z' } },
  { id: 'Cricket Cap', label: 'Cricket Cap', price: 399, fabric: 'Polyester', paths: { front: 'M250 106 C176 106 136 154 128 220 L128 248 L372 248 L372 220 C364 154 324 106 250 106 Z M128 248 C110 254 98 270 102 292 C110 322 152 334 250 334 C348 334 390 322 398 292 C402 270 390 254 372 248 Z', back: 'M250 106 C176 106 136 154 128 220 L128 300 L372 300 L372 220 C364 154 324 106 250 106 Z M128 300 L128 344 L372 344 L372 300 Z' } },
  { id: 'Batting Helmet', label: 'Batting Helmet', price: 1499, fabric: 'ABS + Steel Grill', paths: { front: 'M250 96 C170 96 130 148 122 226 L122 256 L378 256 L378 226 C370 148 330 96 250 96 Z M122 210 L96 300 C92 332 118 352 150 342 L170 316 L180 238 Z M378 210 L404 300 C408 332 382 352 350 342 L330 316 L320 238 Z', back: 'M250 96 C170 96 130 148 122 226 L118 320 C116 356 250 386 250 386 C250 386 384 356 382 320 L378 226 C370 148 330 96 250 96 Z' } },
  { id: 'Cricket Bat', label: 'Cricket Bat', price: 1999, fabric: 'Grade-A Willow', paths: { front: 'M250 502 C304 502 310 496 310 468 L310 300 C310 210 300 180 286 162 L292 98 C292 80 278 66 250 66 C222 66 208 80 208 98 L214 162 C200 180 190 210 190 300 L190 468 C190 496 196 502 250 502 Z', back: 'M250 502 C304 502 310 496 310 468 L310 300 C310 210 300 180 286 162 L292 98 C292 80 278 66 250 66 C222 66 208 80 208 98 L214 162 C200 180 190 210 190 300 L190 468 C190 496 196 502 250 502 Z' } },
]

export const shirtColors = [
  '#FFFFFF', '#0E4637', '#08251F', '#FF6B2C', '#C93C07', '#D9F044',
  '#1E3A8A', '#111827', '#E11D48', '#7C3AED', '#0EA5E9', '#F1F5F9', '#94A3B8',
]

const fonts = ['Arial', 'Verdana', 'Georgia', 'Impact', "'Courier New'", "'Times New Roman'", 'Trebuchet MS']

const palettes = ['#101828', '#FFFFFF', '#FF6B2C', '#D9F044', '#1E805F', '#E11D48', '#1E3A8A']

const templateId = '__template__'
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function Designer() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const storeRef = useRef({ front: [], back: [], price: garmentTypes[2].price, garment: garmentTypes[2] })
  const [view, setView] = useState('front')
  const viewRef = useRef('front')
  const [base, setBase] = useState('#0E4637')
  const baseRef = useRef('#0E4637')
  const [garment, setGarment] = useState(garmentTypes[2])
  const garmentRef = useRef(garmentTypes[2])
  const [font, setFont] = useState('Arial')
  const [fontSize, setFontSize] = useState(44)
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('L')
  const [saving, setSaving] = useState(false)
  const [added, setAdded] = useState(false)
  const [scale, setScale] = useState(1)
  const { add } = useCart()
  const fileRef = useRef(null)

  /* ---- render template + objects for a given view/base ---- */
  const renderScene = useCallback((objects, v, color) => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.clear()
    canvas.backgroundColor = '#EDF1F5'
    const path = new fabric.Path(garmentRef.current.paths[v] || garmentRef.current.paths.front, {
      left: 0, top: 0, width: 500, height: 500,
      fill: color,
      stroke: 'rgba(0,0,0,.18)',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectCaching: false,
    })
    const pb = path.getBoundingRect()
    path.set({ left: 250 - pb.width / 2, top: 250 - pb.height / 2 })
    path.name = templateId
    canvas.add(path)
    objects.forEach((o) => {
      if (o.type === 'text') {
        const t = new fabric.Text(o.text, {
          left: o.left, top: o.top, fontSize: o.fontSize,
          fill: o.fill, fontFamily: o.fontFamily,
          fontWeight: o.bold ? '800' : '400',
          angle: o.angle || 0, scaleX: o.scaleX || 1, scaleY: o.scaleY || 1,
          charSpacing: o.charSpacing || 0,
        })
        canvas.add(t)
      } else if (o.type === 'logo' && o.src) {
        fabric.Image.fromURL(
          o.src,
          (img) => {
            img.set({
              left: o.left, top: o.top,
              scaleX: o.scaleX, scaleY: o.scaleY,
              angle: o.angle || 0,
              flipX: o.flipX || false,
              flipY: o.flipY || false,
            })
            canvas.add(img)
            canvas.renderAll()
          },
          { crossOrigin: 'anonymous' },
        )
      }
    })
    canvas.renderAll()
  }, [])

  /* ---- collect objects for current view (excluding template) ---- */
  const collectObjects = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return []
    return canvas.getObjects().filter((o) => o.name !== templateId).map((o) => {
      if (o.type === 'text') {
        return {
          type: 'text', text: o.text, left: o.left, top: o.top, fontSize: o.fontSize,
          fill: o.fill, fontFamily: o.fontFamily, bold: o.fontWeight === '800',
          angle: o.angle, scaleX: o.scaleX, scaleY: o.scaleY, charSpacing: o.charSpacing,
        }
      }
      if (o.type === 'image') {
        return { type: 'logo', src: o.getSrc(), left: o.left, top: o.top, scaleX: o.scaleX, scaleY: o.scaleY, angle: o.angle, flipX: o.flipX, flipY: o.flipY }
      }
      return null
    }).filter(Boolean)
  }, [])

  /* ---- create canvas ---- */
  useEffect(() => {
    if (!containerRef.current || canvasRef.current) return
    const el = document.createElement('canvas')
    el.width = 500
    el.height = 500
    containerRef.current.appendChild(el)
    const canvas = new fabric.Canvas(el, {
      width: 500, height: 500, backgroundColor: '#EDF1F5',
      selection: false,
      preserveObjectStacking: true,
    })
    canvasRef.current = canvas
    renderScene([], 'front', baseRef.current)

    /* keep the fixed 500×500 canvas square and shrink it to fit narrow screens */
    const measure = () => {
      const w = containerRef.current?.getBoundingClientRect().width || 500
      setScale(Math.min(1, w / 500))
    }
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    measure()

    const host = containerRef.current
    return () => {
      ro?.disconnect()
      canvas.dispose()
      canvasRef.current = null
      if (host) host.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetCanvas = useCallback(() => {
    renderScene(storeRef.current[viewRef.current], viewRef.current, baseRef.current)
  }, [renderScene])

  /* ---- switch view ---- */
  const switchView = useCallback(
    (v) => {
      if (v === viewRef.current) return
      storeRef.current[viewRef.current] = collectObjects()
      viewRef.current = v
      setView(v)
      renderScene(storeRef.current[v], v, baseRef.current)
    },
    [collectObjects, renderScene],
  )

  /* ---- base colour change ---- */
  const changeBase = useCallback(
    (c) => {
      baseRef.current = c
      setBase(c)
      renderScene(storeRef.current[viewRef.current], viewRef.current, c)
    },
    [renderScene],
  )

  /* ---- garment change ---- */
  const changeGarment = useCallback(
    (g) => {
      garmentRef.current = g
      setGarment(g)
      storeRef.current.price = g.price
      setAdded(false)
      renderScene(storeRef.current[viewRef.current], viewRef.current, baseRef.current)
    },
    [renderScene],
  )

  /* ---- text ops ---- */
  const addText = useCallback(
    (text, top, fontSize, bold = false, charSpacing = 0) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const t = new fabric.Text(text, {
        left: 145, top,
        fontSize, fill: textColor,
        fontFamily: font,
        fontWeight: bold ? '800' : '400',
        charSpacing,
        cornerSize: 10,
      })
      canvas.add(t)
      canvas.setActiveObject(t)
      canvas.renderAll()
      setAdded(false)
    },
    [font, textColor],
  )

  const applySelectionStyle = useCallback(
    (key) => {
      const canvas = canvasRef.current
      const active = canvas?.getActiveObject()
      if (!active || active.type !== 'text') return
      if (key === 'font') active.set('fontFamily', font)
      if (key === 'size') active.set('fontSize', Number(fontSize))
      if (key === 'color') active.set('fill', textColor)
      canvas.renderAll()
    },
    [font, fontSize, textColor],
  )

  /* ---- upload logo ---- */
  const onLogo = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.')
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result
      fabric.Image.fromURL(
        src,
        (img) => {
          const max = 140
          const s = Math.min(max / img.width, 1)
          img.set({
            left: 250 - (img.width * s) / 2,
            top: 200 - (img.height * s) / 2,
            scaleX: s, scaleY: s,
            cornerSize: 12,
          })
          canvasRef.current?.add(img)
          canvasRef.current?.setActiveObject(img)
          canvasRef.current?.renderAll()
          setAdded(false)
          toast.success('Logo added — drag, resize and rotate it')
        },
        { crossOrigin: 'anonymous' },
      )
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  const deleteActive = useCallback(() => {
    const canvas = canvasRef.current
    const active = canvas?.getActiveObject()
    if (!active) return toast('Select a design element first')
    canvas.remove(active)
    canvas.discardActiveObject()
    canvas.renderAll()
    setAdded(false)
  }, [])

  /* ---- save + add to cart ---- */
  const saveAndAdd = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (canvas.getObjects().length === 1) return toast.error('Add a name, number or logo to your design first.')
    storeRef.current[viewRef.current] = collectObjects()
    setSaving(true)
    setTimeout(() => {
      try {
        const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1.2 })
        const g = garmentRef.current
        const design = {
          kind: 'custom',
          name: `${g.label} · ${size}`,
          price: g.price,
          qty,
          size,
          baseColor: baseRef.current,
          view: viewRef.current,
          design: { ...storeRef.current },
          preview: dataUrl,
        }
        add(undefined, { size, custom: design })
        setAdded(true)
      } catch (err) {
        toast.error('Could not save the design: ' + err.message)
      } finally {
        setSaving(false)
      }
    }, 300)
  }, [add, collectObjects, qty, size])

  useEffect(() => {
    storeRef.current.garment = garment
  }, [garment])

  useEffect(() => {
    const wrapper = canvasRef.current?.wrapperEl
    if (!wrapper) return
    // Imperative DOM sizing for the fabric canvas wrapper (third-party canvas).
    // eslint-disable-next-line react-hooks/immutability
    wrapper.style.transformOrigin = 'top left'
    wrapper.style.transform = `scale(${scale})`
  }, [scale])

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
      {/* Canvas + order panel */}
      <div>
        <div className="border border-ink/10 p-4 sm:p-5">
          {/* toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex border border-ink/15">
              {['front', 'back'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => switchView(v)}
                  className={`px-5 py-2.5 font-display text-[10px] uppercase tracking-[.14em] transition ${
                    view === v ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-mist'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline px-4 py-2.5 text-[10px]">
                <FaImage size={10} /> Upload logo
              </button>
              <button type="button" onClick={deleteActive} className="btn-outline px-4 py-2.5 text-[10px]">
                <FaTrash size={10} /> Delete
              </button>
              <button type="button" onClick={resetCanvas} className="btn-outline px-4 py-2.5 text-[10px]">
                Reset
              </button>
            </div>
          </div>

          {/* canvas */}
          <div className="relative overflow-hidden border border-ink/10 bg-mist">
            <div
              ref={containerRef}
              className="mx-auto w-full max-w-[500px] overflow-hidden"
              style={{ height: Math.round(500 * scale) }}
            />
            <p className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 bg-white/85 px-2.5 py-1 text-[9px] uppercase tracking-[.14em] text-muted backdrop-blur sm:flex">
              <FaArrowsAlt size={9} /> Drag to move · corners to resize
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => addText('YOUR NAME', 205, 34)} className="btn-primary py-3 text-[10px]">
              <FaFont size={10} /> Add name
            </button>
            <button type="button" onClick={() => addText('07', 300, 96)} className="btn-outline py-3 text-[10px]">
              <FaPlus size={10} /> Add number
            </button>
          </div>
        </div>

        {/* Configure */}
        <div className="mt-4 border border-ink/10 p-5 sm:p-6">
          <h3 className="font-display text-[11px] uppercase tracking-[.14em]">Configure & order</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="field-label">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s)
                      setAdded(false)
                    }}
                    className={`min-w-[2.5rem] border px-2.5 py-2 font-display text-[10px] uppercase tracking-wide transition ${
                      size === s ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink/70 hover:border-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="field-label">Quantity</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setQty(n)
                      setAdded(false)
                    }}
                    className={`h-10 w-10 border font-display text-[11px] transition ${
                      qty === n ? 'border-ink bg-ink text-white' : 'border-ink/20 text-ink/70 hover:border-ink'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <input
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                  aria-label="Custom quantity"
                  className="h-10 w-14 border border-ink/20 text-center text-sm focus:border-ink focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <p className="field-label">Unit price</p>
              <p className="font-display text-2xl leading-none">{inr(garment.price)}</p>
              <p className="mt-1.5 text-[11px] text-muted">
                {inr(garment.price * qty)} total · bulk pricing on 10+
              </p>
            </div>
          </div>

          <button type="button" onClick={saveAndAdd} disabled={saving || added} className="btn-primary mt-6 w-full py-4">
            {added ? 'Added to bag' : saving ? 'Saving design…' : `Add to bag — ${inr(garment.price * qty)}`}
          </button>
          {added && (
            <p className="mt-3 text-center text-[11px] uppercase tracking-[.14em] text-muted">
              <Link to="/cart" className="text-ink underline">
                View your bag
              </Link>{' '}
              or keep designing.
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="border border-ink/10 p-5">
          <h4 className="flex items-center gap-2 font-display text-[11px] uppercase tracking-[.14em]">
            <FaLayerGroup size={10} /> Garment
          </h4>
          <div className="mt-4 space-y-1.5">
            {garmentTypes.map((g) => (
              <label
                key={g.id}
                className={`flex cursor-pointer items-center gap-3 border p-3 transition ${
                  garment.id === g.id ? 'border-ink' : 'border-ink/10 hover:border-ink/30'
                }`}
              >
                <input
                  type="radio"
                  checked={garment.id === g.id}
                  onChange={() => changeGarment(g)}
                  className="h-3.5 w-3.5 accent-ink"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[10px] uppercase tracking-wide">{g.label}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-muted">{g.fabric}</span>
                </span>
                <span className="shrink-0 font-display text-[11px]">{inr(g.price)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border border-ink/10 p-5">
          <h4 className="font-display text-[11px] uppercase tracking-[.14em]">Base colour</h4>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {shirtColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => changeBase(c)}
                style={{ background: c }}
                className={`aspect-square border transition ${
                  base === c ? 'border-ink ring-1 ring-ink' : 'border-transparent hover:border-ink/30'
                } ${c === '#FFFFFF' || c === '#F1F5F9' ? 'border-ink/15' : ''}`}
                aria-label={`Colour ${c}`}
              />
            ))}
          </div>
          <label className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[.14em] text-muted">
            Custom colour
            <input
              type="color"
              value={base}
              onChange={(e) => changeBase(e.target.value)}
              className="ml-2 h-8 w-12 cursor-pointer border border-ink/15"
            />
          </label>
        </div>

        <div className="border border-ink/10 p-5">
          <h4 className="font-display text-[11px] uppercase tracking-[.14em]">Text style</h4>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="ds-font" className="field-label">Font</label>
              <select
                id="ds-font"
                value={font}
                onChange={(e) => {
                  setFont(e.target.value)
                  applySelectionStyle('font')
                }}
                className="field"
              >
                {fonts.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>
                    {f.replace(/'/g, '')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ds-size" className="field-label">
                Size — <span className="tabular-nums text-ink">{fontSize}px</span>
              </label>
              <input
                id="ds-size"
                type="range"
                min="14"
                max="140"
                value={fontSize}
                onChange={(e) => {
                  setFontSize(Number(e.target.value))
                  applySelectionStyle('size')
                }}
                className="w-full accent-ink"
              />
            </div>
            <div>
              <p className="field-label">Text colour</p>
              <div className="flex flex-wrap gap-2">
                {palettes.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setTextColor(c)
                      applySelectionStyle('color')
                    }}
                    style={{ background: c }}
                    className={`h-7 w-7 border ${
                      textColor === c ? 'border-ink ring-1 ring-ink' : 'border-transparent hover:border-ink/30'
                    } ${c === '#FFFFFF' ? 'border-ink/15' : ''}`}
                    aria-label={`Text colour ${c}`}
                  />
                ))}
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value)
                    applySelectionStyle('color')
                  }}
                  aria-label="Custom text colour"
                  className="h-7 w-9 cursor-pointer border border-ink/15"
                />
              </div>
            </div>
            <button type="button" onClick={() => addText('TEAM NAME', 130, 30)} className="btn-outline w-full py-2.5 text-[10px]">
              <FaPlus size={9} /> Add team name
            </button>
            <p className="text-[10px] leading-relaxed text-muted">
              Select any text on the shirt, then change font, size or colour — it updates live.
            </p>
          </div>
        </div>

        <Link to="/customize?tab=form" className="btn-link">
          Prefer a simple brief? Use the form <FaArrowRight size={9} />
        </Link>
      </div>
    </div>
  )
}

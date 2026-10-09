import { paintBlobMask, type BlobShape, type Rect } from './reveal-engine'

/** A word of the hero's background lettering and how it looks once the reveal passes over it. */
export interface RevealWord {
  /** The element carrying the word as `data-word` (rendered through CSS generated content). */
  el: HTMLElement
  fill?: string
  stroke?: { color: string; width: number }
}

const union = (a: Rect, b: Rect): Rect => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) })

/**
 * The hero lettering's revealed state, drawn through the SAME blob as Image 2.
 *
 * RevealEngine owns the pointer and the blob; this layer only receives the finished shape each frame
 * (RevealEngine.onShape) and draws it again in its own canvas. There is no second tracker and no second mask, so the
 * two can never disagree about where the reveal is or what shape it has.
 *
 * Each frame, inside the blob's bounds only: draw every word at the position measured from the real element (so it
 * is registered with the words underneath, parallax included), then keep just the part under the feathered blob.
 * Needs canvas letterSpacing and font metrics; without them the lettering simply has no revealed state.
 */
export class WordsReveal {
  private readonly ctx: CanvasRenderingContext2D
  private readonly mask = document.createElement('canvas')
  private readonly mctx: CanvasRenderingContext2D
  private dirty: Rect | null = null
  private dpr = 1
  private allocated = false
  private releaseTimer = 0

  static supported() {
    return typeof CanvasRenderingContext2D !== 'undefined' && 'letterSpacing' in CanvasRenderingContext2D.prototype && typeof TextMetrics !== 'undefined' && 'fontBoundingBoxAscent' in TextMetrics.prototype
  }

  private readonly canvas: HTMLCanvasElement
  private readonly words: () => RevealWord[]

  constructor(canvas: HTMLCanvasElement, words: () => RevealWord[]) {
    const ctx = canvas.getContext('2d', { alpha: true })
    const mctx = this.mask.getContext('2d', { alpha: true })
    if (!ctx || !mctx) throw new Error('2D canvas unavailable')
    this.canvas = canvas
    this.words = words
    this.ctx = ctx
    this.mctx = mctx
  }

  /**
   * @param shape  the engine's blob in stage coordinates, or null while the reveal is hidden
   * @param origin where those stage coordinates start, in client px (the stage's top-left corner)
   */
  paint(shape: BlobShape | null, origin: { x: number; y: number }) {
    if (!shape) {
      this.clear()
      if (this.allocated && !this.releaseTimer) this.releaseTimer = window.setTimeout(() => this.release(), 4000)
      return
    }
    window.clearTimeout(this.releaseTimer)
    this.releaseTimer = 0

    const box = this.canvas.getBoundingClientRect()
    if (!box.width || !box.height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = Math.round(box.width * dpr)
    const H = Math.round(box.height * dpr)
    if (!this.allocated || this.canvas.width !== W || this.canvas.height !== H) {
      this.canvas.width = W
      this.canvas.height = H
      this.allocated = true
      this.dirty = null
    }

    // stage origin in this canvas's css px
    const ox = origin.x - box.left
    const oy = origin.y - box.top
    const pad = shape.feather * 1.7
    const boxes: Rect[] = [
      ...shape.pts.map((p) => ({ x0: p.x + ox - pad, y0: p.y + oy - pad, x1: p.x + ox + pad, y1: p.y + oy + pad })),
      ...shape.drops.map((d) => {
        const r = d.r * 1.25 + pad
        return { x0: d.x + ox - r, y0: d.y + oy - r, x1: d.x + ox + r, y1: d.y + oy + r }
      }),
    ]
    const fresh = boxes.reduce(union)
    const merged = this.dirty ? union(this.dirty, fresh) : fresh
    this.dirty = fresh
    this.dpr = dpr

    // device-pixel rect, rounded outward and clamped to the canvas
    const dx = Math.max(0, Math.floor(merged.x0 * dpr))
    const dy = Math.max(0, Math.floor(merged.y0 * dpr))
    const dw = Math.min(W, Math.ceil(merged.x1 * dpr)) - dx
    const dh = Math.min(H, Math.ceil(merged.y1 * dpr)) - dy
    if (dw <= 0 || dh <= 0) return

    const { ctx } = this
    ctx.save()
    ctx.beginPath()
    ctx.rect(dx, dy, dw, dh)
    ctx.clip()
    ctx.clearRect(dx, dy, dw, dh)

    // 1. the words, in their revealed state, where the real words are right now
    this.drawWords(box, dpr, { x0: dx / dpr, y0: dy / dpr, x1: (dx + dw) / dpr, y1: (dy + dh) / dpr })

    // 2. the blob as a mask, on a small scratch canvas covering just this rect…
    const { mask, mctx } = this
    if (mask.width < dw || mask.height < dh) {
      mask.width = Math.max(mask.width, dw)
      mask.height = Math.max(mask.height, dh)
    }
    mctx.setTransform(1, 0, 0, 1, 0, 0)
    mctx.clearRect(0, 0, mask.width, mask.height)
    paintBlobMask(mctx, shape, dpr, mask.width, ox - dx / dpr, oy - dy / dpr)

    // 3. …and keep the words only where the blob has alpha
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask, 0, 0, dw, dh, dx, dy, dw, dh)
    ctx.restore()
  }

  private drawWords(box: DOMRect, dpr: number, view: Rect) {
    const { ctx } = this
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    for (const w of this.words()) {
      const el = w.el
      if (el.hidden) continue
      const cs = getComputedStyle(el)
      if (cs.display === 'none') continue
      const r = el.getBoundingClientRect()
      const x = r.left - box.left
      const top = r.top - box.top
      if (x > view.x1 || x + r.width < view.x0 || top > view.y1 || top + r.height < view.y0) continue
      const text = el.dataset.word ?? ''
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing
      // CSS centres the font's ascent+descent in the line box; the baseline follows from that
      const m = ctx.measureText(text)
      const base = top + (r.height - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent
      if (w.fill) {
        ctx.fillStyle = w.fill
        ctx.fillText(text, x, base)
      }
      if (w.stroke) {
        ctx.strokeStyle = w.stroke.color
        ctx.lineWidth = w.stroke.width
        ctx.lineJoin = 'round'
        ctx.strokeText(text, x, base)
      }
    }
  }

  private clear() {
    const d = this.dirty
    this.dirty = null
    if (!d || !this.allocated) return
    const x = Math.max(0, Math.floor(d.x0 * this.dpr))
    const y = Math.max(0, Math.floor(d.y0 * this.dpr))
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(x, y, Math.ceil(d.x1 * this.dpr) - x, Math.ceil(d.y1 * this.dpr) - y)
  }

  /** Give the backing stores back while the reveal is idle (the canvas spans the whole hero). */
  private release() {
    this.releaseTimer = 0
    this.canvas.width = 1
    this.canvas.height = 1
    this.mask.width = 1
    this.mask.height = 1
    this.allocated = false
    this.dirty = null
  }

  destroy() {
    window.clearTimeout(this.releaseTimer)
    this.release()
  }
}

/**
 * RevealEngine — the organic cursor reveal.
 *
 * Image 1 (clean) is a normal <img> that is never touched. Image 2 (AI) lives only as pixels on a
 * <canvas> that sits exactly on top of it, drawn through a blob-shaped mask. Both use the same
 * object-fit: cover math, so they stay aligned at every size; ONLY the mask moves and deforms.
 *
 * The mask is a closed Catmull-Rom spline through N control points whose radii wobble on
 * independent sine pairs, so the perimeter is asymmetric and continuously morphing. The centre
 * follows the pointer through a lagging low-pass (inertia); movement speed stretches the blob along
 * its direction of travel and spawns two small trailing droplets. Edges are feathered with
 * shadowBlur (works in every browser; ctx.filter does not in Safari).
 *
 * Each frame repaints only the union of the previous and next blob bounds (dirty rect) and the
 * loop stops entirely once the reveal has shrunk away, so an idle page costs nothing.
 */

interface Vec {
  x: number
  y: number
}
interface Rect {
  x0: number
  y0: number
  x1: number
  y1: number
}

const TAU = Math.PI * 2
const N = 10

/** Small deterministic generator so the blob's character is identical on every load. */
function mulberry(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface RevealOptions {
  reducedMotion?: boolean
}

export class RevealEngine {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly reduced: boolean

  private dpr = 1
  private w = 0
  private h = 0
  private img: HTMLImageElement | ImageBitmap | null = null
  private focal: Vec = { x: 0.5, y: 0.5 }

  // pointer / body state (css px)
  private pos: Vec = { x: 0, y: 0 }
  private target: Vec = { x: 0, y: 0 }
  private vel: Vec = { x: 0, y: 0 }
  private hist: { t: number; x: number; y: number }[] = []

  // size spring (0 = hidden, 1 = full)
  private k = 0
  private kv = 0
  private kTarget = 0

  private t = 0
  private last = 0
  private raf = 0
  private leaveTimer = 0
  private touch = false
  private dirty: Rect | null = null
  private baseR = 165
  private feather = 34
  private scale = 1

  private autoUntil = 0
  private autoStart = 0
  private autoCentre: Vec = { x: 0, y: 0 }
  private autoRadius: Vec = { x: 0, y: 0 }

  // per-point character (fixed per instance → asymmetric, organic)
  private readonly aj: number[] = []
  private readonly rf: number[] = []
  private readonly w1: number[] = []
  private readonly w2: number[] = []
  private readonly p1: number[] = []
  private readonly p2: number[] = []

  constructor(canvas: HTMLCanvasElement, opts: RevealOptions = {}) {
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) throw new Error('2D canvas unavailable')
    this.canvas = canvas
    this.ctx = ctx
    this.reduced = !!opts.reducedMotion

    const r = mulberry(0x4b414e4e)
    for (let i = 0; i < N; i++) {
      this.aj.push((r() - 0.5) * 0.55 * (TAU / N))
      this.rf.push(0.8 + r() * 0.36)
      this.w1.push(0.0007 + r() * 0.0009)
      this.w2.push(0.0012 + r() * 0.0014)
      this.p1.push(r() * TAU)
      this.p2.push(r() * TAU)
    }
  }

  /** Provide the AI image (decoded). */
  setImage(img: HTMLImageElement | ImageBitmap) {
    this.img = img
    this.dirty = null
    this.ensureLoop()
  }

  /** The clean <img>'s object-position (0–1) — the canvas must use the very same offset. */
  setFocal(x: number, y: number) {
    this.focal = { x, y }
    this.dirty = null
  }

  /** Relative blob size (1 = hero scale). */
  setScale(k: number) {
    this.scale = k
  }

  /** Recompute backing-store size. Call from a ResizeObserver. */
  resize(cssW: number, cssH: number, dpr: number) {
    this.w = cssW
    this.h = cssH
    this.dpr = dpr
    this.canvas.width = Math.max(1, Math.round(cssW * dpr))
    this.canvas.height = Math.max(1, Math.round(cssH * dpr))
    this.dirty = null
    // ~260–380px overall blob, scaled gently with the stage
    this.baseR = Math.min(190, Math.max(130, cssW * 0.13)) * this.scale
    this.feather = Math.max(14, Math.min(40, this.baseR * 0.21))
    if (this.k > 0) this.ensureLoop()
  }

  enter(x: number, y: number, touch = false) {
    window.clearTimeout(this.leaveTimer)
    this.touch = touch
    this.pos = { x, y }
    this.target = { x, y }
    this.vel = { x: 0, y: 0 }
    this.hist = []
    this.kTarget = 1
    this.ensureLoop()
  }

  move(x: number, y: number) {
    if (this.kTarget === 0) {
      this.enter(x, y, this.touch)
      return
    }
    this.target = { x, y }
  }

  /** Hide the reveal. Touch releases linger briefly so a tap still registers visually. */
  leave(holdMs = 0) {
    window.clearTimeout(this.leaveTimer)
    if (holdMs > 0) this.leaveTimer = window.setTimeout(() => (this.kTarget = 0), holdMs)
    else this.kTarget = 0
  }

  /** Scripted pass across the stage — the keyboard / no-pointer way to see the reveal. */
  autoplay(centre: Vec, radius: Vec, ms = 3200) {
    this.autoCentre = centre
    this.autoRadius = radius
    this.autoStart = performance.now()
    this.autoUntil = this.autoStart + ms
    this.enter(centre.x - radius.x, centre.y, false)
  }

  destroy() {
    window.clearTimeout(this.leaveTimer)
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.clearAll()
  }

  /** True while the reveal has any visible presence. */
  get active() {
    return this.k > 0.002 || this.kTarget > 0
  }

  // ----------------------------------------------------------------------------------------
  private ensureLoop() {
    if (this.raf || !this.img || !this.w) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    this.raf = 0
    const dt = Math.min(48, Math.max(1, now - this.last))
    this.last = now
    this.t += dt

    if (this.autoUntil) {
      if (now < this.autoUntil) {
        const p = (now - this.autoStart) / (this.autoUntil - this.autoStart)
        this.target = {
          x: this.autoCentre.x + Math.sin(p * TAU * 0.9 - 1.2) * this.autoRadius.x,
          y: this.autoCentre.y + Math.sin(p * TAU * 1.8) * this.autoRadius.y,
        }
      } else {
        this.autoUntil = 0
        this.kTarget = 0
      }
    }

    // inertia: centre eases toward the pointer through a lagging low-pass
    const tau = this.reduced ? 40 : this.touch ? 70 : 92
    const a = 1 - Math.exp(-dt / tau)
    const px = this.pos.x
    const py = this.pos.y
    let mx = (this.target.x - this.pos.x) * a
    let my = (this.target.y - this.pos.y) * a
    // top speed (~4.5px/ms): a pointer that teleports across the hero still reads as a quick glide
    const cap = 4.5 * dt
    const len = Math.hypot(mx, my)
    if (len > cap) {
      mx *= cap / len
      my *= cap / len
    }
    this.pos.x += mx
    this.pos.y += my
    const b = 1 - Math.exp(-dt / 120)
    this.vel.x += ((this.pos.x - px) / dt - this.vel.x) * b
    this.vel.y += ((this.pos.y - py) / dt - this.vel.y) * b
    this.hist.push({ t: now, x: this.pos.x, y: this.pos.y })
    while (this.hist.length > 2 && now - this.hist[0].t > 320) this.hist.shift()

    // size spring: slightly under-damped on the way in (liquid pop), critically damped on the way out
    const sec = dt / 1000
    const omega = this.kTarget ? 15 : 13
    const zeta = this.kTarget ? 0.55 : 1
    this.kv += (omega * omega * (this.kTarget - this.k) - 2 * zeta * omega * this.kv) * sec
    this.k = Math.max(0, this.k + this.kv * sec)

    this.paint(now)

    const idle = this.kTarget === 0 && this.k < 0.002 && Math.abs(this.kv) < 0.02
    if (idle) {
      this.k = 0
      this.kv = 0
      this.clearAll()
      return
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  private blobPoints(cx: number, cy: number, R: number, speed: number, ang: number): Vec[] {
    const st = this.reduced ? 0 : Math.min(0.5, speed * 0.34)
    const wob = this.reduced ? 0 : 1
    const pts: Vec[] = []
    for (let i = 0; i < N; i++) {
      const th = (i * TAU) / N + this.aj[i]
      const w =
        wob * (0.12 * Math.sin(this.t * this.w1[i] + this.p1[i]) + 0.075 * Math.sin(this.t * this.w2[i] + this.p2[i]))
      let r = R * this.rf[i] * (1 + w)
      const along = Math.cos(th - ang)
      // stretch along the direction of travel, pinch across it
      r *= 1 + st * along * 0.95 - st * 0.38 * (1 - Math.abs(along))
      pts.push({ x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r })
    }
    return pts
  }

  private tracePath(ctx: CanvasRenderingContext2D, pts: Vec[]) {
    const n = pts.length
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n]
      const p1 = pts[i]
      const p2 = pts[(i + 1) % n]
      const p3 = pts[(i + 2) % n]
      const c = 5.2
      ctx.bezierCurveTo(
        p1.x + (p2.x - p0.x) / c,
        p1.y + (p2.y - p0.y) / c,
        p2.x - (p3.x - p1.x) / c,
        p2.y - (p3.y - p1.y) / c,
        p2.x,
        p2.y,
      )
    }
    ctx.closePath()
  }

  private histAt(now: number, delay: number): Vec {
    const want = now - delay
    for (let i = this.hist.length - 1; i >= 0; i--) if (this.hist[i].t <= want) return this.hist[i]
    return this.hist[0] ?? this.pos
  }

  private paint(now: number) {
    const img = this.img
    if (!img || !this.w) return
    const { ctx, dpr } = this
    const iw = (img as HTMLImageElement).naturalWidth || (img as ImageBitmap).width
    const ih = (img as HTMLImageElement).naturalHeight || (img as ImageBitmap).height
    if (!iw || !ih) return

    const k = this.k
    const speed = Math.hypot(this.vel.x, this.vel.y) // px per ms
    const ang = Math.atan2(this.vel.y, this.vel.x)
    const R = this.baseR * (this.touch ? 1.1 : 1) * k

    const pts = k > 0.002 ? this.blobPoints(this.pos.x, this.pos.y, R, speed, ang) : []
    const drops: { x: number; y: number; r: number }[] = []
    if (k > 0.05 && !this.reduced) {
      const f = Math.min(1, speed * 1.5)
      if (f > 0.04) {
        const d1 = this.histAt(now, 105)
        const d2 = this.histAt(now, 205)
        drops.push({ x: d1.x, y: d1.y, r: R * 0.3 * f }, { x: d2.x, y: d2.y, r: R * 0.17 * f })
      }
    }

    // bounds of the new shape
    const pad = this.feather * 1.7
    const boxes: Rect[] = [
      ...pts.map((p) => ({ x0: p.x - pad, y0: p.y - pad, x1: p.x + pad, y1: p.y + pad })),
      ...drops.map((d) => ({ x0: d.x - d.r - pad, y0: d.y - d.r - pad, x1: d.x + d.r + pad, y1: d.y + d.r + pad })),
    ]
    const nb = boxes.reduce<Rect | null>((acc, r) => this.union(acc, r), null)

    const merged = this.union(this.dirty, nb)
    if (!merged) return
    this.dirty = nb

    // device-pixel dirty rect, rounded outward and clamped
    const W = this.canvas.width
    const H = this.canvas.height
    const dx = Math.max(0, Math.floor(merged.x0 * dpr))
    const dy = Math.max(0, Math.floor(merged.y0 * dpr))
    const dx1 = Math.min(W, Math.ceil(merged.x1 * dpr))
    const dy1 = Math.min(H, Math.ceil(merged.y1 * dpr))
    const dw = dx1 - dx
    const dh = dy1 - dy
    if (dw <= 0 || dh <= 0) return

    ctx.save()
    ctx.beginPath()
    ctx.rect(dx, dy, dw, dh)
    ctx.clip()
    ctx.clearRect(dx, dy, dw, dh)

    if (pts.length) {
      // Draw the shape far off-canvas and let only its blurred shadow land inside the clip:
      // a soft-edged mask with no ctx.filter.
      const OFF = W + 4000
      ctx.setTransform(dpr, 0, 0, dpr, -OFF, 0)
      ctx.shadowColor = '#000'
      ctx.shadowBlur = this.feather * dpr
      ctx.shadowOffsetX = OFF
      ctx.shadowOffsetY = 0
      ctx.fillStyle = '#000'
      this.tracePath(ctx, pts)
      ctx.fill()
      for (const d of drops) {
        ctx.beginPath()
        ctx.ellipse(d.x, d.y, d.r * 1.25, d.r * 0.9, ang, 0, TAU)
        ctx.fill()
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0

      // keep only the AI image where the mask has alpha — same cover math as <img object-fit: cover>
      const s = Math.max(this.w / iw, this.h / ih)
      const ox = (this.w - iw * s) * this.focal.x
      const oy = (this.h - ih * s) * this.focal.y
      const cx0 = dx / dpr
      const cy0 = dy / dpr
      const cw = dw / dpr
      const ch = dh / dpr
      const sx = (cx0 - ox) / s
      const sy = (cy0 - oy) / s
      const sw = cw / s
      const sh = ch / s
      ctx.globalCompositeOperation = 'source-in'
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
    }
    ctx.restore()
  }

  private union(a: Rect | null, b: Rect | null): Rect | null {
    if (!a) return b
    if (!b) return a
    return { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) }
  }

  private clearAll() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.dirty = null
  }
}

// Abstract fashion mannequin shared by several scenes (head + neck + torso as one surface of
// revolution, optional legs / arms / base). All proportions are in 1/1000ths of total figure height
// so any scene can place a figure at any size.
import { E, sorMesh, tubeMesh, pchip } from './_shared.mjs'

// profile keys: [unit y, half-width]  (0 = crown, 1000 = floor)
const KA = [
  [0, 0], [5, 20], [18, 38], [40, 48], [62, 51], [85, 47], [105, 39], [120, 29], [130, 22],
  [140, 19], [160, 20], [178, 24], [190, 30],
  [198, 54], [206, 82], [214, 103], [224, 115], [238, 120], [250, 115], [262, 106], [282, 98],
  [300, 95], [330, 87], [360, 79], [385, 75], [420, 86], [455, 99], [480, 105], [510, 106], [545, 103],
]
const KB = [
  [0, 0], [5, 22], [18, 42], [40, 54], [62, 57], [85, 52], [105, 43], [120, 32], [130, 24],
  [140, 20], [160, 21], [178, 24], [190, 26],
  [200, 40], [215, 50], [235, 54], [260, 58], [290, 66], [330, 58], [385, 50], [430, 56], [480, 62],
  [510, 62], [545, 58],
]

/**
 * @param {{cx:number, top:number, h:number, tilt?:number, rows?:number, cols?:number, lean?:number}} o
 */
export function mannequin(o) {
  const { cx, top, h, tilt = 0.2, rows = 80, cols = 64, lean = 0 } = o
  const k = h / 1000
  const Y = (u) => top + u * k
  const uOf = (y) => (y - top) / k
  const Au = pchip(KA)
  const Bu = pchip(KB)
  const A = (y) => Au(uOf(y)) * k
  const B = (y) => Bu(uOf(y)) * k
  const cxf = (y) => cx + lean * Math.sin(((uOf(y) - 100) / 900) * Math.PI)
  const body = sorMesh({ y0: top, y1: Y(545), A, B, cx: cxf, tilt, rows, cols })

  // legs (two tapered columns) and base
  const LA = pchip([[520, 56], [600, 50], [690, 39], [760, 36], [820, 38], [880, 29], [945, 17], [962, 16]])
  const LB = pchip([[520, 54], [600, 49], [690, 40], [760, 38], [820, 40], [880, 30], [945, 17], [962, 17]])
  const legOff = 28 * k
  const legs = [-1, 1].map((s) =>
    sorMesh({
      y0: Y(520),
      y1: Y(962),
      A: (y) => LA(uOf(y)) * k,
      B: (y) => LB(uOf(y)) * k,
      cx: (y) => cx + s * legOff * (1 - 0.35 * Math.max(0, (uOf(y) - 700) / 262)),
      tilt,
      rows: 48,
      cols: 28,
    }),
  )

  // arms: tube along a gentle curve from shoulder to wrist
  const arm = (s) =>
    tubeMesh(
      (t) => {
        const y = Y(222 + t * 330)
        const x = cx + s * (122 + 24 * Math.sin(t * Math.PI * 0.9) + 8 * t) * k
        return [x, y, 0]
      },
      (t) => k * (31 - 15 * t - 6 * Math.sin(t * Math.PI) + 3 * Math.exp(-Math.pow((t - 0.96) / 0.07, 2))),
      { rows: 40, cols: 14, phi0: -Math.PI / 2, phi1: Math.PI / 2, tilt },
    )

  return { cx, top, h, k, Y, uOf, A, B, cxf, body, legs, arms: [arm(-1), arm(1)], tilt, floorY: Y(962) }
}

export const MANNEQUIN_MAT = { ...E.MATERIALS.form }

/** Tailor's dress form: domed neck cap, torso to the hips, centre pole and round base. */
export function dressForm(o) {
  const { cx, top, h, tilt = 0.2, rows = 70, cols = 60, ws = 1 } = o
  const k = h / 1000
  const Y = (u) => top + u * k
  const uOf = (y) => (y - top) / k
  const keysA = [[138, 0], [141, 11], [146, 17], [152, 19.5], ...KA.filter((p) => p[0] >= 160)]
  const keysB = [[138, 0], [141, 11], [146, 17], [152, 20], ...KB.filter((p) => p[0] >= 160)]
  const Au = pchip(keysA)
  const Bu = pchip(keysB)
  const A = (y) => Au(uOf(y)) * k * ws
  const B = (y) => Bu(uOf(y)) * k * (0.5 + 0.5 * ws)
  const body = sorMesh({ y0: Y(138), y1: Y(545), A, B, cx: () => cx, tilt, rows, cols })
  return { cx, top, h, k, Y, uOf, A, B, body, tilt, floorY: Y(962), cxf: () => cx }
}

export const DUR = { fast: 0.2, normal: 0.4, slow: 0.6, dramatic: 1.0 } as const
export const EASE = { out: [0.23, 1, 0.32, 1] as const }
export const rise = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }
export const fade = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
export const t = (d: number = DUR.slow, delay: number = 0) => ({ duration: d, ease: EASE.out, delay })

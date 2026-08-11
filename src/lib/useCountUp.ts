import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const DURATION = 1100 // ms — matches the mockup's count-up timing

// Animates 0 → `to` with a cubic ease-out once `active` flips true.
// Supports 1-decimal targets (94.8) and integers (150, 8); the caller formats.
// Reduced motion: returns the final value immediately, no rAF loop.
export function useCountUp(to: number, active: boolean): number {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? to : 0)
  const started = useRef(false)

  useEffect(() => {
    if (!active) return
    if (reduced) {
      setValue(to)
      return
    }
    if (started.current) return
    started.current = true

    let raf = 0
    let t0: number | null = null
    const step = (ts: number) => {
      if (t0 === null) t0 = ts
      const p = Math.min((ts - t0) / DURATION, 1)
      const eased = 1 - Math.pow(1 - p, 3) // cubic ease-out
      if (p < 1) {
        setValue(to * eased)
        raf = requestAnimationFrame(step)
      } else {
        setValue(to) // land exactly on target
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, reduced, to])

  return value
}

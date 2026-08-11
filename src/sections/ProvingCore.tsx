import { motion, useReducedMotion } from 'framer-motion'

/**
 * ProvingCore — the chrome "proving" orb.
 * SVG ported verbatim from the approved hero mockup (hero-petrol-full.html).
 * Slow vertical float via framer-motion; static when prefers-reduced-motion.
 * TODO(Task 8): swap this SVG for a real 3D render + <img> poster (fetchpriority=high).
 */
export function ProvingCore() {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="aspect-square w-[clamp(200px,48vw,400px)] max-w-full"
      animate={reduced ? undefined : { y: [-10, 10, -10] }}
      transition={reduced ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor="#5ab0e6" stopOpacity=".55" />
            <stop offset="60%" stopColor="#2a6d99" stopOpacity=".18" />
            <stop offset="100%" stopColor="#0d2130" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="metal" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="16%" stopColor="#d6ecfa" />
            <stop offset="42%" stopColor="#7fb8de" />
            <stop offset="70%" stopColor="#2f6c93" />
            <stop offset="100%" stopColor="#0f3047" />
          </radialGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bfe6fb" stopOpacity=".9" />
            <stop offset="45%" stopColor="#bfe6fb" stopOpacity="0" />
            <stop offset="100%" stopColor="#9fd8f5" stopOpacity=".5" />
          </linearGradient>
          <radialGradient id="irid" cx="64%" cy="70%" r="40%">
            <stop offset="0%" stopColor="#b98cff" stopOpacity=".55" />
            <stop offset="100%" stopColor="#b98cff" stopOpacity="0" />
          </radialGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <circle cx="200" cy="200" r="196" fill="url(#glow)" />
        <circle cx="200" cy="200" r="130" fill="url(#metal)" />
        <circle cx="200" cy="200" r="130" fill="url(#irid)" style={{ mixBlendMode: 'screen' }} />
        <circle cx="200" cy="200" r="130" fill="none" stroke="url(#rim)" strokeWidth="2.5" />
        <ellipse cx="158" cy="150" rx="46" ry="30" fill="#ffffff" opacity=".85" filter="url(#soft)" />
        <ellipse cx="245" cy="262" rx="60" ry="26" fill="#0a1c2b" opacity=".45" filter="url(#soft)" />
      </svg>
    </motion.div>
  )
}

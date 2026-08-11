import { motion, useReducedMotion } from 'framer-motion'
import { Glass } from '../components/Glass'
import { Pill } from '../components/Pill'
import { Label } from '../components/Label'
import { IndexRail } from '../components/IndexRail'
import { rise, fade, t, DUR } from '../lib/motion'
import { overall } from '../lib/score'
import { evalSuite } from '../lib/data'

// Book-ends the case: returns to the same petrol-chrome radial ground as Hero,
// top-lit so the "Ship with proof." headline sits in the light.
const OUTRO_BG = 'radial-gradient(120% 100% at 50% 8%, #163449 0%, #0d2130 44%, #081019 100%)'

// Design-system peek — the real tokens this case is built on.
const SWATCHES: { hex: string; name: string }[] = [
  { hex: '#0a1620', name: 'ground-0' },
  { hex: '#0f2230', name: 'ground-1' },
  { hex: '#123246', name: 'ground-2' },
  { hex: '#5ab0e6', name: 'azure' },
  { hex: '#9fd8f5', name: 'bright' },
  { hex: '#eef6fb', name: 'ink' },
  { hex: '#7ee6a8', name: 'pos' },
]

const SIGNATURE_LINKS: { label: string; href: string }[] = [
  { label: 'Portfolio', href: 'https://vitaniko91-lang.github.io' },
  { label: 'GitHub', href: 'https://github.com/vitaniko91-lang' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vitalina-nikulina-0a3088215' },
]

// Shared focus-visible ring so keyboard users get a clear, premium indicator
// on every link (native outline is left intact — never removed).
const FOCUS = 'rounded-[6px] focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

export function Outro() {
  const reduced = useReducedMotion()

  // whileInView entrance (this section is below the fold); reduced motion
  // renders the final state instantly with no offsets. transform/opacity only.
  const enter = (variants: typeof rise | typeof fade, delay = 0, dur: number = DUR.slow) =>
    reduced
      ? { variants, initial: false as const, animate: 'visible' as const }
      : {
          variants,
          initial: 'hidden' as const,
          whileInView: 'visible' as const,
          viewport: { once: true, margin: '-60px' },
          transition: t(dur, delay),
        }

  // Pass rate is computed from the eval suite — the mono specimen shows a real number.
  const passRate = overall(evalSuite.criteria.map((c) => c.v2)) // 94.8

  return (
    <section className="relative w-full overflow-hidden" style={{ background: OUTRO_BG }}>
      {/* ghost watermark — echoes Hero's "CRUCIBLE", closes the frame with "SHIP" */}
      <motion.div
        {...enter(fade, 0.1, DUR.dramatic)}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-90px] left-1/2 z-0 hidden -translate-x-1/2 select-none whitespace-nowrap text-[300px] font-bold leading-none tracking-[-10px] text-white/[.03] md:block"
      >
        SHIP
      </motion.div>

      {/* Ship index — 04, closing the rail that opened at 01 Forge in the Hero */}
      <div className="pointer-events-none absolute right-12 top-[92px] z-[4] hidden xl:block">
        <motion.div {...enter(fade, 0.2, DUR.slow)}>
          <IndexRail active={3} />
        </motion.div>
      </div>

      <div className="relative z-[2] mx-auto max-w-[1440px] px-5 py-20 md:px-12 md:py-[120px]">
        <div className="max-w-[1180px]">
          {/* headline block */}
          <motion.div
            {...enter(rise, 0)}
            className="flex items-center gap-2.5 text-[12px] tracking-[2px] text-azure-bright"
          >
            <span className="h-px w-[34px]" style={{ background: '#5ab0e6' }} />
            <span className="font-mono">[ SHIP · 04 ]</span>
          </motion.div>

          <motion.h2
            {...enter(rise, 0.08)}
            className="mt-5 text-[clamp(40px,9vw,64px)] font-bold leading-[1.02] tracking-[-2.5px]"
          >
            Ship with proof.
          </motion.h2>

          <motion.p
            {...enter(rise, 0.16)}
            className="mt-5 max-w-[520px] text-[17px] leading-[1.55]"
            style={{ color: 'var(--mut)' }}
          >
            Crucible proves the agent at design-time.{' '}
            <span className="text-ink">Relay watches it in production.</span>
          </motion.p>

          {/* handoff + design-system peek */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr]">
            {/* → Relay handoff card */}
            <motion.div {...enter(rise, 0.24)}>
              <Glass className="flex h-full flex-col gap-5 p-7">
                <div className="flex items-center justify-between">
                  <Label>Runtime · production</Label>
                  <span className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: 'var(--mut)' }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-pos" />
                    live
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[20px]" style={{ color: 'var(--mut)' }}>
                      →
                    </span>
                    <h3 className="text-[32px] font-bold tracking-[-1px] text-ink">Relay</h3>
                  </div>
                  <p className="mt-1.5 text-[15px]" style={{ color: 'var(--mut)' }}>
                    fleet health, run traces, live latency
                  </p>
                </div>

                <a
                  href="https://relay-obs.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto inline-flex w-fit items-center gap-2 px-6 py-3 text-[14px] font-semibold text-[#08131c] transition-transform hover:-translate-y-0.5 ${FOCUS}`}
                  style={{
                    background: 'linear-gradient(135deg,#dff2ff,#b7e2fb)',
                    borderRadius: '26px',
                    boxShadow: '0 10px 30px rgba(90,176,230,.28)',
                  }}
                >
                  Open Relay ↗
                </a>
              </Glass>
            </motion.div>

            {/* design-system peek */}
            <motion.div {...enter(rise, 0.32)}>
              <Glass className="flex h-full flex-col gap-6 p-7">
                <div className="flex items-center justify-between">
                  <Label>Design system</Label>
                  <span className="font-mono text-[11px]" style={{ color: 'var(--mut2)' }}>
                    Petrol · Chrome
                  </span>
                </div>

                {/* palette swatches */}
                <div className="flex flex-wrap gap-3">
                  {SWATCHES.map((s) => (
                    <div key={s.name} className="flex flex-col items-center gap-1.5">
                      <span
                        className="h-9 w-9 rounded-[9px] border"
                        style={{ background: s.hex, borderColor: 'var(--brd)' }}
                      />
                      <span className="font-mono text-[9.5px] tracking-tight" style={{ color: 'var(--mut2)' }}>
                        {s.hex}
                      </span>
                    </div>
                  ))}
                </div>

                {/* type specimen */}
                <div
                  className="flex items-end justify-between gap-4 border-t pt-5"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div>
                    <div className="text-[26px] font-bold tracking-[-1px] text-ink">Space Grotesk</div>
                    <div className="font-mono text-[13px]" style={{ color: 'var(--mut)' }}>
                      Space Mono · {passRate}%
                    </div>
                  </div>
                </div>

                {/* reused component instances — the shared component language */}
                <div className="flex flex-col gap-2 border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Pill primary>Ship</Pill>
                    <Pill>v2 holds</Pill>
                  </div>
                  <span className="font-mono text-[10.5px]" style={{ color: 'var(--mut2)' }}>
                    Pill · reused from Build &amp; Evals
                  </span>
                </div>
              </Glass>
            </motion.div>
          </div>

          {/* signature footer */}
          <motion.footer
            {...enter(fade, 0.4)}
            className="mt-16 flex flex-col gap-5 border-t pt-8 md:flex-row md:items-end md:justify-between"
            style={{ borderColor: 'var(--line)' }}
          >
            <div>
              <p className="text-[15px] text-ink">
                Designed &amp; built by <span className="font-semibold">Vitalina Nikulina</span>
              </p>
              <p className="mt-2 font-mono text-[11px] tracking-wide" style={{ color: 'var(--mut2)' }}>
                Crucible · 2026 · React · TypeScript · Tailwind · Framer Motion
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-6 text-[13px]">
              {SIGNATURE_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-0.5 py-1 transition-colors hover:text-ink ${FOCUS}`}
                  style={{ color: 'var(--mut)' }}
                >
                  {l.label} ↗
                </a>
              ))}
            </nav>
          </motion.footer>
        </div>
      </div>
    </section>
  )
}

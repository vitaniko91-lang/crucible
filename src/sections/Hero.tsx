import { motion, useReducedMotion } from 'framer-motion'
import { Glass } from '../components/Glass'
import { IndexRail } from '../components/IndexRail'
import { ProvingCore } from './ProvingCore'
import { rise, fade, t } from '../lib/motion'
import { overall } from '../lib/score'
import { evalSuite } from '../lib/data'

const BG = 'radial-gradient(120% 100% at 72% 30%, #17384c 0%, #0d2130 42%, #081019 100%)'
const NAV_LINKS = ['Build', 'Evals', 'Docs', 'Changelog']

export function Hero() {
  const reduced = useReducedMotion()

  // Entrance helpers — reduced motion skips offsets and renders the final state.
  const enter = (delay: number, dur = 0.7) => ({
    variants: rise,
    initial: reduced ? false : 'hidden',
    animate: 'visible' as const,
    transition: t(dur, delay),
  })
  const enterFade = (delay: number, dur = 0.9) => ({
    variants: fade,
    initial: reduced ? false : 'hidden',
    animate: 'visible' as const,
    transition: t(dur, delay),
  })

  // Numbers derived from the eval suite — never hardcoded.
  const passRate = overall(evalSuite.criteria.map((c) => c.v2)) // 94.8
  const deltaVal =
    Math.round(
      (overall(evalSuite.criteria.map((c) => c.v2)) - overall(evalSuite.criteria.map((c) => c.v1))) *
        10,
    ) / 10 // 11.8 — matches the Evals headline delta
  const passed = evalSuite.cases - evalSuite.flagged // 142

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ background: BG }}>
      <div className="relative mx-auto max-w-[1440px] px-5 py-8 lg:h-screen lg:px-12 lg:py-[26px]">
        {/* ghost watermark — dropped below lg (only fits the 2-col desktop layout) */}
        <motion.div
          {...enterFade(0.25, 1.3)}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-70px] left-[-10px] z-0 hidden select-none whitespace-nowrap text-[280px] font-bold leading-none tracking-[-8px] text-white/[.035] lg:block"
        >
          CRUCIBLE
        </motion.div>

        {/* nav */}
        <motion.header {...enterFade(0, 0.7)} className="relative z-[5]">
          <nav aria-label="Primary" className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2.5 text-[16px] font-bold tracking-[.5px] text-ink">
              <span
                className="h-3 w-3 rounded-[3px]"
                style={{
                  background: 'linear-gradient(135deg,#9fd8f5,#5ab0e6)',
                  boxShadow: '0 0 14px rgba(90,176,230,.7)',
                }}
              />
              Crucible
            </a>
            <ul className="hidden gap-[30px] text-[13px] sm:flex" style={{ color: 'var(--mut)' }}>
              {NAV_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="transition-colors hover:text-ink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="rounded-[22px] px-[18px] py-2.5 text-[13px] font-semibold text-[#08131c]"
              style={{ background: '#eef6fb' }}
            >
              Request access
            </button>
          </nav>
        </motion.header>

        {/* hero grid — single column below lg, 2-col at lg+ (page-level <main> is in App) */}
        <div className="relative z-[2] grid grid-cols-1 gap-12 pt-8 lg:h-[calc(100vh-120px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-0 lg:pt-0">
          {/* copy column */}
          <div>
            <motion.div
              {...enter(0.1, 0.6)}
              className="flex items-center gap-2.5 text-[12px] tracking-[2px] text-azure-bright"
            >
              <span className="h-px w-[34px]" style={{ background: '#5ab0e6' }} />
              <span className="font-mono">[ AGENT&nbsp;QA · 001 ]</span>
            </motion.div>

            <motion.h1
              {...enter(0.18, 0.72)}
              className="mt-5 text-[clamp(38px,8.5vw,74px)] font-bold leading-[.98] tracking-[-2.5px]"
            >
              Forge the agent.
              <br />
              <span className="font-medium" style={{ color: 'var(--mut)' }}>
                Prove it holds.
              </span>
            </motion.h1>

            <motion.p
              {...enter(0.3, 0.7)}
              className="mt-[22px] max-w-[400px] text-[16px] leading-[1.55]"
              style={{ color: 'var(--mut)' }}
            >
              The workbench where you build an AI agent — then put it through the fire. Evals, judges
              and version diffs that prove it’s good and safe before it ships.
            </motion.p>

            <motion.div {...enter(0.42, 0.7)} className="mt-[34px] flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="rounded-[26px] px-6 py-3.5 text-[14px] font-semibold text-[#08131c]"
                style={{
                  background: 'linear-gradient(135deg,#dff2ff,#b7e2fb)',
                  boxShadow: '0 10px 30px rgba(90,176,230,.28)',
                }}
              >
                See it prove →
              </button>
              <button type="button" className="flex items-center gap-2.5 text-[14px] text-ink">
                <span
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full border backdrop-blur-[6px]"
                  style={{ borderColor: 'var(--brd)', background: 'rgba(255,255,255,.07)' }}
                >
                  <span
                    className="ml-[3px]"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '9px solid #eef6fb',
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                    }}
                  />
                </span>
                Watch a run
              </button>
            </motion.div>
          </div>

          {/* orb column */}
          <div className="relative flex h-full flex-col items-center justify-center">
            <ProvingCore />

            {/* floating glass stat cards — absolute over the orb at lg; a wrapped row below it on mobile */}
            <div className="mt-10 flex w-full flex-wrap justify-center gap-3 lg:mt-0 lg:contents">
            <motion.div {...enter(0.52, 0.72)} className="z-[3] lg:absolute lg:right-[20%] lg:top-[20%]">
              <Glass bright className="px-[17px] py-[15px]">
                <div className="text-[10.5px] uppercase tracking-[1px]" style={{ color: 'var(--mut)' }}>
                  Pass rate
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold tracking-[-1px]">{passRate}%</span>
                  <span className="font-mono text-[13px] text-pos">▲ {deltaVal}</span>
                </div>
              </Glass>
            </motion.div>

            <motion.div {...enter(0.64, 0.72)} className="z-[3] lg:absolute lg:bottom-[22%] lg:right-[31%]">
              <Glass bright className="px-[17px] py-[15px]">
                <div className="text-[10.5px] uppercase tracking-[1px]" style={{ color: 'var(--mut)' }}>
                  Eval suite · Safety
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[22px] font-bold tracking-[-1px]">
                    {passed}/{evalSuite.cases}
                  </span>
                  <span className="font-mono text-[12px]" style={{ color: 'var(--mut)' }}>
                    {evalSuite.flagged} flagged
                  </span>
                </div>
              </Glass>
            </motion.div>

            <motion.div {...enter(0.76, 0.72)} className="z-[3] lg:absolute lg:bottom-[15%] lg:right-[6%]">
              <Glass bright className="px-[17px] py-[15px]">
                <div
                  className="font-mono text-[10.5px] uppercase tracking-[1px]"
                  style={{ color: 'var(--mut)' }}
                >
                  v1 → v2
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[22px] font-bold tracking-[-1px] text-azure-bright">holds</span>
                </div>
              </Glass>
            </motion.div>
            </div>
          </div>
        </div>

        {/* index rail */}
        <motion.div
          {...enterFade(0.6, 0.9)}
          className="absolute right-12 top-1/2 z-[4] hidden -translate-y-1/2 lg:block"
        >
          <IndexRail active={0} />
        </motion.div>

        {/* footline */}
        <motion.div
          {...enterFade(0.7, 0.9)}
          className="absolute bottom-[26px] left-12 z-[4] hidden gap-[26px] font-mono text-[12px] lg:flex"
          style={{ color: 'var(--mut)' }}
        >
          <span>
            <b className="font-medium text-ink">Design-time</b> agent QA
          </span>
          <span>
            Relay watches prod — <b className="font-medium text-ink">Crucible</b> proves it first
          </span>
        </motion.div>
      </div>
    </section>
  )
}

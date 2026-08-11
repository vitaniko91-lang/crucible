import { useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { rise, fade, t, DUR, EASE } from '../lib/motion'
import { overall, delta } from '../lib/score'
import { evalSuite, diffCase, flagged } from '../lib/data'
import { useCountUp } from '../lib/useCountUp'

// Same petrol radial as Hero / Build — one continuous chrome across the case.
const EVALS_BG = 'radial-gradient(120% 120% at 80% 0%, #143247 0%, #0d2130 45%, #081019 100%)'

// Evals is the active screen here (Build was active in Build.tsx).
const NAV = [
  { label: 'Build', icon: '◧', on: false },
  { label: 'Evals', icon: '✓', on: true },
  { label: 'Runs · Relay', icon: '↗', on: false },
  { label: 'Settings', icon: '⚙', on: false },
]

// Highlight the graded substring inside a response (bad = red, good = green).
function Mark({ children, tone }: { children: string; tone: 'bad' | 'good' }) {
  const bg = tone === 'bad' ? 'rgba(255,128,128,.22)' : 'rgba(126,230,168,.22)'
  return (
    <span className="rounded-[3px] px-[3px]" style={{ background: bg }}>
      {children}
    </span>
  )
}

function highlight(text: string, sub: string, tone: 'bad' | 'good') {
  const i = text.indexOf(sub)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <Mark tone={tone}>{sub}</Mark>
      {text.slice(i + sub.length)}
    </>
  )
}

export function Evals() {
  const reduced = useReducedMotion()

  // whileInView-based entrance; reduced motion renders the final state instantly.
  const enter = (variants: typeof rise | typeof fade, delay = 0, dur = DUR.slow) =>
    reduced
      ? { variants, initial: false as const, animate: 'visible' as const }
      : {
          variants,
          initial: 'hidden' as const,
          whileInView: 'visible' as const,
          viewport: { once: true, margin: '-60px' },
          transition: t(dur, delay),
        }

  // Count-up begins when the summary strip scrolls into view.
  const summaryRef = useRef<HTMLDivElement>(null)
  const inView = useInView(summaryRef, { once: true, margin: '-80px' })

  // Numbers are computed from the eval suite — never the mockup literals.
  const v1overall = overall(evalSuite.criteria.map((c) => c.v1)) // 83.0
  const v2overall = overall(evalSuite.criteria.map((c) => c.v2)) // 94.8
  const headlineDelta = Math.round((v2overall - v1overall) * 10) / 10 // +11.8

  const verdictVal = useCountUp(v2overall, inView)
  const casesVal = useCountUp(evalSuite.cases, inView)
  const flaggedVal = useCountUp(evalSuite.flagged, inView)

  const moreCount = evalSuite.flagged - flagged.length // 8 − 5 = 3
  const criterionSlug = diffCase.criterion.toLowerCase().replace(/\s+/g, '-') // policy-adherence

  // Emphasize the leading verdict clause ("v2 correct.") in green.
  const [verdictHead, ...verdictRest] = diffCase.verdict.split('. ')

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ background: EVALS_BG }}>
      <div className="mx-auto grid h-screen max-w-[1440px] grid-cols-[196px_1fr]">
        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <motion.aside
          {...enter(fade, 0, DUR.slow)}
          className="flex flex-col gap-[22px] border-r px-4 py-[22px]"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="flex items-center gap-[9px] text-[15px] font-bold">
            <span
              className="h-[11px] w-[11px] rounded-[3px]"
              style={{ background: 'linear-gradient(135deg,#9fd8f5,#5ab0e6)', boxShadow: '0 0 12px rgba(90,176,230,.7)' }}
            />
            Crucible
          </div>

          <button
            type="button"
            className="flex items-center justify-between rounded-chip border px-3 py-2.5 text-left text-[13px] text-ink"
            style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
          >
            <span>Support Agent</span>
            <span style={{ color: 'var(--mut)' }}>▾</span>
          </button>

          <nav className="flex flex-col gap-[3px]">
            {NAV.map((n) => (
              <button
                key={n.label}
                type="button"
                className="flex items-center gap-[9px] rounded-[9px] px-[11px] py-2 text-left text-[13px]"
                style={n.on ? { color: '#eef6fb', background: 'var(--panel2)' } : { color: 'var(--mut)' }}
              >
                <span className="w-[15px] text-center opacity-80">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto text-[11.5px]" style={{ color: 'var(--mut2)' }}>
            <div className="flex justify-between border-t py-1.5" style={{ borderColor: 'var(--line)' }}>
              <span>v1</span>
              <span>{v1overall.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between border-t py-1.5 text-azure-bright" style={{ borderColor: 'var(--line)' }}>
              <span>v2 · draft</span>
              <span>{v2overall.toFixed(1)}%</span>
            </div>
          </div>
        </motion.aside>

        {/* ── MAIN ────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col overflow-hidden">
          {/* topbar */}
          <motion.div
            {...enter(fade, 0.1, DUR.slow)}
            className="flex h-[60px] flex-none items-center justify-between border-b px-6"
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="flex items-center gap-3 text-[15px] font-semibold">Support Agent · Evals</div>
            <div className="flex items-center gap-3">
              <div
                className="flex overflow-hidden rounded-[20px] border text-[12px]"
                style={{ borderColor: 'var(--brd)' }}
              >
                {['v1', 'v1 vs v2', 'v2'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="px-[13px] py-1.5"
                    style={
                      s === 'v1 vs v2'
                        ? { background: 'var(--panel2)', color: '#eef6fb' }
                        : { color: 'var(--mut)' }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rounded-[20px] px-[15px] py-[9px] text-[13px] font-semibold text-[#08131c]"
                style={{ background: 'linear-gradient(135deg,#dff2ff,#b7e2fb)', boxShadow: '0 8px 22px rgba(90,176,230,.25)' }}
              >
                Re-run suite ↻
              </button>
            </div>
          </motion.div>

          {/* content grid: summary / mid / flagged */}
          <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-6 py-5">
            {/* ── SUMMARY STRIP ─────────────────────────────── */}
            <div ref={summaryRef} className="flex items-stretch gap-4">
              {/* verdict */}
              <motion.div
                {...enter(rise, 0, DUR.slow)}
                className="relative flex-none overflow-hidden rounded-card px-[22px] py-4"
                style={{
                  border: '1px solid rgba(126,230,168,.35)',
                  background: 'linear-gradient(135deg,rgba(126,230,168,.10),rgba(90,176,230,.05))',
                }}
              >
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute"
                  style={{
                    right: -30,
                    top: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(126,230,168,.4),transparent 70%)',
                  }}
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE.out }}
                />
                <div className="text-[11px] uppercase tracking-[1.5px]" style={{ color: 'var(--mut)' }}>
                  Verdict · v2
                </div>
                <div className="mt-1.5 text-[40px] font-bold leading-none tracking-[-1.5px]">
                  {verdictVal.toFixed(1)}% <span className="text-[20px] text-pos">holds</span>
                </div>
                <div className="mt-2 text-[12px]" style={{ color: 'var(--mut)' }}>
                  up from {v1overall.toFixed(1)}% · <b className="text-pos">+{headlineDelta.toFixed(1)}</b> vs v1
                </div>
              </motion.div>

              {/* metric tiles */}
              <div className="grid flex-1 grid-cols-3 gap-3">
                <Tile {...enter(rise, 0.06, DUR.slow)} k="Cases">
                  <span className="text-[26px] font-bold">{Math.round(casesVal)}</span>
                </Tile>
                <Tile {...enter(rise, 0.15, DUR.slow)} k="Flagged">
                  <span className="text-[26px] font-bold text-neg">{Math.round(flaggedVal)}</span>
                  <small className="text-[13px] font-medium" style={{ color: 'var(--mut)' }}>
                    {' '}
                    / {evalSuite.cases}
                  </small>
                </Tile>
                <Tile {...enter(rise, 0.26, DUR.slow)} k="Judge">
                  <span className="text-[16px] font-bold">
                    gpt-4o{' '}
                    <small className="text-[13px] font-medium" style={{ color: 'var(--mut)' }}>
                      · rubric
                    </small>
                  </span>
                </Tile>
              </div>
            </div>

            {/* ── MIDDLE: scorecard | diff+judge ────────────── */}
            <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-4">
              {/* scorecard */}
              <motion.div
                {...enter(rise, 0.15, DUR.slow)}
                className="flex min-h-0 flex-col overflow-hidden rounded-card border px-[18px] py-4"
                style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
              >
                <div className="mb-3.5 flex items-center justify-between">
                  <span className="text-[14px] font-semibold">Scorecard</span>
                  <span className="text-[11px]" style={{ color: 'var(--mut)' }}>
                    v1 → v2 · by criterion
                  </span>
                </div>
                <div className="flex flex-col gap-[13px]">
                  {evalSuite.criteria.map((c, i) => {
                    const d = delta(c.v1, c.v2)
                    const down = d < 0
                    return (
                      <div key={c.name}>
                        <div className="mb-[5px] flex items-baseline justify-between">
                          <span className="text-[12.5px]">{c.name}</span>
                          <span className="text-[12px]" style={{ color: 'var(--mut)' }}>
                            {c.v1} → <b className="text-ink">{c.v2}</b>
                            <span className={`ml-2 text-[11px] ${down ? 'text-neg' : 'text-pos'}`}>
                              {down ? `−${Math.abs(d)}` : `+${d}`}
                            </span>
                          </span>
                        </div>
                        <div
                          className="relative h-[7px] overflow-hidden rounded-[5px]"
                          style={{ background: 'rgba(255,255,255,.08)' }}
                        >
                          {/* faint v1 layer */}
                          <span
                            className="absolute left-0 top-0 h-full rounded-[5px]"
                            style={{ width: `${c.v1}%`, background: 'rgba(255,255,255,.16)' }}
                          />
                          {/* v2 layer — grows on in-view; grey for the regressed row */}
                          <motion.span
                            className="absolute left-0 top-0 h-full rounded-[5px]"
                            style={{
                              width: `${c.v2}%`,
                              transformOrigin: 'left',
                              background: down
                                ? 'linear-gradient(90deg,#7c8794,#aeb8c2)'
                                : 'linear-gradient(90deg,#5ab0e6,#9fd8f5)',
                            }}
                            initial={reduced ? false : { scaleX: 0 }}
                            whileInView={reduced ? undefined : { scaleX: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={t(DUR.slow, i * 0.07)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* ★ diff + judge (signature) */}
              <motion.div
                {...enter(rise, 0.26, DUR.slow)}
                className="flex min-h-0 flex-col overflow-hidden rounded-card px-[18px] py-4"
                style={{
                  border: '1px solid rgba(90,176,230,.4)',
                  background: 'var(--panel)',
                  boxShadow: '0 0 0 1px rgba(90,176,230,.12),0 16px 46px rgba(0,0,0,.32)',
                }}
              >
                <div className="mb-3.5 flex items-center justify-between">
                  <span className="text-[14px] font-semibold">★ Failure → fix · v1 vs v2</span>
                  <span className="text-[11px]" style={{ color: 'var(--mut)' }}>
                    {criterionSlug}
                  </span>
                </div>

                <div
                  className="mb-3 rounded-[9px] border px-[11px] py-[9px] text-[12px]"
                  style={{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--mut)' }}
                >
                  Case {diffCase.id} — customer asks: <b className="text-ink">“{diffCase.prompt}”</b>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-2 gap-[11px]">
                  {/* v1 — failed */}
                  <motion.div
                    {...enter(rise, 0.32, DUR.slow)}
                    className="rounded-[11px] border px-3 py-[11px] text-[12px] leading-[1.5]"
                    style={{ borderColor: 'rgba(255,128,128,.3)', background: 'rgba(255,128,128,.07)' }}
                  >
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[1px] text-neg">
                      ◦ v1 · failed
                    </div>
                    “{highlight(diffCase.v1.text, diffCase.v1.bad, 'bad')}”
                  </motion.div>

                  {/* v2 — passed */}
                  <motion.div
                    {...enter(rise, 0.4, DUR.slow)}
                    className="rounded-[11px] border px-3 py-[11px] text-[12px] leading-[1.5]"
                    style={{ borderColor: 'rgba(126,230,168,.35)', background: 'rgba(126,230,168,.08)' }}
                  >
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[1px] text-pos">
                      ◦ v2 · passed
                    </div>
                    “{highlight(diffCase.v2.text, diffCase.v2.good, 'good')}”
                  </motion.div>
                </div>

                {/* judge */}
                <motion.div
                  {...enter(rise, 0.48, DUR.slow)}
                  className="mt-3 flex items-start gap-[11px] border-t pt-3"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span
                    className="flex h-7 w-7 flex-none items-center justify-center rounded-[8px] border text-[14px] text-azure-bright"
                    style={{ background: 'rgba(90,176,230,.16)', borderColor: 'rgba(90,176,230,.4)' }}
                  >
                    §
                  </span>
                  <div className="text-[12.5px] leading-[1.5]">
                    <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--mut)' }}>
                      Judge verdict · {criterionSlug}
                    </div>
                    <div>
                      <b className="text-pos">{verdictHead}.</b> {verdictRest.join('. ')}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* ── FLAGGED STRIP ─────────────────────────────── */}
            <motion.div {...enter(rise, 0.38, DUR.slow)} className="flex flex-none items-center gap-2.5">
              <span className="text-[11px] uppercase tracking-[.5px]" style={{ color: 'var(--mut)' }}>
                {evalSuite.flagged} flagged
              </span>
              {flagged.map((f) => (
                <span
                  key={f.id}
                  className="whitespace-nowrap rounded-[8px] border px-2.5 py-1.5 text-[11px]"
                  style={{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--mut)' }}
                >
                  {f.id} {f.label}{' '}
                  <span className={f.state === 'open' ? 'text-neg' : ''} style={f.state === 'fixed' ? { color: 'var(--mut2)' } : undefined}>
                    {f.state}
                  </span>
                </span>
              ))}
              <span
                className="whitespace-nowrap rounded-[8px] border px-2.5 py-1.5 text-[11px]"
                style={{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--mut2)' }}
              >
                +{moreCount} more
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Metric tile — spreads framer entrance props from the caller's `enter(...)`.
function Tile({
  k,
  children,
  ...motionProps
}: { k: string; children: React.ReactNode } & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      {...motionProps}
      className="flex flex-col justify-center rounded-node border px-4 py-3.5"
      style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
    >
      <div className="text-[11px] uppercase tracking-[.5px]" style={{ color: 'var(--mut)' }}>
        {k}
      </div>
      <div className="mt-1">{children}</div>
    </motion.div>
  )
}

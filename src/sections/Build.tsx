import { motion, useReducedMotion } from 'framer-motion'
import { rise, fade, t, DUR } from '../lib/motion'
import { overall } from '../lib/score'
import { graph, evalSuite } from '../lib/data'
import type { Node } from '../lib/data'

// Build screen background — mockup's petrol radial, same palette family as Hero.
const BUILD_BG = 'radial-gradient(120% 120% at 78% 0%, #143247 0%, #0d2130 44%, #081019 100%)'

// Node glyphs by type (faithful to the approved mockup — decorative symbols, not emoji).
const GLYPH: Record<string, string> = {
  Trigger: '✦', Retrieve: '▤', LLM: '◇', Tool: '⛭', Guardrail: '⛨', Respond: '➤',
}
// Subs rendered in mono in the mockup.
const MONO_SUB = new Set(['retrieve', 'reason', 'tool'])

// Icon chip color by node kind: tool→violet, guard→green, default→azure.
function iconStyle(kind?: 'tool' | 'guard') {
  if (kind === 'tool') return { background: 'rgba(185,140,255,.16)', borderColor: 'rgba(185,140,255,.4)', color: '#c9adff' }
  if (kind === 'guard') return { background: 'rgba(126,230,168,.15)', borderColor: 'rgba(126,230,168,.4)', color: '#7ee6a8' }
  return { background: 'rgba(90,176,230,.18)', borderColor: 'rgba(90,176,230,.4)', color: '#9fd8f5' }
}

// --- Graph geometry -----------------------------------------------------------
// The node coordinate space (data x/y, in px) is 1:1 with the SVG viewBox so edges
// attach to real node ports. Curves mirror the mockup's <svg class="edges"> anchors.
const NW = 176 // node width
const NH = 92 // node height (approx, for port math)
const SPREAD = 16 // fan-in / fan-out separation at a shared port

type Built = { id: string; d: string }

function buildEdges(): Built[] {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]))
  const cls = graph.edges.map((e) => {
    const from = byId.get(e.from) as Node
    const to = byId.get(e.to) as Node
    const horiz = to.x > from.x + NW || to.x + NW < from.x
    return { from, to, horiz }
  })

  // Group horizontal edges that share a right (out) or left (in) port so the hub fans.
  const groups: Record<string, number[]> = {}
  const push = (k: string, i: number) => {
    if (!groups[k]) groups[k] = []
    groups[k].push(i)
  }
  cls.forEach((c, i) => {
    if (!c.horiz) return
    push(`${c.from.id}:R`, i)
    push(`${c.to.id}:L`, i)
  })
  const offsetFor = (key: string, i: number, side: 'from' | 'to') => {
    const grp = groups[key]
    if (!grp || grp.length < 2) return 0
    const sorted = [...grp].sort((a, b) => {
      const ya = side === 'from' ? cls[a].to.y : cls[a].from.y
      const yb = side === 'from' ? cls[b].to.y : cls[b].from.y
      return ya - yb
    })
    return (sorted.indexOf(i) - (grp.length - 1) / 2) * SPREAD
  }

  return cls.map((c, i) => {
    const { from, to, horiz } = c
    const id = `${from.id}-${to.id}`
    if (horiz) {
      const right = to.x > from.x
      const a = { x: right ? from.x + NW : from.x, y: from.y + NH / 2 + offsetFor(`${from.id}:R`, i, 'from') }
      const b = { x: right ? to.x : to.x + NW, y: to.y + NH / 2 + offsetFor(`${to.id}:L`, i, 'to') }
      const mx = (a.x + b.x) / 2
      return { id, d: `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}` }
    }
    // Same column → vertical. Short drop stays straight; long spans bow around the right.
    const below = to.y > from.y
    const a = { x: from.x + NW / 2, y: below ? from.y + NH : from.y }
    const b = { x: to.x + NW / 2, y: below ? to.y : to.y + NH }
    const gap = Math.abs(b.y - a.y)
    if (gap > NH) {
      const rx = Math.max(from.x, to.x) + NW + 34
      return {
        id,
        d: `M${from.x + NW},${from.y + NH / 2} C${rx},${from.y + NH / 2} ${rx},${to.y + NH / 2} ${to.x + NW},${to.y + NH / 2}`,
      }
    }
    const my = (a.y + b.y) / 2
    return { id, d: `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}` }
  })
}

const EDGES = buildEdges()

// --- Static content (mockup copy) --------------------------------------------
const NAV = [
  { label: 'Build', icon: '◧', on: true },
  { label: 'Evals', icon: '✓', on: false },
  { label: 'Runs · Relay', icon: '↗', on: false },
  { label: 'Settings', icon: '⚙', on: false },
]
const STEPS: { label: string; ms?: string; out?: string }[] = [
  { label: 'Retrieve', ms: '120ms' },
  { label: 'Reason', ms: '840ms' },
  { label: 'check_order', ms: '210ms' },
  { label: 'Respond', out: '“Shipped, arrives Tue”' },
]
const TOOLS = ['check_order', 'issue_refund']
const GUARDRAILS = ['PII redaction', 'Tone', 'No refunds > $200']

export function Build() {
  const reduced = useReducedMotion()

  // Entrance helpers — reduced motion renders the final state with no offset.
  const enter = (variants: typeof rise | typeof fade, delay: number, dur: number) => ({
    variants,
    initial: reduced ? (false as const) : ('hidden' as const),
    animate: 'visible' as const,
    transition: t(dur, delay),
  })

  // Numbers derived from the eval suite — never hardcoded.
  const v1 = overall(evalSuite.criteria.map((c) => c.v1)) // 83.0
  const v2 = overall(evalSuite.criteria.map((c) => c.v2)) // 94.8

  // Inspector reflects the selected node (Reason / LLM).
  const selected = graph.nodes.find((n) => n.selected) as Node
  const [model, tempPart] = selected.sub.split('·').map((s) => s.trim())
  const temp = tempPart.replace(/[^0-9.]/g, '') // '0.2'
  const tempPct = Math.round(parseFloat(temp) * 100) // 20

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ background: BUILD_BG }}>
      <div
        className="mx-auto grid max-w-[1440px] grid-cols-1 lg:h-screen lg:grid-cols-[196px_1fr_312px]"
        style={{ borderColor: 'var(--line)' }}
      >
        {/* ── SIDEBAR (top strip on mobile, left rail at lg) ───── */}
        <motion.aside
          {...enter(fade, 0, DUR.slow)}
          className="flex flex-row flex-wrap items-center gap-4 border-b px-5 py-3.5 lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-[22px] lg:border-b-0 lg:border-r lg:px-4 lg:py-[22px]"
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

          <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-[3px]">
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

          <div className="mt-auto hidden text-[11.5px] lg:block" style={{ color: 'var(--mut2)' }}>
            <div className="flex justify-between border-t py-1.5" style={{ borderColor: 'var(--line)' }}>
              <span>v1</span>
              <span>{v1.toFixed(1)}%</span>
            </div>
            <div
              className="flex justify-between border-t py-1.5 text-azure-bright"
              style={{ borderColor: 'var(--line)' }}
            >
              <span>v2 · draft</span>
              <span>{v2.toFixed(1)}%</span>
            </div>
          </div>
        </motion.aside>

        {/* ── MAIN (topbar + canvas) ──────────────────────────── */}
        <div className="flex min-w-0 flex-col">
          <motion.div
            {...enter(fade, 0.1, DUR.slow)}
            className="flex min-h-[60px] flex-wrap items-center justify-between gap-3 border-b px-5 py-3 lg:h-[60px] lg:flex-nowrap lg:px-[22px] lg:py-0"
            style={{ borderColor: 'var(--line)' }}
          >
            <div className="flex items-center gap-3 text-[15px] font-semibold">
              Support Agent
              <span
                className="rounded-[20px] border px-[9px] py-1 text-[11px]"
                style={{ borderColor: 'var(--brd)', background: 'var(--panel)', color: 'var(--mut)' }}
              >
                v2 · draft ▾
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="rounded-[20px] border px-[15px] py-[9px] text-[13px] font-semibold text-ink"
                style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
              >
                Test run
              </button>
              <button
                type="button"
                className="rounded-[20px] px-[15px] py-[9px] text-[13px] font-semibold text-[#08131c]"
                style={{ background: 'linear-gradient(135deg,#dff2ff,#b7e2fb)', boxShadow: '0 8px 22px rgba(90,176,230,.25)' }}
              >
                Run {evalSuite.cases} evals →
              </button>
            </div>
          </motion.div>

          {/* canvas area — relative box at lg (absolute children); flex column on mobile */}
          <div className="relative flex flex-1 flex-col lg:block">
          {/* graph scroller — the fixed 760px stage scrolls horizontally inside this box, never the page */}
          <div
            className="relative h-[500px] w-full overflow-x-auto overflow-y-hidden lg:absolute lg:inset-0 lg:h-auto lg:w-auto lg:overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.045) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          >
            {/* graph stage — nodes + edges share one coordinate space */}
            <div
              className="relative mx-auto my-[15px] lg:absolute lg:left-1/2 lg:top-1/2 lg:my-0 lg:-translate-x-1/2 lg:-translate-y-1/2"
              style={{ width: 760, height: 470 }}
            >
              {/* edges (behind nodes) */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 760 470"
                fill="none"
                aria-hidden="true"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#5ab0e6" stopOpacity=".2" />
                    <stop offset="1" stopColor="#5ab0e6" stopOpacity=".7" />
                  </linearGradient>
                </defs>
                <g stroke="url(#edgeGrad)" strokeWidth="1.6" fill="none">
                  {EDGES.map((e) => (
                    <motion.path
                      key={e.id}
                      d={e.d}
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ ...t(DUR.dramatic, 0.15) }}
                    />
                  ))}
                </g>
              </svg>

              {/* settle glow behind the selected node (opacity-only, one-shot) */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute rounded-[20px]"
                style={{
                  left: selected.x - 10,
                  top: selected.y - 10,
                  width: NW + 20,
                  height: NH + 20,
                  background: 'radial-gradient(60% 60% at 50% 50%, rgba(90,176,230,.45), transparent 70%)',
                  filter: 'blur(14px)',
                }}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: reduced ? 0 : 0.5 }}
              />

              {/* nodes */}
              {graph.nodes.map((n, i) => {
                const sel = !!n.selected
                return (
                  <motion.div
                    key={n.id}
                    variants={rise}
                    initial={reduced ? false : 'hidden'}
                    animate="visible"
                    transition={t(0.52, 0.16 + i * 0.08)}
                    className="absolute rounded-node border backdrop-blur-[10px]"
                    style={{
                      left: n.x,
                      top: n.y,
                      width: NW,
                      padding: '12px 13px',
                      background: 'linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.05))',
                      borderColor: sel ? '#5ab0e6' : 'var(--brd)',
                      boxShadow: sel
                        ? '0 0 0 1px #5ab0e6, 0 14px 40px rgba(90,176,230,.3)'
                        : '0 12px 34px rgba(0,0,0,.32)',
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] border text-[12px]"
                        style={iconStyle(n.kind)}
                      >
                        {GLYPH[n.type] ?? '◇'}
                      </span>
                      <span className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--mut)' }}>
                        {n.type}
                      </span>
                      <span
                        className="ml-auto h-[7px] w-[7px] rounded-full"
                        style={{ background: '#7ee6a8', boxShadow: '0 0 8px rgba(126,230,168,.8)' }}
                      />
                    </div>
                    <div className="text-[15px] font-semibold">{n.title}</div>
                    <div
                      className={`mt-0.5 text-[11px] ${MONO_SUB.has(n.id) ? 'font-mono' : ''}`}
                      style={{ color: 'var(--mut)' }}
                    >
                      {n.sub}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ── TEST-RUN DOCK — pinned to the canvas at lg, a block below it on mobile ── */}
          <motion.div
              {...enter(rise, 0.7, 0.64)}
              className="relative z-[3] m-3 flex flex-wrap items-center gap-1.5 rounded-card border px-3 py-[13px] backdrop-blur-[16px] lg:absolute lg:bottom-4 lg:left-3 lg:right-3 lg:m-0 lg:flex-nowrap"
              style={{
                background: 'rgba(9,22,32,.72)',
                borderColor: 'var(--brd)',
                boxShadow: '0 18px 50px rgba(0,0,0,.4)',
              }}
            >
              <div className="flex flex-none items-center gap-2">
                <span
                  className="rounded-[9px] border px-1 py-2 text-[11px] text-ink"
                  style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
                >
                  “Where’s my order #4821?”
                </span>
                <button
                  type="button"
                  aria-label="Run test"
                  className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] text-[11px] text-[#08131c]"
                  style={{ background: 'linear-gradient(135deg,#dff2ff,#b7e2fb)' }}
                >
                  ▶
                </button>
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:overflow-hidden">
                {STEPS.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-1">
                    <motion.span
                      {...enter(fade, 0.95 + i * 0.13, DUR.fast + 0.3)}
                      className="whitespace-nowrap rounded-[8px] border px-1 py-1 text-[10.5px]"
                      style={{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--mut)' }}
                    >
                      {s.label}{' '}
                      {s.ms ? (
                        <span className="text-azure-bright">{s.ms}</span>
                      ) : (
                        <b className="font-medium text-ink">{s.out}</b>
                      )}
                    </motion.span>
                    {i < STEPS.length - 1 && (
                      <span className="text-[10.5px]" style={{ color: 'var(--mut2)' }}>
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="ml-auto flex-none pl-1 text-right font-mono text-[9.5px]" style={{ color: 'var(--mut)' }}>
                p95 <b className="font-normal text-ink">1.84s</b> · 1,240 tok · $0.006
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── INSPECTOR (below the canvas on mobile, right rail at lg) ── */}
        <motion.aside
          {...enter(rise, 0.5, 0.64)}
          className="flex flex-col gap-4 border-t px-5 py-5 lg:overflow-auto lg:border-l lg:border-t-0 lg:px-[18px]"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="flex items-center gap-[9px]">
            <span
              className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border text-[13px]"
              style={iconStyle(selected.kind)}
            >
              {GLYPH[selected.type] ?? '◇'}
            </span>
            <div>
              <div className="text-[16px] font-semibold">{selected.title}</div>
              <div className="text-[11px]" style={{ color: 'var(--mut)' }}>
                {selected.type} step
              </div>
            </div>
          </div>

          <Field label="Model">
            <div
              className="flex items-center justify-between rounded-[9px] border px-[11px] py-[9px] text-[13px]"
              style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
            >
              <span>OpenAI</span>
              <span className="font-mono text-[12px] text-azure-bright">{model} ▾</span>
            </div>
          </Field>

          <Field label="Temperature">
            <div className="flex items-center gap-2.5">
              <div className="relative h-1 flex-1 rounded-[3px]" style={{ background: 'rgba(255,255,255,.12)' }}>
                <div
                  className="absolute left-0 top-0 h-full rounded-[3px]"
                  style={{ width: `${tempPct}%`, background: '#5ab0e6' }}
                />
                <span
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                  style={{ left: `${tempPct}%`, boxShadow: '0 0 8px rgba(90,176,230,.7)' }}
                />
              </div>
              <span className="font-mono text-[12px] text-azure-bright">{temp}</span>
            </div>
          </Field>

          <Field label="System prompt">
            <div
              className="rounded-[9px] border px-[11px] py-2.5 text-[12px] leading-[1.5]"
              style={{ borderColor: 'var(--brd)', background: 'var(--panel)', color: 'var(--mut)' }}
            >
              You are a support agent for Nimbus. Be concise and warm. Always verify order status with{' '}
              <span className="text-azure-bright">check_order</span> before promising a date…
            </div>
          </Field>

          <Field label="Tools">
            <div className="flex flex-wrap gap-1.5">
              {TOOLS.map((tl) => (
                <Chip key={tl} on>
                  {tl}
                </Chip>
              ))}
              <button
                type="button"
                className="rounded-[16px] border px-2.5 py-[5px] text-[11.5px] text-ink"
                style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
              >
                + add
              </button>
            </div>
          </Field>

          <Field label="Guardrails">
            <div className="flex flex-wrap gap-1.5">
              {GUARDRAILS.map((g) => (
                <Chip key={g} on>
                  {g}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="Output">
            <div
              className="flex items-center justify-between rounded-[9px] border px-[11px] py-[9px] text-[13px]"
              style={{ borderColor: 'var(--brd)', background: 'var(--panel)' }}
            >
              <span>Schema</span>
              <span className="font-mono text-[12px] text-azure-bright">reply · json ▾</span>
            </div>
          </Field>
        </motion.aside>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-[.5px]" style={{ color: 'var(--mut)' }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function Chip({ children, on = false }: { children: React.ReactNode; on?: boolean }) {
  return (
    <span
      className="rounded-[16px] border px-2.5 py-[5px] text-[11.5px]"
      style={
        on
          ? { borderColor: 'rgba(126,230,168,.5)', background: 'rgba(126,230,168,.12)', color: '#7ee6a8' }
          : { borderColor: 'var(--brd)', background: 'var(--panel)', color: '#eef6fb' }
      }
    >
      {children}
    </span>
  )
}

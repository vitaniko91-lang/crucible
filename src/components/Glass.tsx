import type { ReactNode } from 'react'
// `bright` = the mockup's brighter hero-stat glass (panel .07 / border .16);
// default stays at the subtler .045 / .14 used everywhere else (e.g. Outro).
export function Glass({
  children,
  className = '',
  bright = false,
}: {
  children: ReactNode
  className?: string
  bright?: boolean
}) {
  return (
    <div
      className={`rounded-card border backdrop-blur-md ${className}`}
      style={{
        background: bright ? 'var(--panel2)' : 'var(--panel)',
        borderColor: bright ? 'var(--brd2)' : 'var(--brd)',
        boxShadow: '0 18px 50px rgba(0,0,0,.35)',
      }}
    >
      {children}
    </div>
  )
}

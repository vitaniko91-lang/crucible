import type { ReactNode } from 'react'
export function Glass({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border backdrop-blur-md ${className}`}
      style={{ background: 'var(--panel)', borderColor: 'var(--brd)', boxShadow: '0 18px 50px rgba(0,0,0,.35)' }}>
      {children}
    </div>
  )
}

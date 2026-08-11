const items = ['01  Forge','02  Prove','03  Diff','04  Ship']
export function IndexRail({ active = 0 }: { active?: number }) {
  return (
    <div className="font-mono text-[12px] flex flex-col gap-3.5 text-right" style={{ color:'var(--mut)' }}>
      {items.map((s,i)=>(<span key={s} className={i===active ? 'text-ink' : undefined}>{s}</span>))}
    </div>
  )
}

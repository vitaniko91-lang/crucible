export function Pill({ children, primary = false }: { children: React.ReactNode; primary?: boolean }) {
  return primary
    ? <span className="text-[13px] font-semibold rounded-full px-4 py-2.5 text-[#08131c]"
        style={{ background: 'linear-gradient(135deg,#dff2ff,#b7e2fb)', boxShadow: '0 8px 22px rgba(90,176,230,.25)' }}>{children}</span>
    : <span className="text-[13px] rounded-full px-4 py-2.5 border" style={{ borderColor:'var(--brd)', background:'var(--panel)' }}>{children}</span>
}

/** Decorative "synergy" rings — three overlapping circles in club colours. */
export default function Rings({ className = "", opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 400 400" className={`pointer-events-none select-none ${className}`} aria-hidden style={{ opacity }}>
      <circle cx="160" cy="160" r="110" fill="none" stroke="#d41367" strokeOpacity=".22" strokeWidth="2" />
      <circle cx="240" cy="160" r="110" fill="none" stroke="#f7a81b" strokeOpacity=".35" strokeWidth="2" />
      <circle cx="200" cy="230" r="110" fill="none" stroke="#17458f" strokeOpacity=".16" strokeWidth="2" />
      <circle cx="160" cy="160" r="6" fill="#d41367" fillOpacity=".5" />
      <circle cx="240" cy="160" r="6" fill="#f7a81b" fillOpacity=".7" />
      <circle cx="200" cy="230" r="6" fill="#17458f" fillOpacity=".4" />
    </svg>
  );
}

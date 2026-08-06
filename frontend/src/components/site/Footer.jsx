export const Footer = () => (
  <footer className="bg-ink border-t border-white/10 px-4 md:px-12 py-10" data-testid="site-footer">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-signal rec-dot" />
        <span className="font-display text-3xl tracking-wide">MANJOY DEBNATH</span>
      </div>
      <p className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">
        © {new Date().getFullYear()} — Video Editor & Colorist · Los Angeles
      </p>
      <a
        href="#top"
        className="font-monoE text-[10px] uppercase tracking-[0.2em] text-ghost hover:text-accent transition-colors"
      >
        Back to top ↑
      </a>
    </div>
  </footer>
);

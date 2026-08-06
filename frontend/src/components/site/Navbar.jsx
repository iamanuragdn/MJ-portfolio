import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      data-testid="site-navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/10" : "border-b border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-4 md:px-12 h-16 md:h-20">
        <a href="#top" data-testid="nav-logo" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-signal rec-dot" />
          <span className="font-display text-2xl md:text-3xl tracking-wide leading-none">KADE MERCER</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="font-monoE text-xs uppercase tracking-[0.2em] text-ghost hover:text-white transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            data-testid="nav-cta"
            className="font-monoE text-xs uppercase tracking-[0.2em] border border-white/20 px-5 py-2.5 hover:bg-signal hover:border-signal hover:text-ink transition-colors duration-300"
          >
            Start a project
          </a>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col px-4 py-6 gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl tracking-wide text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "../../lib/kinetic";

const CHAPTERS = [
  {
    n: "01",
    title: "The story leads, the tools follow",
    body: "Software is just a scalpel. Before I touch a timeline I find the emotional spine of the footage — the single frame everything else should serve.",
  },
  {
    n: "02",
    title: "Rhythm is invisible, felt not seen",
    body: "A cut lands when the audience never notices it. I obsess over pacing, breath and negative space so the edit disappears and the feeling stays.",
  },
  {
    n: "03",
    title: "Color is a second script",
    body: "Grade is not a filter. It's mood, time of day, memory. I build looks that carry meaning from the first frame to the last.",
  },
];

const STATS = [
  { k: "10+", v: "Years editing" },
  { k: "420", v: "Projects delivered" },
  { k: "38M", v: "Views driven" },
  { k: "17", v: "Festival selections" },
];

export const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="bg-inkalt py-20 md:py-32 border-t border-white/10" data-testid="about-section">
      <div className="px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* portrait */}
          <div className="md:col-span-5 relative overflow-hidden">
            <div className="overflow-hidden">
              <motion.img
                style={{ y }}
                src="https://images.pexels.com/photos/31922581/pexels-photo-31922581.jpeg"
                alt="Kade Mercer"
                className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110"
              />
            </div>
            <div className="flex items-center justify-between mt-4 font-monoE text-[10px] uppercase tracking-[0.2em] text-ghost">
              <span>Kade Mercer</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-signal rec-dot" /> On set, 2025</span>
            </div>
          </div>

          {/* intro */}
          <div className="md:col-span-7 md:pl-8">
            <span className="font-monoE text-xs uppercase tracking-[0.3em] text-signal">02 — About</span>
            <Reveal>
              <h2 className="font-serif-e text-3xl md:text-5xl leading-tight text-white mt-5">
                I'm Kade — an editor who believes the best cut is the one you feel but never see.
              </h2>
            </Reveal>
            <p className="text-ghost text-base leading-relaxed mt-6 max-w-xl">
              For over a decade I've cut everything from festival shorts and music videos to global brand films and
              scroll-stopping social. My work sits at the intersection of craft and instinct — technical enough to
              deliver, emotional enough to matter.
            </p>

            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 mt-10">
              {STATS.map((s) => (
                <div key={s.v} className="bg-inkalt p-5 md:p-6">
                  <div className="font-display text-4xl md:text-5xl text-white leading-none">{s.k}</div>
                  <div className="font-monoE text-[10px] uppercase tracking-[0.15em] text-ghost mt-2">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* manifesto chapters */}
        <div className="mt-20 md:mt-32">
          <span className="font-monoE text-xs uppercase tracking-[0.3em] text-faint">Manifesto</span>
          <div className="mt-8 divide-y divide-white/10 border-t border-white/10">
            {CHAPTERS.map((c) => (
              <Reveal key={c.n}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 py-10 md:py-14 group">
                  <div className="md:col-span-3 font-serif-e text-6xl md:text-8xl text-faint group-hover:text-accent transition-colors duration-500 leading-none">
                    {c.n}
                  </div>
                  <h3 className="md:col-span-5 font-display text-3xl md:text-5xl uppercase tracking-tight leading-none text-white">
                    {c.title}
                  </h3>
                  <p className="md:col-span-4 text-ghost text-sm leading-relaxed self-center">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

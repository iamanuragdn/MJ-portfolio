import { useRef } from "react";
import portrait from "../../images/portrait.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "../../lib/kinetic";
// import portraitImg from '../images/portrait.jpg';

const CHAPTERS = [
  {
    n: "01",
    title: "CINEMATIC IS A FEELING, NOT A FILTER",
    body: "Mood is built through pacing, light, sound, and color—not just LUTs.",
  },
  {
    n: "02",
    title: "EVERY REEL DESERVES A REASON TO EXIST",
    body: "Whether it's 15 seconds or 5 minutes, every edit should leave the audience with something.",
  },
  {
    n: "03",
    title: "STORY COMES BEFORE STYLE",
    body: "Transitions impress for a moment. Stories stay with people long after the screen goes dark.",
  },
];

const STATS = [
  { k: "2+", v: "Years editing" },
  { k: "20", v: "Reels / shots" },
  { k: "30k", v: "Views driven" },
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
                    style={{ y, objectPosition: "30% 50%" }}
                    src={portrait}
                    alt="Manjoy Debnath"
                    className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110"
                  />
            </div>
            <div className="flex items-center justify-between mt-4 font-monoE text-[10px] uppercase tracking-[0.2em] text-ghost">
              <span>Manjoy Debnath</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-signal rec-dot" /> On set, 2025</span>
            </div>
          </div>

          {/* intro */}
          <div className="md:col-span-7 md:pl-8">
            <span className="font-monoE text-xs uppercase tracking-[0.3em] text-signal">02 — About</span>
            <Reveal>
              <h2 className="font-serif-e text-3xl md:text-5xl leading-tight text-white mt-5">
                I'm MJ — I don't chase perfect edits. I chase the feeling people remember after the screen goes black.
              </h2>
            </Reveal>
            <p className="text-ghost text-base leading-relaxed mt-6 max-w-xl">
              For me, editing isn't about adding effects—it's about finding the emotion hidden inside the footage. Through thoughtful pacing, color, and storytelling, I craft vlogs, cinematic reels, music videos, and films that connect long after the final frame.
            </p>

            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-10">
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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 py-10 md:py-14 group items-center">
                  <div className="md:col-span-3 font-serif-e text-6xl md:text-8xl text-faint group-hover:text-accent transition-colors duration-500 leading-none flex items-center justify-center md:justify-start">
                    {c.n}
                  </div>
                  <h3 className="md:col-span-5 font-display text-3xl md:text-5xl uppercase tracking-tight leading-none text-white self-center">
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

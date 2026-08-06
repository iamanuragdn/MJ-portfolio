import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import { KineticLines } from "../../lib/kinetic";

export const Hero = ({ onShowreel }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-ink" data-testid="hero-section">
      {/* Parallax background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/13812458/pexels-photo-13812458.jpeg"
          alt="Cinematic set"
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
      </motion.div>

      {/* Top meta bar */}
      <motion.div
        style={{ opacity }}
        className="absolute top-20 md:top-28 left-4 md:left-12 right-4 md:right-12 flex justify-between font-monoE text-[10px] md:text-xs uppercase tracking-[0.25em] text-ghost"
      >
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-signal rec-dot" /> Rec · Editing since 2014</span>
        <span className="hidden sm:block">Based in Los Angeles</span>
        <span>Film / Commercial / Social</span>
      </motion.div>

      {/* Kinetic headline */}
      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-center px-4 md:px-12">
        <div className="font-monoE text-xs uppercase tracking-[0.3em] text-signal mb-6 md:mb-8 overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
          >
            Video Editor & Colorist
          </motion.span>
        </div>

        <KineticLines
          delay={0.5}
          className="font-display uppercase leading-[0.82] tracking-tight text-white text-[19vw] md:text-[15vw] lg:text-[13vw]"
          lines={["Cutting", <>frames into <span className="text-accent">feeling</span></>]}
        />

        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row sm:items-center gap-6 md:gap-10">
          <motion.button
            data-testid="hero-showreel-btn"
            onClick={onShowreel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="group flex items-center gap-4"
          >
            <span className="grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/30 group-hover:bg-signal group-hover:border-signal transition-colors duration-300">
              <Play className="w-5 h-5 fill-white group-hover:fill-ink transition-colors duration-300" />
            </span>
            <span className="font-monoE text-xs uppercase tracking-[0.2em] text-white">Watch Showreel</span>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="max-w-xs text-sm text-ghost leading-relaxed"
          >
            I shape rhythm, pace and color for films, brands and creators — turning raw footage into stories people finish.
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ghost"
      >
        <span className="font-monoE text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
};

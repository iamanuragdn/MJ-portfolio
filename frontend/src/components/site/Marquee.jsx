import { motion } from "framer-motion";

const WORDS = [
  "Storytelling",
  "Reels",
  "Shorts",
  "Gaming",
  "Vlogs",
  "Mvs",
  "Cinematics",
  "Pacing",
  "Retiming",
  "Keyframing",
];

export const Marquee = () => {
  const loop = [...WORDS, ...WORDS];
  return (
    <section className="border-y border-white/10 bg-inkalt py-6 md:py-8 overflow-hidden" data-testid="marquee">
      <motion.div
        className="marquee-track"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {loop.concat(loop).map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="font-serif-e italic text-2xl md:text-4xl uppercase tracking-widest text-white/40 px-6 md:px-10">
              {w}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-signal/70" />
          </span>
        ))}
      </motion.div>
    </section>
  );
};

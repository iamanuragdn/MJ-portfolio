import { motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1];

// Masked line-by-line kinetic reveal. Pass an array of lines.
export function KineticLines({ lines, className = "", delay = 0, stagger = 0.12, as = "div" }) {
  const Wrapper = motion[as] || motion.div;
  return (
    <Wrapper
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={className}
    >
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 1, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}

// Simple whileInView reveal for a single block.
export function Reveal({ children, className = "", delay = 0, y = 40 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

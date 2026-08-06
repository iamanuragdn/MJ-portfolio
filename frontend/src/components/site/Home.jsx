import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Work } from "./Work";
import { About } from "./About";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const SHOWREEL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

export const Home = () => {
  const [reel, setReel] = useState(false);
  return (
    <>
      <Navbar />
      <main>
        <Hero onShowreel={() => setReel(true)} />
        <Marquee />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />

      <AnimatePresence>
        {reel && (
          <motion.div
            data-testid="showreel-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-lg grid place-items-center p-4 md:p-10"
            onClick={() => setReel(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
              className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}
            >
              <button
                data-testid="showreel-close"
                onClick={() => setReel(false)}
                className="absolute -top-12 right-0 flex items-center gap-2 font-monoE text-xs uppercase tracking-[0.2em] text-white hover:text-signal transition-colors"
              >
                Close <X className="w-4 h-4" />
              </button>
              <video src={SHOWREEL} controls autoPlay playsInline className="w-full aspect-video bg-black border border-white/10" />
              <p className="mt-4 font-monoE text-xs uppercase tracking-[0.2em] text-ghost">Showreel 2025 · Kade Mercer</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

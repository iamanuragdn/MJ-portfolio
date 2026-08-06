import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { PROJECTS as FALLBACK } from "../../data/projects";
import { Reveal } from "../../lib/kinetic";
import { API, mediaUrl } from "../../lib/media";

const Card = ({ project, onOpen }) => {
  const videoRef = useRef(null);
  const onEnter = () => {
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  };
  const onLeave = () => { const v = videoRef.current; if (v) v.pause(); };

  return (
    <motion.button
      data-testid={`project-card-${project.id}`}
      onClick={() => onOpen(project)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      whileHover={{ scale: 0.995 }}
      className={`group relative overflow-hidden bg-ink text-left ${project.span} min-h-[46vw] md:min-h-[22vw]`}
    >
      <img
        src={mediaUrl(project.poster)}
        alt={project.title}
        className="absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-30 transition-opacity duration-500"
      />
      <video
        ref={videoRef}
        src={mediaUrl(project.video)}
        muted loop playsInline preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-60 transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/20 transition-colors duration-500" />
      <div className="relative z-10 flex items-start justify-between p-5 md:p-7">
        <span className="font-monoE text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/80 border border-white/20 px-3 py-1 backdrop-blur-sm">
          {project.category}
        </span>
        <span className="font-monoE text-[10px] md:text-xs text-white/70">{project.year}</span>
      </div>
      <div className="absolute inset-0 z-10 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="grid place-items-center w-16 h-16 rounded-full bg-signal">
          <Play className="w-6 h-6 fill-ink text-ink translate-x-0.5" />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-7 flex items-end justify-between">
        <div>
          <h3 className="font-display text-4xl md:text-6xl leading-none tracking-tight text-white">{project.title}</h3>
          <p className="font-monoE text-[10px] md:text-xs uppercase tracking-[0.15em] text-ghost mt-2">
            {project.client} · {project.role}
          </p>
        </div>
        <span className="font-monoE text-xs text-white/70 whitespace-nowrap">{project.runtime}</span>
      </div>
    </motion.button>
  );
};

export const Work = () => {
  const [active, setActive] = useState(null);
  const [projects, setProjects] = useState(FALLBACK);

  useEffect(() => {
    axios.get(`${API}/projects`)
      .then((r) => { if (Array.isArray(r.data) && r.data.length) setProjects(r.data); })
      .catch(() => {});
  }, []);

  return (
    <section id="work" className="bg-ink py-20 md:py-32" data-testid="work-section">
      <div className="px-4 md:px-12 mb-12 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <Reveal>
          <span className="font-monoE text-xs uppercase tracking-[0.3em] text-signal">01 — Selected Work</span>
          <h2 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tight text-white mt-4">
            The Cutting Room
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-sm text-sm text-ghost leading-relaxed">
            A cross-section of films, music videos, brand spots and social edits. Hover to preview — click to play the full reel.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/10 border-y border-white/10">
        {projects.map((p) => (
          <Card key={p.id} project={p} onOpen={setActive} />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            data-testid="project-lightbox"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-lg grid place-items-center p-4 md:p-10"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
              className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}
            >
              <button
                data-testid="lightbox-close"
                onClick={() => setActive(null)}
                className="absolute -top-12 right-0 flex items-center gap-2 font-monoE text-xs uppercase tracking-[0.2em] text-white hover:text-signal transition-colors"
              >
                Close <X className="w-4 h-4" />
              </button>
              <video
                src={mediaUrl(active.video)} poster={mediaUrl(active.poster)}
                controls autoPlay playsInline
                className="w-full aspect-video bg-black border border-white/10"
              />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-4xl md:text-5xl tracking-tight text-white">{active.title}</h3>
                <p className="font-monoE text-xs uppercase tracking-[0.15em] text-ghost">
                  {active.client} · {active.role} · {active.runtime}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

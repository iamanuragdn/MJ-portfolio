import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Loader2, Copy } from "lucide-react";
import { Reveal } from "../../lib/kinetic";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api`;

const TYPES = ["Short Film", "Music Video", "Commercial", "Social / Reels", "Docu-Series", "Other"];

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", project_type: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Message sent — I'll be in touch within 48 hours.");
      setForm({ name: "", email: "", project_type: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  const CONTACT_EMAIL = "debnathmanjoy@gmail.com";
  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    toast.success("Email copied to clipboard");
  };

  return (
    <section id="contact" className="bg-ink py-20 md:py-32 border-t border-white/10" data-testid="contact-section">
      <div className="px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20">
        {/* Left — big type + info */}
        <div>
          <span className="font-monoE text-xs uppercase tracking-[0.3em] text-signal">03 — Contact</span>
          <h2 className="font-display text-7xl sm:text-8xl lg:text-[9vw] leading-[0.82] tracking-tight text-white mt-5">
            Let's <span className="text-accent">talk</span>
          </h2>
          <p className="text-ghost text-base leading-relaxed mt-6 max-w-md">
            Have footage that deserves a great cut? Tell me about your project and I'll get back within 48 hours.
          </p>

          <div className="mt-12 space-y-8">
            <div className="mt-6">
              <button
                onClick={copyEmail}
                data-testid="copy-email"
                className="group flex items-center gap-3 text-left"
              >
                <div>
                  <div className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Email</div>
                  <div className="font-serif-e text-2xl md:text-3xl text-white group-hover:text-accent transition-colors">
                    {CONTACT_EMAIL}
                  </div>
                </div>
                <Copy className="w-4 h-4 text-faint group-hover:text-accent transition-colors" />
              </button>

              <div className="flex gap-12 mt-6">
                <div>
                  <div className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Based in</div>
                  <div className="text-white mt-1">Chandigarh, India</div>
                  <div className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint mt-2">Available</div>
                  <div className="text-white mt-1">Worldwide • Remote</div>
                </div>
                <div>
                  <div className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Socials</div>
                  <div className="flex flex-col gap-1 mt-1 font-monoE text-sm">
                    <div className="flex gap-4 mt-1">
                      <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white hover:text-accent transition-colors">Instagram</a>
                      <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-white hover:text-accent transition-colors">YouTube</a>
                      <a href="https://discordapp.com/users/1066298444102238208" target="_blank" rel="noreferrer" className="text-white hover:text-accent transition-colors">Discord</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Right — form */}
        <Reveal delay={0.1}>
          <form onSubmit={submit} data-testid="contact-form" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Your name</label>
              <input
                data-testid="contact-name"
                value={form.name}
                onChange={set("name")}
                placeholder="Director"
                className="bg-transparent border-b border-white/20 rounded-none py-3 text-white placeholder:text-faint focus:border-signal focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Email</label>
              <input
                data-testid="contact-email"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@studio.com"
                className="bg-transparent border-b border-white/20 rounded-none py-3 text-white placeholder:text-faint focus:border-signal focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Project type</label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    data-testid={`type-${t}`}
                    onClick={() => setForm((f) => ({ ...f, project_type: t }))}
                    className={`font-monoE text-[11px] uppercase tracking-[0.15em] px-4 py-2 border transition-colors ${
                      form.project_type === t
                        ? "bg-signal border-signal text-ink"
                        : "border-white/20 text-ghost hover:border-white/60 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Tell me about it</label>
              <textarea
                data-testid="contact-message"
                value={form.message}
                onChange={set("message")}
                rows={4}
                placeholder="Footage, timeline, vibe, deadline..."
                className="bg-transparent border-b border-white/20 rounded-none py-3 text-white placeholder:text-faint focus:border-signal focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              data-testid="contact-submit"
              disabled={sending}
              className="group mt-2 inline-flex items-center justify-center gap-3 bg-signal text-ink font-monoE text-xs uppercase tracking-[0.25em] px-8 py-5 hover:bg-white transition-colors disabled:opacity-60"
            >
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending</> : <>Send message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

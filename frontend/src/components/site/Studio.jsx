import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { UploadCloud, Loader2, Trash2, Film, Image as ImageIcon, ArrowLeft, Check } from "lucide-react";
import { API, mediaUrl } from "../../lib/media";

const EMPTY = { title: "", client: "", category: "Short Film", year: "2025", role: "Editor", runtime: "", span: "md:col-span-6" };
const CATEGORIES = ["Short Film", "Music Video", "Commercial", "Docu-Series", "Reels / Shorts"];
const SPANS = [
  { v: "md:col-span-8", label: "Wide" },
  { v: "md:col-span-6", label: "Half" },
  { v: "md:col-span-4", label: "Narrow" },
];

const FileDrop = ({ label, accept, kind, fileMeta, onUploaded, testid, icon: Icon }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handle = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await axios.post(`${API}/upload?kind=${kind}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(r.data.url);
      toast.success(`${label} uploaded`);
    } catch (e) {
      toast.error(`Upload failed: ${e?.response?.data?.detail || "try again"}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      data-testid={testid}
      onClick={() => inputRef.current?.click()}
      className="relative flex flex-col items-center justify-center gap-3 border border-dashed border-white/20 hover:border-signal aspect-video w-full transition-colors bg-inkalt overflow-hidden group"
    >
      {fileMeta ? (
        kind === "video" ? (
          <video src={mediaUrl(fileMeta)} muted className="absolute inset-0 h-full w-full object-cover opacity-60" />
        ) : (
          <img src={mediaUrl(fileMeta)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )
      ) : null}
      <div className="relative z-10 flex flex-col items-center gap-2 text-ghost group-hover:text-white transition-colors">
        {busy ? <Loader2 className="w-7 h-7 animate-spin" /> : fileMeta ? <Check className="w-7 h-7 text-signal" /> : <Icon className="w-7 h-7" />}
        <span className="font-monoE text-[10px] uppercase tracking-[0.2em]">
          {busy ? "Uploading" : fileMeta ? `${label} ready — replace` : `Upload ${label}`}
        </span>
      </div>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => handle(e.target.files?.[0])} />
    </button>
  );
};

export const Studio = () => {
  const [form, setForm] = useState(EMPTY);
  const [poster, setPoster] = useState("");
  const [video, setVideo] = useState("");
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);

  const load = () => axios.get(`${API}/projects`).then((r) => setProjects(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.runtime || !poster || !video) {
      toast.error("Add a title, runtime, poster image and video.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${API}/projects`, { ...form, poster, video });
      toast.success("Project published to your portfolio");
      setForm(EMPTY); setPoster(""); setVideo("");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not save project");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`);
      toast.success("Project removed");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-ink text-white px-4 md:px-12 py-10 md:py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="font-monoE text-xs uppercase tracking-[0.3em] text-signal flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal rec-dot" /> Studio · Manage Work
          </span>
          <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tight mt-3">Upload a Reel</h1>
        </div>
        <Link to="/" data-testid="back-to-site" className="font-monoE text-xs uppercase tracking-[0.2em] text-ghost hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> View site
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* form */}
        <form onSubmit={save} data-testid="studio-form" className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-5">
            <FileDrop label="Poster" accept="image/*" kind="image" fileMeta={poster} onUploaded={setPoster} testid="upload-poster" icon={ImageIcon} />
            <FileDrop label="Video" accept="video/*" kind="video" fileMeta={video} onUploaded={setVideo} testid="upload-video" icon={Film} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Title" testid="field-title" value={form.title} onChange={set("title")} placeholder="NOCTURNE" />
            <Field label="Client" testid="field-client" value={form.client} onChange={set("client")} placeholder="A24 x Independent" />
            <Field label="Runtime" testid="field-runtime" value={form.runtime} onChange={set("runtime")} placeholder="07:42" />
            <Field label="Year" testid="field-year" value={form.year} onChange={set("year")} placeholder="2025" />
            <Field label="Role" testid="field-role" value={form.role} onChange={set("role")} placeholder="Editor · Colorist" />
            <div className="flex flex-col gap-2">
              <label className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Category</label>
              <select
                data-testid="field-category"
                value={form.category}
                onChange={set("category")}
                className="bg-transparent border-b border-white/20 rounded-none py-3 text-white focus:border-signal focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c} className="bg-ink">{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">Grid size</label>
            <div className="flex gap-2">
              {SPANS.map((s) => (
                <button
                  key={s.v} type="button" onClick={() => setForm((f) => ({ ...f, span: s.v }))}
                  className={`font-monoE text-[11px] uppercase tracking-[0.15em] px-4 py-2 border transition-colors ${form.span === s.v ? "bg-signal border-signal text-ink" : "border-white/20 text-ghost hover:text-white"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit" data-testid="studio-submit" disabled={saving}
            className="mt-2 inline-flex items-center justify-center gap-3 bg-signal text-ink font-monoE text-xs uppercase tracking-[0.25em] px-8 py-5 hover:bg-white transition-colors disabled:opacity-60"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing</> : <><UploadCloud className="w-4 h-4" /> Publish project</>}
          </button>
        </form>

        {/* list */}
        <div>
          <h2 className="font-monoE text-xs uppercase tracking-[0.3em] text-faint mb-6">Published — {projects.length}</h2>
          <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            {projects.map((p) => (
              <div key={p.id} data-testid={`studio-item-${p.id}`} className="flex items-center gap-4 py-4">
                <img src={mediaUrl(p.poster)} alt="" className="w-20 h-12 object-cover bg-inkalt" />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-2xl leading-none truncate">{p.title}</div>
                  <div className="font-monoE text-[10px] uppercase tracking-[0.15em] text-ghost mt-1">{p.category} · {p.year}</div>
                </div>
                <button onClick={() => remove(p.id)} data-testid={`delete-${p.id}`} className="text-faint hover:text-signal transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {projects.length === 0 && <p className="py-8 text-ghost text-sm">No projects yet — upload your first reel.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, testid, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="font-monoE text-[10px] uppercase tracking-[0.2em] text-faint">{label}</label>
    <input
      data-testid={testid}
      {...props}
      className="bg-transparent border-b border-white/20 rounded-none py-3 text-white placeholder:text-faint focus:border-signal focus:outline-none transition-colors"
    />
  </div>
);

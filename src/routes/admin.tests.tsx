import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { fetchTests, addTest, updateTest, deleteTest } from "@/lib/tests-service";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { MedicalTest, Availability } from "@/lib/seed-data";
import { Plus, Pencil, Trash2, Loader2, X, Upload, AlertCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/tests")({
  component: AdminTests,
});

const empty: Omit<MedicalTest, "id"> = { name: "", description: "", availability: "Both", duration: "24 hrs", category: "Blood", sampleReportUrl: "" };

function AdminTests() {
  const [tests, setTests] = useState<MedicalTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MedicalTest | null>(null);
  const [showForm, setShowForm] = useState(false);

  const refresh = () => { setLoading(true); fetchTests().then((t) => { setTests(t); setLoading(false); }); };
  useEffect(refresh, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this test?")) return;
    try { await deleteTest(id); refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : "Failed"); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Medical Tests</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tests.length} tests in catalog</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
          <Plus className="h-4 w-4" /> Add Test
        </button>
      </div>

      {!isFirebaseConfigured && (
        <div className="mt-6 flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-warning-foreground" />
          <div className="text-warning-foreground">
            <p className="font-semibold">Read-only mode</p>
            <p className="text-xs mt-1">You're viewing seed data. Configure Firebase to add/edit tests.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold">Test Name</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Availability</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-5 py-3 font-medium">{t.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.category}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.availability}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.duration}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button onClick={() => { setEditing(t); setShowForm(true); }} disabled={!isFirebaseConfigured} className="rounded-lg p-2 text-foreground/70 hover:bg-secondary hover:text-primary disabled:opacity-40">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => onDelete(t.id)} disabled={!isFirebaseConfigured} className="rounded-lg p-2 text-foreground/70 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && <TestForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); refresh(); }} />}
    </div>
  );
}

function TestForm({ initial, onClose, onSaved }: { initial: MedicalTest | null; onClose: () => void; onSaved: () => void }) {
  const [data, setData] = useState<Omit<MedicalTest, "id">>(initial ? { name: initial.name, description: initial.description, availability: initial.availability, duration: initial.duration, category: initial.category, sampleReportUrl: initial.sampleReportUrl || "" } : empty);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onUpload = async (file: File) => {
    if (!isCloudinaryConfigured) { setError("Cloudinary not configured. Edit src/lib/cloudinary.ts"); return; }
    setUploading(true); setError("");
    try { const { url } = await uploadToCloudinary(file); setData({ ...data, sampleReportUrl: url }); }
    catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (initial) await updateTest(initial.id, data);
      else await addTest(data);
      onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-elevated max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg font-bold">{initial ? "Edit Test" : "Add Test"}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <Field label="Test Name"><input required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className={inputCls} /></Field>
          <Field label="Description"><textarea required rows={3} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Availability">
              <select value={data.availability} onChange={(e) => setData({ ...data, availability: e.target.value as Availability })} className={inputCls}>
                <option value="Lab">Lab</option><option value="Home">Home</option><option value="Both">Both</option>
              </select>
            </Field>
            <Field label="Duration"><input required value={data.duration} onChange={(e) => setData({ ...data, duration: e.target.value })} className={inputCls} placeholder="24 hrs" /></Field>
          </div>
          <Field label="Category">
            <select value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} className={inputCls}>
              {["Blood", "Thyroid", "ECG", "EEG", "Allergy"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">Cancel</button>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-gradient-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}

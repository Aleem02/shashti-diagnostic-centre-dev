import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { fetchTests, addTest, updateTest, deleteTest } from "@/lib/tests-service";
import { isFirebaseConfigured, uploadFileToStorage } from "@/lib/firebase";

import type { MedicalTest, Availability } from "@/lib/seed-data";
import { Plus, Pencil, Trash2, Loader2, X, Upload, AlertCircle, FileText, Copy } from "lucide-react";

export const Route = createFileRoute("/admin/tests")({
  component: AdminTests,
});

const empty: Omit<MedicalTest, "id"> = { name: "", description: "", availability: "Both", duration: "24 hrs", category: "Blood", sampleReportUrl: "", price: null as any, discountPrice: null as any, hidePrice: false };

function AdminTests() {
  const [tests, setTests] = useState<MedicalTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MedicalTest | null>(null);
  const [copying, setCopying] = useState<MedicalTest | null>(null);
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
        <button onClick={() => { setEditing(null); setCopying(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 cursor-pointer">
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
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => {
                  const isSample = /^\d+$/.test(t.id);
                  return (
                  <tr key={t.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-5 py-3">
                      <div className="font-medium">{t.name}</div>
                      {isSample && <span className="inline-block mt-0.5 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sample</span>}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{t.category}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.availability}</td>
                    <td className="px-5 py-3 text-muted-foreground">{t.duration}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {t.price ? (
                            <span>
                              {t.discountPrice ? (
                                <>
                                  <span className="line-through opacity-50 mr-2">₹{t.price}</span>
                                  <span className="text-accent font-bold">₹{t.discountPrice}</span>
                                </>
                              ) : (
                                `₹${t.price}`
                              )}
                            </span>
                          ) : "-"}
                          {t.hidePrice && <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-destructive">Hidden</span>}
                        </div>
                      </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button 
                          onClick={() => { 
                            if (isSample) {
                              setCopying(t);
                              setEditing(null);
                            } else {
                              setEditing(t);
                              setCopying(null);
                            }
                            setShowForm(true); 
                          }}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
                          title={isSample ? "Edit (Creates editable copy)" : "Edit Test"}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {!isSample && (
                          <button 
                            onClick={() => onDelete(t.id)}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <TestForm 
          initial={editing} 
          testToCopy={copying} 
          onClose={() => setShowForm(false)} 
          onSaved={() => { setShowForm(false); refresh(); }} 
        />
      )}
    </div>
  );
}

function TestForm({ initial, testToCopy, onClose, onSaved }: { initial: MedicalTest | null; testToCopy?: MedicalTest | null; onClose: () => void; onSaved: () => void }) {
  const [data, setData] = useState<Omit<MedicalTest, "id">>(() => {
    const source = initial || testToCopy;
    return source ? { 
      name: source.name, 
      description: source.description, 
      availability: source.availability, 
      duration: source.duration, 
      category: source.category, 
      sampleReportUrl: source.sampleReportUrl || "",
      price: source.price ?? null,
      discountPrice: source.discountPrice ?? null,
      hidePrice: source.hidePrice ?? false
    } : empty;
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onUpload = async (file: File) => {
    if (!isFirebaseConfigured) { setError("Firebase not configured"); return; }
    setUploading(true); setError("");
    try { const { url } = await uploadFileToStorage(file, "test_images"); setData({ ...data, sampleReportUrl: url }); }
    catch (e) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setUploading(false); }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    
    // Remove undefined values, but KEEP nulls (to clear fields in Firestore)
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    try {
      if (initial) await updateTest(initial.id, cleanData as any);
      else await addTest(cleanData as any);
      onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-elevated max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg font-bold">
            {initial ? "Edit Test" : testToCopy ? "Create from Sample" : "Add Test"}
          </h2>
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (Optional)">
              <input type="number" value={data.price ?? ""} onChange={(e) => setData({ ...data, price: e.target.value ? Number(e.target.value) : null as any })} className={inputCls} placeholder="e.g. 500" />
            </Field>
            <Field label="Discount Price (Optional)">
              <input type="number" value={data.discountPrice ?? ""} onChange={(e) => setData({ ...data, discountPrice: e.target.value ? Number(e.target.value) : null as any })} className={inputCls} placeholder="e.g. 450" />
            </Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={data.hidePrice} 
              onChange={(e) => setData({ ...data, hidePrice: e.target.checked })}
              className="h-4 w-4 accent-foreground"
            />
            <span className="text-sm font-medium">Hide price from public website</span>
          </label>
          {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">Cancel</button>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-gradient-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60">
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

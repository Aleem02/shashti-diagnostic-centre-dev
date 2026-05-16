import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { fetchTestProfiles, addTestProfile, updateTestProfile, deleteTestProfile } from "@/lib/tests-service";
import { isFirebaseConfigured, uploadFileToStorage } from "@/lib/firebase";

import type { TestProfile, Availability } from "@/lib/seed-data";
import { Plus, Pencil, Trash2, Loader2, X, Star, AlertCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/test-profiles")({
  component: AdminTestProfiles,
});

const empty: Omit<TestProfile, "id"> = { 
  name: "", 
  description: "", 
  availability: "Both", 
  duration: "24 hrs", 
  sampleReportUrl: "", 
  price: null, 
  discountPrice: null, 
  hidePrice: false,
  includedTests: [],
  slug: "",
  category: "Test Profiles",
  requirements: [
    "No special preparation needed"
  ],
  featured: false
};

function AdminTestProfiles() {
  const [profiles, setProfiles] = useState<TestProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TestProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null); // null means all

  const refresh = () => { 
    setLoading(true); 
    setSelectedIds([]);
    fetchTestProfiles().then((p) => { 
      setProfiles(p); 
      setLoading(false); 
    }); 
  };
  
  useEffect(refresh, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this test profile?")) return;
    try { 
      await deleteTestProfile(id); 
      refresh(); 
    } catch (e) { 
      alert(e instanceof Error ? e.message : "Failed"); 
    }
  };

  const toggleFeatured = async (p: TestProfile) => {
    try {
      await updateTestProfile(p.id, { featured: !p.featured });
      refresh();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  const onBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected profiles?`)) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => deleteTestProfile(id)));
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Bulk delete failed");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterFeatured === null || p.featured === filterFeatured;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Test Profiles (Packages)</h1>
          <p className="mt-1 text-sm text-muted-foreground">{profiles.length} profiles in catalog</p>
        </div>
        
        <div className="flex flex-1 max-w-2xl gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search packages by name or info..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
          
          <div className="flex rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => setFilterFeatured(null)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterFeatured === null ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilterFeatured(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterFeatured === true ? "bg-amber-500/10 text-amber-600" : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <Star className={cn("h-3 w-3", filterFeatured === true && "fill-amber-500")} />
              Featured
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button onClick={onBulkDelete} disabled={isBulkDeleting}
              className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground shadow-glow hover:opacity-90 disabled:opacity-60 cursor-pointer">
              {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete ({selectedIds.length})
            </button>
          )}
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 cursor-pointer">
            <Plus className="h-4 w-4" /> Add Profile
          </button>
        </div>
      </div>

      {!isFirebaseConfigured && (
        <div className="mt-6 flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-warning-foreground" />
          <div className="text-warning-foreground">
            <p className="font-semibold">Read-only mode</p>
            <p className="text-xs mt-1">Configure Firebase to manage test profiles.</p>
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
                  <th className="px-5 py-3 font-semibold w-12">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === profiles.length && profiles.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(profiles.map(p => p.id));
                        else setSelectedIds([]);
                      }}
                      className="h-4 w-4 accent-primary rounded cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-3 font-semibold">Profile Name</th>
                  <th className="px-5 py-3 font-semibold">Availability</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold text-center">Featured</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className={`border-t border-border hover:bg-secondary/30 transition-colors ${selectedIds.includes(p.id) ? 'bg-secondary/40' : ''}`}>
                    <td className="px-5 py-3">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(p.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds([...selectedIds, p.id]);
                          else setSelectedIds(selectedIds.filter(id => id !== p.id));
                        }}
                        className="h-4 w-4 accent-primary rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium">{p.name}</div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{p.availability}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.duration}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {p.price ? (
                            <span>
                              {p.discountPrice ? (
                                <>
                                  <span className="line-through opacity-50 mr-2">₹{p.price}</span>
                                  <span className="text-accent font-bold">₹{p.discountPrice}</span>
                                </>
                              ) : (
                                `₹${p.price}`
                              )}
                            </span>
                          ) : "-"}
                          {p.hidePrice && <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-destructive">Hidden</span>}
                        </div>
                      </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={cn(
                          "p-2 rounded-lg transition-all hover:scale-110 active:scale-90",
                          p.featured ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30 hover:text-amber-500/50"
                        )}
                        title={p.featured ? "Remove from Homepage" : "Show on Homepage"}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button 
                          onClick={() => { setEditing(p); setShowForm(true); }}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(p.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                        >
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

      {showForm && (
        <ProfileForm 
          initial={editing} 
          onClose={() => setShowForm(false)} 
          onSaved={() => { setShowForm(false); refresh(); }} 
        />
      )}
    </div>
  );
}

function TestTagInput({ tags, setTags }: { tags: string[]; setTags: (tags: string[]) => void }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 p-3 min-h-[80px] rounded-xl border border-border bg-secondary/5">
        {tags.length === 0 && <span className="text-muted-foreground text-xs italic p-1">No tests added yet...</span>}
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary group transition-all hover:bg-primary/20">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(i)}
              className="hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={addTag}
          className={inputCls} 
          placeholder="Type test name & press Enter or Comma..." 
        />
        <button 
          type="button" 
          onClick={addTag}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-secondary/80 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ProfileForm({ initial, onClose, onSaved }: { initial: TestProfile | null; onClose: () => void; onSaved: () => void }) {
  const [data, setData] = useState<Omit<TestProfile, "id">>(() => initial ? { 
    name: initial.name, 
    description: initial.description, 
    availability: initial.availability, 
    duration: initial.duration, 
    sampleReportUrl: initial.sampleReportUrl || "",
    price: initial.price ?? null,
    discountPrice: initial.discountPrice ?? null,
    hidePrice: initial.hidePrice ?? false,
    includedTests: initial.includedTests || [],
    slug: initial.slug || "",
    category: initial.category || "Test Profiles",
    requirements: initial.requirements || [
      "No special preparation needed"
    ],
    featured: initial.featured ?? false
  } : empty);
  
  const [requirementsStr, setRequirementsStr] = useState("");

  useEffect(() => {
    if (initial) {
      setRequirementsStr(initial.requirements?.join("\n") || "");
    } else {
      setRequirementsStr(empty.requirements?.join("\n") || "");
    }
  }, [initial]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); 
    setBusy(true); 
    setError("");
    
    // Process requirements into array
    const finalData = {
      ...data,
      requirements: requirementsStr.split("\n").map(t => t.trim()).filter(t => t)
    };

    const cleanData = Object.fromEntries(
      Object.entries(finalData).filter(([_, v]) => v !== undefined)
    );

    try {
      if (initial) await updateTestProfile(initial.id, cleanData as any);
      else await addTestProfile(cleanData as any);
      onSaved();
    } catch (err) { 
      setError(err instanceof Error ? err.message : "Save failed"); 
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-elevated max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg font-bold">
            {initial ? "Edit Profile" : "Add Test Profile"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-5">
          <Field label="Profile Name"><input required value={data.name} onChange={(e) => {
            const name = e.target.value;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setData({ ...data, name, slug });
          }} className={inputCls} /></Field>
          <Field label="Description"><textarea required rows={2} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} className={inputCls} placeholder="Brief summary of the package..." /></Field>
          
          <Field label="Tests Included (Smart Selection)">
            <TestTagInput 
              tags={data.includedTests} 
              setTags={(tags) => setData({ ...data, includedTests: tags })} 
            />
          </Field>

          <Field label="Preparation & Requirements (One per line)"><textarea required rows={3} value={requirementsStr} onChange={(e) => setRequirementsStr(e.target.value)} className={inputCls} placeholder="Fasting required..." /></Field>
          
          <div className="grid grid-cols-2 gap-3">
            <Field label="Availability">
              <select value={data.availability} onChange={(e) => setData({ ...data, availability: e.target.value as Availability })} className={inputCls}>
                <option value="Lab">Lab</option><option value="Home">Home</option><option value="Both">Both</option>
              </select>
            </Field>
            <Field label="Duration"><input required value={data.duration} onChange={(e) => setData({ ...data, duration: e.target.value })} className={inputCls} placeholder="24 hrs" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (Optional)">
              <input type="number" value={data.price ?? ""} onChange={(e) => setData({ ...data, price: e.target.value ? Number(e.target.value) : null })} className={inputCls} placeholder="e.g. 2000" />
            </Field>
            <Field label="Discount Price (Optional)">
              <input type="number" value={data.discountPrice ?? ""} onChange={(e) => setData({ ...data, discountPrice: e.target.value ? Number(e.target.value) : null })} className={inputCls} placeholder="e.g. 1500" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={data.hidePrice} 
                onChange={(e) => setData({ ...data, hidePrice: e.target.checked })}
                className="h-4 w-4 accent-primary rounded"
              />
              <span className="text-sm font-medium">Hide Price</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={data.featured} 
                onChange={(e) => setData({ ...data, featured: e.target.checked })}
                className="h-4 w-4 accent-primary rounded"
              />
              <span className="text-sm font-medium text-primary">Show on Homepage (Featured)</span>
            </label>
          </div>
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

const inputCls = "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}

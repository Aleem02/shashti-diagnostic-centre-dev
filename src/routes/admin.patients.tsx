import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, FileUp, Loader2, CheckCircle2, Phone, User, TestTube } from "lucide-react";
import { createOrUpdatePatient, uploadPatientReport, uploadReportToStorage } from "@/lib/patient-service";
// Keep Cloudinary for other potential uses if needed, but remove from report upload

export const Route = createFileRoute("/admin/patients")({
  component: AdminPatientsPage,
});

function AdminPatientsPage() {
  return (
    <div className="space-y-8 animate-rise">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Patient Access Control</h1>
        <p className="text-muted-foreground mt-1">Manage patient logins and upload diagnostic reports.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <PatientLoginSection />
        <ReportUploadSection />
      </div>

      <PatientListSection />

      <ManageReportsSection />
    </div>
  );
}

function ManageReportsSection() {
  const [searchPhone, setSearchPhone] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone) return;
    setLoading(true); setError("");
    try {
      const results = await fetchPatientReports(searchPhone);
      setReports(results);
      if (results.length === 0) setError("No reports found for this number.");
    } catch (err) {
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await deletePatientReport(id);
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
          <TestTube className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl font-bold">Manage Existing Reports</h2>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="tel" 
            value={searchPhone} 
            onChange={e => setSearchPhone(e.target.value)} 
            placeholder="Search reports by mobile number..." 
            className={inputCls + " pl-10"} 
          />
        </div>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-semibold transition cursor-pointer">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="text-sm text-destructive mb-4">{error}</div>}

      <div className="space-y-3">
        {reports.map(r => (
          <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-secondary/20">
            <div>
              <div className="font-semibold text-sm">{r.patientName}</div>
              <div className="text-xs text-muted-foreground">{r.testName} · {r.createdAt?.toDate().toLocaleDateString()}</div>
            </div>
            <button 
              onClick={() => handleDelete(r.id)}
              className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition cursor-pointer"
              title="Delete Report"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

import { X, Clock, Trash2, FileText, ArrowRight, Search } from "lucide-react";
import { fetchPatientReports, deletePatientReport, fetchAllUsers, fetchAllReports, deletePatientUser } from "@/lib/patient-service";
import { useEffect } from "react";

function PatientListSection() {
  const [data, setData] = useState<{ users: any[], reports: any[] }>({ users: [], reports: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([fetchAllUsers(), fetchAllReports()]);
      setData({ users: u, reports: r });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (phone: string) => {
    if (!confirm(`Are you sure you want to delete patient ${phone}? This will NOT delete their uploaded reports, only their login access.`)) return;
    try {
      await deletePatientUser(phone);
      setData(prev => ({ ...prev, users: prev.users.filter(u => u.phone !== phone) }));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const getReportCount = (phone: string) => {
    return data.reports.filter(r => r.phone === phone).length;
  };

  const filteredUsers = data.users.filter(u => 
    u.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
            <User className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold">Registered Patient List</h2>
        </div>
        
        <div className="flex flex-1 max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/20 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={loadData} className="text-xs font-semibold text-primary hover:underline whitespace-nowrap">Refresh List</button>
            {data.users.length > 9 && (
              <Link to="/admin/patients/all" className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-xs font-bold hover:bg-secondary/80 transition whitespace-nowrap">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm italic">
          {searchTerm ? "No patients found matching your search." : "No patients registered yet."}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.slice(0, 9).map(u => (
            <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-secondary/10 group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {u.phone.slice(-2)}
                </div>
                <div>
                  <div className="font-bold text-sm">{u.phone}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <FileText className="h-3 w-3" /> {getReportCount(u.phone)} Reports
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteUser(u.phone)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Remove Access"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PatientLoginSection() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"new" | "updated" | "">("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(""); setStatus("");
    try {
      const res = await createOrUpdatePatient(phone, pin);
      setStatus(res === "created" ? "new" : "updated");
      setPin("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save patient");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <UserPlus className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl font-bold">Manage Patient Login</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Field label="Mobile Number">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" className={inputCls + " pl-10"} />
          </div>
        </Field>
        <Field label="Set PIN (4-6 Digits)">
          <input required type="password" minLength={4} maxLength={6} value={pin} onChange={e => setPin(e.target.value)} placeholder="••••••" className={inputCls} />
        </Field>

        {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</div>}
        {status === "new" && <div className="text-sm text-moss bg-moss/10 p-3 rounded-xl flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> New patient login created successfully</div>}
        {status === "updated" && <div className="text-sm text-accent bg-accent/10 p-3 rounded-xl flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Patient already exists - PIN updated successfully</div>}

        <button disabled={busy} type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-ink py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Login Credentials"}
        </button>
      </form>
    </section>
  );
}

function ReportUploadSection() {
  const [data, setData] = useState({ phone: "", patientName: "", testName: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please select a report file"); return; }
    setBusy(true); setError(""); setSuccess(false);
    try {
      // Use Firebase Storage instead of Cloudinary for secure document handling
      const url = await uploadReportToStorage(file, data.phone);
      await uploadPatientReport({
        ...data,
        reportUrl: url
      });
      setSuccess(true);
      setData({ phone: "", patientName: "", testName: "" });
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload report");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent/10 text-accent">
          <FileUp className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl font-bold">Upload Patient Report</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Mobile Number">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input required type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} placeholder="98765..." className={inputCls + " pl-10"} />
            </div>
          </Field>
          <Field label="Patient Name">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input required value={data.patientName} onChange={e => setData({...data, patientName: e.target.value})} placeholder="e.g. Rajesh Kumar" className={inputCls + " pl-10"} />
            </div>
          </Field>
        </div>

        <Field label="Test Name">
          <div className="relative">
            <TestTube className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input required value={data.testName} onChange={e => setData({...data, testName: e.target.value})} placeholder="e.g. Thyroid Profile" className={inputCls + " pl-10"} />
          </div>
        </Field>

        <Field label="Report File (PDF/Image)">
          <input required type="file" onChange={e => setFile(e.target.files?.[0] || null)} className={inputCls + " file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"} />
        </Field>

        {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</div>}
        {success && <div className="text-sm text-moss bg-moss/10 p-3 rounded-xl flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Report uploaded and linked successfully</div>}

        <button disabled={busy} type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background hover:opacity-90 transition disabled:opacity-50 cursor-pointer">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload & Link Report"}
        </button>
      </form>
    </section>
  );
}

const inputCls = "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}

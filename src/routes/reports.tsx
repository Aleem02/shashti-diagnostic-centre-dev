import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Phone, Lock, Loader2, FileText, Download, Eye, LogOut, Search, Clock, User } from "lucide-react";
import { verifyPatientLogin, fetchPatientReports } from "@/lib/patient-service";
import { type PatientReport } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";
import { Breadcrumbs } from "@/components/SEO";

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { t } = useLanguage();
  const [session, setSession] = useState<{ phone: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("patient_session");
    if (saved) setSession(JSON.parse(saved));
    setLoading(false);
  }, []);

  const handleLogin = (phone: string) => {
    const sess = { phone };
    sessionStorage.setItem("patient_session", JSON.stringify(sess));
    setSession(sess);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("patient_session");
    setSession(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 lg:py-20">
      <Breadcrumbs />
      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <LoginForm onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div 
            key="reports"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-8">
              <div>
                <h1 className="font-display text-4xl font-bold tracking-tight">{t("portal_header")}</h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> {t("portal_linked")} {session.phone}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-destructive hover:bg-destructive/5 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> {t("portal_logout")}
              </button>
            </div>

            <ReportList phone={session.phone} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: (phone: string) => void }) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const valid = await verifyPatientLogin(phone, pin);
      if (valid) onLogin(phone);
      else setError(t("portal_error_login"));
    } catch (err) {
      setError(t("portal_error_conn"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[2.5rem] border border-border bg-card p-8 sm:p-10 shadow-elevated">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-ink mb-6 shadow-glow">
          <FileText className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold">{t("portal_title")}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{t("portal_desc")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground ml-1">{t("field_mobile")}</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              required 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="98765 43210"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground ml-1">{t("field_pin")}</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              required 
              type="password" 
              value={pin} 
              onChange={e => setPin(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••"
            />
          </div>
        </div>

        {error && <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive leading-relaxed">{error}</div>}

        <button 
          disabled={busy}
          type="submit" 
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-ink py-4 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : t("btn_access")}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">{t("portal_no_pin")}</p>
      </div>
    </div>
  );
}

function ReportList({ phone }: { phone: string }) {
  const { t } = useLanguage();
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (r: PatientReport) => {
    setDownloadingId(r.id);
    try {
      const res = await fetch(r.reportUrl);
      if (!res.ok) throw new Error("Network error");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Report_${r.patientName.replace(/\s+/g, '_')}_${r.testName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      // Fallback: open in new tab if CORS blocks fetch
      window.open(r.reportUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };


  useEffect(() => {
    fetchPatientReports(phone).then(setReports).finally(() => setLoading(false));
  }, [phone]);

  const filtered = reports.filter(r => 
    r.patientName.toLowerCase().includes(search.toLowerCase()) ||
    r.testName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1,2,3].map(i => <div key={i} className="h-48 rounded-3xl bg-secondary/50 animate-pulse" />)}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-[2.5rem]">
        <div className="h-16 w-16 bg-secondary flex items-center justify-center rounded-full mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-bold">{t("portal_empty_title")}</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">{t("portal_empty_desc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t("portal_search_reports")}
          className="w-full rounded-2xl border border-input bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group relative flex flex-col rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all hover:shadow-elevated hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent uppercase tracking-wider mb-1">
                    <User className="h-3 w-3" /> {r.patientName}
                  </div>
                  <h3 className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                    {r.testName}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{r.createdAt?.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  <span className="text-border">•</span>
                  <span>{r.createdAt ? formatTimeAgo(r.createdAt.toDate()) : ''}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <a 
                  href={r.reportUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold hover:bg-secondary/80 transition cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" /> {t("portal_btn_view")}
                </a>
                <button 
                  onClick={() => handleDownload(r)}
                  disabled={downloadingId === r.id}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-3 py-2.5 text-xs font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                  {downloadingId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} 
                  {downloadingId === r.id ? t("portal_downloading") : t("portal_btn_download")}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

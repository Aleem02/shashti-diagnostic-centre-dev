import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchTests, fetchGallery, fetchTestProfiles } from "@/lib/tests-service";
import { fetchAllUsers, fetchAllReports, checkUserExists } from "@/lib/patient-service";
import { FlaskConical, ImageIcon, ArrowRight, Activity, Users, FileText, PlusCircle, LayoutGrid, Clock, Search, CheckCircle2, XCircle, Loader2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ tests: 0, gallery: 0, profiles: 0, users: 0, reports: 0 });
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<"found" | "not_found" | null>(null);

  useEffect(() => {
    Promise.all([
      fetchTests(),
      fetchGallery(),
      fetchTestProfiles(),
      fetchAllUsers(),
      fetchAllReports()
    ]).then(([t, g, p, u, r]) => {
      setStats({
        tests: t.length,
        gallery: g.length,
        profiles: p.length,
        users: u.length,
        reports: r.length
      });
      setLoading(false);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone || searchPhone.length < 5) return;
    
    setIsSearching(true);
    setSearchResult(null);
    try {
      const exists = await checkUserExists(searchPhone);
      setSearchResult(exists ? "found" : "not_found");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const cards = [
    { to: "/admin/tests", icon: FlaskConical, label: "Medical Tests", count: stats.tests, desc: "Manage individual diagnostic tests.", color: "bg-blue-500/10 text-blue-600" },
    { to: "/admin/test-profiles", icon: LayoutGrid, label: "Test Profiles", count: stats.profiles, desc: "Manage health checkup packages.", color: "bg-purple-500/10 text-purple-600" },
    { to: "/admin/gallery", icon: ImageIcon, label: "Gallery Images", count: stats.gallery, desc: "Manage facility & lab photos.", color: "bg-amber-500/10 text-amber-600" },
    { to: "/admin/patients", icon: Users, label: "Registered Patients", count: stats.users, desc: "Patient login accounts.", color: "bg-emerald-500/10 text-emerald-600" },
  ];

  return (
    <div className="space-y-10 animate-rise">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">Admin Overview</h1>
        <p className="mt-2 text-muted-foreground text-lg">Central control for Shashti Diagnostic Center.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Link 
            key={c.to} 
            to={c.to} 
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-display font-bold tracking-tight">{c.count}</div>
            </div>
            <div>
              <div className="font-bold text-foreground group-hover:text-primary transition-colors">{c.label}</div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick Actions & Search */}
        <div className="lg:col-span-1 space-y-8">
          {/* Patient Lookup Search */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Patient Quick Lookup
            </h2>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="tel" 
                  placeholder="Enter Mobile Number..." 
                  value={searchPhone}
                  onChange={(e) => {
                    setSearchPhone(e.target.value);
                    setSearchResult(null);
                  }}
                  className="w-full rounded-2xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button 
                  type="submit" 
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <AnimatePresence mode="wait">
                {searchResult === "found" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <div className="text-xs font-semibold">Patient Record Available</div>
                  </motion.div>
                )}
                {searchResult === "not_found" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-destructive/5 text-destructive border border-destructive/10"
                  >
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    <div className="text-xs font-semibold">No patient record found</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid gap-3">
              {[
                { to: "/admin/tests", label: "Add New Test", icon: FlaskConical },
                { to: "/admin/test-profiles", label: "Create Package", icon: LayoutGrid },
                { to: "/admin/patients", label: "Upload Report", icon: FileText },
                { to: "/admin/gallery", label: "Add Photo", icon: ImageIcon },
              ].map((a) => (
                <Link 
                  key={a.label} 
                  to={a.to} 
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-sm">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* System Health / Status */}
        <div className="lg:col-span-2 space-y-6 pt-2">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Platform Status
          </h2>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">Content Summary</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Reports</span>
                    <span className="font-bold">{stats.reports}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Database Sync</span>
                    <span className="text-emerald-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Storage Usage</span>
                    <span className="font-medium">Optimized</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-between">
                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">Quick Link</div>
                <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3 text-sm font-bold hover:bg-foreground/90 transition">
                  View Public Site <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl bg-primary/5 border border-primary/10 p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-bold text-sm">Pro Tip: Search & Curation</div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Use the search functionality in Tests and Profiles to quickly find and curate featured items for the homepage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

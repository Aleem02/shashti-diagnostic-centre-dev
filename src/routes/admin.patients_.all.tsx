import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, FileText, Trash2, Search, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { fetchAllUsers, fetchAllReports, deletePatientUser } from "@/lib/patient-service";

export const Route = createFileRoute("/admin/patients_/all")({
  component: AllPatientsPage,
});

function AllPatientsPage() {
  const [data, setData] = useState<{ users: any[], reports: any[] }>({ users: [], reports: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

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
    if (!confirm(`Are you sure you want to delete patient ${phone}?`)) return;
    try {
      await deletePatientUser(phone);
      setData(prev => ({ ...prev, users: prev.users.filter(u => u.phone !== phone) }));
      setSelectedPhones(prev => prev.filter(p => p !== phone));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPhones.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPhones.length} selected patients?`)) return;
    
    setIsDeletingBulk(true);
    try {
      await Promise.all(selectedPhones.map(p => deletePatientUser(p)));
      setData(prev => ({ ...prev, users: prev.users.filter(u => !selectedPhones.includes(u.phone)) }));
      setSelectedPhones([]);
    } catch (err) {
      alert("Some deletions failed.");
      loadData();
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPhones.length === filteredUsers.length) {
      setSelectedPhones([]);
    } else {
      setSelectedPhones(filteredUsers.map(u => u.phone));
    }
  };

  const toggleSelect = (phone: string) => {
    setSelectedPhones(prev => 
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    );
  };

  const filteredUsers = data.users.filter(u => 
    u.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReportCount = (phone: string) => {
    return data.reports.filter(r => r.phone === phone).length;
  };

  return (
    <div className="space-y-8 animate-rise pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/patients" className="p-2 rounded-full hover:bg-secondary transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">All Registered Patients</h1>
            <p className="text-muted-foreground mt-1 text-sm">Full list of {data.users.length} patients.</p>
          </div>
        </div>

        {selectedPhones.length > 0 && (
          <button 
            onClick={handleBulkDelete}
            disabled={isDeletingBulk}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold shadow-glow-destructive hover:opacity-90 transition disabled:opacity-50"
          >
            {isDeletingBulk ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete Selected ({selectedPhones.length})
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by mobile number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>
        
        {filteredUsers.length > 0 && (
          <button 
            onClick={toggleSelectAll}
            className="whitespace-nowrap px-6 py-4 rounded-2xl border border-border bg-card text-sm font-semibold hover:bg-secondary transition shadow-sm flex items-center gap-2"
          >
            {selectedPhones.length === filteredUsers.length ? "Deselect All" : "Select All Search Results"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card rounded-3xl border border-dashed border-border">
          No patients found matching your search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map(u => {
            const isSelected = selectedPhones.includes(u.phone);
            return (
              <div 
                key={u.id} 
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all shadow-sm group relative cursor-pointer ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card hover:border-primary/20'}`}
                onClick={() => toggleSelect(u.phone)}
              >
                {/* Visual Checkbox */}
                <div className={`absolute top-4 left-4 h-5 w-5 rounded-md border transition-all flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                </div>

                <div className="flex items-center gap-4 pl-6">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isSelected ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-muted-foreground border-border'}`}>
                    {u.phone.slice(-2)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{u.phone}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <FileText className="h-3 w-3" /> {getReportCount(u.phone)} Reports
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(u.phone);
                  }}
                  className={`p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  title="Remove Access"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

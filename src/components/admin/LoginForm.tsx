import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { Activity, AlertCircle, Loader2 } from "lucide-react";

export function LoginForm({ configured }: { configured: boolean }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try { await login(email, password); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-soft p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elevated">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
            <Activity className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-lg font-bold">Admin Panel</div>
            <div className="text-xs text-muted-foreground">Shashti Diagnostic Center</div>
          </div>
        </div>

        {!configured && (
          <div className="mt-6 flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-warning-foreground" />
            <div className="text-warning-foreground">
              <p className="font-semibold">Firebase not configured</p>
              <p className="mt-1 text-xs leading-relaxed">Add your Firebase credentials to <code className="rounded bg-card/60 px-1">src/lib/firebase.ts</code> to enable admin login.</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={!configured}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={!configured}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60" />
          </div>
          {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
          <button type="submit" disabled={busy || !configured}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-accent px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60 transition">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

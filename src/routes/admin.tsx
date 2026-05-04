import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Activity, LayoutDashboard, FlaskConical, ImageIcon, LogOut, Loader2 } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Shashti Diagnostic Center" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AuthProvider>
      <AdminShell />
    </AuthProvider>
  ),
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/tests", label: "Tests", icon: FlaskConical },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

function AdminShell() {
  const { user, loading, configured, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!configured || !user) {
    return <LoginForm configured={configured} />;
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <Link to="/" className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-accent">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold">SHASHTI</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Admin Panel</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-gradient-accent text-primary-foreground shadow-glow" : "text-foreground/75 hover:bg-secondary hover:text-foreground"
              )}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
          <button onClick={() => logout()} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <Link to="/" className="font-display font-bold">SHASHTI Admin</Link>
        <button onClick={() => logout()} className="text-sm text-destructive font-medium">Sign out</button>
      </div>

      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8">
        {/* Mobile nav pills */}
        <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto">
          {navItems.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={cn("rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap", active ? "bg-gradient-accent text-primary-foreground" : "bg-card text-foreground")}>
                {n.label}
              </Link>
            );
          })}
        </div>
        <Outlet />
      </main>
    </div>
  );
}

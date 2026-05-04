import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchTests, fetchGallery } from "@/lib/tests-service";
import { FlaskConical, ImageIcon, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ tests: 0, gallery: 0 });

  useEffect(() => {
    Promise.all([fetchTests(), fetchGallery()]).then(([t, g]) => setStats({ tests: t.length, gallery: g.length }));
  }, []);

  const cards = [
    { to: "/admin/tests", icon: FlaskConical, label: "Medical Tests", count: stats.tests, desc: "Add, edit, or remove tests with sample reports." },
    { to: "/admin/gallery", icon: ImageIcon, label: "Gallery Images", count: stats.gallery, desc: "Upload and manage gallery photos." },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Manage your diagnostic center content.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
                <c.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <div className="font-display text-4xl font-extrabold">{c.count}</div>
              <div className="text-sm font-semibold text-foreground">{c.label}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

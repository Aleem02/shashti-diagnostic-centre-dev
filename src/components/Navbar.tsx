import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_PHONE } from "@/lib/contact";

const links = [
  { to: "/", label: "Index", num: "01" },
  { to: "/services", label: "Services", num: "02" },
  { to: "/gallery", label: "Gallery", num: "03" },
  { to: "/about", label: "About", num: "04" },
  { to: "/contact", label: "Visit", num: "05" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 w-full border-b hairline bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-foreground/80 text-foreground">
            <span className="font-display text-[15px] italic font-medium leading-none">S</span>
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent animate-shimmer" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-medium tracking-tight text-foreground">Shashti</div>
            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">Diagnostic · Est. 2014</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "group/link relative px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
                )}
              >
                <span className="font-mono text-[10px] text-muted-foreground/70 mr-1.5">{l.num}</span>
                {l.label}
                <span className={cn(
                  "absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-foreground origin-left transition-transform duration-300",
                  active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"
                )} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-[12px] font-sans font-bold uppercase tracking-wide text-foreground/80 hover:text-foreground transition-colors">
            <Phone className="h-3.5 w-3.5" /> 24/7 · {CONTACT_PHONE}
          </a>
          <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2 text-xs font-medium uppercase tracking-wider text-background hover:bg-transparent hover:text-foreground transition-colors">
            Book a Visit
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden rounded-full border border-foreground/20 p-2 text-foreground" aria-label="Menu">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t hairline bg-background">
          <div className="px-5 py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b hairline px-1 py-3 text-sm",
                  path === l.to ? "text-foreground" : "text-foreground/65"
                )}
              >
                <span><span className="font-mono text-[10px] text-muted-foreground mr-3">{l.num}</span>{l.label}</span>
                <span className="font-display italic text-xs">→</span>
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="mt-3 block rounded-full border border-foreground bg-foreground px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-background">
              Book a Visit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

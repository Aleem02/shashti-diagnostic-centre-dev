import { useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Menu, X, Phone, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_PHONE, getWhatsAppLink } from "@/lib/contact";
import { fetchTests } from "@/lib/tests-service";
import { type MedicalTest } from "@/lib/seed-data";
import { motion, AnimatePresence } from "framer-motion";

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [tests, setTests] = useState<MedicalTest[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchTests().then(setTests);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return tests.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, tests]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/services", search: { q: searchQuery } });
      setSearchQuery("");
      setShowResults(false);
      setOpen(false);
    }
  };

  const handleResultClick = (query: string) => {
    navigate({ to: "/services", search: { q: query } });
    setSearchQuery("");
    setShowResults(false);
    setOpen(false);
  };

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

        <div className="hidden xl:block relative group search-container">
          <form onSubmit={handleSearch} className="relative flex items-center max-w-[240px]">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full rounded-full border hairline bg-background/50 pl-8 pr-3 py-1.5 text-[12px] font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-all"
            />
          </form>

          <AnimatePresence>
            {showResults && results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-lg border hairline bg-background shadow-elevated z-50"
              >
                <div className="p-1">
                  {results.slice(0, 5).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleResultClick(r.name)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[12px] hover:bg-secondary transition-colors"
                    >
                      <span className="truncate pr-4">{r.name}</span>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground/50" />
                    </button>
                  ))}
                  {results.length > 5 && (
                    <button
                      onClick={handleSearch}
                      className="mt-1 flex w-full items-center justify-center border-t hairline p-2 text-[11px] font-mono uppercase tracking-wider text-accent hover:bg-secondary transition-colors"
                    >
                      View all results ({results.length})
                    </button>
                  )}
                </div>
              </motion.div>
            )}
            
            {showResults && searchQuery && results.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-lg border hairline bg-background p-4 text-center shadow-elevated z-50"
              >
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">No matches found</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-[12px] font-sans font-bold uppercase tracking-wide text-foreground/80 hover:text-foreground transition-colors">
            <Phone className="h-3.5 w-3.5" /> 24/7 · {CONTACT_PHONE}
          </a>
          <a href={getWhatsAppLink("Hello Shashti Diagnostic Center, I would like to book a visit.")} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2 text-xs font-medium uppercase tracking-wider text-background hover:bg-transparent hover:text-foreground transition-colors">
            Book a Visit
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden rounded-full border border-foreground/20 p-2 text-foreground" aria-label="Menu">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t hairline bg-background overflow-hidden"
          >
            <div className="px-5 py-4 space-y-4">
              <div className="relative search-container">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="w-full rounded-full border hairline bg-secondary/30 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground"
                  />
                </form>

                <AnimatePresence>
                  {showResults && results.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 overflow-hidden rounded-lg border hairline bg-background shadow-elevated z-50"
                    >
                      <div className="p-1">
                        {results.slice(0, 5).map((r) => (
                          <button
                            key={r.id}
                            onClick={() => handleResultClick(r.name)}
                            className="flex w-full items-center justify-between rounded-md px-4 py-3 text-left text-sm border-b last:border-0 hairline"
                          >
                            <span>{r.name}</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
                          </button>
                        ))}
                        {results.length > 5 && (
                          <button
                            onClick={handleSearch}
                            className="flex w-full items-center justify-center p-3 text-xs font-mono uppercase tracking-wider text-accent bg-secondary/50"
                          >
                            View all results ({results.length})
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
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
                  </motion.div>
                ))}
                <a href={getWhatsAppLink("Hello Shashti Diagnostic Center, I would like to book a visit.")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-3 block rounded-full border border-foreground bg-foreground px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-background">
                  Book a Visit
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

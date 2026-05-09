import { useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Menu, X, Phone, ArrowUpRight, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_PHONE, getWhatsAppLink, INSTAGRAM_URL } from "@/lib/contact";
import { fetchTests, fetchTestProfiles } from "@/lib/tests-service";
import { type MedicalTest, type TestProfile } from "@/lib/seed-data";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Index", num: "01" },
  { to: "/services", label: "Services", num: "02" },
  { to: "/gallery", label: "Gallery", num: "03" },
  { to: "/reports", label: "Reports", num: "04" },
  { to: "/about", label: "About", num: "05" },
  { to: "/contact", label: "Visit", num: "06" },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<(MedicalTest | TestProfile)[]>([]);
  const [showResults, setShowResults] = useState(false);

  const navLinks = [
    { to: "/", label: t("nav_home"), num: "01" },
    { to: "/services", label: t("nav_services"), num: "02" },
    { to: "/gallery", label: t("nav_gallery") || "Gallery", num: "03" },
    { to: "/reports", label: t("nav_reports"), num: "04" },
    { to: "/about", label: t("nav_about"), num: "05" },
    { to: "/contact", label: t("nav_contact"), num: "06" },
  ];

  useEffect(() => {
    Promise.all([fetchTests(), fetchTestProfiles()]).then(([t, p]) => {
      setItems([...t, ...p]);
    });
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
    return items.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t as any).category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, items]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/services", search: { q: searchQuery } });
      setSearchQuery("");
      setShowResults(false);
      setOpen(false);
    }
  };

  const handleResultClick = (slugOrId: string) => {
    navigate({ to: `/services/${slugOrId}` });
    setSearchQuery("");
    setShowResults(false);
    setOpen(false);
  };

  const handleNavLinkClick = (to: string) => {
    if (path === to) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b hairline bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="Shashti Diagnostic Centre" 
            className="h-10 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105 mix-blend-multiply" 
          />
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5">
          {navLinks.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => handleNavLinkClick(l.to)}
                className={cn(
                  "group/link relative px-2.5 py-2 text-[13px] font-medium transition-colors",
                  active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
                )}
              >
                <span className="font-mono text-[9px] text-muted-foreground/70 mr-1">{l.num}</span>
                {l.label}
                <span className={cn(
                  "absolute left-2.5 right-2.5 -bottom-0.5 h-px bg-foreground origin-left transition-transform duration-300",
                  active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"
                )} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden xl:block relative group search-container">
          <form onSubmit={handleSearch} className="relative flex items-center w-[140px] xl:w-[200px]">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full rounded-full border hairline bg-background/50 pl-8 pr-3 py-1.5 text-[11px] font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-all"
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
                      onClick={() => handleResultClick(r.slug || r.id)}
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

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Language Toggle - Visible on all screens */}
          <div className="flex items-center gap-0.5 p-0.5 sm:gap-1 sm:p-1 rounded-full border hairline bg-secondary/20">
            <button 
              onClick={() => setLanguage("en")}
              className={cn(
                "px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer",
                language === "en" ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground"
              )}
            >EN</button>
            <button 
              onClick={() => setLanguage("ta")}
              className={cn(
                "px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer",
                language === "ta" ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground"
              )}
            >தமிழ்</button>
          </div>

          <div className="hidden xl:flex items-center gap-6">
            <a href={getWhatsAppLink("Hello Shashti Diagnostic Center, I would like to book a visit.")} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-background hover:bg-transparent hover:text-foreground transition-colors whitespace-nowrap cursor-pointer">
              {t("cta_book_visit") || "Book a Visit"}
            </a>
          </div>
        </div>

        <button onClick={() => setOpen(!open)} className="xl:hidden rounded-full border border-foreground/20 p-2 text-foreground" aria-label="Menu">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden border-t hairline bg-background overflow-hidden"
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
                            onClick={() => handleResultClick(r.slug || r.id)}
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
                <div className="pt-2"></div>
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => handleNavLinkClick(l.to)}
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
                <a href={getWhatsAppLink("Hello Shashti Diagnostic Center, I would like to book a visit.")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-3 block rounded-full border border-foreground bg-foreground px-4 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-background cursor-pointer">
                  {t("cta_book_visit") || "Book a Visit"}
                </a>
                
                <div className="pt-6 flex items-center justify-center gap-6">
                  <a 
                    href={INSTAGRAM_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-foreground/50 hover:text-accent hover:border-accent transition-all"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

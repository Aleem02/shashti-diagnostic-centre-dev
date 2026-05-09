import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";
import { CONTACT_PHONE, INSTAGRAM_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n.tsx";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative mt-32 bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20">
        {/* Big mark */}
        <div className="border-b border-background/15 pb-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/55">Index · Footer</div>
              <h2 className="mt-4 font-display text-5xl sm:text-7xl lg:text-[7rem] leading-[0.92] tracking-tight">
                Shashti<span className="serif-italic text-accent">.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm text-background/65 leading-relaxed">
                {t("footer_desc")}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a 
                  href={INSTAGRAM_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-background/20 hover:border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-500"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
            <Link to="/contact" className="group inline-flex items-center gap-3 rounded-full border border-background/30 px-6 py-3 text-xs font-mono uppercase tracking-wider hover:bg-background hover:text-foreground transition-colors cursor-pointer">
              {t("cta_schedule")} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/45">A · {t("contact_visit")}</div>
            <p className="mt-4 text-sm leading-relaxed text-background/85">
              {t("footer_address")}
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/45">B · {t("contact_call")}</div>
            <ul className="mt-4 space-y-2 text-sm text-background/85">
              <li><a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="hover:text-accent">{CONTACT_PHONE}</a></li>
              <li><a href="mailto:info@shashtidiagnostic.in" className="hover:text-accent">info@shashtidiagnostic.in</a></li>
              <li className="text-background/55 text-xs font-mono uppercase tracking-wider mt-2">{t("contact_open_always")}</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/45">C · {t("nav_services")}</div>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: "/services", label: t("nav_services") },
                { to: "/gallery", label: t("nav_gallery") },
                { to: "/about", label: t("nav_about") },
                { to: "/contact", label: t("nav_contact") },
                { to: "/admin", label: t("nav_admin") },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-background/85 hover:text-accent cursor-pointer">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/45">D · {t("about_pillars_tag").split(" · ")[1]}</div>
            <p className="mt-4 text-sm text-background/85 leading-relaxed">
              {t("footer_promise")}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-background/15 pt-6 text-[11px] font-mono uppercase tracking-wider text-background/50 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Shashti Diagnostic Center · All rights reserved</div>
          <div>Crafted with care in Chidambaram</div>
        </div>
      </div>
    </footer>
  );
}

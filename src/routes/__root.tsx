import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LanguageProvider } from "@/lib/i18n.tsx";
import { JsonLd, organizationSchema } from "@/components/SEO";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes (Diagnostics data rarely changes)
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false, // Save reads when user switches tabs
      retry: 1,
    },
  },
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Go home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shashti Diagnostic Center — Trusted Diagnostics in Chidambaram" },
      { name: "description", content: "Accurate diagnostics, 24/7 service, home sample collection in Chidambaram. Blood, ECG, EEG, Thyroid, Allergy & more." },
      { name: "keywords", content: "diagnostic center Chidambaram, blood test, ECG, thyroid, home sample collection" },
      { property: "og:title", content: "Shashti Diagnostic Center" },
      { property: "og:description", content: "Accurate Diagnostics. Trusted Care. 24/7 in Chidambaram." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin");
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <JsonLd data={organizationSchema} />
        <div className="min-h-screen flex flex-col">
          {!isAdmin && <Navbar />}
          <main className="flex-1 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          {!isAdmin && <Footer />}
          {!isAdmin && <WhatsAppButton />}
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

/**
 * JSON-LD Schema Markup
 */
export function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Breadcrumbs Component for navigation hierarchy
 */
export function Breadcrumbs() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (path === "/") return null;

  const parts = path.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
      {parts.map((part, i) => {
        const to = `/${parts.slice(0, i + 1).join("/")}`;
        const isLast = i === parts.length - 1;
        const label = part.charAt(0).toUpperCase() + part.slice(1);

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3 opacity-50" />
            {isLast ? (
              <span className="text-foreground font-semibold">{label}</span>
            ) : (
              <Link to={to as any} className="hover:text-foreground transition-colors">{label}</Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Standard Organizational Schema
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Shashti Diagnostic Center",
  "alternateName": "Shashti Digital Health",
  "description": "Premium diagnostic center in Chidambaram offering 24/7 blood tests, health packages, and home sample collection.",
  "url": "https://shashtidiagnostic.in",
  "logo": "https://shashtidiagnostic.in/favicon.svg",
  "image": "https://shashtidiagnostic.in/og-image.jpg",
  "medicalSpecialty": [
    "Pathology",
    "Diagnostic services",
    "Laboratory medicine",
    "Radiology"
  ],
  "priceRange": "₹₹",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91 99999 99999", // Replace with real phone
    "contactType": "customer service",
    "areaServed": {
      "@type": "State",
      "name": "Tamil Nadu"
    },
    "availableLanguage": ["English", "Tamil"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Laya Complex, S.P Kovil Street",
    "addressLocality": "Chidambaram",
    "addressRegion": "Tamil Nadu",
    "postalCode": "608001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 11.3995,
    "longitude": 79.6936
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  ],
  "hasMap": "https://maps.google.com/?q=Shashti+Diagnostic+Center+Chidambaram",
  "sameAs": [
    "https://www.instagram.com/shashtidiagcentre"
  ]
};

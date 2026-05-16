import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";
import imgIAF from "@/assets/cert-iaf.png";
import imgEIAC from "@/assets/cert-eiac.png";

const certifications = [
  {
    name: "IAF Accreditation",
    img: imgIAF, 
  },
  {
    name: "EIAC Accreditation",
    img: imgEIAC,
  },
  {
    name: "ISO 9001:2015",
    img: "/iso_certification_logo_1778335459474.png",
  }
];

export function Certifications() {
  const { t } = useLanguage();
  return (
    <section className="py-24 lg:py-32 bg-secondary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-6">World Class Standards</div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">{t("cert_title")}</h2>
            <p className="mt-8 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t("cert_desc")}
            </p>
          </div>

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.1,
                    ease: [0.21, 1, 0.36, 1] 
                  }}
                  className="group relative"
                >
                  <div className="relative aspect-[4/5] flex flex-col items-center justify-center p-6 bg-white border hairline rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500 overflow-hidden">
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                      <div className="h-32 w-full flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                        <img 
                          src={cert.img} 
                          alt={cert.name} 
                          className="max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="mt-6 font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors duration-500 text-center leading-tight">
                        {cert.name}
                      </div>
                    </div>

                    {/* Pedestal line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

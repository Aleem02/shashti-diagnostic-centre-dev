import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n.tsx";

const certifications = [
  {
    name: "IAF Accreditation",
    img: "/iaf_accreditation_logo_1778335420059.png", 
  },
  {
    name: "EIAC Accreditation",
    img: "/eiac_accreditation_logo_1778335439409.png",
  },
  {
    name: "ISO 9001:2015",
    img: "/iso_certification_logo_1778335459474.png",
  }
];

export function Certifications() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{t("cert_title")}</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {t("cert_desc")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="relative h-24 md:h-32 w-48 md:w-64 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105">
                <img 
                  src={cert.img} 
                  alt={cert.name} 
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

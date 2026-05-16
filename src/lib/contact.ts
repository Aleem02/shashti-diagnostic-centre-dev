export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || "+91 96267 89520";
export const CONTACT_LANDLINE = "04144 796945";
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919626789520";

export const getWhatsAppLink = (text = "Hello Shashti Diagnostic Center") => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const getTelLink = () => {
  return `tel:${WHATSAPP_NUMBER.startsWith("+") ? WHATSAPP_NUMBER : "+" + WHATSAPP_NUMBER}`;
};

export const INSTAGRAM_URL = "https://www.instagram.com/shashtidiagcentre?utm_source=qr&igsh=MTc5emtxNWdrbGxzcw%3D%3D";

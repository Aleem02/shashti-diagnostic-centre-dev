export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || "+91 99999 99999";
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";

export const getWhatsAppLink = (text = "Hello Shashti Diagnostic Center") => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const getTelLink = () => {
  return `tel:${WHATSAPP_NUMBER.startsWith("+") ? WHATSAPP_NUMBER : "+" + WHATSAPP_NUMBER}`;
};

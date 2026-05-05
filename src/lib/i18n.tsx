import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ta";

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

export const translations: Translations = {
  // Navigation
  nav_home: { en: "Home", ta: "முகப்பு" },
  nav_services: { en: "Services", ta: "சேவைகள்" },
  nav_about: { en: "About", ta: "எங்களைப் பற்றி" },
  nav_contact: { en: "Contact", ta: "தொடர்பு" },
  nav_reports: { en: "Reports", ta: "அறிக்கைகள்" },
  nav_admin: { en: "Admin", ta: "நிர்வாகம்" },
  nav_gallery: { en: "Gallery", ta: "புகைப்படங்கள்" },

  // Hero
  hero_tag: { en: "A Diagnostic Center · Est. 2014", ta: "பரிசோதனை மையம் · ஆரம்பம் 2014" },
  hero_title_1: { en: "Precision,", ta: "துல்லியம்," },
  hero_title_2: { en: "delivered with", ta: "கனிவான" },
  hero_title_3: { en: "quiet care", ta: "கவனிப்புடன்" },
  hero_subtitle: { en: "Accurate testing, gentle care.", ta: "துல்லியமான பரிசோதனை, கனிவான கவனிப்பு." },
  hero_desc: { 
    en: "Shashti is a modern diagnostic center where laboratory rigour meets the calm of a private clinic. Reports you can trust — at the lab, at your door, or at 3 a.m.",
    ta: "சாஸ்தி ஒரு நவீன பரிசோதனை மையம். ஆய்வகத் துல்லியமும், கனிவான கவனிப்பும் இங்கே ஒன்றிணைகிறது. நீங்கள் நம்பக்கூடிய அறிக்கைகள் — ஆய்வகத்தில், உங்கள் வீட்டில் அல்லது அதிகாலை 3 மணிக்கும் கிடைக்கும்."
  },
  cta_explore: { en: "Explore Services", ta: "சேவைகளைப் பார்க்க" },
  cta_book_home: { en: "Book Home Collection", ta: "வீட்டிற்கே வந்து சேகரிப்பு" },
  cta_book_visit: { en: "Book a Visit", ta: "முன்பதிவு செய்க" },

  // Stats
  stat_reports: { en: "Reports delivered", ta: "வழங்கப்பட்ட அறிக்கைகள்" },
  stat_years: { en: "Years in practice", ta: "ஆண்டு கால அனுபவம்" },
  stat_open: { en: "Always open", ta: "எப்போதும் திறந்திருக்கும்" },
  stat_ontime: { en: "Reports on time", ta: "சரியான நேரத்திற்கு அறிக்கைகள்" },

  // Ethos
  ethos_tag: { en: "§ 02 · About", ta: "§ 02 · எங்களைப் பற்றி" },
  ethos_title_1: { en: "Diagnostics held", ta: "பரிசோதனைகள்" },
  ethos_title_2: { en: "to a higher", ta: "உயர் தரத்தில்" },
  ethos_title_3: { en: "standard.", ta: "வழங்கப்படுகிறது." },
  ethos_desc: { 
    en: "We believe a medical report should be clear, the experience patient-focused, and the results trusted. Every sample is processed by trained technicians and reviewed by certified pathologists.",
    ta: "மருத்துவ அறிக்கை தெளிவாகவும், கவனிப்பு நோயாளியை முன்னிறுத்தியும், முடிவுகள் நம்பகமானதாகவும் இருக்க வேண்டும் என்று நாங்கள் நம்புகிறோம். ஒவ்வொரு மாதிரியும் நிபுணர்களால் பரிசோதிக்கப்படுகிறது."
  },

  // Index
  index_tag: { en: "§ 03 · The Index", ta: "§ 03 · சேவைகள்" },
  index_title_1: { en: "A complete", ta: "முழுமையான" },
  index_title_2: { en: "menu of care", ta: "பரிசோதனை பட்டியல்" },
  index_subtitle: { en: "All types of medical tests in one place.", ta: "அனைத்து வகையான மருத்துவ பரிசோதனைகளும் ஒரே இடத்தில்." },
  index_view_all: { en: "View full list", ta: "முழு பட்டியலை பார்க்க" },

  // Testimonials
  voices_tag: { en: "§ 04 · Voices", ta: "§ 04 · நோயாளிகளின் கருத்துக்கள்" },
  voices_title_1: { en: "Words", ta: "எங்களைப் பற்றி" },
  voices_title_2: { en: "from those", ta: "நோயாளிகளின்" },
  voices_title_3: { en: "we've served.", ta: "கருத்துக்கள்." },

  // CTA Section
  invite_tag: { en: "§ 05 · An Invitation", ta: "§ 05 · அழைப்பு" },
  invite_title_1: { en: "Let us begin", ta: "தொடங்குவோம்" },
  invite_title_2: { en: "with a single", ta: "ஒரு எளிய" },
  invite_title_3: { en: "sample", ta: "மாதிரியுடன்" },
  invite_subtitle: { en: "Visit us once, and experience our quality service yourself.", ta: "ஒருமுறை எங்களை அணுகுங்கள், எங்கள் சேவையை நீங்களே உணர்வீர்கள்." },
  invite_desc: { 
    en: "Walk in, call, or schedule a doorstep collection. Our pathology suite is open 24 hours, every day of the year.",
    ta: "நேரில் வரலாம், அழைக்கலாம் அல்லது வீட்டிற்கே வரச் சொல்லலாம். எங்கள் ஆய்வகம் ஆண்டு முழுவதும் 24 மணிநேரமும் திறந்திருக்கும்."
  },
  cta_schedule: { en: "Schedule a visit", ta: "முன்பதிவு செய்ய" },

  // Services Page
  services_tag: { en: "The Catalogue", ta: "பரிசோதனை பட்டியல்" },
  services_desc: { 
    en: "A curated index of every diagnostic procedure offered at Shashti — with transparent timelines and availability for your reference.",
    ta: "சாஸ்தியில் வழங்கப்படும் ஒவ்வொரு மருத்துவ பரிசோதனைகளின் தொகுப்பு — உங்கள் வசதிக்காக நேரங்கள் மற்றும் கிடைக்கும் விவரங்களுடன்."
  },
  services_subtitle: { en: "Test list and details.", ta: "பரிசோதனைகளின் பட்டியல் மற்றும் விவரங்கள்." },
  services_home_avail: { en: "Home Collection Available", ta: "வீட்டிற்கே வந்து மாதிரி சேகரிப்பு" },
  services_lab_only: { en: "In-Lab Only", ta: "ஆய்வகத்தில் மட்டும்" },
  services_search_placeholder: { en: "Search the catalogue...", ta: "பரிசோதனைகளைத் தேடுக..." },
  services_home_only: { en: "Home only", ta: "வீட்டிற்கே மட்டும்" },
  services_no_match: { en: "No entries match your inquiry.", ta: "தேடலுக்கு பொருத்தமான முடிவுகள் இல்லை." },
  services_report_time: { en: "Report:", ta: "அறிக்கை:" },
  services_book_now: { en: "Book Now", ta: "முன்பதிவு" },

  // Gallery
  gallery_title: { en: "Gallery", ta: "புகைப்படங்கள்" },
  service_home: { en: "Home Collection", ta: "வீட்டிற்கே வந்து சேகரிப்பு" },
  service_report: { en: "Report", ta: "அறிக்கை" },

  // Patient Portal
  portal_title: { en: "Patient Portal", ta: "நோயாளி தளம்" },
  portal_desc: { en: "Enter your mobile number and PIN to access your reports.", ta: "உங்கள் மொபைல் எண் மற்றும் பின் (PIN) குறியீட்டை உள்ளிட்டு அறிக்கைகளைப் பார்க்கவும்." },
  field_mobile: { en: "Mobile Number", ta: "மொபைல் எண்" },
  field_pin: { en: "Login PIN", ta: "கடவுச்சொல் (PIN)" },
  btn_access: { en: "Access My Reports", ta: "அறிக்கைகளைப் பார்க்கவும்" },
  portal_no_pin: { en: "Don't have a PIN? Contact the laboratory desk to register.", ta: "பின் (PIN) இல்லையா? பதிவு செய்ய ஆய்வகத்தை தொடர்பு கொள்ளவும்." },
  portal_header: { en: "Your Health Reports", ta: "உங்கள் மருத்துவ அறிக்கைகள்" },
  portal_linked: { en: "Reports linked to", ta: "தொடர்புடைய அறிக்கைகள்" },
  portal_logout: { en: "Logout", ta: "வெளியேறு" },
  portal_search_reports: { en: "Search by patient or test name...", ta: "நோயாளி அல்லது பரிசோதனை பெயர்..." },
  portal_btn_view: { en: "View", ta: "பார்க்க" },
  portal_btn_download: { en: "Download", ta: "பதிவிறக்கம்" },
  portal_downloading: { en: "Downloading...", ta: "பதிவிறக்கம் ஆகிறது..." },
  portal_empty_title: { en: "No reports found", ta: "அறிக்கைகள் எதுவும் இல்லை" },
  portal_empty_desc: { en: "We couldn't find any reports linked to this mobile number yet.", ta: "இந்த மொபைல் எண்ணுடன் தொடர்புடைய அறிக்கைகள் எதுவும் தற்போது இல்லை." },
  portal_error_login: { en: "Invalid mobile number or PIN. Please try again.", ta: "தவறான மொபைல் எண் அல்லது பின் (PIN). மீண்டும் முயற்சிக்கவும்." },
  portal_error_conn: { en: "Login failed. Check your connection.", ta: "உள்நுழைய முடியவில்லை. இணைய இணைப்பைச் சரிபார்க்கவும்." },

  // Contact
  contact_title_1: { en: "Come", ta: "எங்களை" },
  contact_title_2: { en: "find us", ta: "அணுகவும்" },
  contact_visit: { en: "Visit", ta: "நேரில் வர" },
  contact_call: { en: "Call", ta: "அழைக்க" },
  contact_write: { en: "Write", ta: "மின்னஞ்சல்" },
  contact_get_directions: { en: "Get directions", ta: "வழித்தடம்" },
  contact_whatsapp_title: { en: "Or send us a message", ta: "அல்லது எங்களுக்கு செய்தி அனுப்பவும்" },
  contact_whatsapp_btn: { en: "Chat on WhatsApp", ta: "வாட்ஸ்அப்பில் பேச" },
  contact_desc: { en: "Walk in any hour of the day or night. Or schedule a doorstep collection — we'll be there within the hour.", ta: "எந்த நேரமும் நேரில் வரலாம். அல்லது வீட்டிற்கே வரச் சொல்லலாம் — ஒரு மணி நேரத்திற்குள் நாங்கள் அங்கே இருப்போம்." },
  contact_whatsapp_fast: { en: "Fastest channel", ta: "வேகமான வழி" },
  contact_whatsapp_reply: { en: "A real human will reply, day or night, usually within minutes.", ta: "எந்த நேரத்திலும் எங்களது நிபுணர்கள் சில நிமிடங்களில் பதிலளிப்பார்கள்." },
  contact_plate_location: { en: "Plate · Location", ta: "வரைபடம் · இடம்" },
  contact_call_now: { en: "Call now", ta: "இப்போதே அழைக்க" },
  contact_send_email: { en: "Send email", ta: "மின்னஞ்சல் அனுப்புக" },
  contact_open_always: { en: "Open 24 / 7 · 365", ta: "24 / 7 · 365 நாட்களும்" },
  contact_email_respond: { en: "We respond within the hour", ta: "ஒரு மணி நேரத்திற்குள் பதில்" },

  // About Page
  about_title_1: { en: "A diagnostic", ta: "நம்பகமான ஒரு" },
  about_title_2: { en: "partner you can", ta: "மருத்துவப்" },
  about_title_3: { en: "trust", ta: "பரிசோதனைத் துணை" },
  about_manifesto_tag: { en: "A · Manifesto", ta: "A · எங்களது நோக்கம்" },
  about_manifesto_text: { 
    en: "Shashti is a modern, full-service medical laboratory in Chidambaram. We pair advanced equipment with skilled hands and patient-first care to deliver diagnostics worth your trust — anytime, day or night.",
    ta: "சாஸ்தி சிதம்பரத்தில் ஒரு நவீன, முழுமையான மருத்துவ ஆய்வகம். நாங்கள் மேம்பட்ட உபகரணங்கள், திறமையான நிபுணர்கள் மற்றும் கனிவான கவனிப்புடன் நீங்கள் நம்பக்கூடிய சேவையை வழங்குகிறோம் — பகல் அல்லது இரவு எந்த நேரத்திலும்."
  },
  about_offerings_tag: { en: "B · Offerings", ta: "B · சேவைகள்" },
  about_offerings_title_1: { en: "What we", ta: "நாங்கள் வழங்கும்" },
  about_offerings_title_2: { en: "practice", ta: "சேவைகள்" },
  about_offerings_desc: { en: "A comprehensive menu of diagnostics under one roof — supporting physicians and families across the region.", ta: "ஒரே கூரையின் கீழ் அனைத்து வகையான மருத்துவ பரிசோதனைகளும் — இப்பகுதி மருத்துவர்கள் மற்றும் குடும்பங்களுக்கு ஆதரவாக." },
  about_pillars_tag: { en: "C · Pillars", ta: "C · எங்களது தூண்கள்" },
  about_pillars_title_1: { en: "Why patients", ta: "நோயாளிகள் ஏன்" },
  about_pillars_title_2: { en: "return", ta: "எங்களை நாடுகிறார்கள்" },
  pillar_1_title: { en: "No hidden charges", ta: "மறைமுகக் கட்டணங்கள் இல்லை" },
  pillar_1_desc: { en: "Transparent pricing — what you see is what you pay. Always.", ta: "வெளிப்படையான விலை நிர்ணயம் — கூடுதல் கட்டணங்கள் எதுவும் எப்போதும் இல்லை." },
  pillar_2_title: { en: "Reports on time", ta: "சரியான நேரத்தில் அறிக்கைகள்" },
  pillar_2_desc: { en: "Same-day or next-day delivery, every single instance.", ta: "ஒரே நாளில் அல்லது மறுநாளே அறிக்கைகள் வழங்கப்படும்." },
  pillar_3_title: { en: "Certified pathology", ta: "சான்றளிக்கப்பட்ட பரிசோதனைகள்" },
  pillar_3_desc: { en: "Trained technicians and pathologist-reviewed reports.", ta: "நிபுணர்களால் பரிசோதிக்கப்பட்டு சான்றளிக்கப்பட்ட அறிக்கைகள்." },

  // Gallery Page
  gallery_tag_1: { en: "Inside", ta: "ஆய்வகப்" },
  gallery_tag_2: { en: "the gallery", ta: "புகைப்படங்கள்" },
  gallery_page_desc: { en: "A visual register of our diagnostic suites, instruments and the people who keep Shashti running through the night.", ta: "எங்கள் ஆய்வகம், நவீன கருவிகள் மற்றும் 24 மணிநேரமும் பணியாற்றும் நிபுணர்களின் புகைப்படங்கள்." },

  // Footer
  footer_desc: { 
    en: "A precision diagnostic center located in Chidambaram. Trusted by physicians, families, and night-shift emergencies for over a decade.",
    ta: "சிதம்பரத்தில் அமைந்துள்ள ஒரு துல்லியமான ஆய்வக மையம். ஒரு தசாப்தத்திற்கும் மேலாக மருத்துவர்கள் மற்றும் குடும்பங்களால் நம்பப்படுகிறது."
  },
  footer_address: { en: "Laya Complex, S.P Kovil Street, Chidambaram", ta: "லயா காம்க்ளக்ஸ், எஸ்.பி கோவில் தெரு, சிதம்பரம்" },
  footer_promise: { en: "Same-day reports. Doorstep collection. No hidden charges.", ta: "ஒரே நாளில் அறிக்கைகள். வீட்டிற்கே வந்து சேகரிப்பு. மறைமுகக் கட்டணங்கள் இல்லை." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("shashti_lang") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("shashti_lang", lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <div dir="ltr" className={language === "ta" ? "font-tamil" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

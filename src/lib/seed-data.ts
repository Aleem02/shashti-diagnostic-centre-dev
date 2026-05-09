// Seed/fallback data used when Firebase/Cloudinary aren't configured yet.
export type Availability = "Lab" | "Home" | "Both";

export interface MedicalTest {
  id: string;
  name: string;
  description: string;
  availability: Availability;
  duration: string;
  category?: string;
  slug: string;
  biomarkers?: string[];
  image?: string;
  sampleReportUrl?: string | null;
  price?: number | null;
  discountPrice?: number | null;
  hidePrice?: boolean;
  requirements?: string[];
  featured?: boolean;
}

export interface TestProfile extends Omit<MedicalTest, 'category' | 'biomarkers'> {
  includedTests?: string[];
  category: string; // Keep category for consistency or filtering
  requirements?: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface PatientUser {
  phone: string; // document ID
  pinHash: string;
  createdAt: any;
}

export interface PatientReport {
  id: string;
  phone: string;
  patientName: string;
  testName: string;
  reportUrl: string;
  createdAt: any;
}

export const SEED_TESTS: MedicalTest[] = [];

export const SEED_PROFILES: TestProfile[] = [];

export const SEED_GALLERY: GalleryImage[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900", caption: "Modern Diagnostic Lab" },
  { id: "2", url: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=900", caption: "Sample Collection Area" },
  { id: "3", url: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900", caption: "Advanced Equipment" },
  { id: "4", url: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=900", caption: "Reception" },
  { id: "5", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900", caption: "Patient Care" },
  { id: "6", url: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900", caption: "Health Camp" },
  { id: "7", url: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=900", caption: "Lab Technicians" },
  { id: "8", url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=900", caption: "Quality Testing" },
];

export const TESTIMONIALS = [
  { name: "Maha Lakshmi. B", role: "Patient, Chidambaram", text: "I have done my fertility test at shashti diagnostic center and they gave me the report within 3 hours. In all the centers they said they will give the report next day but only in this center they gave it within three hours.Best diagnostic center in Chidambaram.Staffs are very response nd well experienced. Reasonable price. Truly satisfied.", rating: 5 },
  { name: "Pramodh SS", role: "Patient, Chidambaram", text: "I highly recommend this diagnostic center for anyone in need of medical tests. The staff was courteous and knowledgeable, and they made the entire process seamless. The facility was clean, and I felt reassured by the professionalism of the team.", rating: 5 },
  { name: "LENA NEWEL", role: "Patient, Chidambaram", text: "Shashti diagnostic center should have a qualified medical staff to handle your health issues. The center should have experienced and skilled radiologists, pathologists, surgeons, and other medical professionals.", rating: 5 },
  { name: "navas deen", role: "Patient", text: "Good Response and Very Supportive and they provide Pre employment medical fitness report for all countries and guide very well.", rating: 5 },
];

export const TEST_CATEGORIES = ["All", "Tests", "Test Profiles"];

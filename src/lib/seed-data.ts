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

export const SEED_GALLERY: GalleryImage[] = [];

export const TESTIMONIALS = [
  { name: "Maha Lakshmi. B", role: "Patient, Chidambaram", text: "I have done my fertility test at shashti diagnostic center and they gave me the report within 3 hours. In all the centers they said they will give the report next day but only in this center they gave it within three hours.Best diagnostic center in Chidambaram.Staffs are very response nd well experienced. Reasonable price. Truly satisfied.", rating: 5 },
  { name: "Pramodh SS", role: "Patient, Chidambaram", text: "I highly recommend this diagnostic center for anyone in need of medical tests. The staff was courteous and knowledgeable, and they made the entire process seamless. The facility was clean, and I felt reassured by the professionalism of the team.", rating: 5 },
  { name: "LENA NEWEL", role: "Patient, Chidambaram", text: "Shashti diagnostic center should have a qualified medical staff to handle your health issues. The center should have experienced and skilled radiologists, pathologists, surgeons, and other medical professionals.", rating: 5 },
  { name: "navas deen", role: "Patient", text: "Good Response and Very Supportive and they provide Pre employment medical fitness report for all countries and guide very well.", rating: 5 },
];

export const TEST_CATEGORIES = ["All", "Tests", "Test Profiles"];

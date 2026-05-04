// Seed/fallback data used when Firebase/Cloudinary aren't configured yet.
export type Availability = "Lab" | "Home" | "Both";

export interface MedicalTest {
  id: string;
  name: string;
  description: string;
  availability: Availability;
  duration: string;
  category: string;
  sampleReportUrl?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export const SEED_TESTS: MedicalTest[] = [
  { id: "1", name: "Complete Blood Count (CBC)", description: "Comprehensive blood analysis covering RBC, WBC, hemoglobin and platelets.", availability: "Both", duration: "24 hrs", category: "Blood" },
  { id: "2", name: "Thyroid Profile (T3, T4, TSH)", description: "Evaluates thyroid gland function and detects hypo/hyperthyroidism.", availability: "Both", duration: "24 hrs", category: "Thyroid" },
  { id: "3", name: "Lipid Profile", description: "Measures cholesterol, triglycerides, HDL & LDL for heart health.", availability: "Both", duration: "24 hrs", category: "Blood" },
  { id: "4", name: "ECG (Electrocardiogram)", description: "Records electrical activity of the heart to detect cardiac issues.", availability: "Lab", duration: "Same day", category: "ECG" },
  { id: "5", name: "EEG (Electroencephalogram)", description: "Brain wave analysis to evaluate neurological conditions.", availability: "Lab", duration: "48 hrs", category: "EEG" },
  { id: "6", name: "Allergy Panel Test", description: "Identifies common food, dust and environmental allergens.", availability: "Both", duration: "48 hrs", category: "Allergy" },
  { id: "7", name: "Diabetes Screening (HbA1c)", description: "3-month average blood glucose for diabetes monitoring.", availability: "Both", duration: "24 hrs", category: "Blood" },
  { id: "8", name: "Liver Function Test (LFT)", description: "Assesses liver enzymes, bilirubin and protein levels.", availability: "Both", duration: "24 hrs", category: "Blood" },
  { id: "9", name: "Kidney Function Test (KFT)", description: "Checks creatinine, urea and electrolytes for kidney health.", availability: "Both", duration: "24 hrs", category: "Blood" },
  { id: "10", name: "Vitamin D & B12", description: "Detects vitamin deficiencies affecting bones and energy.", availability: "Both", duration: "48 hrs", category: "Blood" },
];

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
  { name: "Priya Ramesh", role: "Patient, Chidambaram", text: "Excellent service! The home collection team was punctual and very professional. Reports came in faster than promised.", rating: 5 },
  { name: "Dr. Karthik S.", role: "Local Physician", text: "I refer my patients here for accurate diagnostics. Their reporting standard and turnaround time is consistently reliable.", rating: 5 },
  { name: "Lakshmi Narayanan", role: "Senior Citizen", text: "Caring staff and transparent pricing. Booking a thyroid test was effortless and the result explanation was clear.", rating: 5 },
  { name: "Anand Kumar", role: "Patient", text: "Open 24/7 was a lifesaver during an emergency ECG. Calm, clean environment and zero waiting time.", rating: 5 },
];

export const TEST_CATEGORIES = ["All", "Blood", "Thyroid", "ECG", "EEG", "Allergy"];

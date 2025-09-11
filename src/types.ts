
export interface Resource {
  id: number;
  title: string;
  url: string;
}

export interface Module {
  id: number;
  title:string;
  videoCode: string | null;
  description: string;
  resources: Resource[];
}

export interface CourseInfo {
  about: string;
  thanks: string;
  contact: string;
}

export interface Feature {
  id: number;
  icon: string; // lucide-react icon name
  title: string;
  description: string;
}

export interface Testimonial {
    id: number;
    text: string;
    author: string;
}

export interface FAQ {
    id: number;
    question: string;
    answer: string;
}

export interface LandingPageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  featuresTitle: string;
  features: Feature[];
  testimonialsTitle: string;
  testimonials: Testimonial[];
}

export interface SiteSettings {
  themeColor: string;
  headerTitle: string;
  footerText: string;
  contactEmail: string;
}

// FIX: Add UserProfile type for Firestore user data.
export interface UserProfile {
  hasPaid: boolean;
}

export interface SiteData {
  siteSettings: SiteSettings;
  landingPageContent: LandingPageContent;
  modules: Module[];
  courseInfo: CourseInfo;
  faqs: FAQ[];
}

// FIX: Remove the unused NetlifyUser type as the app is switching to Firebase.
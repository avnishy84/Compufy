export interface TechStackGroup {
  heading: string;
  items: { name: string; description: string }[];
}

export interface FeatureGroup {
  heading: string;
  items: { name: string; description: string }[];
}

export interface DifferentiatorItem {
  heading: string;
  body: string;
}

export interface ClientProject {
  id: string;
  slug: string;
  name: string;
  industry: string;
  tagline: string;
  initials: string;
  overview: string;
  quote?: string;
  featureGroups: FeatureGroup[];
  techStackGroups: TechStackGroup[];
  techTags: string[];
  architecture?: string;
  architectureNotes?: { heading: string; body: string }[];
  differentiators?: DifferentiatorItem[];
  liveDemoAvailable: boolean;
  liveDemoUrl?: string;
  logoUrl?: string;
}

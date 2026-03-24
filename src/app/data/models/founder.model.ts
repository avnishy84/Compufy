export interface SkillCategory {
  label: string;           // e.g. "Languages"
  skills: string[];        // e.g. ["C#", "JavaScript", "SQL"]
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location: string;
  dateRange: string;       // e.g. "2022 – Present"
  highlights: string[];    // key projects / responsibilities
}

export interface EducationEntry {
  degree: string;          // e.g. "MCA"
  institution: string;
  yearRange: string;       // e.g. "2020 – 2022"
  score: string;           // e.g. "77.80%"
}

export interface FounderProfile {
  name: string;
  title: string;
  location: string;
  summary: string;
  role: string;            // e.g. "Founder, Compufy Technology"
  skillCategories: SkillCategory[];
  experience: ExperienceEntry[];   // reverse-chronological
  education: EducationEntry[];     // reverse-chronological
}

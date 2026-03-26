export interface ServiceCategory {
  id: string;
  label: string;
  services: Service[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'web-development' | 'digital-solutions' | 'pitc';
  slug: string;
  overview?: string;
  features?: string[];
  benefits?: string[];
}

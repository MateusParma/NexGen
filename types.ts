
export enum ServiceType {
  WEB_DEV = 'Desenvolvimento Web',
  MOBILE_APPS = 'Aplicativos Mobile',
  AI_SOLUTIONS = 'Soluções em IA',
  DESIGN_BRANDING = 'Design & Branding',
  SEO_GLOBAL = 'SEO & Internacionalização',
  ADS = 'Publicidade Digital'
}

export type PageView = 
  | 'home' 
  | 'service-web' 
  | 'service-mobile' 
  | 'service-ai' 
  | 'service-design' 
  | 'service-seo' 
  | 'service-ads' 
  | 'project-vino'
  | 'project-tech'
  | 'project-travel'
  | 'project-finance'
  | 'ai-consultant'
  | 'admin-dashboard'
  | 'user-dashboard'
  | 'user-project-detail' // Nova página
  | 'auth-login';

export interface Project {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  slug?: PageView;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 image string
}

export type UserRole = 'admin' | 'client' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // Adicionado para contato de convidado
  role: UserRole;
  avatar?: string;
  password?: string; // Adicionado para autenticação
}

export interface ProjectIdea {
  id: string;
  ownerId?: string; // Adicionado para vincular ao usuário
  title: string;
  description: string;
  features: string[];
  budgetRange?: string;
  createdAt: Date | string; // Permitir string para compatibilidade JSON
  images: string[]; 
  driveLink?: string;
}

export interface ProposalData {
  title: string;
  executiveSummary: string;
  solutionHighlights: string[];
  techStack: string[];
  timeline: { phase: string; duration: string }[];
  investmentValue: string;
  investmentDetails: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  interest: string;
  createdAt: Date | string; // Permitir string para compatibilidade JSON
  status: 'New' | 'Contacted' | 'Confirmed' | 'Cancelled';
  projectImage?: string; 
  projectData?: ProjectIdea; 
  generatedProposal?: ProposalData; 
}

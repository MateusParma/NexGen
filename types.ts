

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
  | 'user-project-detail' 
  | 'auth-login'
  | 'startup-builder'; // Nova ferramenta

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
  phone?: string; 
  role: UserRole;
  avatar?: string;
  password?: string; 
}

export interface ProjectIdea {
  id: string;
  ownerId?: string; 
  title: string;
  description: string;
  features: string[];
  budgetRange?: string;
  createdAt: Date | string; 
  images: string[]; 
  driveLink?: string;
}

export interface ProposalScopeItem {
  title: string;
  description: string;
}

export interface ProposalData {
  title: string;
  subtitle?: string;
  executiveSummary: string;
  scope: ProposalScopeItem[]; 
  techStack: string[];
  timeline: { phase: string; duration: string; deliverable: string }[]; 
  marketingStrategy?: string; 
  maintenancePlan?: string; 
  investmentValue: string;
  investmentDetails: string;
  whyUs?: string; 
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  interest: string;
  createdAt: Date | string; 
  status: 'New' | 'Contacted' | 'Confirmed' | 'Cancelled';
  projectImage?: string; 
  projectData?: ProjectIdea; 
  generatedProposal?: ProposalData; 
}

// --- Interfaces para o Startup Builder ---

export interface StartupFeasibility {
  score: number; // 0 a 100
  verdict: "Aprovado" | "Reprovado" | "Incerto" | "Potencial";
  summary: string; // Comentário estilo Shark Tank
  strengths: string[];
  weaknesses: string[];
  pivotAdvice?: string; // Conselhos para melhorar ou pivotar
}

export interface StartupBudget {
  mvp: { 
    range: string; 
    description: string; 
    timeline: string; 
  };
  ideal: { 
    range: string; 
    description: string; 
    timeline: string; 
  };
}

export interface StartupAnalysis {
  // Branding
  name: string;
  slogan: string;
  logoSvg: string; 
  colors: string[];
  
  // Strategic Data (Novos campos estruturados)
  problem: string;
  solution: string;
  marketSize: string; // TAM/SAM/SOM or description
  competitors: string[];
  monetization: string; // Revenue Model
  marketingStrategy: string;
  
  // Financials
  budgets: StartupBudget;
  
  // Lazy Loaded Visuals (Opcional - Fase 2)
  websiteHtml?: string; 
}
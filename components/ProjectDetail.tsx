
import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, ExternalLink, Code, Layers, Users, TrendingUp } from 'lucide-react';
import { PageView, Lead } from '../types';

interface ProjectDetailProps {
  page: PageView;
  onBack: () => void;
  onRegisterLead?: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
}

interface ProjectData {
  title: string;
  category: string;
  client: string;
  year: string;
  heroImage: string;
  description: string;
  challenge: string;
  solution: string;
  techStack: string[];
  results: { label: string; value: string }[];
  galleryImages: string[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ page, onBack, onRegisterLead }) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Database of projects indexed by slug
  const projectsData: Record<string, ProjectData> = {
    'project-vino': {
      title: "Vino Italiano Premium",
      category: "E-commerce & Branding",
      client: "Vinícola Rosso & Sapore (Itália)",
      year: "2024",
      heroImage: "https://images.unsplash.com/photo-1504279577054-12350c3c754d?q=80&w=1200&auto=format&fit=crop",
      description: "Desenvolvimento de uma plataforma de e-commerce de luxo para exportação de vinhos italianos exclusivos para o mercado global. O projeto envolveu desde o rebranding digital até a implementação de um sistema logístico complexo.",
      challenge: "O cliente precisava modernizar sua imagem tradicional sem perder a essência clássica, além de superar desafios de vendas internacionais, como cálculo de impostos em tempo real e verificação de idade.",
      solution: "Criamos uma interface minimalista e imersiva focada em storytelling. Utilizamos Shopify Plus headless com Next.js para máxima performance. Integramos IA para sugerir vinhos baseados no paladar do cliente.",
      techStack: ["React / Next.js", "Tailwind CSS", "Shopify Plus API", "Node.js Middleware", "Stripe Global"],
      results: [
        { label: "Aumento em Vendas", value: "+140%" },
        { label: "Taxa de Conversão", value: "3.8%" },
        { label: "Performance Mobile", value: "99/100" }
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?q=80&w=600&auto=format&fit=crop"
      ]
    },
    'project-tech': {
      title: "Lisboa Tech Hub",
      category: "Portal Corporativo",
      client: "Associação Digital Lisboa (Portugal)",
      year: "2023",
      heroImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
      description: "Um portal centralizado para conectar startups, investidores e nômades digitais em Lisboa. A plataforma serve como um hub de eventos, vagas de emprego e diretório de empresas de tecnologia.",
      challenge: "Agregar dados em tempo real de múltiplas fontes (Meetup, LinkedIn, APIs de governo) em uma interface unificada e performática, capaz de suportar picos de tráfego durante grandes eventos como o Web Summit.",
      solution: "Arquitetura de microsserviços para escalabilidade. Implementamos um sistema de cache agressivo e renderização híbrida (ISR) com Next.js. O sistema de busca utiliza ElasticSearch para resultados instantâneos.",
      techStack: ["Next.js", "Python (Django)", "ElasticSearch", "Redis", "Docker"],
      results: [
        { label: "Startups Cadastradas", value: "+500" },
        { label: "Usuários Mensais", value: "15k" },
        { label: "Tempo de Carregamento", value: "0.8s" }
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop"
      ]
    },
    'project-travel': {
      title: "EcoTravel App",
      category: "Mobile App / UI",
      client: "GreenWay Italia (Itália)",
      year: "2024",
      heroImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
      description: "Aplicativo móvel focado em turismo sustentável, permitindo que viajantes planejem rotas com menor pegada de carbono e encontrem acomodações eco-friendly na Itália.",
      challenge: "Integrar APIs complexas de transporte público europeu e criar um sistema de gamificação que incentivasse escolhas sustentáveis sem prejudicar a experiência do usuário.",
      solution: "Desenvolvimento cross-platform com Flutter para iOS e Android. Utilizamos Google Maps Platform com camadas customizadas para rotas verdes. Algoritmo proprietário para cálculo de CO2.",
      techStack: ["Flutter", "Firebase", "Google Maps API", "Node.js", "GraphQL"],
      results: [
        { label: "Downloads (3 meses)", value: "50k" },
        { label: "Redução de CO2", value: "-15%" },
        { label: "Avaliação na Store", value: "4.8★" }
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop"
      ]
    },
    'project-finance': {
      title: "Finanças AI Dashboard",
      category: "SaaS / AI Integration",
      client: "InvestEurope Solutions (Portugal/UK)",
      year: "2023",
      heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      description: "Dashboard B2B para análise financeira preditiva. A ferramenta utiliza IA para prever tendências de mercado e automatizar relatórios complexos para gestores de fundos.",
      challenge: "Visualizar terabytes de dados financeiros em tempo real com zero latência e garantir segurança de nível bancário para dados sensíveis.",
      solution: "Frontend em React com bibliotecas de visualização D3.js otimizadas. Backend em Python (FastAPI) servindo modelos de Machine Learning. Infraestrutura segura em AWS com criptografia ponta a ponta.",
      techStack: ["React", "TypeScript", "D3.js", "Python (FastAPI)", "TensorFlow"],
      results: [
        { label: "Velocidade Relatórios", value: "+90%" },
        { label: "Precisão Preditiva", value: "87%" },
        { label: "Retenção de Clientes", value: "98%" }
      ],
      galleryImages: [
        "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=600&auto=format&fit=crop"
      ]
    }
  };

  const projectData = projectsData[page as string];

  if (!projectData) return null;

  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar aos Projetos
          </button>
          <div className="text-sm font-mono text-slate-500 uppercase tracking-widest">{projectData.category}</div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-800 group">
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10"></div>
          <img 
            src={projectData.heroImage} 
            alt={projectData.title} 
            className="w-full h-[50vh] object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20">
            <h1 className="text-4xl md:text-6xl font-black mb-4">{projectData.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm font-medium">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                Cliente: {projectData.client}
              </span>
              <span className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-full border border-slate-600">
                Ano: {projectData.year}
              </span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6 text-purple-500" />
                O Desafio
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed text-justify">
                {projectData.challenge}
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Code className="w-6 h-6 text-blue-500" />
                A Solução Técnica
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed text-justify mb-6">
                {projectData.solution}
              </p>
              
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Tech Stack</h3>
                 <div className="flex flex-wrap gap-3">
                   {projectData.techStack.map((tech, i) => (
                     <span key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-sm">
                       {tech}
                     </span>
                   ))}
                 </div>
              </div>
            </div>

            {/* Gallery Placeholder */}
            <div className="grid md:grid-cols-2 gap-4">
               {projectData.galleryImages.map((img, idx) => (
                 <div key={idx} className="h-64 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative group">
                    <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-105" alt={`${projectData.title} Detail ${idx + 1}`} />
                 </div>
               ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Resultados
              </h3>
              <div className="space-y-6">
                {projectData.results.map((stat, i) => (
                  <div key={i} className="pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
                    <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 shadow-lg shadow-blue-900/30 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Gostou deste projeto?</h3>
              <p className="text-blue-100 text-sm mb-6">Podemos construir algo similar para sua empresa.</p>
              <a href="#contact" className="inline-flex items-center justify-center w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Solicitar Orçamento
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

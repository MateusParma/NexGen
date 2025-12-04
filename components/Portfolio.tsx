
import React from 'react';
import { Project, PageView } from '../types';
import { ExternalLink } from 'lucide-react';

interface PortfolioProps {
  onNavigate: (page: PageView) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onNavigate }) => {
  const projects: Project[] = [
    {
      id: 1,
      title: "Vino Italiano Premium",
      category: "E-commerce / Design",
      imageUrl: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=800&auto=format&fit=crop",
      slug: 'project-vino'
    },
    {
      id: 2,
      title: "Lisboa Tech Hub",
      category: "Portal Corporativo",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
      slug: 'project-tech'
    },
    {
      id: 3,
      title: "EcoTravel App",
      category: "Mobile App / UI",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
      slug: 'project-travel'
    },
    {
      id: 4,
      title: "Finanças AI Dashboard",
      category: "SaaS / AI Integration",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      slug: 'project-finance'
    }
  ];

  const handleProjectClick = (project: Project) => {
    if (project.slug) {
      onNavigate(project.slug);
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Projetos Recentes</h2>
            <p className="text-slate-400">Uma seleção de trabalhos entregues em Portugal e Itália.</p>
          </div>
          <button className="hidden md:block text-primary hover:text-blue-400 font-semibold mt-4 md:mt-0">
            Ver todo o portfólio &rarr;
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => handleProjectClick(project)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-dark/60 group-hover:bg-dark/40 transition-all z-10"></div>
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">{project.category}</p>
                <h3 className="text-2xl font-bold text-white flex items-center justify-between">
                  {project.title}
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
           <button className="text-primary hover:text-blue-400 font-semibold">
            Ver todo o portfólio &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

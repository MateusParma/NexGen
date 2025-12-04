
import React from 'react';
import { Monitor, Smartphone, Brain, Palette, Globe, TrendingUp, ArrowRight } from 'lucide-react';
import { ServiceType, PageView } from '../types';

interface ServicesProps {
  onNavigate: (page: PageView) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const services = [
    {
      id: 'service-web',
      icon: <Monitor className="w-8 h-8 text-blue-500" />,
      title: ServiceType.WEB_DEV,
      desc: "Sites de alta performance, Landing Pages e E-commerce com tecnologias modernas (React, Next.js)."
    },
    {
      id: 'service-mobile',
      icon: <Smartphone className="w-8 h-8 text-purple-500" />,
      title: ServiceType.MOBILE_APPS,
      desc: "Aplicativos nativos e híbridos (iOS e Android) com UX intuitiva e robustez técnica."
    },
    {
      id: 'service-ai',
      icon: <Brain className="w-8 h-8 text-pink-500" />,
      title: ServiceType.AI_SOLUTIONS,
      desc: "Integração da API Google Gemini para automação, chatbots inteligentes e análise de dados."
    },
    {
      id: 'service-design',
      icon: <Palette className="w-8 h-8 text-yellow-500" />,
      title: ServiceType.DESIGN_BRANDING,
      desc: "Identidade visual completa, logotipos, UI/UX Design e materiais gráficos para redes sociais."
    },
    {
      id: 'service-seo',
      icon: <Globe className="w-8 h-8 text-teal-500" />,
      title: "SEO & Internacionalização",
      desc: "Estratégias para posicionar sua marca em Portugal, Itália e mercados globais."
    },
    {
      id: 'service-ads',
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      title: "Publicidade Digital",
      desc: "Gestão de tráfego pago (Google Ads, Meta Ads) para atrair leads qualificados."
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Nossas Soluções</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Combinamos design premium com a mais recente tecnologia para construir produtos digitais que vendem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => onNavigate(service.id as PageView)}
              className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
            >
              <div className="mb-6 p-4 bg-slate-900 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 border border-slate-700">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6 flex-grow">
                {service.desc}
              </p>
              <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:translate-x-2 transition-transform">
                Saiba mais <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

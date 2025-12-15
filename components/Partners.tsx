
import React from 'react';
import { ExternalLink, Droplets, BriefcaseBusiness } from 'lucide-react';

const Partners: React.FC = () => {
  return (
    <section className="py-10 border-b border-slate-800 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">
          Parceiros Estratégicos & Clientes
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Partner 1: HidroClean */}
          <a 
            href="https://www.hidroclean.pt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <Droplets className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                HidroClean
                <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-slate-400">Referência em soluções de canalização e desentupimentos em Portugal.</p>
            </div>
          </a>

          {/* Partner 2: Workly */}
          <a 
            href="https://workly.pt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
              <BriefcaseBusiness className="w-7 h-7 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Workly
                <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-slate-400">Plataforma inovadora de serviços para inserção de jovens no mercado de trabalho.</p>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
};

export default Partners;


import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { PageView } from '../types';

interface HeroProps {
  onNavigate: (page: PageView) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [progress, setProgress] = useState(20);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: any;

    if (isHovered) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 40); // Velocidade reduzida em 50% (20ms -> 40ms)
    } else {
      setProgress(20); // Reseta para 20% ao tirar o mouse
    }

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleAiClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('ai-consultant');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10"></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-blue-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Google AI Studio Partner
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            O Futuro do Seu Negócio é <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Inteligente</span>.
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Especialistas em criação de sites, aplicativos móveis e integração de Inteligência Artificial. 
            Levamos inovação de Portugal e Itália para o mundo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAiClick}
              className="group flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold transition-all text-lg shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-1"
            >
              <Zap className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
              Testar nossa IA
            </button>
            <a 
              href="#portfolio" 
              className="flex items-center justify-center gap-2 bg-transparent border border-slate-600 hover:border-white text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-slate-800"
            >
              Ver Projetos
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="relative hidden md:block">
          {/* Abstract Tech Illustration - Interactive */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative z-10 glass-panel p-8 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-slate-600/50 cursor-default"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-slate-400 font-mono">analysis_module.tsx</div>
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex">
                <span className="text-purple-400 mr-2">const</span>
                <span className="text-blue-400">transformBusiness</span>
                <span className="text-white mx-2">=</span>
                <span className="text-yellow-300">async</span>
                <span className="text-slate-400">()</span>
                <span className="text-slate-400 mx-2">=&gt;</span>
                <span className="text-slate-400">{`{`}</span>
              </div>
              <div className="pl-4 text-slate-300">
                <span className="text-purple-400">await</span> gemini.optimize(<span className="text-green-400">'revenue'</span>);
              </div>
              <div className="pl-4 text-slate-300">
                <span className="text-purple-400">await</span> design.create(<span className="text-green-400">'stunning_ui'</span>);
              </div>
               <div className="pl-4 text-slate-300">
                <span className="text-purple-400">return</span> <span className="text-green-400">'growth'</span>;
              </div>
              <div className="text-slate-400">{`}`}</div>
            </div>
            
            <div className="mt-8 p-4 bg-black/30 rounded-lg border border-slate-700">
              <div className="text-xs text-blue-400 mb-2 font-semibold">System Status</div>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-75 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-white font-mono w-28 text-right">
                  {progress}% Optimization
                </span>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-50 blur-xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

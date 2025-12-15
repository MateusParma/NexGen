
import React from 'react';
import { Satellite, Wifi, ArrowRight, ExternalLink, Globe, Zap, Settings, ShieldCheck } from 'lucide-react';

interface StarlinkSectionProps {
  onContactClick: () => void;
}

const StarlinkSection: React.FC<StarlinkSectionProps> = ({ onContactClick }) => {
  const referralLink = "https://starlink.com/residential?referral=RC-DF-9417919-57481-63";

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-black to-black opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {/* Stars Effect (CSS based dots) */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.1 }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 font-medium backdrop-blur-md">
              <Satellite className="w-4 h-4 text-white" />
              <span className="text-white">Conectividade via Satélite</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Internet de Alta Velocidade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Em Qualquer Lugar.</span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Somos especialistas na instalação e configuração de antenas Starlink. 
              Garanta internet estável, rápida e de baixa latência para sua casa, empresa ou zona rural, 
              mesmo onde a fibra não chega.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={referralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-black hover:bg-slate-200 px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Encomendar Starlink
                <ExternalLink className="w-4 h-4" />
              </a>
              <button 
                onClick={onContactClick}
                className="flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all"
              >
                Agendar Instalação Têcnica
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              *Use nosso link de referência para benefícios exclusivos na compra do kit.
            </p>
          </div>

          {/* Visual Tech Representation */}
          <div className="relative">
            {/* Central Dish Visualization */}
            <div className="relative z-10 bg-gradient-to-b from-slate-900 to-black border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                     <Satellite className="w-6 h-6 text-black" />
                   </div>
                   <div>
                     <h3 className="text-white font-bold text-lg">Starlink Certified Setup</h3>
                     <p className="text-slate-400 text-xs">Instalação Profissional NexGen</p>
                   </div>
                </div>
                <div className="flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <div className="text-green-500 text-xs font-bold font-mono">SIGNAL: STRONG</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <Globe className="w-6 h-6 text-blue-400" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Cobertura Global</h4>
                    <p className="text-slate-400 text-xs">Ideal para zonas rurais e remotas.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Baixa Latência</h4>
                    <p className="text-slate-400 text-xs">Perfeito para videochamadas e jogos.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <Settings className="w-6 h-6 text-purple-400" />
                  <div>
                    <h4 className="text-white font-bold text-sm">Instalação Completa</h4>
                    <p className="text-slate-400 text-xs">Fixação, cabeamento e configuração Wi-Fi.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                 <div className="text-xs text-slate-500">Download Speed</div>
                 <div className="text-2xl font-black text-white font-mono flex items-center gap-1">
                   200+ <span className="text-sm font-normal text-slate-400">Mbps</span>
                 </div>
              </div>
            </div>

            {/* Orbit Lines Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full -z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-0"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StarlinkSection;

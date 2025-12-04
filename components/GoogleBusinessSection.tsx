
import React from 'react';
import { MapPin, BarChart3, Search, Star, CheckCircle2, Globe } from 'lucide-react';

const GoogleBusinessSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
          
          {/* Content */}
          <div className="lg:w-1/2 space-y-8">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 font-medium">
              <Globe className="w-4 h-4" />
              Google Partner Expertise
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Sua Empresa no Topo do <span className="text-blue-500">Google</span>.
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed">
              Não basta ter um site, ele precisa ser encontrado. Gerenciamos sua presença completa no ecossistema Google, desde o perfil no Maps até campanhas de tráfego pago que geram vendas reais.
            </p>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <MapPin className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Perfil de Empresa (Google Meu Negócio)</h4>
                  <p className="text-slate-400 mt-1">Configuração profissional, otimização de SEO local, gestão de avaliações e postagens semanais para manter seu negócio relevante na sua região.</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <BarChart3 className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Gestão de Tráfego (Google Ads)</h4>
                  <p className="text-slate-400 mt-1">Criação de campanhas de Pesquisa, Display e YouTube. Cuidamos do setup, palavras-chave negativas e otimização do ROI.</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <Search className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">SEO & Conteúdo</h4>
                  <p className="text-slate-400 mt-1">Estratégias para rankear organicamente. Criação de artes e conteúdo otimizado para o perfil da empresa.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Visual Element - Mockup Card */}
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 blur-[100px] opacity-20 rounded-full"></div>
              
              {/* Card */}
              <div className="relative bg-white text-slate-900 rounded-2xl p-6 shadow-2xl max-w-md mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-start justify-between mb-6">
                   <div>
                     <h3 className="text-2xl font-bold">Sua Empresa</h3>
                     <div className="flex items-center gap-1 mt-1 text-orange-500">
                       <span className="font-bold text-lg">5.0</span>
                       <div className="flex">
                         <Star className="w-4 h-4 fill-current" />
                         <Star className="w-4 h-4 fill-current" />
                         <Star className="w-4 h-4 fill-current" />
                         <Star className="w-4 h-4 fill-current" />
                         <Star className="w-4 h-4 fill-current" />
                       </div>
                       <span className="text-slate-400 text-xs ml-1">(128 avaliações)</span>
                     </div>
                     <p className="text-slate-500 text-sm mt-1">Design • Marketing • Software</p>
                   </div>
                   <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                     SE
                   </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-full text-sm font-medium">Ligar</button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-full text-sm font-medium">Rota</button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-full text-sm font-medium">Site</button>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Aberto agora • Fecha às 18:00</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Otimizado para SEO Local</span>
                  </div>
                   <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Campanhas Ads Ativas</span>
                  </div>
                </div>
                
                {/* Floating Stats Badge */}
                <div className="absolute -right-12 top-1/2 bg-slate-800 text-white p-4 rounded-xl shadow-xl animate-bounce [animation-duration:3s]">
                  <div className="text-xs text-slate-400 uppercase font-bold">Impressões</div>
                  <div className="text-2xl font-bold text-green-400">+145%</div>
                  <div className="text-xs text-slate-400">Últimos 30 dias</div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GoogleBusinessSection;

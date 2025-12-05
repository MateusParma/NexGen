
import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Rocket, Loader2, Target, TrendingUp, AlertTriangle, Code, Play, CheckCircle, XCircle, DollarSign, Layout, Monitor, MessageCircle } from 'lucide-react';
import { StartupAnalysis, StartupFeasibility } from '../types';
import { analyzeFeasibility, generateFullStartup } from '../services/geminiService';
import { saveToGoogleSheet } from '../services/googleSheetService';

interface StartupBuilderProps {
  onBack: () => void;
  onNavigate: (page: any) => void;
}

const StartupBuilder: React.FC<StartupBuilderProps> = ({ onBack, onNavigate }) => {
  const [idea, setIdea] = useState('');
  
  // States do Fluxo
  const [step, setStep] = useState<'input' | 'analyzing_feasibility' | 'feasibility_result' | 'analyzing_full' | 'full_result'>('input');
  
  const [feasibility, setFeasibility] = useState<StartupFeasibility | null>(null);
  const [fullResult, setFullResult] = useState<StartupAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'business' | 'budget' | 'website'>('business');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Etapa 1: Análise Rápida
  const handleFeasibilityCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setStep('analyzing_feasibility');
    const response = await analyzeFeasibility(idea);

    if (response.success && response.data) {
      setFeasibility(response.data);
      setStep('feasibility_result');
    } else {
      alert("Erro ao analisar viabilidade. Tente novamente.");
      setStep('input');
    }
  };

  // Etapa 2: Geração Completa
  const handleFullGeneration = async () => {
    setStep('analyzing_full');
    const response = await generateFullStartup(idea);

    if (response.success && response.data) {
      setFullResult(response.data);
      setStep('full_result');
    } else {
      alert("Erro ao gerar startup completa.");
      setStep('feasibility_result');
    }
  };

  // --- LÓGICA DE CAPTURA DE CLIQUE NO PREVIEW ---
  const handlePreviewClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Identifica se o clique foi em um botão ou link (ou filho deles)
    const target = e.target as HTMLElement;
    const clickableElement = target.closest('a, button');

    if (clickableElement && fullResult) {
      e.preventDefault(); // Impede erro de navegação
      
      if (isRedirecting) return;
      setIsRedirecting(true);

      const confirmAction = window.confirm(`Gostou do conceito da ${fullResult.name}? \n\nVamos te redirecionar para o WhatsApp para solicitar o desenvolvimento deste projeto real.`);
      
      if (!confirmAction) {
        setIsRedirecting(false);
        return;
      }

      // 2. Salva Lead no Google Sheets
      const interestText = `Startup Builder: ${fullResult.name} - Orçamento Estimado: ${fullResult.budgets.mvp.range}`;
      await saveToGoogleSheet({
        name: "Lead via Startup Builder",
        contact: "WhatsApp Click",
        interest: interestText,
        details: {
          idea: fullResult.description,
          budget_mvp: fullResult.budgets.mvp.range,
          budget_ideal: fullResult.budgets.ideal.range
        }
      });

      // 3. Monta mensagem e abre WhatsApp
      const adminPhone = "351925460063";
      const text = `🚀 *PEDIDO DE PROJETO - NEXGEN BUILDER*\n\n` +
                   `Acabei de gerar uma startup na IA e quero um orçamento!\n\n` +
                   `*Projeto:* ${fullResult.name}\n` +
                   `*Slogan:* ${fullResult.slogan}\n` +
                   `*MVP Estimado:* ${fullResult.budgets.mvp.range}\n\n` +
                   `Podemos agendar uma reunião?`;

      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Header Minimalista */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Site
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 rounded-lg">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">NexGen <span className="text-purple-400">Startup Builder</span></span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        
        {/* STEP 1: INPUT */}
        {step === 'input' && (
          <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 relative inline-block">
               <div className="absolute inset-0 bg-purple-600 blur-[60px] opacity-30 rounded-full"></div>
               <Sparkles className="w-16 h-16 text-purple-400 relative z-10 mx-auto" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Sua ideia vale <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-pulse">Milhões?</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              O "Shark Tank" da Inteligência Artificial. Descreva sua ideia e descubra se ela tem futuro antes de investir um centavo.
            </p>

            <form onSubmit={handleFeasibilityCheck} className="relative max-w-xl mx-auto">
              <textarea 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Ex: Um aplicativo para alugar ferramentas de construção entre vizinhos..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-6 text-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none shadow-2xl transition-all"
                rows={4}
              />
              <button 
                type="submit"
                disabled={!idea.trim()}
                className="absolute bottom-4 right-4 bg-white text-black hover:bg-purple-50 px-6 py-2 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Validar Ideia <Target className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* LOADING SCREENS */}
        {(step === 'analyzing_feasibility' || step === 'analyzing_full') && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold animate-pulse">
              {step === 'analyzing_feasibility' ? 'Consultando Investidores IA...' : 'Construindo sua Empresa...'}
            </h2>
            <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
            <p className="text-slate-500 mt-2 text-sm">
              {step === 'analyzing_feasibility' ? 'Analisando Mercado • Riscos • Potencial' : 'Gerando Site • Criando Orçamento • Escrevendo Business Plan'}
            </p>
          </div>
        )}

        {/* STEP 2: FEASIBILITY RESULT */}
        {step === 'feasibility_result' && feasibility && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
             <div className="text-center mb-8">
               <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">Veredito da IA</span>
               <h2 className="text-4xl font-black mt-2">Análise de Viabilidade</h2>
             </div>

             <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Score Card */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                   <div className={`absolute inset-0 opacity-20 blur-3xl ${feasibility.score > 70 ? 'bg-green-500' : feasibility.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                   <div className="text-6xl font-black mb-2 relative z-10">{feasibility.score}/100</div>
                   <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider relative z-10 ${
                     feasibility.verdict === 'Aprovado' ? 'bg-green-500/20 text-green-400' : 
                     feasibility.verdict === 'Reprovado' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                   }`}>
                     {feasibility.verdict}
                   </div>
                   <p className="text-slate-400 mt-6 italic">"{feasibility.summary}"</p>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-4">
                   <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                      <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Pontos Fortes</h3>
                      <ul className="space-y-2">
                        {feasibility.strengths.map((s, i) => <li key={i} className="text-slate-300 text-sm">• {s}</li>)}
                      </ul>
                   </div>
                   <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                      <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" /> Pontos Fracos</h3>
                      <ul className="space-y-2">
                        {feasibility.weaknesses.map((w, i) => <li key={i} className="text-slate-300 text-sm">• {w}</li>)}
                      </ul>
                   </div>
                </div>
             </div>

             <div className="flex justify-center gap-4">
                <button onClick={() => setStep('input')} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                  Testar Outra Ideia
                </button>
                {feasibility.verdict !== 'Reprovado' && (
                  <button onClick={handleFullGeneration} className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-purple-50 shadow-lg shadow-white/10 transition-transform transform hover:scale-105 flex items-center gap-2">
                    Acelerar Startup (Plano Completo) <ArrowRight className="w-4 h-4" />
                  </button>
                )}
             </div>
          </div>
        )}

        {/* STEP 3: FULL RESULT */}
        {step === 'full_result' && fullResult && (
          <div className="animate-in fade-in zoom-in duration-500">
            {/* Startup Header */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
               
               <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-black border border-slate-700 p-4 flex items-center justify-center shrink-0 shadow-xl"
                    dangerouslySetInnerHTML={{ __html: fullResult.logoSvg }}
               ></div>

               <div className="text-center md:text-left flex-1">
                 <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{fullResult.name}</h1>
                 <p className="text-xl text-purple-400 font-medium italic mb-4">"{fullResult.slogan}"</p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {fullResult.colors.map((color, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: color }}></div>
                        <span className="text-xs font-mono text-slate-400">{color}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* TABS NAVIGATION */}
            <div className="flex justify-center mb-8 bg-slate-900/50 p-1.5 rounded-xl w-fit mx-auto border border-slate-800">
               <button 
                onClick={() => setActiveTab('business')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'business' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                 <Layout className="w-4 h-4" /> Plano de Negócios
               </button>
               <button 
                onClick={() => setActiveTab('budget')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'budget' ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'text-slate-400 hover:text-white'}`}
               >
                 <DollarSign className="w-4 h-4" /> Orçamento & MVP
               </button>
               <button 
                onClick={() => setActiveTab('website')}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'website' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                 <Code className="w-4 h-4" /> Landing Page
               </button>
            </div>

            {/* TAB CONTENT */}
            
            {/* 1. BUSINESS PLAN */}
            {activeTab === 'business' && (
              <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
                 <div className="space-y-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-blue-500" /> Público Alvo</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">{fullResult.targetAudience}</p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" /> Modelo de Receita</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">{fullResult.revenueModel}</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 h-full">
                       <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Rocket className="w-5 h-5 text-purple-500" /> Estratégia de Marketing</h3>
                       <p className="text-slate-400 leading-relaxed text-sm">{fullResult.marketingStrategy}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* 2. BUDGET (COMPARISON) */}
            {activeTab === 'budget' && (
              <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
                 {/* MVP Option */}
                 <div className="bg-slate-900/50 border border-slate-700 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Opção 1: MVP</div>
                    <h3 className="text-3xl font-black text-white mb-4">Mínimo Viável</h3>
                    <div className="text-4xl font-bold text-white mb-6">{fullResult.budgets.mvp.range}</div>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex gap-3 text-slate-400 text-sm">
                          <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                          {fullResult.budgets.mvp.description}
                       </div>
                       <div className="flex gap-3 text-slate-400 text-sm">
                          <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                          Prazo: {fullResult.budgets.mvp.timeline}
                       </div>
                    </div>
                 </div>

                 {/* Ideal Option */}
                 <div className="bg-gradient-to-b from-purple-900/20 to-slate-900/50 border border-purple-500/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
                    <div className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">Opção 2: Escala</div>
                    <h3 className="text-3xl font-black text-white mb-4">Produto Ideal</h3>
                    <div className="text-4xl font-bold text-white mb-6">{fullResult.budgets.ideal.range}</div>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex gap-3 text-slate-300 text-sm">
                          <CheckCircle className="w-5 h-5 text-purple-500 shrink-0" />
                          {fullResult.budgets.ideal.description}
                       </div>
                       <div className="flex gap-3 text-slate-300 text-sm">
                          <CheckCircle className="w-5 h-5 text-purple-500 shrink-0" />
                          Prazo: {fullResult.budgets.ideal.timeline}
                       </div>
                    </div>

                    <button 
                      onClick={() => onNavigate('contact')}
                      className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" /> Solicitar Orçamento Real
                    </button>
                 </div>
              </div>
            )}

            {/* 3. WEBSITE PREVIEW - CORREÇÃO: Container com Scroll Interno & Event Delegation */}
            {activeTab === 'website' && (
              <div className="animate-in slide-in-from-bottom-2">
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 h-[80vh] flex flex-col relative">
                    
                    {/* Browser Mockup Header (Fixed) */}
                    <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-4 shrink-0 z-10">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="bg-white px-4 py-1 rounded-md text-xs text-slate-500 flex-1 text-center shadow-sm font-mono">
                          {fullResult.name.toLowerCase().replace(/\s/g, '')}.com
                      </div>
                    </div>
                    
                    {/* Rendered HTML - Scrollable Content with Click Interception */}
                    <div 
                      className="flex-1 overflow-y-auto bg-white relative custom-scrollbar cursor-default"
                      onClick={handlePreviewClick} // INTERCEPTA TODOS OS CLIQUES AQUI
                    >
                         <div dangerouslySetInnerHTML={{ __html: fullResult.websiteHtml }} className="w-full text-black"></div>
                         
                         {/* Watermark at the bottom of content */}
                         <div className="bg-slate-100 text-slate-500 py-4 text-center text-xs font-medium border-t border-slate-200 mt-auto">
                           Design gerado por NexGen Startup Builder. Clique em qualquer botão do site para solicitar um orçamento.
                         </div>
                    </div>
                    
                </div>
                <div className="text-center mt-6">
                   <p className="text-slate-500 text-sm mb-4">Gostou deste site? Clique nos botões da pré-visualização ou abaixo para construir de verdade.</p>
                   <button 
                      onClick={() => onNavigate('contact')}
                      className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-900/20"
                    >
                      Quero este Site
                    </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
      
      {/* Custom Scrollbar Styles for the Website Preview */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default StartupBuilder;

// Helper icons for dynamic usage if needed
const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

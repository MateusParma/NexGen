import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Target, TrendingUp, AlertTriangle, Code, Play, CheckCircle, XCircle, DollarSign, Layout, Monitor, MessageCircle, Globe, Lightbulb, PieChart, Users, Sword, Zap, ShieldCheck, Rocket } from 'lucide-react';
import { StartupAnalysis, StartupFeasibility } from '../types';
import { analyzeFeasibility, generateStartupPlan, generateStartupWebsite } from '../services/geminiService';

interface StartupBuilderProps {
  onBack: () => void;
  onNavigate: (page: any) => void;
}

const StartupBuilder: React.FC<StartupBuilderProps> = ({ onBack, onNavigate }) => {
  const [idea, setIdea] = useState('');
  const [inputType, setInputType] = useState<'idea' | 'website'>('idea');
  
  // Flow State
  const [step, setStep] = useState<'input' | 'analyzing_feasibility' | 'feasibility_result' | 'analyzing_plan' | 'full_result'>('input');
  
  // Data State
  const [feasibility, setFeasibility] = useState<StartupFeasibility | null>(null);
  const [fullResult, setFullResult] = useState<StartupAnalysis | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'business' | 'budget' | 'website'>('business');
  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  const [websiteGenerated, setWebsiteGenerated] = useState(false);

  // --- STEP 1: Feasibility ---
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

  // --- STEP 2: Strategic Plan (JSON Only) ---
  const handlePlanGeneration = async () => {
    setStep('analyzing_plan');
    const response = await generateStartupPlan(idea, inputType);

    if (response.success && response.data) {
      setFullResult(response.data);
      setStep('full_result');
      setActiveTab('business'); // Default tab
    } else {
      alert("Erro ao gerar plano estratégico.");
      setStep('feasibility_result');
    }
  };

  // --- STEP 3: Website Generation (Lazy Load) ---
  const handleWebsiteTabClick = async () => {
    setActiveTab('website');
    
    // Only generate if not already generated
    if (!websiteGenerated && fullResult && !isLoadingWebsite) {
      setIsLoadingWebsite(true);
      const response = await generateStartupWebsite(fullResult);
      
      if (response.success && response.html) {
        setFullResult(prev => prev ? { ...prev, websiteHtml: response.html } : null);
        setWebsiteGenerated(true);
      } else {
        alert("Erro ao gerar o design do site.");
      }
      setIsLoadingWebsite(false);
    }
  };

  // --- CONVERSION LOGIC ---
  const handleConversion = (source: string) => {
    if (!fullResult) return;

    const confirmAction = window.confirm(`Deseja salvar o projeto "${fullResult.name}" e solicitar um orçamento para o pacote ${source}?`);
    
    if (confirmAction) {
       const pendingProject = {
          title: fullResult.name,
          description: `ORIGEM: Startup Builder (${inputType === 'website' ? 'Redesign' : 'Nova Ideia'})\nPACOTE: ${source}\n\nPROBLEMA: ${fullResult.problem}\nSOLUÇÃO: ${fullResult.solution}\n\nSLOGAN: ${fullResult.slogan}`,
          budget: source === 'MVP' ? fullResult.budgets.mvp.range : fullResult.budgets.ideal.range,
          features: [
            "Landing Page de Alta Conversão", 
            "Painel Administrativo", 
            "Integração de Pagamentos",
            ...(source === 'Ideal' ? ["App Mobile", "Automação IA"] : [])
          ],
       };
       localStorage.setItem('nexgen_pending_project', JSON.stringify(pendingProject));
       onNavigate('user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Sair
          </button>
          <div className="flex items-center gap-3">
            <div className="w-[70px] h-[70px] rounded-md overflow-hidden flex items-center justify-center">
               <img 
                 src="https://raw.githubusercontent.com/MateusParma/NexGen/main/3.png" 
                 alt="NexGen Logo" 
                 className="w-full h-full object-contain"
               />
            </div>
             <img 
                src="https://github.com/MateusParma/NexGen/blob/main/1.png?raw=true" 
                alt="NexGen"
                className="h-16 object-contain"
              />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        
        {/* === INPUT SCREEN === */}
        {step === 'input' && (
          <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 relative inline-block">
               <div className="absolute inset-0 bg-purple-600 blur-[80px] opacity-40 rounded-full"></div>
               <Sparkles className="w-20 h-20 text-purple-400 relative z-10 mx-auto" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
              Construa o Futuro <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse">Em Segundos.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transforme uma ideia vaga em um Plano de Negócios, Estratégia de Mercado e um Site de Alta Conversão usando IA Generativa.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              <button onClick={() => setInputType('idea')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${inputType === 'idea' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40' : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                <Lightbulb className="w-4 h-4" /> Validar Nova Ideia
              </button>
              <button onClick={() => setInputType('website')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all border ${inputType === 'website' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                <Globe className="w-4 h-4" /> Analisar Site Existente
              </button>
            </div>

            <form onSubmit={handleFeasibilityCheck} className="relative max-w-xl mx-auto group">
              <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-2 transition-all group-focus-within:border-purple-500 group-focus-within:ring-1 group-focus-within:ring-purple-500 shadow-2xl backdrop-blur-sm">
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={inputType === 'idea' ? "Ex: Um 'Airbnb' para aluguel de equipamentos de filmagem profissionais..." : "https://minha-empresa.com"}
                  className="w-full bg-transparent border-none p-4 text-lg text-white placeholder-slate-500 outline-none resize-none font-medium"
                  rows={inputType === 'idea' ? 3 : 1}
                />
              </div>
              
              <div className="flex justify-center mt-8">
                <button type="submit" disabled={!idea.trim()} className="relative overflow-hidden w-full md:w-auto bg-white text-black hover:bg-slate-200 px-12 py-4 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl text-lg group">
                   <span className="relative z-10 flex items-center gap-2">Iniciar Análise <Zap className="w-5 h-5 text-yellow-600 fill-current" /></span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* === LOADING SCREENS === */}
        {(step === 'analyzing_feasibility' || step === 'analyzing_plan') && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
               <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse"></div>
               <Loader2 className="w-16 h-16 text-purple-500 animate-spin relative z-10" />
            </div>
            <h2 className="text-3xl font-bold mt-8 mb-2">
              {step === 'analyzing_feasibility' ? 'Analisando Mercado...' : 'Desenvolvendo Estratégia...'}
            </h2>
            <p className="text-slate-500 text-lg">
              {step === 'analyzing_feasibility' ? 'Nossa IA está consultando tendências e concorrentes.' : 'Criando Business Plan, Branding e Estrutura Financeira.'}
            </p>
          </div>
        )}

        {/* === FEASIBILITY RESULT === */}
        {step === 'feasibility_result' && feasibility && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
             <div className="text-center mb-12">
               <h2 className="text-4xl font-black mb-2">Análise de Viabilidade</h2>
               <p className="text-slate-400">O primeiro passo antes de investir.</p>
             </div>

             <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Score Card */}
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                   <div className={`absolute inset-0 opacity-10 blur-[80px] ${feasibility.score > 70 ? 'bg-green-500' : feasibility.score > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                   <div className="text-7xl font-black mb-4 relative z-10 text-white">{feasibility.score}</div>
                   <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider relative z-10 border ${
                     feasibility.verdict === 'Aprovado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                     feasibility.verdict === 'Reprovado' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                   }`}>
                     {feasibility.verdict}
                   </div>
                   <p className="text-slate-400 mt-8 italic text-lg leading-relaxed">"{feasibility.summary}"</p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                   <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                      <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Pontos Fortes</h3>
                      <ul className="space-y-3">
                        {feasibility.strengths.map((s, i) => <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-green-500/50">•</span> {s}</li>)}
                      </ul>
                   </div>
                   <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                      <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><XCircle className="w-5 h-5" /> Riscos & Desafios</h3>
                      <ul className="space-y-3">
                        {feasibility.weaknesses.map((w, i) => <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-red-500/50">•</span> {w}</li>)}
                      </ul>
                   </div>
                </div>
             </div>

             {feasibility.pivotAdvice && (
               <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl mb-8 animate-in slide-in-from-bottom-2">
                 <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                   <Lightbulb className="w-5 h-5" /> Recomendação Estratégica
                 </h3>
                 <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                   {feasibility.pivotAdvice}
                 </p>
               </div>
             )}

             <div className="flex justify-center gap-4 mt-8">
                <button onClick={() => setStep('input')} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                  Nova Análise
                </button>
                {feasibility.score >= 30 && (
                  <button onClick={handlePlanGeneration} className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-purple-50 shadow-lg shadow-white/10 transition-transform transform hover:scale-105 flex items-center gap-2">
                    Gerar Plano & Site <ArrowRight className="w-4 h-4" />
                  </button>
                )}
             </div>
          </div>
        )}

        {/* === FULL RESULT (STRATEGY + WEBSITE) === */}
        {step === 'full_result' && fullResult && (
          <div className="animate-in fade-in zoom-in duration-500 pb-20">
            
            {/* Header / Branding */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
                <div className="w-32 h-32 rounded-2xl bg-black border border-slate-700 p-4 flex items-center justify-center shrink-0 shadow-2xl" dangerouslySetInnerHTML={{ __html: fullResult.logoSvg }}></div>
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tight text-white mb-2">{fullResult.name}</h1>
                    <p className="text-xl text-purple-400 font-medium italic">"{fullResult.slogan}"</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-10">
               <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 inline-flex">
                 <button onClick={() => setActiveTab('business')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'business' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                    <Layout className="w-4 h-4" /> Plano de Negócios
                 </button>
                 <button onClick={() => setActiveTab('budget')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'budget' ? 'bg-green-900/20 text-green-400 border border-green-500/20' : 'text-slate-500 hover:text-white'}`}>
                    <DollarSign className="w-4 h-4" /> Investimento
                 </button>
                 <button onClick={handleWebsiteTabClick} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'website' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                    <Code className="w-4 h-4" /> Website & Design
                 </button>
               </div>
            </div>

            {/* === TAB 1: BUSINESS PLAN DASHBOARD === */}
            {activeTab === 'business' && (
              <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                 {/* Card: Problem */}
                 <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                       <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">O Problema</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{fullResult.problem}</p>
                 </div>

                 {/* Card: Solution */}
                 <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors md:col-span-2 bg-gradient-to-br from-slate-900/50 to-blue-900/10">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                       <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">A Solução</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{fullResult.solution}</p>
                 </div>

                 {/* Card: Market */}
                 <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                       <PieChart className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Mercado (TAM/SAM)</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{fullResult.marketSize}</p>
                 </div>

                 {/* Card: Monetization */}
                 <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                       <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Monetização</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{fullResult.monetization}</p>
                 </div>

                 {/* Card: Competitors */}
                 <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                       <Sword className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Concorrentes</h3>
                    <ul className="space-y-1">
                      {fullResult.competitors.map((c, i) => (
                        <li key={i} className="text-slate-400 text-sm">• {c}</li>
                      ))}
                    </ul>
                 </div>

                 {/* Card: Strategy */}
                 <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors md:col-span-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                       <TrendingUp className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Estratégia de Growth</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{fullResult.marketingStrategy}</p>
                 </div>
              </div>
            )}

            {/* === TAB 2: BUDGETS === */}
            {activeTab === 'budget' && (
              <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                 {/* MVP Card */}
                 <div className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-3xl p-8 transition-all relative overflow-hidden">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Fase 1: Validação</div>
                    <h3 className="text-3xl font-black text-white mb-2">MVP</h3>
                    <div className="text-4xl font-bold text-slate-200 mb-6">{fullResult.budgets.mvp.range}</div>
                    <p className="text-slate-400 text-sm mb-6 min-h-[60px]">{fullResult.budgets.mvp.description}</p>
                    <div className="bg-slate-800/50 p-3 rounded-xl mb-8 flex items-center gap-3">
                        <Code className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400 font-mono">Prazo estimado: {fullResult.budgets.mvp.timeline}</span>
                    </div>
                    <button onClick={() => handleConversion('MVP')} className="w-full py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                       Solicitar Orçamento MVP
                    </button>
                 </div>

                 {/* Ideal Card */}
                 <div className="group bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/30 rounded-3xl p-8 transition-all relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Recomendado</div>
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Fase 2: Escala</div>
                    <h3 className="text-3xl font-black text-white mb-2">Produto Ideal</h3>
                    <div className="text-4xl font-bold text-white mb-6">{fullResult.budgets.ideal.range}</div>
                    <p className="text-slate-300 text-sm mb-6 min-h-[60px]">{fullResult.budgets.ideal.description}</p>
                    <div className="bg-purple-900/20 border border-purple-500/20 p-3 rounded-xl mb-8 flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-purple-200 font-mono">Prazo estimado: {fullResult.budgets.ideal.timeline}</span>
                    </div>
                    <button onClick={() => handleConversion('Ideal')} className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20">
                       <Zap className="w-4 h-4 text-purple-600 fill-current" /> Solicitar Orçamento Completo
                    </button>
                 </div>
              </div>
            )}

            {/* === TAB 3: WEBSITE (LAZY LOADED) === */}
            {activeTab === 'website' && (
              <div className="animate-in slide-in-from-bottom-4 h-full">
                {isLoadingWebsite ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800 rounded-3xl">
                     <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-6" />
                     <h3 className="text-xl font-bold text-white">Gerando Design High-End...</h3>
                     <p className="text-slate-500 text-sm mt-2">Nossa IA está escrevendo o código HTML & Tailwind.</p>
                  </div>
                ) : fullResult.websiteHtml ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 h-[75vh] flex flex-col relative group">
                        {/* Browser Header */}
                        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-4 shrink-0 z-10">
                           <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-400"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                             <div className="w-3 h-3 rounded-full bg-green-400"></div>
                           </div>
                           <div className="bg-white px-4 py-1 rounded-md text-xs text-slate-500 flex-1 text-center shadow-sm font-mono truncate">
                               {fullResult.name.toLowerCase().replace(/\s/g, '')}.com
                           </div>
                        </div>
                        
                        {/* Render HTML */}
                        <div className="flex-1 overflow-y-auto bg-slate-950 relative custom-scrollbar">
                           <div dangerouslySetInnerHTML={{ __html: fullResult.websiteHtml }} />
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white font-bold px-6 py-3 rounded-full bg-black border border-white/20 backdrop-blur-md">Pré-visualização do Conceito</span>
                        </div>
                    </div>
                    
                    <div className="text-center">
                       <button onClick={() => handleConversion('Website')} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 transform hover:scale-105">
                         Gostei deste Design. Quero construir!
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-red-400">Erro ao carregar o site. Tente novamente.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Scrollbar Utility */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

export default StartupBuilder;

import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles, Activity, MessageSquare, Paperclip, X, Cpu } from 'lucide-react';
import { getAiConsultation } from '../services/geminiService';
import { ChatMessage, Lead } from '../types';

interface AiConsultantPageProps {
  onBack: () => void;
  onRegisterLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
}

const AiConsultantPage: React.FC<AiConsultantPageProps> = ({ onBack, onRegisterLead }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Olá. Sou a Inteligência Artificial da NexGen Digital. \n\nPosso analisar imagens de referências, esbocós ou sites. Me envie uma foto ou descreva seu desafio.' 
    }
  ]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, selectedImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!query.trim() && !selectedImage) || isLoading) return;

    const userText = query;
    const userImage = selectedImage;

    setQuery('');
    setSelectedImage(null);
    
    // Adiciona mensagem do usuário
    const newMessages = [...messages, { role: 'user', text: userText, image: userImage || undefined } as ChatMessage];
    setMessages(newMessages);
    
    setIsLoading(true);

    // Passa o histórico completo e a imagem atual para a IA
    const result = await getAiConsultation(userText, messages, userImage || undefined);

    // Se a IA detectou um lead, registra no App
    if (result.leadData) {
      onRegisterLead(result.leadData);
    }

    setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Improved Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_70%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-slate-800 bg-black/50 backdrop-blur-md flex justify-between items-center shrink-0 h-24">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-3">
              <div className="w-[70px] h-[70px] rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="https://github.com/MateusParma/nexgenimages/blob/main/Icone%20nexgen.png?raw=true" 
                  alt="NexGen Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <img 
                src="https://github.com/MateusParma/nexgenimages/blob/main/Logo%20nexgen.png?raw=true" 
                alt="NexGen AI"
                className="h-16 object-contain"
              />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI Consultant</span>
            </h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-green-400 font-mono font-bold tracking-wider">ONLINE • MULTIMODAL</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col min-h-0 container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Chat Interface Container */}
        <div className="flex-1 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 md:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative ring-1 ring-white/5">
          
          {/* Messages Area - SCROLLABLE */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 relative z-10 scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  <div className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
                      {msg.role === 'user' ? <div className="w-full h-full rounded-xl bg-slate-600 border border-slate-500" /> : <Sparkles className="w-5 h-5 text-white" />}
                    </div>

                    {/* Bubble */}
                    <div 
                      className={`p-4 md:p-6 rounded-2xl text-sm md:text-base leading-7 shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-none'
                      }`}
                    >
                       {/* Render Image if exists */}
                       {msg.image && (
                         <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                           <img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-64 object-cover" />
                         </div>
                       )}
                       <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - FIXED at bottom */}
          <div className="p-4 md:p-6 bg-slate-900/90 border-t border-slate-700/50 backdrop-blur-xl shrink-0 z-20">
            
            {/* Image Preview Area */}
            {selectedImage && (
              <div className="mb-3 flex items-center gap-2 animate-in slide-in-from-bottom-2">
                <div className="relative group">
                  <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-600" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">Imagem anexada</span>
              </div>
            )}

            <form onSubmit={handleSearch} className="relative flex gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-600 transition-colors"
                title="Anexar imagem"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Escreva sua mensagem ou envie uma imagem..."
                  className="w-full bg-black/50 border border-slate-600 text-white rounded-xl pl-5 pr-4 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500 text-base"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || (!query.trim() && !selectedImage)}
                className="bg-primary hover:bg-blue-600 text-white px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg shadow-blue-900/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Floating Footer Info */}
        <div className="hidden lg:flex justify-center mt-4 shrink-0">
           <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
             <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Gemini 2.5 Vision</span>
             <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
             <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Google Search Enabled</span>
           </div>
        </div>

      </main>
    </div>
  );
};

export default AiConsultantPage;

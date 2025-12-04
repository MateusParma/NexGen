
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Loader2, Paperclip, X } from 'lucide-react';
import { getAiConsultation } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Olá! Sou o consultor virtual da NexGen Digital. Posso sugerir como a tecnologia e a IA podem transformar seu negócio específico. Qual é o seu ramo de atuação?' 
    }
  ]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
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

    setMessages(prev => [...prev, { role: 'user', text: userText, image: userImage || undefined } as ChatMessage]);
    setIsLoading(true);

    const result = await getAiConsultation(userText, messages, userImage || undefined);

    setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    setIsLoading(false);
  };

  return (
    <section id="ai-demo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark to-blue-900/10 -z-10"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-sm text-purple-400 font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini 2.5 Flash
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Experimente o Poder da <br />
              <span className="text-purple-400">Inteligência Artificial</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Não sabe por onde começar? Converse com nosso consultor de IA. 
              Ele analisa seu setor e propõe soluções digitais personalizadas instantaneamente.
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Análise de Oportunidades
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Ideias de Automação
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Estratégias de Crescimento
              </li>
            </ul>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700 shadow-2xl h-[500px] flex flex-col">
              {/* Chat Header */}
              <div className="bg-slate-800/80 p-4 flex items-center gap-3 border-b border-slate-700">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">NexGen AI Consultant</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>

              {/* Chat Body */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-700 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.image && (
                         <div className="mb-2 rounded overflow-hidden">
                           <img src={msg.image} alt="Upload" className="max-h-32 object-cover" />
                         </div>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                      <span className="text-xs text-slate-400">Pensando...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-slate-800/50 border-t border-slate-700">
                
                {selectedImage && (
                  <div className="mb-2 flex items-center gap-2">
                    <div className="relative">
                      <img src={selectedImage} alt="Preview" className="h-12 w-12 object-cover rounded border border-slate-600" />
                      <button onClick={() => setSelectedImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full"><X className="w-3 h-3" /></button>
                    </div>
                    <span className="text-xs text-slate-400">Imagem selecionada</span>
                  </div>
                )}

                <form onSubmit={handleSearch} className="relative flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                  
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ex: Tenho uma imobiliária em Lisboa..."
                      className="w-full bg-slate-900/80 border border-slate-600 text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-500"
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading || (!query.trim() && !selectedImage)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GeminiDemo;

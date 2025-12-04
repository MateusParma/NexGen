
import React, { useState } from 'react';
import { Palette, Layers, Image as ImageIcon, PenTool, ArrowRight, Settings, Check, Edit2 } from 'lucide-react';
import { User } from '../types';

interface GraphicDesignSectionProps {
  currentUser?: User | null;
}

// Configuração Inicial - Imagens atualizadas para Estilo "Estúdio Criativo"
const INITIAL_IMAGES = [
  {
    id: 1,
    title: "Identidade Visual",
    // Imagem de processo criativo com paletas de cores e sketches (Mais profissional)
    url: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop",
    alt: "Mesa de designer com paletas de cores Pantone e esboços de logotipos",
    heightClass: "h-64"
  },
  {
    id: 2,
    title: "Social Media Content",
    // Link atualizado conforme solicitado pelo usuário
    url: "https://img.digital4.biz/wp-content/uploads/2022/11/social-media-marketing.jpg",
    alt: "Conceito de Social Media Marketing com ícones e conexões digitais",
    heightClass: "h-48"
  },
  {
    id: 3,
    title: "Print & Stationery",
    // Mockup clean de papelaria corporativa
    url: "https://images.unsplash.com/photo-1606166325683-e6deb697d301?q=80&w=800&auto=format&fit=crop",
    alt: "Papelaria corporativa premium e cartões de visita",
    heightClass: "h-48"
  },
  {
    id: 4,
    title: "Digital Campaigns",
    // Ambiente de trabalho digital com analytics
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    alt: "Dashboard de analytics e campanhas digitais",
    heightClass: "h-64"
  }
];

const GraphicDesignSection: React.FC<GraphicDesignSectionProps> = ({ currentUser }) => {
  const [images, setImages] = useState(INITIAL_IMAGES);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditImage = (id: number) => {
    if (!isEditing) return;

    const imgToEdit = images.find(img => img.id === id);
    if (!imgToEdit) return;

    // Simulação de edição simples
    const newUrl = window.prompt("Insira a nova URL da imagem (Unsplash, etc):", imgToEdit.url);
    if (newUrl) {
      const newTitle = window.prompt("Insira o novo título:", imgToEdit.title);
      
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, url: newUrl, title: newTitle || img.title } : img
      ));
    }
  };

  return (
    <section className="py-24 bg-dark relative overflow-hidden group/section">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-900/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[128px]"></div>

      {/* Admin Control Button */}
      {currentUser?.role === 'admin' && (
        <div className="absolute top-6 right-6 z-30 animate-in fade-in slide-in-from-right-4">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all ${isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}`}
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4" />
                Salvar Alterações
              </>
            ) : (
              <>
                <Settings className="w-4 h-4" />
                Gerenciar Galeria
              </>
            )}
          </button>
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-sm text-pink-400 font-medium">
              <Palette className="w-4 h-4" />
              Estúdio Criativo
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Design que <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Marca</span> e Converte.
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed">
              A primeira impressão é a que fica. Nossa equipe de design cria identidades visuais únicas, materiais impressos de luxo e criativos de alta performance para suas campanhas digitais.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition-colors group">
                <div className="bg-pink-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-pink-500 transition-colors">
                  <PenTool className="w-5 h-5 text-pink-400 group-hover:text-white" />
                </div>
                <h4 className="font-bold text-white mb-1">Branding & Logos</h4>
                <p className="text-sm text-slate-400">Criação de marcas memoráveis e manuais de identidade.</p>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition-colors group">
                <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500 transition-colors">
                  <Layers className="w-5 h-5 text-purple-400 group-hover:text-white" />
                </div>
                <h4 className="font-bold text-white mb-1">Papelaria Premium</h4>
                <p className="text-sm text-slate-400">Cartões de visita, pastas e envelopes corporativos.</p>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition-colors group">
                <div className="bg-blue-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors">
                  <ImageIcon className="w-5 h-5 text-blue-400 group-hover:text-white" />
                </div>
                <h4 className="font-bold text-white mb-1">Social Media</h4>
                <p className="text-sm text-slate-400">Posts, stories e reels editados para engajamento.</p>
              </div>

              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition-colors group">
                <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-500 transition-colors">
                  <ArrowRight className="w-5 h-5 text-green-400 group-hover:text-white" />
                </div>
                <h4 className="font-bold text-white mb-1">Ads Creatives</h4>
                <p className="text-sm text-slate-400">Banners otimizados para alta taxa de cliques (CTR).</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase (Masonry Grid simulation) */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            
            {/* Coluna 1 */}
            <div className="space-y-4 mt-8">
              {images.slice(0, 2).map((img) => (
                <div 
                  key={img.id} 
                  onClick={() => handleEditImage(img.id)}
                  className={`${img.heightClass} rounded-2xl overflow-hidden relative group shadow-lg border border-slate-800/50 ${isEditing ? 'cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-dark' : ''}`}
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={img.alt} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-bold">{img.title}</span>
                  </div>
                  
                  {/* Edit Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-2">
                        <Edit2 className="w-3 h-3" />
                        Editar Imagem
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Coluna 2 */}
            <div className="space-y-4">
               {images.slice(2, 4).map((img) => (
                <div 
                  key={img.id} 
                  onClick={() => handleEditImage(img.id)}
                  className={`${img.heightClass} rounded-2xl overflow-hidden relative group shadow-lg border border-slate-800/50 ${isEditing ? 'cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-dark' : ''}`}
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={img.alt} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-bold">{img.title}</span>
                  </div>

                  {/* Edit Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                       <div className="bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-2">
                        <Edit2 className="w-3 h-3" />
                        Editar Imagem
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GraphicDesignSection;

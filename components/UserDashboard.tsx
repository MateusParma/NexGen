
import React, { useState, useEffect } from 'react';
import { User, ProjectIdea, PageView } from '../types';
import { ArrowLeft, LogOut, Plus, Trash2, Eye, Link as LinkIcon, Upload, X, ImageIcon, Loader2, Bot, Sparkles } from 'lucide-react';

interface UserDashboardProps {
  currentUser: User;
  onBack: () => void;
  onLogout: () => void;
  ideas: ProjectIdea[];
  onSaveIdea: (idea: ProjectIdea) => void;
  onDeleteIdea: (id: string) => void;
  onViewProject: (project: ProjectIdea) => void;
  onNavigate: (page: PageView) => void; // Adicionado para navegar para o consultor
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
    currentUser, 
    onBack, 
    onLogout, 
    ideas, 
    onSaveIdea, 
    onDeleteIdea, 
    onViewProject,
    onNavigate
}) => {
  const [showForm, setShowForm] = useState(false);
  
  // Estado do formulário de nova ideia
  const [newIdea, setNewIdea] = useState({ 
    title: '', 
    description: '', 
    features: '', 
    budget: '',
    driveLink: ''
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // --- STARTUP BUILDER INTEGRATION ---
  useEffect(() => {
    // Verifica se existe um projeto pendente vindo do Startup Builder
    const pendingProject = localStorage.getItem('nexgen_pending_project');
    if (pendingProject) {
      try {
        const parsed = JSON.parse(pendingProject);
        setNewIdea({
            title: parsed.title || '',
            description: parsed.description || '',
            budget: parsed.budget || '',
            features: parsed.features || '',
            driveLink: ''
        });
        setShowForm(true);
        // Limpa para não abrir novamente
        localStorage.removeItem('nexgen_pending_project');
      } catch (e) {
        console.error("Erro ao carregar projeto pendente", e);
      }
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessingImages(true);
      const files = Array.from(e.target.files);
      
      const base64Promises = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file as Blob);
        });
      });

      const base64Images = await Promise.all(base64Promises);
      setUploadedImages(prev => [...prev, ...base64Images]);
      setIsProcessingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    const idea: ProjectIdea = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: currentUser.id,
      title: newIdea.title,
      description: newIdea.description,
      features: newIdea.features.split(',').map(f => f.trim()).filter(f => f),
      budgetRange: newIdea.budget,
      createdAt: new Date().toISOString(),
      images: uploadedImages,
      driveLink: newIdea.driveLink
    };
    
    onSaveIdea(idea);
    setShowForm(false);
    // Reset Form
    setNewIdea({ title: '', description: '', features: '', budget: '', driveLink: '' });
    setUploadedImages([]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja apagar este projeto?")) {
      onDeleteIdea(id);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <div className="flex gap-4">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-4 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Voltar para Site
              </button>
            </div>
            
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              Minha Área Criativa
            </h1>
            <p className="text-slate-400 mt-2">
              Bem-vindo, {currentUser.name}. Gerencie suas ideias e transforme-as em realidade.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-xl font-bold text-white">Meus Projetos</h2>
            <div className="flex gap-4 w-full md:w-auto">
               <button 
                onClick={() => onNavigate('ai-consultant')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg shadow-purple-900/20"
              >
                <Bot className="w-5 h-5" />
                Usar Consultor IA
              </button>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20"
              >
                <Plus className="w-5 h-5" />
                Criar Novo Projeto
              </button>
            </div>
        </div>

        {/* Form New Idea */}
        {showForm && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-12 animate-in fade-in slide-in-from-top-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-slate-700 pb-4">Detalhes do Novo Projeto</h3>
            <form onSubmit={handleAddIdea} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nome do Projeto</label>
                  <input 
                    required
                    value={newIdea.title}
                    onChange={e => setNewIdea({...newIdea, title: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                    placeholder="Ex: App de Entregas Sustentáveis" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Orçamento Estimado</label>
                  <input 
                    value={newIdea.budget}
                    onChange={e => setNewIdea({...newIdea, budget: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Ex: €1.000 - €5.000 ou A Definir"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Descrição Detalhada</label>
                <textarea 
                  required
                  value={newIdea.description}
                  onChange={e => setNewIdea({...newIdea, description: e.target.value})}
                  rows={4} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none" 
                  placeholder="Descreva o objetivo do projeto, público-alvo e o problema que ele resolve..." 
                ></textarea>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-400 mb-2">Funcionalidades Principais (separar por vírgula)</label>
                 <input 
                  value={newIdea.features}
                  onChange={e => setNewIdea({...newIdea, features: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                  placeholder="Ex: Login Social, Geolocalização, Pagamento com Cartão, Chat em Tempo Real..." 
                 />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Imagens de Referência / Esboços</label>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 hover:border-primary hover:bg-slate-800/80 transition-all text-center relative group">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                     <Upload className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors" />
                     <p className="text-slate-400 text-sm">Arraste imagens ou clique para carregar</p>
                  </div>
                </div>

                {/* Preview Images */}
                {isProcessingImages && (
                  <div className="flex items-center gap-2 mt-4 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processando imagens...
                  </div>
                )}
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group">
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" /> Link Externo (Google Drive, Dropbox)
                </label>
                <input 
                  value={newIdea.driveLink}
                  onChange={e => setNewIdea({...newIdea, driveLink: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none text-sm" 
                  placeholder="https://drive.google.com/..." 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-6 py-3 text-slate-400 hover:text-white font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-900/20"
                >
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        {ideas.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
            <Upload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300">Nenhum projeto criado ainda</h3>
            <p className="text-slate-500 mb-6">Comece criando sua primeira ideia para receber um orçamento.</p>
            <div className="flex justify-center gap-4">
               <button 
                onClick={() => onNavigate('ai-consultant')}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg transition-colors border border-purple-500/30"
              >
                <Sparkles className="w-4 h-4" />
                Ajuda da IA
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Criar Manualmente
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div 
                key={idea.id} 
                className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group flex flex-col h-full"
              >
                {/* Card Image */}
                <div className="h-48 bg-slate-900 relative overflow-hidden">
                  {idea.images && idea.images.length > 0 ? (
                    <img 
                      src={idea.images[0]} 
                      alt={idea.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <ImageIcon className="w-12 h-12 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={(e) => handleDelete(idea.id, e)}
                      className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white line-clamp-1" title={idea.title}>{idea.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{idea.description}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                      {idea.budgetRange || 'Orçamento não def.'}
                    </span>
                    <span className="text-slate-500 text-xs">
                      • {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button 
                    onClick={() => onViewProject(idea)}
                    className="w-full py-3 bg-slate-700 hover:bg-primary text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes & Pedir Orçamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;

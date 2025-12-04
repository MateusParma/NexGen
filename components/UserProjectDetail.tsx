
import React, { useState } from 'react';
import { ProjectIdea, User, Lead } from '../types';
import { ArrowLeft, Printer, Calendar, Wallet, CheckCircle, ExternalLink, Sparkles, Edit3, Save, X, Send, Loader2 } from 'lucide-react';

interface UserProjectDetailProps {
  project: ProjectIdea;
  currentUser: User;
  onBack: () => void;
  onUpdateProject: (project: ProjectIdea) => void;
  onRegisterLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
}

const UserProjectDetail: React.FC<UserProjectDetailProps> = ({ project, currentUser, onBack, onUpdateProject, onRegisterLead }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Estado local para edição
  const [editedProject, setEditedProject] = useState<ProjectIdea>(project);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdit = () => {
    onUpdateProject(editedProject);
    setIsEditing(false);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Prepara os dados do Lead para enviar ao Admin
    // Inclui a primeira imagem como thumbnail se existir
    // Inclui TODOS os dados do projeto para geração de proposta com IA
    const leadData: Omit<Lead, 'id' | 'createdAt' | 'status'> = {
      name: currentUser.name,
      contact: currentUser.email,
      interest: `Orçamento Projeto: ${project.title} (${project.budgetRange || 'Sem valor'})`,
      projectImage: project.images && project.images.length > 0 ? project.images[0] : undefined,
      projectData: project // Envia o objeto completo
    };

    // Simulação de tempo de rede
    setTimeout(() => {
      onRegisterLead(leadData); // Chama a função do App.tsx
      setIsSending(false);
      setQuoteSent(true);
      
      setTimeout(() => {
        setQuoteSent(false);
        setShowQuoteModal(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12 print:bg-white print:text-black print:p-0 print:m-0">
      
      {/* Navigation - Hidden on Print */}
      <div className="container mx-auto px-6 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para Projetos
        </button>
      </div>

      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Actions Bar - Hidden on Print */}
        <div className="flex flex-wrap justify-end gap-4 mb-6 print:hidden">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-900/20"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 rounded-xl font-bold transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Editar Ideia
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-all shadow-lg"
              >
                <Printer className="w-4 h-4" />
                Salvar PDF
              </button>
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
              >
                <Send className="w-4 h-4" />
                Pedir Orçamento
              </button>
            </>
          )}
        </div>

        {/* DOCUMENT CONTAINER - This is what gets printed beautifully */}
        <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl print:shadow-none print:rounded-none print:p-0 relative">
          
          {/* PDF HEADER */}
          <div className="border-b-2 border-slate-100 pb-8 mb-8 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold text-blue-600 tracking-tighter mb-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                NexGen<span className="text-slate-900">Digital</span>
              </div>
              <p className="text-slate-500 text-sm">Design • Tecnologia • Inteligência Artificial</p>
              <div className="text-xs text-slate-400 mt-1">Lisboa, Portugal • Tropea, Itália</div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Solicitante</div>
              <h2 className="font-bold text-slate-800">{currentUser.name}</h2>
              <p className="text-slate-500 text-sm">{currentUser.email}</p>
              <p className="text-slate-500 text-sm mt-2">Data: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* PROJECT TITLE SECTION */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
              Documento de Projeto
            </span>
            
            {isEditing ? (
              <div className="mb-4">
                 <label className="block text-xs text-slate-400 font-bold uppercase mb-1">Nome do Projeto</label>
                 <input 
                  type="text"
                  value={editedProject.title}
                  onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
                  className="w-full text-4xl font-black text-slate-900 border-b-2 border-blue-200 focus:border-blue-600 outline-none bg-transparent"
                 />
              </div>
            ) : (
              <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
                {project.title}
              </h1>
            )}

            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <Calendar className="w-4 h-4 text-blue-500" />
                Criado em: {new Date(project.createdAt).toLocaleDateString()}
              </div>
              
              {isEditing ? (
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Wallet className="w-4 h-4 text-green-500" />
                  <select 
                    value={editedProject.budgetRange}
                    onChange={(e) => setEditedProject({...editedProject, budgetRange: e.target.value})}
                    className="bg-transparent outline-none border-b border-slate-300 focus:border-green-500"
                  >
                    <option value="< €1.000">Menos de €1.000</option>
                    <option value="€1.000 - €5.000">€1.000 - €5.000</option>
                    <option value="€5.000 - €15.000">€5.000 - €15.000</option>
                    <option value="> €15.000">Mais de €15.000</option>
                  </select>
                </div>
              ) : (
                project.budgetRange && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Wallet className="w-4 h-4 text-green-500" />
                    Orçamento: {project.budgetRange}
                  </div>
                )
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-blue-500 pl-3 mb-4">
              Descrição do Conceito
            </h3>
            {isEditing ? (
              <textarea 
                value={editedProject.description}
                onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                rows={6}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-wrap">
                {project.description}
              </p>
            )}
          </div>

          {/* GRID LAYOUT: FEATURES & LINKS */}
          <div className="grid md:grid-cols-2 gap-8 mb-10 print:grid-cols-2">
            
            {/* Features List */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Funcionalidades Planejadas
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">Separe as funcionalidades por vírgula</p>
                  <textarea 
                    value={editedProject.features.join(', ')}
                    onChange={(e) => setEditedProject({...editedProject, features: e.target.value.split(',').map(f => f.trim())})}
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    rows={4}
                  />
                </div>
              ) : (
                <ul className="space-y-3">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* External Resources */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-purple-500" />
                Recursos Externos
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                Links para arquivos, pastas ou referências adicionais.
              </p>
              {isEditing ? (
                <input 
                  type="text"
                  value={editedProject.driveLink || ''}
                  onChange={(e) => setEditedProject({...editedProject, driveLink: e.target.value})}
                  placeholder="https://"
                  className="w-full p-2 bg-white border border-slate-200 rounded text-sm outline-none focus:border-purple-500"
                />
              ) : (
                project.driveLink && (
                  <a 
                    href={project.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all font-medium"
                  >
                    {project.driveLink}
                  </a>
                )
              )}
            </div>
          </div>

          {/* IMAGE GALLERY */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8 break-inside-avoid">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-purple-500 pl-3 mb-6">
                Galeria Visual & Referências
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {project.images.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm break-inside-avoid">
                    <img 
                      src={img} 
                      alt={`Referência ${idx + 1}`} 
                      className="w-full h-64 object-cover bg-slate-100" 
                    />
                    <div className="p-2 bg-slate-50 text-xs text-slate-500 text-center border-t border-slate-200">
                      Imagem de Referência {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm print:mt-auto">
            <p className="mb-2 font-medium text-slate-500">NexGen Digital Agency</p>
            <p>www.nexgendigital.com | comercial.nexgen.iaestudio@gmail.com</p>
            <p>Portugal: +351 925 460 063 | Itália: +39 392 015 2416</p>
          </div>

        </div>
      </div>
      
      {/* QUOTE MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Solicitar Orçamento
              </h3>
              <button onClick={() => setShowQuoteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {!quoteSent ? (
                <form onSubmit={handleSendQuote} className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-200">
                      <p className="font-bold mb-1">Projeto Anexado Automaticamente</p>
                      <p>O PDF do seu projeto <strong>"{project.title}"</strong> e suas imagens serão enviados junto com esta mensagem para nossa equipe.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Mensagem Adicional (Opcional)</label>
                    <textarea 
                      className="w-full bg-black/20 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                      placeholder="Gostaria de prioridade na entrega..."
                      rows={3}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando Dados...
                      </>
                    ) : (
                      'Confirmar Envio'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Enviado com Sucesso!</h4>
                  <p className="text-slate-400">Recebemos seu projeto. Você pode verificar o status no painel principal ou aguardar nosso contato em <strong>{currentUser.email}</strong>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS Print Styles Override */}
      <style>{`
        @media print {
          @page { margin: 0.5cm; size: A4; }
          body { 
            background: white !important; 
            color: black !important; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          /* Force hide elements that might slip through */
          nav, footer, button { display: none !important; }
          /* Ensure backgrounds print */
          .bg-blue-600 { background-color: #2563EB !important; }
          .bg-blue-100 { background-color: #DBEAFE !important; }
          .text-blue-700 { color: #1D4ED8 !important; }
          .border-blue-500 { border-color: #3B82F6 !important; }
          .bg-slate-50 { background-color: #F8FAFC !important; }
        }
      `}</style>

    </div>
  );
};

export default UserProjectDetail;
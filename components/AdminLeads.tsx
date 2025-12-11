import React, { useState } from 'react';
import { Lead, User, UserRole, ProposalData, ProjectIdea } from '../types';
import { generateProposal } from '../services/geminiService';
import { ArrowLeft, Mail, Calendar, LogOut, Check, X, Phone, Shield, UserPlus, Search, Trash2, Edit, Save, Lock, Image as ImageIcon, Eye, FileText, Sparkles, Loader2, Printer, Wallet, ExternalLink, Paperclip, AlertTriangle, RefreshCcw, Briefcase, Zap, Clock, ShieldCheck, Target, FilePlus } from 'lucide-react';

interface AdminDashboardProps {
  leads: Lead[];
  users: User[];
  onBack: () => void;
  onLogout: () => void;
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onDeleteLead: (id: string) => void;
  onSaveUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  currentUser: User;
}

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  leads, 
  users, 
  onBack, 
  onLogout, 
  onUpdateStatus, 
  onDeleteLead,
  onSaveUser,
  onDeleteUser,
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'users'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Users Management State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ name: '', email: '', role: 'client', password: '' });

  // Lead Details State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<ProposalData | null>(null);

  // Manual Proposal Generation State
  const [showManualProposalModal, setShowManualProposalModal] = useState(false);
  const [manualProposalInput, setManualProposalInput] = useState({ clientName: '', projectTitle: '', projectDescription: '' });

  // --- Filter Logic ---
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- User Actions ---
  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUserId(user.id);
      setFormData({ name: user.name, email: user.email, role: user.role, password: user.password || '' });
    } else {
      setEditingUserId(null);
      setFormData({ name: '', email: '', role: 'client', password: '' });
    }
    setShowUserModal(true);
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: User = {
        id: editingUserId || Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password
    };
    onSaveUser(userData);
    setShowUserModal(false);
  };

  const handleRemoveUser = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      onDeleteUser(id);
    }
  };

  // --- Lead Actions ---
  const handleRemoveLead = (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este lead do histórico?')) {
      onDeleteLead(id);
      if (selectedLead?.id === id) setSelectedLead(null);
    }
  };

  // --- Proposal Actions ---
  const handleGenerateProposal = async () => {
    if (!selectedLead?.projectData) {
        alert("Este lead não possui dados estruturados de projeto para gerar proposta.");
        return;
    }
    
    // Reset states
    setIsGeneratingProposal(true);
    setGenerationError(null);
    
    // Check cache first
    if (selectedLead.generatedProposal) {
        setCurrentProposal(selectedLead.generatedProposal);
        setIsGeneratingProposal(false);
        setShowProposalModal(true);
        return;
    }

    try {
        const result = await generateProposal(selectedLead.projectData);
        
        if (result.success && result.data) {
            setCurrentProposal(result.data);
            selectedLead.generatedProposal = result.data; 
            setShowProposalModal(true);
        } else {
            setGenerationError(result.error || "Erro desconhecido ao gerar proposta.");
        }
    } catch (e) {
        console.error(e);
        setGenerationError("Erro crítico na aplicação.");
    } finally {
        setIsGeneratingProposal(false);
    }
  };

  const handleManualProposalGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingProposal(true);
    setGenerationError(null);

    // Simula uma ProjectIdea com os dados manuais
    const manualProject: ProjectIdea = {
      id: 'manual',
      title: manualProposalInput.projectTitle,
      description: manualProposalInput.projectDescription,
      features: ['A ser definido na proposta'],
      createdAt: new Date(),
      images: []
    };

    // Cria um lead temporário para exibir o nome do cliente no PDF
    const tempLead: Lead = {
      id: 'temp',
      name: manualProposalInput.clientName,
      contact: 'N/A',
      interest: 'Manual Proposal',
      createdAt: new Date(),
      status: 'New'
    };
    setSelectedLead(tempLead); // Hack para usar o nome no visualizador

    try {
      const result = await generateProposal(manualProject);
      if (result.success && result.data) {
        setCurrentProposal(result.data);
        setShowManualProposalModal(false);
        setShowProposalModal(true);
      } else {
        alert(result.error || "Erro ao gerar proposta.");
      }
    } catch (error) {
      alert("Erro crítico.");
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handlePrintProposal = () => {
    window.print();
  };
  
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Contacted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getStatusLabel = (status: Lead['status']) => {
    switch (status) {
      case 'Confirmed': return 'Confirmado';
      case 'Cancelled': return 'Cancelado';
      case 'Contacted': return 'Contatado';
      default: return 'Novo';
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12 relative print:bg-white print:p-0 print:pt-0">
      
      {/* --- DASHBOARD VIEW (HIDDEN ON PRINT) --- */}
      <div className="container mx-auto px-6 print:hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-4 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Voltar para Site
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg"><Shield className="w-6 h-6 text-white" /></div>
              Painel Administrativo (BD Local)
            </h1>
            <p className="text-slate-400 mt-2">Gestor: <span className="text-white font-semibold">{currentUser.name}</span></p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {/* Tabs & Filters */}
        <div className="flex gap-4 border-b border-slate-700 mb-8">
          <button onClick={() => setActiveTab('leads')} className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'leads' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            Gestão de Leads
            {activeTab === 'leads' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
          <button onClick={() => setActiveTab('users')} className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            Gestão de Usuários
            {activeTab === 'users' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder={activeTab === 'leads' ? "Buscar leads..." : "Buscar usuários..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-primary w-full md:w-80"
            />
          </div>
          <div className="flex gap-3">
            {activeTab === 'leads' && (
              <button onClick={() => setShowManualProposalModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg">
                <FilePlus className="w-4 h-4" /> Criar Proposta Manual
              </button>
            )}
            {activeTab === 'users' && (
              <button onClick={() => handleOpenUserModal()} className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-900/20">
                <UserPlus className="w-4 h-4" /> Novo Usuário
              </button>
            )}
          </div>
        </div>

        {/* Tables */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl min-h-[400px]">
          {activeTab === 'leads' && (
            filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full mt-20">
                <Mail className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg">Nenhum lead encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                      <th className="p-6 font-semibold">Data</th>
                      <th className="p-6 font-semibold">Nome</th>
                      <th className="p-6 font-semibold">Contato</th>
                      <th className="p-6 font-semibold">Interesse</th>
                      <th className="p-6 font-semibold">Status</th>
                      <th className="p-6 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-6 text-slate-400 whitespace-nowrap font-mono text-xs">
                          <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}</div>
                          <div className="opacity-50 mt-1">{new Date(lead.createdAt).toLocaleTimeString().slice(0,5)}</div>
                        </td>
                        <td className="p-6 font-bold text-white">
                           <div className="flex items-center gap-3">
                              {lead.projectImage ? (
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                                  <img src={lead.projectImage} alt="Projeto" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                                  <div className="text-xs font-bold">{lead.name.charAt(0)}</div>
                                </div>
                              )}
                              {lead.name}
                            </div>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full w-fit text-sm">
                             <Phone className="w-3 h-3" /> {lead.contact}
                           </div>
                        </td>
                        <td className="p-6 text-slate-300 max-w-xs" title={lead.interest}>
                            <p className="truncate">{lead.interest}</p>
                            {(lead.projectData) && <span className="text-[10px] text-green-400 flex items-center gap-1 mt-1"><FileText className="w-3 h-3"/> Projeto Anexado</span>}
                        </td>
                        <td className="p-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>{getStatusLabel(lead.status)}</span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setSelectedLead(lead); setGenerationError(null); }} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all" title="Ver Detalhes"><Eye className="w-4 h-4" /></button>
                            {lead.status !== 'Confirmed' && lead.status !== 'Cancelled' && (
                              <>
                                <button onClick={() => onUpdateStatus(lead.id, 'Confirmed')} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg border border-green-500/20 transition-all"><Check className="w-4 h-4" /></button>
                                <button onClick={() => onUpdateStatus(lead.id, 'Cancelled')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all"><X className="w-4 h-4" /></button>
                              </>
                            )}
                            <div className="w-px h-6 bg-slate-700 mx-1"></div>
                            <button onClick={() => handleRemoveLead(lead.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
          {activeTab === 'users' && (
             <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-6 font-semibold">Nome</th>
                    <th className="p-6 font-semibold">Email</th>
                    <th className="p-6 font-semibold">Telefone</th>
                    <th className="p-6 font-semibold">Permissão</th>
                    <th className="p-6 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-6 font-bold text-white flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">{user.name.charAt(0)}</div>
                         {user.name}
                      </td>
                      <td className="p-6 text-slate-300">{user.email}</td>
                      <td className="p-6 text-slate-300 text-sm">{user.phone || '-'}</td>
                      <td className="p-6">
                         {user.role === 'admin' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Admin</span>}
                         {user.role === 'client' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Cliente</span>}
                         {user.role === 'guest' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Convidado</span>}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenUserModal(user)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleRemoveUser(user.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- LEAD DETAILS MODAL --- */}
      {selectedLead && !showProposalModal && !showManualProposalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Detalhes do Projeto & Lead</h3>
              <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white transition-colors p-1 bg-slate-800 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row">
              
              <div className="p-6 flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Cliente</label>
                    <div className="text-white font-bold text-lg">{selectedLead.name}</div>
                    <div className="text-blue-400 font-medium text-sm flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {selectedLead.contact}</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Status</label>
                     <div className="flex justify-between items-center">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedLead.status)}`}>{getStatusLabel(selectedLead.status)}</span>
                     </div>
                  </div>
                </div>
                
                {selectedLead.projectData ? (
                   <div className="bg-slate-50 text-slate-900 rounded-xl p-6 shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">PROJETO DO CLIENTE</div>
                     
                     <h3 className="font-black text-2xl mb-2">{selectedLead.projectData.title}</h3>
                     <p className="text-sm text-slate-600 mb-4 whitespace-pre-wrap leading-relaxed">{selectedLead.projectData.description}</p>
                     
                     <div className="border-t border-slate-200 pt-3 mb-4">
                        <span className="font-bold block text-slate-800 text-sm mb-2">Funcionalidades:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedLead.projectData.features.map((f, i) => <span key={i} className="text-xs bg-slate-200 border border-slate-300 px-2 py-1 rounded text-slate-700">{f}</span>)}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-3">
                        <div>
                            <span className="font-bold block text-slate-800 text-sm mb-1 flex items-center gap-1"><Wallet className="w-3 h-3" /> Orçamento</span>
                            <span className="text-sm text-slate-600 bg-green-100 text-green-800 px-2 py-0.5 rounded inline-block">{selectedLead.projectData.budgetRange || 'Não informado'}</span>
                        </div>
                        <div>
                            <span className="font-bold block text-slate-800 text-sm mb-1 flex items-center gap-1"><Paperclip className="w-3 h-3" /> Links</span>
                            {selectedLead.projectData.driveLink ? (
                                <a href={selectedLead.projectData.driveLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" /> Abrir Link
                                </a>
                            ) : (
                                <span className="text-sm text-slate-400 italic">Nenhum</span>
                            )}
                        </div>
                     </div>

                     {selectedLead.projectData.images && selectedLead.projectData.images.length > 0 && (
                        <div className="border-t border-slate-200 pt-3 mt-4">
                            <span className="font-bold block text-slate-800 text-sm mb-2 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Galeria</span>
                            <div className="grid grid-cols-3 gap-2">
                                {selectedLead.projectData.images.map((img, idx) => (
                                    <div key={idx} className="aspect-square bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative group">
                                        <img src={img} className="w-full h-full object-cover" alt={`Anexo ${idx}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                     )}
                   </div>
                ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500">Sem dados detalhados.</p>
                    </div>
                )}
              </div>

              <div className="lg:w-80 bg-slate-800/30 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col gap-6">
                 <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> Gerador de Proposta IA</h4>
                    <p className="text-xs text-slate-400">Analisa os dados para criar uma proposta comercial.</p>
                    
                    {generationError ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm animate-in fade-in">
                            <div className="flex items-start gap-2 text-red-400 mb-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span className="font-bold">Falha ao Gerar</span>
                            </div>
                            <p className="text-slate-400 text-xs mb-3">{generationError}</p>
                            <button 
                                onClick={handleGenerateProposal}
                                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCcw className="w-3 h-3" /> Tentar Novamente
                            </button>
                        </div>
                    ) : (
                        <button 
                        onClick={handleGenerateProposal}
                        disabled={isGeneratingProposal || !selectedLead.projectData}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {isGeneratingProposal ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando (pode demorar)...</> : 'Gerar Proposta'}
                        </button>
                    )}
                  </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- MANUAL PROPOSAL MODAL --- */}
      {showManualProposalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl relative">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><FilePlus className="w-5 h-5 text-purple-400" /> Criar Proposta Manual</h3>
                 <button onClick={() => setShowManualProposalModal(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleManualProposalGenerate} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase">Nome do Cliente</label>
                       <input 
                         required
                         type="text" 
                         value={manualProposalInput.clientName}
                         onChange={e => setManualProposalInput({...manualProposalInput, clientName: e.target.value})}
                         className="w-full bg-black/20 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" 
                         placeholder="Ex: João Silva"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase">Título do Projeto</label>
                       <input 
                         required
                         type="text" 
                         value={manualProposalInput.projectTitle}
                         onChange={e => setManualProposalInput({...manualProposalInput, projectTitle: e.target.value})}
                         className="w-full bg-black/20 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none" 
                         placeholder="Ex: App de Delivery"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Descrição Completa / Conteúdo do PDF</label>
                    <textarea 
                      required
                      value={manualProposalInput.projectDescription}
                      onChange={e => setManualProposalInput({...manualProposalInput, projectDescription: e.target.value})}
                      className="w-full bg-black/20 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none h-48"
                      placeholder="Cole aqui todas as informações do projeto, emails, ou copie e cole o texto do PDF que o cliente enviou..."
                    />
                 </div>
                 <div className="pt-2">
                    <button 
                       type="submit" 
                       disabled={isGeneratingProposal}
                       className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                       {isGeneratingProposal ? <><Loader2 className="w-4 h-4 animate-spin" /> Analisando Texto e Gerando...</> : <><Sparkles className="w-4 h-4" /> Gerar Proposta com IA</>}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* --- PROPOSAL PDF VIEW (PREMIUM) --- */}
      {showProposalModal && currentProposal && (
         <div className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto">
            <div className="fixed top-0 left-0 w-full h-16 bg-slate-800 border-b border-slate-700 flex justify-between items-center px-6 print:hidden z-50 shadow-lg">
                <div className="flex items-center gap-4">
                   <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold">
                     <ArrowLeft className="w-4 h-4" /> Voltar
                   </button>
                   <div className="h-6 w-px bg-slate-600"></div>
                   <span className="text-white font-bold">Visualização de Impressão</span>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                    onClick={handlePrintProposal}
                    className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg transition-colors"
                   >
                     <Printer className="w-4 h-4" />
                     Imprimir / Salvar PDF
                   </button>
                </div>
            </div>

            <div className="pt-24 pb-20 px-4 min-h-screen flex justify-center print:p-0 print:block print:min-h-0 print:bg-white print:pt-0">
               {/* A4 PAPER CONTAINER */}
               <div className="bg-white text-slate-900 w-full max-w-[21cm] shadow-2xl p-[1.5cm] print:shadow-none print:w-full print:max-w-none print:h-auto print:min-h-0 print:p-0 relative print:m-0 box-border">
                  
                  {/* HEADER WITH LOGO */}
                  <header className="flex justify-between items-center mb-12 border-b-2 border-slate-900 pb-6">
                     <div>
                       <div className="flex items-center gap-3 text-3xl font-black text-slate-900 tracking-tighter">
                         <div className="w-32 h-32 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 overflow-hidden">
                             <img 
                               src="https://raw.githubusercontent.com/MateusParma/NexGen/main/3.png" 
                               alt="NexGen Logo" 
                               className="w-full h-full object-contain"
                             />
                         </div>
                         <img 
                            src="https://github.com/MateusParma/NexGen/blob/main/1.png?raw=true" 
                            alt="NexGen Digital" 
                            className="h-24 object-contain filter invert" 
                         />
                       </div>
                     </div>
                     <div className="text-right text-xs uppercase tracking-widest font-bold text-slate-500">
                        Proposta Comercial Confidencial
                     </div>
                  </header>

                  {/* COVER INFO */}
                  <section className="mb-12">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded mb-4">
                      {new Date().toLocaleDateString()} • Validade: 15 Dias
                    </span>
                    <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-2">
                      {currentProposal.title}
                    </h1>
                    {currentProposal.subtitle && (
                      <h2 className="text-xl text-slate-500 font-medium mb-6">
                        {currentProposal.subtitle}
                      </h2>
                    )}
                    
                    <div className="flex items-center gap-4 mt-6">
                        <div className="h-1 w-20 bg-blue-600"></div>
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Preparado para {selectedLead?.name}</p>
                    </div>
                  </section>

                  {/* EXECUTIVE SUMMARY */}
                  <section className="mb-12 bg-slate-50 p-8 rounded-xl border-l-4 border-slate-900 print:bg-transparent print:border-l-4 print:border-slate-900 print:p-0 print:pl-6">
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">Visão Executiva</h3>
                     <p className="text-lg text-slate-700 leading-relaxed font-serif italic">
                       "{currentProposal.executiveSummary}"
                     </p>
                  </section>

                  {/* SCOPE OF WORK (GRID) */}
                  <section className="mb-12 break-inside-avoid">
                    <div className="flex items-center gap-3 mb-6">
                       <Target className="w-6 h-6 text-slate-900" />
                       <h3 className="text-xl font-bold text-slate-900">Escopo do Projeto</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                       {currentProposal.scope && currentProposal.scope.length > 0 ? (
                           currentProposal.scope.map((item, idx) => (
                             <div key={idx} className="border border-slate-200 p-5 rounded-lg break-inside-avoid">
                                <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                             </div>
                           ))
                       ) : (
                         <p className="text-slate-500 italic">Detalhes do escopo a serem definidos.</p>
                       )}
                    </div>
                  </section>

                  {/* TIMELINE & DELIVERABLES */}
                  <section className="mb-12 break-inside-avoid">
                    <div className="flex items-center gap-3 mb-6">
                       <Clock className="w-6 h-6 text-slate-900" />
                       <h3 className="text-xl font-bold text-slate-900">Cronograma & Entregáveis</h3>
                    </div>
                    <div className="space-y-0 border-l border-slate-200 ml-3">
                       {currentProposal.timeline.map((item, i) => (
                         <div key={i} className="relative pl-8 pb-8 last:pb-0 break-inside-avoid">
                            <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-600 rounded-full ring-4 ring-white"></div>
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-900 text-lg">{item.phase}</h4>
                                <span className="bg-slate-100 px-3 py-1 rounded text-xs font-bold text-slate-600">{item.duration}</span>
                            </div>
                            <p className="text-sm text-slate-500">
                               <span className="font-semibold text-slate-700">Entrega:</span> {item.deliverable}
                            </p>
                         </div>
                       ))}
                    </div>
                  </section>

                  {/* TECH STACK & STRATEGY (2 COLUMNS) */}
                  <section className="grid grid-cols-2 gap-8 mb-12 break-inside-avoid">
                     <div>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Tech Stack</h3>
                       <div className="flex flex-wrap gap-2">
                          {currentProposal.techStack.map((tech, i) => (
                             <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">
                               {tech}
                             </span>
                          ))}
                       </div>
                     </div>
                     <div>
                        {currentProposal.marketingStrategy && (
                            <>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Estratégia de Growth</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{currentProposal.marketingStrategy}</p>
                            </>
                        )}
                     </div>
                  </section>

                  {/* INVESTMENT - BIG HIGHLIGHT */}
                  <section className="bg-slate-900 text-white p-8 rounded-xl mb-8 break-inside-avoid print:bg-black print:text-white">
                     <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                          <h3 className="text-slate-400 font-medium uppercase tracking-widest text-xs mb-2">Investimento Total Estimado</h3>
                          <div className="text-5xl font-bold tracking-tight mb-2">{currentProposal.investmentValue}</div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                             <ShieldCheck className="w-4 h-4 text-green-400" />
                             <span>{currentProposal.investmentDetails}</span>
                          </div>
                        </div>
                        <div className="text-right max-w-xs">
                           <div className="text-xs text-slate-500 uppercase font-bold mb-1">Incluso no Pacote</div>
                           <p className="text-sm text-slate-300">
                             {currentProposal.maintenancePlan || "Suporte técnico e garantia de bugs por 3 meses após lançamento."}
                           </p>
                        </div>
                     </div>
                  </section>

                  {/* FOOTER / WHY US */}
                  <div className="border-t border-slate-200 pt-6 text-center break-inside-avoid">
                    {currentProposal.whyUs && (
                        <p className="text-slate-800 font-medium italic mb-4">"{currentProposal.whyUs}"</p>
                    )}
                    <div className="flex justify-center gap-8 text-xs text-slate-400 uppercase tracking-widest">
                       <span>www.nexgendigital.com</span>
                       <span>comercial.nexgen.iaestudio@gmail.com</span>
                    </div>
                  </div>

               </div>
            </div>
            
            <style>{`
               @media print {
                 @page { margin: 0; size: A4; }
                 body { 
                    background: white; 
                    margin: 0; 
                    padding: 0;
                 }
                 /* Esconde TUDO que não seja o modal de proposta */
                 body > *:not(.fixed) { display: none !important; }
                 
                 /* Força a visibilidade das classes print:block */
                 .print\\:block { display: block !important; }
                 .print\\:hidden { display: none !important; }
                 
                 /* Reset de containers para ocupar a folha toda */
                 .fixed.inset-0 { position: static !important; height: auto !important; overflow: visible !important; background: white !important; }
                 .bg-white { box-shadow: none !important; max-width: none !important; width: 100% !important; padding: 1.5cm !important; }
                 
                 /* Cores exatas */
                 * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
               }
            `}</style>
         </div>
      )}

      {/* --- USER MODAL --- */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">{editingUserId ? <Edit className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />} {editingUserId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmitUser} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Nome</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/20 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Senha</label>
                <div className="relative">
                  <input type="text" required={!editingUserId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/20 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Tipo de Permissão</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFormData({...formData, role: 'client'})} className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.role === 'client' ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>Cliente</button>
                  <button type="button" onClick={() => setFormData({...formData, role: 'admin'})} className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.role === 'admin' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>Admin</button>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold transition-colors flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
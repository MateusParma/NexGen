
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import GraphicDesignSection from './components/GraphicDesignSection';
import GoogleBusinessSection from './components/GoogleBusinessSection';
import GeminiDemo from './components/GeminiDemo';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ServiceDetail from './components/ServiceDetail';
import ProjectDetail from './components/ProjectDetail';
import AiConsultantPage from './components/AiConsultantPage';
import AdminDashboard from './components/AdminLeads';
import UserDashboard from './components/UserDashboard';
import UserProjectDetail from './components/UserProjectDetail';
import Login from './components/Login';
import StartupBuilder from './components/StartupBuilder'; // Novo Componente
import { PageView, Lead, User, ProjectIdea } from './types';
import { storageService } from './services/storageService';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  
  // Application State (Database Mirrors)
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProjectIdea, setSelectedProjectIdea] = useState<ProjectIdea | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Inicializa o banco de dados se estiver vazio
    storageService.init();

    // Carrega dados do banco
    setUsers(storageService.getUsers());
    setLeads(storageService.getLeads());
    setProjects(storageService.getProjects());

    // Tenta recuperar sessão do usuário (opcional, simples persistência de sessão)
    const savedUser = localStorage.getItem('nexgen_session_user');
    if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // --- NAVIGATION ---
  const handleNavigate = (page: PageView) => {
    // Auth Guard
    if ((page === 'admin-dashboard' || page === 'user-dashboard' || page === 'user-project-detail') && !currentUser) {
      // Se tentar acessar dashboard sem logar, vai pro login
      // O Login component saberá para onde voltar se implementarmos lógica de redirect, 
      // mas por enquanto ele joga para o dashboard apropriado ao logar.
      setCurrentPage('auth-login');
      return;
    }
    
    // Admin Guard
    if (page === 'admin-dashboard' && currentUser?.role !== 'admin') {
      alert("Acesso não autorizado.");
      return;
    }

    setCurrentPage(page);
  };

  // --- LEAD MANAGEMENT ---
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      status: 'New',
      ...leadData
    };
    
    // Atualiza estado e banco
    storageService.addLead(newLead);
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLeadStatus = (id: string, status: Lead['status']) => {
    const leadToUpdate = leads.find(l => l.id === id);
    if (leadToUpdate) {
        const updated = { ...leadToUpdate, status };
        storageService.updateLead(updated);
        setLeads(prev => prev.map(l => l.id === id ? updated : l));
    }
  };

  const handleDeleteLead = (id: string) => {
    storageService.deleteLead(id);
    setLeads(prev => prev.filter(l => l.id !== id));
  }

  // --- USER MANAGEMENT (ADMIN) ---
  const handleSaveUser = (user: User) => {
    storageService.saveUser(user);
    setUsers(storageService.getUsers()); // Recarrega para garantir sincronia
  };

  const handleDeleteUser = (id: string) => {
    storageService.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // --- PROJECT MANAGEMENT (USER) ---
  const handleSaveProject = (project: ProjectIdea) => {
    // Garante que o projeto tenha o ID do dono
    const projectWithUser = { ...project, ownerId: currentUser?.id };
    storageService.saveProject(projectWithUser);
    
    setProjects(prev => {
        const exists = prev.find(p => p.id === project.id);
        if (exists) return prev.map(p => p.id === project.id ? projectWithUser : p);
        return [projectWithUser, ...prev];
    });

    if (selectedProjectIdea?.id === project.id) {
        setSelectedProjectIdea(projectWithUser);
    }
  };

  const handleDeleteProject = (id: string) => {
    storageService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleViewProject = (project: ProjectIdea) => {
    setSelectedProjectIdea(project);
    setCurrentPage('user-project-detail');
  };

  // --- AUTHENTICATION ---
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nexgen_session_user', JSON.stringify(user));
    if (user.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('user-dashboard');
    }
  };

  const handleRegisterUser = (user: User) => {
    storageService.saveUser(user);
    setUsers(prev => [...prev, user]);
    handleLoginSuccess(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexgen_session_user');
    setCurrentPage('auth-login');
  };

  // --- ROUTING ---
  const isServicePage = currentPage.startsWith('service-');
  const isProjectPage = currentPage.startsWith('project-');

  // Filtrar projetos para o usuário logado
  const userProjects = projects.filter(p => p.ownerId === currentUser?.id);

  if (currentPage === 'startup-builder') {
    return <StartupBuilder onBack={() => setCurrentPage('home')} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'ai-consultant') {
    return <AiConsultantPage onBack={() => setCurrentPage('home')} onRegisterLead={handleAddLead} />;
  }

  if (currentPage === 'auth-login') {
    return (
      <Login 
        users={users} // Passa usuários reais para validação
        onLoginSuccess={handleLoginSuccess}
        onRegister={handleRegisterUser}
        onBack={() => setCurrentPage('home')} 
      />
    );
  }

  if (currentPage === 'admin-dashboard' && currentUser) {
    return (
      <AdminDashboard 
        leads={leads} 
        users={users}
        onBack={() => setCurrentPage('home')} 
        onLogout={handleLogout}
        onUpdateStatus={handleUpdateLeadStatus}
        onDeleteLead={handleDeleteLead}
        onSaveUser={handleSaveUser}
        onDeleteUser={handleDeleteUser}
        currentUser={currentUser}
      />
    );
  }

  if (currentPage === 'user-dashboard' && currentUser) {
    return (
      <UserDashboard 
        currentUser={currentUser}
        onBack={() => setCurrentPage('home')}
        onLogout={handleLogout}
        ideas={userProjects}
        onSaveIdea={handleSaveProject}
        onDeleteIdea={handleDeleteProject}
        onViewProject={handleViewProject}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === 'user-project-detail' && currentUser && selectedProjectIdea) {
    return (
      <UserProjectDetail 
        project={selectedProjectIdea}
        currentUser={currentUser}
        onBack={() => setCurrentPage('user-dashboard')}
        onUpdateProject={handleSaveProject}
        onRegisterLead={handleAddLead}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} />
      
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero onNavigate={handleNavigate} />
            <Services onNavigate={handleNavigate} />
            <GraphicDesignSection currentUser={currentUser} />
            <GoogleBusinessSection />
            <GeminiDemo />
            <Portfolio onNavigate={handleNavigate} />
            <Contact onRegisterLead={handleAddLead} />
          </>
        ) : isServicePage ? (
          <>
            <ServiceDetail 
              page={currentPage} 
              onBack={() => setCurrentPage('home')} 
              onNavigate={handleNavigate} 
              onRegisterLead={handleAddLead} 
            />
            <div className="border-t border-slate-800">
              <Contact onRegisterLead={handleAddLead} />
            </div>
          </>
        ) : isProjectPage ? (
           <>
            <ProjectDetail 
              page={currentPage} 
              onBack={() => setCurrentPage('home')} 
              onNavigate={handleNavigate}
              onRegisterLead={handleAddLead} 
            />
             <div className="border-t border-slate-800">
              <Contact onRegisterLead={handleAddLead} />
            </div>
           </>
        ) : null}
      </main>
      
      <Footer onAdminClick={() => handleNavigate('admin-dashboard')} />
    </div>
  );
}

export default App;

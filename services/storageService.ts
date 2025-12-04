
import { Lead, User, ProjectIdea } from '../types';

const KEYS = {
  USERS: 'nexgen_db_users',
  LEADS: 'nexgen_db_leads',
  PROJECTS: 'nexgen_db_projects'
};

// Dados Iniciais (Seed)
const INITIAL_USERS: User[] = [
  { id: 'admin-1', name: 'Admin Principal', email: 'admin@nexgen.com', role: 'admin', password: '123' },
  { id: 'admin-2', name: 'Admin Parma', email: 'parma@gmail.com', role: 'admin', password: '123' },
  { id: 'admin-3', name: 'Mateus Admin', email: 'mateus@admin.com', role: 'admin', password: '1234' },
  { id: 'client-1', name: 'João Silva', email: 'joao@cliente.com', role: 'client', password: '123' },
];

const INITIAL_PROJECTS: ProjectIdea[] = [
  {
    id: '1',
    ownerId: 'client-1',
    title: 'E-commerce de Vinhos',
    description: 'Plataforma para vender vinhos portugueses para a China. Preciso de integração com WeChat Pay e sistema de logística automatizado.',
    features: ['Pagamento WeChat', 'Tradução Mandarim', 'Cálculo de Frete'],
    budgetRange: '€5.000 - €10.000',
    createdAt: new Date().toISOString(),
    images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800'],
    driveLink: 'https://drive.google.com/drive/folders/exemple'
  }
];

// Helper para ler do localStorage com segurança
const getStorage = <T>(key: string, initialValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Erro ao ler ${key}`, error);
    return initialValue;
  }
};

// Helper para salvar no localStorage
const setStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar ${key}`, error);
  }
};

export const storageService = {
  // --- INICIALIZAÇÃO ---
  init: () => {
    // Inicializa Leads
    if (!localStorage.getItem(KEYS.LEADS)) {
      setStorage(KEYS.LEADS, []);
    }
    
    // Inicializa Projetos
    if (!localStorage.getItem(KEYS.PROJECTS)) {
      setStorage(KEYS.PROJECTS, INITIAL_PROJECTS);
    }

    // --- LÓGICA DE SINCRONIZAÇÃO DE USUÁRIOS ---
    // Garante que os usuários hardcoded (como mateus@admin.com) existam,
    // mesmo que o localStorage já tenha sido criado anteriormente.
    const storedUsers = getStorage<User[]>(KEYS.USERS, []);
    
    let hasChanges = false;
    const finalUsers = [...storedUsers];

    INITIAL_USERS.forEach(seedUser => {
      const exists = finalUsers.find(u => u.email === seedUser.email);
      if (!exists) {
        finalUsers.push(seedUser);
        hasChanges = true;
      }
    });

    // Se não tinha nada, ou se adicionamos novos admins hardcoded
    if (storedUsers.length === 0 || hasChanges) {
      setStorage(KEYS.USERS, finalUsers);
    }
  },

  // --- USERS ---
  getUsers: (): User[] => getStorage(KEYS.USERS, INITIAL_USERS),
  
  saveUser: (user: User) => {
    const users = getStorage<User[]>(KEYS.USERS, []);
    const exists = users.find(u => u.id === user.id);
    let newUsers;
    if (exists) {
      newUsers = users.map(u => u.id === user.id ? user : u);
    } else {
      newUsers = [...users, user];
    }
    setStorage(KEYS.USERS, newUsers);
    return newUsers;
  },

  deleteUser: (id: string) => {
    const users = getStorage<User[]>(KEYS.USERS, []);
    const newUsers = users.filter(u => u.id !== id);
    setStorage(KEYS.USERS, newUsers);
    return newUsers;
  },

  // --- LEADS ---
  getLeads: (): Lead[] => {
    const leads = getStorage<Lead[]>(KEYS.LEADS, []);
    // Recupera datas de string para objeto Date se necessário
    return leads.map(l => ({
      ...l,
      createdAt: new Date(l.createdAt)
    }));
  },

  addLead: (lead: Lead) => {
    const leads = getStorage<Lead[]>(KEYS.LEADS, []);
    const newLeads = [lead, ...leads];
    setStorage(KEYS.LEADS, newLeads);
    return newLeads; // Retorna lista atualizada com datas como string (JSON)
  },

  updateLead: (updatedLead: Lead) => {
    const leads = getStorage<Lead[]>(KEYS.LEADS, []);
    const newLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    setStorage(KEYS.LEADS, newLeads);
    return newLeads;
  },

  deleteLead: (id: string) => {
    const leads = getStorage<Lead[]>(KEYS.LEADS, []);
    const newLeads = leads.filter(l => l.id !== id);
    setStorage(KEYS.LEADS, newLeads);
    return newLeads;
  },

  // --- PROJETOS ---
  getProjects: (): ProjectIdea[] => {
    const projects = getStorage<ProjectIdea[]>(KEYS.PROJECTS, []);
    return projects.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt)
    }));
  },

  saveProject: (project: ProjectIdea) => {
    const projects = getStorage<ProjectIdea[]>(KEYS.PROJECTS, []);
    const exists = projects.find(p => p.id === project.id);
    let newProjects;
    if (exists) {
        newProjects = projects.map(p => p.id === project.id ? project : p);
    } else {
        newProjects = [project, ...projects];
    }
    setStorage(KEYS.PROJECTS, newProjects);
    return newProjects;
  },

  deleteProject: (id: string) => {
    const projects = getStorage<ProjectIdea[]>(KEYS.PROJECTS, []);
    const newProjects = projects.filter(p => p.id !== id);
    setStorage(KEYS.PROJECTS, newProjects);
    return newProjects;
  }
};

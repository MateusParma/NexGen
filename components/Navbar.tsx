
import React, { useState, useEffect } from 'react';
import { Menu, X, User, Lock, LayoutDashboard, LogIn, Rocket } from 'lucide-react';
import { PageView, User as UserType } from '../types';

interface NavbarProps {
  onNavigate: (page: PageView) => void;
  currentUser?: UserType | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentUser, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    onNavigate('home');
    setIsMobileMenuOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBudgetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Fluxo: Login -> User Dashboard -> Criar Projeto
    if (currentUser) {
      onNavigate(currentUser.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
    } else {
      onNavigate('auth-login');
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Início', id: 'home' },
    { name: 'Serviços', id: 'services' },
    { name: 'Expertise AI', id: 'ai-demo' },
    { name: 'Portfólio', id: 'portfolio' },
    // Contato removido da navegação principal para forçar fluxo de orçamento
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-3"
        >
          <div className="relative w-[70px] h-[70px] flex items-center justify-center rounded-lg overflow-hidden">
            <img 
              src="https://github.com/MateusParma/nexgenimages/blob/main/Icone%20nexgen.png?raw=true" 
              alt="NexGen Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <img 
            src="https://github.com/MateusParma/nexgenimages/blob/main/Logo%20nexgen.png?raw=true" 
            alt="NexGen Digital"
            className="h-20 object-contain"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-slate-300 hover:text-white hover:text-primary transition-colors text-sm font-medium uppercase tracking-wide"
            >
              {link.name}
            </a>
          ))}

          {/* New Startup Builder Link */}
          <button 
            onClick={() => onNavigate('startup-builder')}
            className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm font-bold uppercase tracking-wide border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 rounded-lg"
          >
            <Rocket className="w-3 h-3" /> Startup Builder
          </button>

          {currentUser ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-700">
               <button 
                onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                className="flex items-center gap-2 text-white hover:text-primary transition-colors text-sm font-medium"
              >
                {currentUser.role === 'admin' ? <Lock className="w-4 h-4 text-primary" /> : <LayoutDashboard className="w-4 h-4 text-green-400" />}
                {currentUser.name}
              </button>
              <button 
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-300 uppercase font-bold"
              >
                Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('auth-login')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-full"
            >
              <LogIn className="w-3 h-3" />
              Login
            </button>
          )}

          <button 
            onClick={handleBudgetClick}
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            Orçamento
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-dark border-t border-slate-800 py-4 px-6 flex flex-col space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-slate-300 hover:text-primary py-2 border-b border-slate-800 last:border-0"
            >
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={() => { onNavigate('startup-builder'); setIsMobileMenuOpen(false); }}
            className="text-left text-purple-400 font-bold py-2 border-b border-slate-800 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" /> Startup Builder
          </button>

          {currentUser ? (
             <button 
              onClick={() => {
                onNavigate(currentUser.role === 'admin' ? 'admin-dashboard' : 'user-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-white font-bold py-2 border-b border-slate-800 flex items-center gap-2"
            >
              {currentUser.role === 'admin' ? <Lock className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
              Painel {currentUser.role === 'admin' ? 'Admin' : 'Cliente'}
            </button>
          ) : (
            <button 
              onClick={() => {
                onNavigate('auth-login');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-slate-300 hover:text-primary py-2 border-b border-slate-800 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}

          <button 
            onClick={handleBudgetClick}
            className="w-full text-center bg-primary hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold mt-2"
          >
            Pedir Orçamento
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, User, Lock, LayoutDashboard } from 'lucide-react';
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

  const navLinks = [
    { name: 'Início', id: 'home' },
    { name: 'Serviços', id: 'services' },
    { name: 'Expertise AI', id: 'ai-demo' },
    { name: 'Portfólio', id: 'portfolio' },
    // Contato removido conforme solicitado
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-2 text-2xl font-bold text-white tracking-tighter"
        >
          <div className="bg-primary p-1.5 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          NexGen<span className="text-primary">Digital</span>
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
              <Lock className="w-3 h-3" />
              Área Restrita
            </button>
          )}

          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, 'contact')}
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            Orçamento
          </a>
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
              <Lock className="w-4 h-4" />
              Login / Área Restrita
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

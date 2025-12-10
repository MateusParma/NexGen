import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-black py-12 border-t border-slate-800 text-sm">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative w-[70px] h-[70px] flex items-center justify-center rounded-lg overflow-hidden">
            <img 
              src="https://github.com/MateusParma/NexGen/blob/main/3.png?raw=true" 
              alt="NexGen Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <img 
            src="https://github.com/MateusParma/NexGen/blob/main/2.png?raw=true" 
            alt="NexGen Digital"
            className="h-20 object-contain"
          />
        </div>
        
        <div className="text-slate-500 text-center md:text-right flex flex-col items-center md:items-end">
          <p>&copy; {new Date().getFullYear()} NexGen Digital. Todos os direitos reservados.</p>
          <div className="flex gap-4 justify-center md:justify-end mt-2">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            {onAdminClick && (
              <button onClick={onAdminClick} className="text-slate-700 hover:text-slate-500 transition-colors" title="Admin Access">
                <Lock className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
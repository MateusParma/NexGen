
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Send, CheckCircle, Loader2, MessageCircle } from 'lucide-react';
import { Lead } from '../types';
import { saveToGoogleSheet } from '../services/googleSheetService';

interface ContactProps {
  onRegisterLead?: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
}

const Contact: React.FC<ContactProps> = ({ onRegisterLead }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    service: 'Desenvolvimento Web',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const interestText = `${formData.service} - ${formData.company ? `Empresa: ${formData.company} - ` : ''}${formData.message}`;

    // 1. Salva localmente (para o histórico do cliente neste dispositivo)
    if (onRegisterLead) {
      onRegisterLead({
        name: formData.name,
        contact: formData.email,
        interest: interestText,
      });
    }

    // 2. Salva no Banco de Dados (Google Sheets)
    await saveToGoogleSheet({
      name: formData.name,
      contact: formData.email,
      interest: interestText,
      details: { company: formData.company, service: formData.service, message: formData.message }
    });

    // 3. Envia para o WhatsApp do Admin (Garante o recebimento imediato)
    setTimeout(() => {
      const adminPhone = "351925460063"; // Número do Admin
      const text = `🚀 *Novo Lead via Site NexGen*\n\n` +
                   `*Nome:* ${formData.name}\n` +
                   `*Empresa:* ${formData.company || 'N/A'}\n` +
                   `*Email:* ${formData.email}\n` +
                   `*Interesse:* ${formData.service}\n\n` +
                   `*Mensagem:*\n${formData.message}`;
      
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
      
      // Abre o WhatsApp em nova aba
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', company: '', email: '', service: 'Desenvolvimento Web', message: '' });
      
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-t from-black to-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Vamos Criar Algo Incrível?</h2>
            <p className="text-slate-400 text-lg mb-12">
              Estamos prontos para levar seu negócio ao próximo nível com design de ponta e inteligência artificial. 
              Atendemos clientes em Portugal, Itália e remotamente para o mundo.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Email</h4>
                  <p className="text-slate-400">comercial.nexgen.iaestudio@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-purple-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Telefone</h4>
                  <p className="text-slate-400">+351 925 460 063 (PT)</p>
                  <p className="text-slate-400">+39 392 015 2416 (IT)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-pink-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Escritórios</h4>
                  <p className="text-slate-400">Lisboa, Portugal</p>
                  <p className="text-slate-400">Tropea, Itália</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <a href="#" className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-primary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
               <a href="#" className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-primary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 relative overflow-hidden">
            
            {isSent ? (
              <div className="absolute inset-0 z-10 bg-slate-800/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/50">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Solicitação Iniciada!</h3>
                <p className="text-slate-300 max-w-xs mb-6">
                  Estamos abrindo seu WhatsApp para finalizar o contato direto com nossa equipe comercial.
                </p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Voltar
                </button>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Nome</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" 
                    placeholder="Seu nome" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Empresa</label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" 
                    placeholder="Nome da empresa" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" 
                  placeholder="seu@email.com" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Serviço de Interesse</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                >
                  <option>Desenvolvimento Web</option>
                  <option>Aplicativo Mobile</option>
                  <option>Integração com IA</option>
                  <option>Design & Branding</option>
                  <option>Publicidade Online</option>
                  <option>Google Business & SEO</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Mensagem</label>
                <textarea 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" 
                  placeholder="Conte um pouco sobre seu projeto..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Preparando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Enviar via WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

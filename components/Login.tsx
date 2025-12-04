
import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, AlertCircle, Loader2, User as UserIcon, UserPlus, Ghost, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onRegister: (user: User) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLoginSuccess, onRegister, onBack }) => {
  const [view, setView] = useState<'login' | 'register' | 'guest'>('login');
  const [activeRole, setActiveRole] = useState<'admin' | 'client'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleSwitchView = (newView: 'login' | 'register' | 'guest') => {
    setView(newView);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // --- GUEST LOGIN ---
      if (view === 'guest') {
        if (!name.trim()) {
            setError('Por favor, informe seu nome.');
            setIsLoading(false);
            return;
        }
        const guestUser: User = {
            id: `guest-${Date.now()}`,
            name: name,
            email: 'guest@nexgen.com',
            role: 'guest',
        };
        onRegister(guestUser); // Trata convidado como registro temporário
        setIsLoading(false);
        return;
      }

      // --- REGISTER LOGIC ---
      if (view === 'register') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setIsLoading(false);
          return;
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
           setError('Este email já está cadastrado.');
           setIsLoading(false);
           return;
        }

        const newUser: User = {
          id: `client-${Date.now()}`,
          name: name,
          email: email,
          role: 'client',
          password: password
        };
        
        onRegister(newUser);
        setIsLoading(false);
        return;
      }

      // --- LOGIN LOGIC ---
      // Fix: Find user by email first, ignoring role initially to allow login from any tab
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        if (foundUser.password === password) {
             // Login successful
             onLoginSuccess(foundUser);
        } else {
             setError('Senha incorreta.');
             setIsLoading(false);
        }
      } else {
        setError('Usuário não encontrado.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl relative">
        
        {view === 'login' && (
          <div className="flex bg-slate-800 p-1 rounded-xl mb-8">
            <button 
              onClick={() => { setActiveRole('client'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeRole === 'client' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <UserIcon className="w-4 h-4" />
              Sou Cliente
            </button>
            <button 
              onClick={() => { setActiveRole('admin'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${activeRole === 'admin' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Lock className="w-4 h-4" />
              Área Restrita
            </button>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            {view === 'register' && (
              <>
                <UserPlus className="w-6 h-6 text-green-400" />
                Criar Nova Conta
              </>
            )}
            {view === 'guest' && (
              <>
                <Ghost className="w-6 h-6 text-yellow-400" />
                Entrar como Convidado
              </>
            )}
            {view === 'login' && (
               activeRole === 'admin' ? 'Painel de Gestão' : 'Login do Cliente'
            )}
          </h1>
          {view === 'login' && (
            <p className="text-slate-400 text-sm mt-2">
             Entre para gerenciar seus projetos.
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {(view === 'register' || view === 'guest') && (
            <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Como podemos te chamar?</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="Seu nome"
                  required
                />
                <UserIcon className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {view !== 'guest' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                    required
                  />
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 pr-10 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {view === 'register' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmar Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-slate-800 border rounded-xl p-3 pl-10 text-white focus:outline-none transition-colors ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-slate-700 focus:border-primary'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4 ${
              view === 'register'
                ? 'bg-green-600 hover:bg-green-500 shadow-green-900/20 text-white'
                : view === 'guest'
                  ? 'bg-yellow-500 hover:bg-yellow-400 shadow-yellow-900/20 text-black'
                  : activeRole === 'admin' 
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20 text-white' 
                    : 'bg-primary hover:bg-blue-600 shadow-blue-900/20 text-white'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              view === 'register' ? 'Cadastrar Conta' : view === 'guest' ? 'Entrar como Convidado' : 'Entrar'
            )}
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {view === 'login' && (
            <>
              <button 
                onClick={() => handleSwitchView('register')}
                className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 rounded-lg py-2"
              >
                Não tem conta? <span className="text-primary font-bold">Criar agora</span>
              </button>
              <button 
                 onClick={() => handleSwitchView('guest')}
                 className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest font-semibold"
              >
                Continuar sem senha (Convidado)
              </button>
            </>
          )}

          {(view === 'register' || view === 'guest') && (
             <button 
                onClick={() => handleSwitchView('login')}
                className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
              >
                Já tem conta? <span className="text-primary font-bold">Fazer Login</span>
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Logo } from './Logo';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a professional delay
    setTimeout(() => {
      if (password === 'Pos.2026') {
        onLogin();
      } else {
        setError(true);
        setLoading(false);
        // Shake animation reset
        setTimeout(() => setError(false), 500);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 font-sans">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-apple-accent/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-apple-accent/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <Logo className="mb-6 scale-110" />
          <div className="text-center">
            <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F] mb-2">Portal Corporativo</h1>
            <p className="text-[#86868B] text-[17px] font-medium">Acceso restringido a personal autorizado.</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-[#86868B]">Contraseña de Acceso</label>
                <ShieldCheck size={16} className="text-apple-accent opacity-50" />
              </div>
              
              <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-[#F5F5F7] border-2 rounded-2xl px-6 py-3 md:py-4 text-lg md:text-xl outline-none transition-all placeholder:text-zinc-300 ${
                    error ? 'border-red-500/50 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-apple-accent/30'
                  }`}
                  autoFocus
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock size={20} strokeWidth={1.5} />
                </div>
              </motion.div>
              
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm font-medium text-center"
                >
                  Credenciales incorrectas. Intente de nuevo.
                </motion.p>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full apple-button py-4 text-lg rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-apple-accent/20 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Ingresar al Sistema
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex gap-8 text-[13px] font-medium text-[#86868B]">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Sistemas Online
            </span>
            <span>v2.0.26</span>
            <button 
              onClick={() => window.location.href = '/'}
              className="hover:text-apple-accent transition-colors"
            >
              Volver a la Tienda
            </button>
          </div>
          
          <p className="text-[11px] text-[#A1A1A6] text-center leading-relaxed max-w-[300px]">
            Este sistema utiliza cifrado de grado empresarial. Todas las actividades son monitoreadas y registradas.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

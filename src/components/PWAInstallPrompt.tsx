import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                             (window.navigator as any).standalone || 
                             document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // If not installed and is iOS, show prompt after a delay
    if (isIOSDevice && !isStandaloneMode) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white rounded-2xl shadow-2xl border border-apple-border p-4 z-[150] flex flex-col gap-3"
      >
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 p-1 text-apple-sub hover:text-apple-dark transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-apple-dark rounded-xl flex items-center justify-center shrink-0">
            <Download size={24} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-apple-dark">Instalar Pos-Tec</h4>
            <p className="text-sm text-apple-sub mt-1">
              {isIOS 
                ? 'Para instalar: toca el botón Compartir y luego "Añadir a la pantalla de inicio".'
                : 'Instala nuestra app para una mejor experiencia y acceso rápido.'}
            </p>
          </div>
        </div>

        {!isIOS && (
          <button 
            onClick={handleInstallClick}
            className="apple-button w-full py-2 mt-2"
          >
            Instalar App
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

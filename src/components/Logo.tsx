import React from 'react';
import { ScanBarcode } from 'lucide-react';

export const Logo = ({ className = "", src }: { className?: string, src?: string }) => {
  if (src) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img src={src} alt="Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-apple-dark p-2 rounded-xl shadow-lg">
        <ScanBarcode size={24} className="text-apple-accent" />
      </div>
      <span className={`font-black tracking-tighter text-3xl ${className.includes('text-white') ? 'text-white' : 'text-apple-dark'}`}>
        Pos<span className="text-apple-accent">-Tec</span>
      </span>
    </div>
  );
};

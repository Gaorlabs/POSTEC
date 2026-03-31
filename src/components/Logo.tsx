import React from 'react';
import { ScanBarcode } from 'lucide-react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-apple-dark p-2 rounded-xl shadow-lg">
        <ScanBarcode size={24} className="text-apple-accent" />
      </div>
      <span className={`font-black tracking-tighter text-3xl ${className.includes('text-white') ? 'text-white' : 'text-apple-dark'}`}>
        POST<span className="text-apple-accent">EC</span>
      </span>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product> | null;
  setProduct: (product: Partial<Product>) => void;
  onSave: (e: React.FormEvent) => void;
}

export default function ProductModal({ isOpen, onClose, product, setProduct, onSave }: ProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative glass-card rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
        >
          <div className="p-10 border-b border-apple-border/10 flex items-center justify-between">
            <h3 className="text-3xl font-semibold tracking-tight">{product.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <button onClick={onClose} className="p-3 hover:bg-apple-gray rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={onSave} className="p-10 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Nombre</label>
                <input 
                  required
                  type="text" 
                  value={product.name || ''}
                  onChange={e => setProduct({...product, name: e.target.value})}
                  className="apple-input text-lg py-4"
                  placeholder="Ej. Producto Increíble"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Descripción</label>
                <textarea 
                  required
                  value={product.description || ''}
                  onChange={e => setProduct({...product, description: e.target.value})}
                  className="apple-input text-lg py-4 min-h-[100px] resize-none"
                  placeholder="Descripción del producto..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Precio</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={product.price || 0}
                    onChange={e => setProduct({...product, price: parseFloat(e.target.value)})}
                    className="apple-input text-lg py-4"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Categoría</label>
                  <input 
                    required
                    type="text" 
                    value={product.category || ''}
                    onChange={e => setProduct({...product, category: e.target.value})}
                    className="apple-input text-lg py-4"
                    placeholder="Ej. Otros"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Características</label>
                <textarea 
                  value={product.features || ''}
                  onChange={e => setProduct({...product, features: e.target.value})}
                  className="apple-input text-lg py-4 min-h-[100px] resize-none"
                  placeholder="Características del producto..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">URLs de Imágenes Adicionales (separadas por coma)</label>
                <textarea 
                  value={product.image_urls?.join(', ') || ''}
                  onChange={e => setProduct({...product, image_urls: e.target.value.split(',').map(s => s.trim())})}
                  className="apple-input text-lg py-4 min-h-[100px] resize-none"
                  placeholder="https://..., https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">URL de Imagen Principal</label>
                <input 
                  type="url" 
                  value={product.image_url || ''}
                  onChange={e => setProduct({...product, image_url: e.target.value})}
                  className="apple-input text-lg py-4"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 rounded-2xl font-semibold text-lg bg-apple-gray hover:bg-zinc-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 apple-button py-4 text-lg rounded-2xl shadow-lg shadow-apple-accent/20"
              >
                {product.id ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

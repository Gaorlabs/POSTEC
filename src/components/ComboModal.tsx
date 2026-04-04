import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Combo, Product } from '../types';
import { supabase } from '../lib/supabaseClient';

interface ComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  combo: Partial<Combo> | null;
  onSave: (e: React.FormEvent) => void;
  onChange: (combo: Partial<Combo>) => void;
  products: Product[];
}

export default function ComboModal({ isOpen, onClose, combo, onSave, onChange, products }: ComboModalProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `combos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products') // Reusing products bucket for simplicity
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      onChange({ ...combo, image_url: publicUrl });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const toggleProduct = (productId: number) => {
    const currentIds = combo?.product_ids || [];
    if (currentIds.includes(productId)) {
      onChange({ ...combo, product_ids: currentIds.filter(id => id !== productId) });
    } else {
      onChange({ ...combo, product_ids: [...currentIds, productId] });
    }
  };

  if (!isOpen || !combo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
        >
          <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-apple-border/10 px-8 py-6 flex justify-between items-center z-20">
            <h2 className="text-2xl font-semibold tracking-tight">
              {combo.id ? 'Editar Combo' : 'Nuevo Combo'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-apple-gray rounded-full transition-colors">
              <X size={24} className="text-apple-sub" />
            </button>
          </div>

          <form onSubmit={onSave} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-apple-dark">Imagen del Combo</label>
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-apple-border/30 bg-apple-gray/50 flex flex-col items-center justify-center overflow-hidden group hover:border-apple-accent/50 transition-colors">
                  {combo.image_url ? (
                    <>
                      <img src={combo.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium flex items-center gap-2">
                          <Upload size={18} /> Cambiar imagen
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Upload size={20} className="text-apple-sub" />
                      </div>
                      <p className="text-sm font-medium text-apple-dark">Haz clic para subir</p>
                      <p className="text-xs text-apple-sub mt-1">PNG, JPG hasta 5MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="animate-spin text-apple-accent" size={24} />
                    </div>
                  )}
                </div>
              </div>

              {/* Combo Details */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Nombre del Combo</label>
                  <input 
                    type="text" 
                    required
                    value={combo.name || ''}
                    onChange={e => onChange({ ...combo, name: e.target.value })}
                    className="apple-input w-full"
                    placeholder="Ej: Pack Emprendedor Básico"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Precio (S/)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={combo.price || ''}
                    onChange={e => onChange({ ...combo, price: parseFloat(e.target.value) })}
                    className="apple-input w-full"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Descripción</label>
                  <textarea 
                    required
                    value={combo.description || ''}
                    onChange={e => onChange({ ...combo, description: e.target.value })}
                    className="apple-input w-full min-h-[120px] resize-none"
                    placeholder="Describe los beneficios de este combo..."
                  />
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="space-y-4 pt-6 border-t border-apple-border/10">
              <label className="block text-sm font-semibold text-apple-dark">Productos Incluidos</label>
              <p className="text-xs text-apple-sub mb-4">Selecciona los productos que forman parte de este combo.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                {products.map(product => {
                  const isSelected = combo.product_ids?.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-apple-accent bg-apple-accent/5' 
                          : 'border-apple-border/20 hover:border-apple-border/40 bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-apple-accent border-apple-accent text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <div className="w-10 h-10 bg-apple-gray rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.image_url || `https://picsum.photos/seed/${product.id}/50/50`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-medium text-apple-dark truncate">{product.name}</div>
                        <div className="text-xs text-apple-sub">S/ {product.price.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-apple-border/10">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-apple-sub hover:bg-apple-gray rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={uploading || !combo.product_ids || combo.product_ids.length === 0}
                className="apple-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {combo.id ? 'Guardar Cambios' : 'Crear Combo'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

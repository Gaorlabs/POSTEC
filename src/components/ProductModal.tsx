import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { supabase } from '../lib/supabaseClient';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product> | null;
  setProduct: (product: Partial<Product>) => void;
  onSave: (e: React.FormEvent) => void;
}

export default function ProductModal({ isOpen, onClose, product, setProduct, onSave }: ProductModalProps) {
  const [uploading, setUploading] = useState(false);

  if (!isOpen || !product) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = true) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(isMain ? 'products' : 'product-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(isMain ? 'products' : 'product-photos')
        .getPublicUrl(filePath);

      if (isMain) {
        setProduct({ ...product, image_url: publicUrl });
      } else {
        const currentUrls = product.image_urls || [];
        setProduct({ ...product, image_urls: [...currentUrls, publicUrl] });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

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
          className="relative glass-card rounded-3xl md:rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 md:p-10 border-b border-apple-border/10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <h3 className="text-xl md:text-3xl font-semibold tracking-tight">{product.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <button onClick={onClose} className="p-2 md:p-3 hover:bg-apple-gray rounded-full transition-colors">
              <X size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
          <form onSubmit={onSave} className="p-6 md:p-10 space-y-6 md:space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Nombre</label>
                <input 
                  required
                  type="text" 
                  value={product.name || ''}
                  onChange={e => setProduct({...product, name: e.target.value})}
                  className="apple-input text-base md:text-lg py-3 md:py-4"
                  placeholder="Ej. Producto Increíble"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Descripción</label>
                <textarea 
                  required
                  value={product.description || ''}
                  onChange={e => setProduct({...product, description: e.target.value})}
                  className="apple-input text-base md:text-lg py-3 md:py-4 min-h-[80px] md:min-h-[100px] resize-none"
                  placeholder="Descripción del producto..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">SKU</label>
                  <input 
                    type="text" 
                    value={product.sku || ''}
                    onChange={e => setProduct({...product, sku: e.target.value})}
                    className="apple-input text-base md:text-lg py-3 md:py-4"
                    placeholder="Ej. POS-5027"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Colores</label>
                  <input 
                    type="text" 
                    value={product.colors?.join(', ') || ''}
                    onChange={e => setProduct({...product, colors: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                    className="apple-input text-base md:text-lg py-3 md:py-4"
                    placeholder="Ej. Negro, Blanco, Gris"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Precio</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={product.price || 0}
                    onChange={e => setProduct({...product, price: parseFloat(e.target.value)})}
                    className="apple-input text-base md:text-lg py-3 md:py-4"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Categoría</label>
                  <input 
                    required
                    type="text" 
                    value={product.category || ''}
                    onChange={e => setProduct({...product, category: e.target.value})}
                    className="apple-input text-base md:text-lg py-3 md:py-4"
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Imagen Principal</label>
                  <div className="flex gap-4">
                    <input 
                      type="url" 
                      value={product.image_url || ''}
                      onChange={e => setProduct({...product, image_url: e.target.value})}
                      className="apple-input text-lg py-4 flex-grow"
                      placeholder="URL de imagen..."
                    />
                    <label className="cursor-pointer bg-apple-gray hover:bg-zinc-200 p-4 rounded-xl transition-colors flex items-center justify-center min-w-[60px]">
                      {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, true)} disabled={uploading} />
                    </label>
                  </div>
                  {product.image_url && (
                    <img src={product.image_url} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-apple-border" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Imágenes Adicionales</label>
                  <div className="flex gap-4">
                    <textarea 
                      value={product.image_urls?.join(', ') || ''}
                      onChange={e => setProduct({...product, image_urls: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                      className="apple-input text-lg py-4 min-h-[80px] resize-none flex-grow"
                      placeholder="URLs separadas por coma..."
                    />
                    <label className="cursor-pointer bg-apple-gray hover:bg-zinc-200 p-4 rounded-xl transition-colors flex items-center justify-center min-w-[60px] h-[80px]">
                      {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, false)} disabled={uploading} />
                    </label>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.image_urls?.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Preview ${i}`} className="h-16 w-16 object-cover rounded-lg border border-apple-border" />
                        <button 
                          type="button"
                          onClick={() => setProduct({...product, image_urls: product.image_urls?.filter((_, index) => index !== i)})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-apple-border/10">
              <button 
                type="button"
                onClick={onClose}
                className="order-2 md:order-1 flex-1 px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg bg-apple-gray hover:bg-zinc-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={uploading}
                className="order-1 md:order-2 flex-1 apple-button py-3 md:py-4 text-base md:text-lg rounded-xl md:rounded-2xl shadow-lg shadow-apple-accent/20 disabled:opacity-50"
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

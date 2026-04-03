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
  const MAX_IMAGES = 5;

  if (!isOpen || !product) return null;

  const totalImages = (product.image_url ? 1 : 0) + (product.image_urls?.length || 0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = true) => {
    try {
      if (totalImages >= MAX_IMAGES && (!isMain || !product.image_url)) {
        alert(`Máximo ${MAX_IMAGES} imágenes permitidas`);
        return;
      }
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
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub">Imagen Principal</label>
                    <span className="text-[11px] font-medium text-apple-sub">
                      {totalImages} / {MAX_IMAGES} fotos
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="url" 
                      value={product.image_url || ''}
                      onChange={e => {
                        const val = e.target.value;
                        if (val && !product.image_url && totalImages >= MAX_IMAGES) {
                          alert(`Máximo ${MAX_IMAGES} imágenes permitidas`);
                          return;
                        }
                        setProduct({...product, image_url: val});
                      }}
                      className="apple-input text-lg py-4 flex-grow"
                      placeholder="URL de imagen (ej. postimg.cc)..."
                    />
                    <label className={`cursor-pointer p-4 rounded-xl transition-colors flex items-center justify-center min-w-[60px] ${totalImages >= MAX_IMAGES && !product.image_url ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-apple-gray hover:bg-zinc-200'}`}>
                      {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={e => handleFileUpload(e, true)} 
                        disabled={uploading || (totalImages >= MAX_IMAGES && !product.image_url)} 
                      />
                    </label>
                  </div>
                  {product.image_url && (
                    <div className="relative w-20 h-20">
                      <img src={product.image_url} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-apple-border" />
                      <button 
                        type="button"
                        onClick={() => setProduct({...product, image_url: ''})}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Imágenes Adicionales</label>
                  <div className="flex gap-4">
                    <textarea 
                      value={product.image_urls?.join(', ') || ''}
                      onChange={e => {
                        const urls = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                        const otherCount = product.image_url ? 1 : 0;
                        if (urls.length + otherCount > MAX_IMAGES) {
                          alert(`Máximo ${MAX_IMAGES} imágenes permitidas`);
                          return;
                        }
                        setProduct({...product, image_urls: urls});
                      }}
                      className="apple-input text-lg py-4 min-h-[80px] resize-none flex-grow"
                      placeholder="URLs separadas por coma..."
                    />
                    <label className={`cursor-pointer p-4 rounded-xl transition-colors flex items-center justify-center min-w-[60px] h-[80px] ${totalImages >= MAX_IMAGES ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-apple-gray hover:bg-zinc-200'}`}>
                      {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={e => handleFileUpload(e, false)} 
                        disabled={uploading || totalImages >= MAX_IMAGES} 
                      />
                    </label>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.image_urls?.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Preview ${i}`} className="h-16 w-16 object-cover rounded-lg border border-apple-border" />
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => {
                              const currentMain = product.image_url;
                              const currentUrls = [...(product.image_urls || [])];
                              const newMain = currentUrls[i];
                              if (currentMain) {
                                currentUrls[i] = currentMain;
                              } else {
                                currentUrls.splice(i, 1);
                              }
                              setProduct({...product, image_url: newMain, image_urls: currentUrls});
                            }}
                            className="bg-apple-accent text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                            title="Poner como principal"
                          >
                            <Upload size={12} className="rotate-180" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setProduct({...product, image_urls: product.image_urls?.filter((_, index) => index !== i)})}
                            className="bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                            title="Eliminar"
                          >
                            <X size={12} />
                          </button>
                        </div>
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Order, Product } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Partial<Order> | null;
  setOrder: (order: Partial<Order>) => void;
  onSave: (e: React.FormEvent) => void;
  products: Product[];
}

export default function OrderModal({ isOpen, onClose, order, setOrder, onSave, products }: OrderModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');

  if (!isOpen || !order) return null;

  const handleProductChange = (productId: number) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      setOrder({
        ...order,
        items: [{ id: product.id, name: product.name, price: product.price, quantity: 1 }],
        total: product.price
      });
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
          className="relative glass-card rounded-3xl md:rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 md:p-10 border-b border-apple-border/10 flex items-center justify-between">
            <h3 className="text-xl md:text-3xl font-semibold tracking-tight">Nuevo Pedido</h3>
            <button onClick={onClose} className="p-2 md:p-3 hover:bg-apple-gray rounded-full transition-colors">
              <X size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
          <form onSubmit={onSave} className="p-6 md:p-10 space-y-6 md:space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Producto</label>
                <select 
                  required
                  value={selectedProductId}
                  onChange={e => handleProductChange(Number(e.target.value))}
                  className="apple-input text-base md:text-lg py-3 md:py-4 w-full"
                >
                  <option value="">Selecciona un producto</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - S/.{p.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Nombre del Cliente</label>
                <input 
                  required
                  type="text" 
                  value={order.customer_name || ''}
                  onChange={e => setOrder({...order, customer_name: e.target.value})}
                  className="apple-input text-base md:text-lg py-3 md:py-4"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">WhatsApp</label>
                <input 
                  required
                  type="text" 
                  value={order.customer_whatsapp || ''}
                  onChange={e => setOrder({...order, customer_whatsapp: e.target.value})}
                  className="apple-input text-base md:text-lg py-3 md:py-4"
                  placeholder="+51..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Total</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={order.total || 0}
                  onChange={e => setOrder({...order, total: parseFloat(e.target.value)})}
                  className="apple-input text-base md:text-lg py-3 md:py-4"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="order-2 md:order-1 flex-1 px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg bg-apple-gray hover:bg-zinc-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="order-1 md:order-2 flex-1 apple-button py-3 md:py-4 text-base md:text-lg rounded-xl md:rounded-2xl shadow-lg shadow-apple-accent/20"
              >
                Crear Pedido
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

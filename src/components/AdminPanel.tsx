import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Order } from '../types';
import { Package, Plus, Edit2, Trash2, ShoppingBag, ArrowLeft, Save, X, ExternalLink, RefreshCw, Zap, ChevronRight } from 'lucide-react';
import { buildWhatsAppMessage } from '../lib/whatsapp';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    fetchData();
    
    // Real-time subscriptions
    const productsSub = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe();

    const ordersSub = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(productsSub);
      supabase.removeChannel(ordersSub);
    };
  }, []);

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchOrders()]);
    setLoading(false);
  }

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
  }

  async function fetchOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data || []);
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (editingProduct.id) {
        const { error } = await supabase
          .from('products')
          .update(editingProduct)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([editingProduct]);
        if (error) throw error;
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const resendWhatsApp = (order: Order) => {
    const url = buildWhatsAppMessage(
      order.id,
      order.customer_name,
      order.customer_whatsapp,
      order.customer_address,
      order.items,
      order.total
    );
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-dark font-sans selection:bg-apple-accent/10">
      {/* Admin Header */}
      <header className="apple-nav">
        <div className="max-w-[1600px] mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-apple-dark" />
            <h1 className="font-semibold text-base tracking-tight">Panel de Administración</h1>
            <span className="bg-apple-gray text-apple-sub text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-apple-border/30">
              Pos-Tec
            </span>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-1.5 text-[12px] text-apple-accent font-medium hover:underline group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver a la Tienda
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-16">
        {/* Tabs */}
        <div className="flex gap-10 mb-16 border-b border-apple-border/20">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-2 text-[13px] font-medium transition-all relative ${
              activeTab === 'products' ? 'text-apple-dark' : 'text-apple-sub hover:text-apple-dark'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={16} /> Productos
            </div>
            {activeTab === 'products' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-apple-dark" />}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 text-[13px] font-medium transition-all relative ${
              activeTab === 'orders' ? 'text-apple-dark' : 'text-apple-sub hover:text-apple-dark'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} /> Pedidos
            </div>
            {activeTab === 'orders' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-apple-dark" />}
          </button>
        </div>

        {activeTab === 'products' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[2.5rem] font-semibold tracking-tight leading-tight">Gestión de Productos</h2>
                <p className="text-apple-sub text-lg mt-2">Administra el inventario de tu tienda.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingProduct({ name: '', description: '', price: 0, category: 'Otros', image_url: '' });
                  setIsProductModalOpen(true);
                }}
                className="apple-button flex items-center gap-2 shadow-lg shadow-apple-accent/20"
              >
                <Plus size={20} /> Nuevo Producto
              </button>
            </div>

            <div className="apple-card border-none bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-apple-gray/50 text-apple-sub text-[10px] uppercase tracking-widest font-bold border-b border-apple-border/10">
                      <th className="px-10 py-5">Producto</th>
                      <th className="px-10 py-5">Categoría</th>
                      <th className="px-10 py-5">Precio</th>
                      <th className="px-10 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-apple-border/5">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-apple-gray/30 transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-apple-gray rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-apple-border/10">
                              <img src={product.image_url || `https://picsum.photos/seed/${product.id}/100/100`} alt="" className="max-h-14 object-contain group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div>
                              <div className="font-semibold text-[17px] text-apple-dark mb-1">{product.name}</div>
                              <div className="text-[13px] text-apple-sub line-clamp-1 max-w-xs font-medium">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="bg-apple-gray text-apple-sub text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest border border-apple-border/20">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-10 py-8 font-semibold text-xl">S/.{product.price.toFixed(2)}</td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductModalOpen(true);
                              }}
                              className="p-3 hover:bg-apple-gray rounded-full text-apple-sub hover:text-apple-accent transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-3 hover:bg-apple-gray rounded-full text-apple-sub hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[2.5rem] font-semibold tracking-tight leading-tight">Registro de Pedidos</h2>
                <p className="text-apple-sub text-lg mt-2">Gestiona las ventas y envíos.</p>
              </div>
              <button 
                onClick={fetchOrders}
                className="p-4 hover:bg-apple-gray rounded-full text-apple-sub transition-all"
              >
                <RefreshCw size={22} />
              </button>
            </div>

            <div className="apple-card border-none bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-apple-gray/50 text-apple-sub text-[10px] uppercase tracking-widest font-bold border-b border-apple-border/10">
                      <th className="px-10 py-5">ID / Fecha</th>
                      <th className="px-10 py-5">Cliente</th>
                      <th className="px-10 py-5">Total</th>
                      <th className="px-10 py-5">Estado</th>
                      <th className="px-10 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-apple-border/5">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-apple-gray/30 transition-colors group">
                        <td className="px-10 py-8">
                          <div className="font-semibold text-apple-accent text-[15px] mb-1">#{order.id}</div>
                          <div className="text-[12px] text-apple-sub font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="font-semibold text-apple-dark text-[17px] mb-1">{order.customer_name}</div>
                          <div className="text-[13px] text-apple-sub font-medium">{order.customer_whatsapp}</div>
                        </td>
                        <td className="px-10 py-8 font-semibold text-xl">S/.{order.total.toFixed(2)}</td>
                        <td className="px-10 py-8">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl border focus:outline-none transition-all appearance-none cursor-pointer shadow-sm ${
                              order.status === 'pendiente' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
                              order.status === 'pagado' ? 'bg-green-50 border-green-200 text-green-600' :
                              order.status === 'enviado' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                              'bg-red-50 border-red-200 text-red-600'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Enviado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button 
                            onClick={() => resendWhatsApp(order)}
                            className="p-4 hover:bg-apple-gray rounded-full text-apple-sub hover:text-green-600 transition-all"
                            title="Reenviar por WhatsApp"
                          >
                            <ExternalLink size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && editingProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
              onClick={() => setIsProductModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative glass-card rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-apple-border/10 flex items-center justify-between">
                <h3 className="text-3xl font-semibold tracking-tight">{editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-apple-gray rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Nombre</label>
                    <input 
                      required
                      type="text" 
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="apple-input text-lg py-4"
                      placeholder="Ej. Impresora Térmica XP-80"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Descripción</label>
                    <textarea 
                      required
                      value={editingProduct.description}
                      onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="apple-input text-lg py-4 min-h-[120px] resize-none"
                      placeholder="Describe las características del producto..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Precio (S/.)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        value={editingProduct.price || ''}
                        onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                        className="apple-input text-lg py-4"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Categoría</label>
                      <select 
                        value={editingProduct.category || 'Otros'}
                        onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                        className="apple-input text-lg py-4 appearance-none cursor-pointer"
                      >
                        <option value="Impresoras Térmicas">Impresoras Térmicas</option>
                        <option value="Gavetas de Dinero">Gavetas de Dinero</option>
                        <option value="Control de Acceso">Control de Acceso</option>
                        <option value="Lector de Código de Barras">Lector de Código de Barras</option>
                        <option value="Monitores Touch">Monitores Touch</option>
                        <option value="PC O LAPTOP">PC O LAPTOP</option>
                        <option value="Suministros">Suministros</option>
                        <option value="Terminal Punto de Venta">Terminal Punto de Venta</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">URL de Imagen</label>
                    <input 
                      type="url" 
                      value={editingProduct.image_url || ''}
                      onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})}
                      className="apple-input text-lg py-4"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-semibold text-lg bg-apple-gray hover:bg-zinc-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 apple-button py-4 text-lg rounded-2xl shadow-lg shadow-apple-accent/20"
                  >
                    {editingProduct.id ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Order, Customer, Interaction } from '../types';
import { Package, Plus, Edit2, Trash2, ShoppingBag, ArrowLeft, Save, X, ExternalLink, RefreshCw, Zap, ChevronRight, Users, Settings, MessageCircle, Phone, Mail, Upload } from 'lucide-react';
import { buildWhatsAppMessage } from '../lib/whatsapp';
import { motion, AnimatePresence } from 'motion/react';
import ProductModal from './ProductModal';
import OrderModal from './OrderModal';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'crm' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchData();
    fetchSettings();
    
    // Real-time subscriptions
    const productsSub = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe();

    const ordersSub = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe();

    const customersSub = supabase
      .channel('customers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => fetchCustomers())
      .subscribe();

    return () => {
      supabase.removeChannel(productsSub);
      supabase.removeChannel(ordersSub);
      supabase.removeChannel(customersSub);
    };
  }, []);

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchOrders(), fetchCustomers()]);
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

  async function fetchCustomers() {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (!error) setCustomers(data || []);
  }

  async function fetchInteractions(customerId: string) {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (!error) setInteractions(data || []);
  }

  async function fetchSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'general')
      .single();
    if (!error && data) setSettings(data.value);
  }

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as Interaction['type'];
    const content = formData.get('content') as string;

    try {
      const { error } = await supabase
        .from('interactions')
        .insert([{ customer_id: selectedCustomer.id, type, content }]);
      if (error) throw error;
      
      setIsInteractionModalOpen(false);
      fetchInteractions(selectedCustomer.id);
    } catch (error) {
      console.error('Error adding interaction:', error);
      alert('Error al registrar la interacción');
    }
  };

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

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const { error } = await supabase
        .from('orders')
        .insert([{ ...editingOrder, status: 'pendiente' }]);
      if (error) throw error;
      
      setIsOrderModalOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error al guardar el pedido');
    }
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      if (editingCustomer.id) {
        const { error } = await supabase
          .from('customers')
          .update(editingCustomer)
          .eq('id', editingCustomer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([editingCustomer]);
        if (error) throw error;
      }
      setIsCustomerModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error al guardar el cliente');
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

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
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
          {[
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
            { id: 'crm', label: 'CRM', icon: Users },
            { id: 'settings', label: 'Configuración', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 text-[13px] font-medium transition-all relative ${
                activeTab === tab.id ? 'text-apple-dark' : 'text-apple-sub hover:text-apple-dark'
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon size={16} /> {tab.label}
              </div>
              {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-apple-dark" />}
            </button>
          ))}
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
        ) : activeTab === 'orders' ? (
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
              <div className="flex gap-4">
                <button 
                  onClick={fetchOrders}
                  className="p-4 hover:bg-apple-gray rounded-full text-apple-sub transition-all"
                >
                  <RefreshCw size={22} />
                </button>
                <button 
                  onClick={() => {
                    setEditingOrder({ customer_name: '', customer_whatsapp: '', total: 0 });
                    setIsOrderModalOpen(true);
                  }}
                  className="apple-button flex items-center gap-2 shadow-lg shadow-apple-accent/20"
                >
                  <Plus size={20} /> Nuevo Pedido
                </button>
              </div>
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
        ) : activeTab === 'crm' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[2.5rem] font-semibold tracking-tight leading-tight">CRM de Clientes</h2>
                <p className="text-apple-sub text-lg mt-2">Gestiona tus relaciones con los clientes.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingCustomer({ name: '', whatsapp: '', email: '', notes: '' });
                  setIsCustomerModalOpen(true);
                }}
                className="apple-button flex items-center gap-2 shadow-lg shadow-apple-accent/20"
              >
                <Plus size={20} /> Nuevo Cliente
              </button>
            </div>

            <div className="apple-card border-none bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-apple-gray/50 text-apple-sub text-[10px] uppercase tracking-widest font-bold border-b border-apple-border/10">
                      <th className="px-10 py-5">Cliente</th>
                      <th className="px-10 py-5">WhatsApp</th>
                      <th className="px-10 py-5">Última Interacción</th>
                      <th className="px-10 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-apple-border/5">
                    {customers.map(customer => (
                      <tr key={customer.id} className="hover:bg-apple-gray/30 transition-colors group">
                        <td className="px-10 py-8">
                          <div className="font-semibold text-apple-dark text-[17px]">{customer.name}</div>
                          <div className="text-[13px] text-apple-sub">{customer.email}</div>
                        </td>
                        <td className="px-10 py-8 text-[15px] font-medium">{customer.whatsapp}</td>
                        <td className="px-10 py-8 text-[15px] font-medium">{new Date(customer.last_interaction).toLocaleDateString()}</td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => {
                                setSelectedCustomer(customer);
                                fetchInteractions(customer.id);
                                setIsInteractionModalOpen(true);
                              }}
                              className="p-3 hover:bg-apple-gray rounded-full text-apple-sub hover:text-apple-accent transition-all"
                            >
                              <MessageCircle size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingCustomer(customer);
                                setIsCustomerModalOpen(true);
                              }}
                              className="p-3 hover:bg-apple-gray rounded-full text-apple-sub hover:text-apple-accent transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCustomer(customer.id)}
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
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-semibold mb-8">Configuración de la Tienda</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newSettings = {
                whatsapp: formData.get('whatsapp'),
                facebook: formData.get('facebook'),
                instagram: formData.get('instagram'),
                tiktok: formData.get('tiktok'),
                logo_url: formData.get('logo_url'),
                slides: (formData.get('slides') as string).split(',').map(s => s.trim()).filter(s => s !== ''),
              };
              
              const { error } = await supabase
                .from('settings')
                .upsert({ key: 'general', value: newSettings });
                
              if (error) alert('Error al guardar configuración');
              else {
                alert('Configuración guardada correctamente');
                setSettings(newSettings);
              }
            }} className="apple-card p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Logo de la Tienda</label>
                <div className="flex gap-4">
                  <input name="logo_url" type="url" className="apple-input text-lg py-4 flex-grow" placeholder="https://..." defaultValue={settings?.logo_url || ''} />
                  <label className="cursor-pointer bg-apple-gray hover:bg-zinc-200 p-4 rounded-xl transition-colors flex items-center justify-center min-w-[60px]">
                    <Upload size={20} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
                        const { data, error } = await supabase.storage.from('logos').upload(fileName, file);
                        if (error) return alert('Error al subir logo');
                        const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName);
                        const input = (e.target.closest('div')?.querySelector('input[name="logo_url"]') as HTMLInputElement);
                        if (input) input.value = publicUrl;
                      }} 
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Número de WhatsApp</label>
                <input name="whatsapp" type="text" className="apple-input text-lg py-4" placeholder="+51..." defaultValue={settings?.whatsapp || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Facebook URL</label>
                <input name="facebook" type="url" className="apple-input text-lg py-4" placeholder="https://facebook.com/..." defaultValue={settings?.facebook || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Instagram URL</label>
                <input name="instagram" type="url" className="apple-input text-lg py-4" placeholder="https://instagram.com/..." defaultValue={settings?.instagram || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">TikTok URL</label>
                <input name="tiktok" type="url" className="apple-input text-lg py-4" placeholder="https://tiktok.com/..." defaultValue={settings?.tiktok || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Fotos del Carrusel (URLs separadas por coma)</label>
                <div className="flex gap-4">
                  <textarea name="slides" className="apple-input text-lg py-4 min-h-[100px] flex-grow" placeholder="https://..., https://..." defaultValue={settings?.slides?.join(', ') || ''} />
                  <label className="cursor-pointer bg-apple-gray hover:bg-zinc-200 p-4 rounded-xl transition-colors flex items-center justify-center min-w-[60px] h-[100px]">
                    <Upload size={20} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
                        const { data, error } = await supabase.storage.from('hero-slides').upload(fileName, file);
                        if (error) return alert('Error al subir imagen');
                        const { data: { publicUrl } } = supabase.storage.from('hero-slides').getPublicUrl(fileName);
                        const textarea = (e.target.closest('div')?.querySelector('textarea[name="slides"]') as HTMLTextAreaElement);
                        if (textarea) {
                          const current = textarea.value.trim();
                          textarea.value = current ? `${current}, ${publicUrl}` : publicUrl;
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
              <button type="submit" className="apple-button w-full py-4 text-lg rounded-2xl shadow-lg shadow-apple-accent/20">
                Guardar Configuración
              </button>
            </form>
          </motion.div>
        )}
      </main>

      {/* Order Modal */}
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        order={editingOrder} 
        setOrder={setEditingOrder} 
        onSave={handleSaveOrder} 
        products={products}
      />

      {/* Product Modal */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        product={editingProduct} 
        setProduct={setEditingProduct} 
        onSave={handleSaveProduct} 
      />

      {/* Interaction Modal */}
      <AnimatePresence>
        {isInteractionModalOpen && selectedCustomer && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
              onClick={() => setIsInteractionModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative glass-card rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-apple-border/10 flex items-center justify-between">
                <h3 className="text-3xl font-semibold tracking-tight">Historial: {selectedCustomer.name}</h3>
                <button onClick={() => setIsInteractionModalOpen(false)} className="p-3 hover:bg-apple-gray rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-8">
                <form onSubmit={handleAddInteraction} className="space-y-4">
                  <div className="flex gap-4">
                    <select name="type" className="apple-input py-3">
                      <option value="whatsapp">WhatsApp</option>
                      <option value="llamada">Llamada</option>
                      <option value="email">Email</option>
                    </select>
                    <input name="content" required className="apple-input flex-1 py-3" placeholder="Detalle de la interacción..." />
                    <button type="submit" className="apple-button px-6 py-3 rounded-xl">Agregar</button>
                  </div>
                </form>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {interactions.map(interaction => (
                    <div key={interaction.id} className="p-4 bg-apple-gray rounded-xl">
                      <div className="flex justify-between text-[12px] font-bold uppercase text-apple-sub mb-2">
                        <span>{interaction.type}</span>
                        <span>{new Date(interaction.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-apple-dark">{interaction.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && editingCustomer && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
              onClick={() => setIsCustomerModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative glass-card rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-apple-border/10 flex items-center justify-between">
                <h3 className="text-3xl font-semibold tracking-tight">{editingCustomer.id ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="p-3 hover:bg-apple-gray rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveCustomer} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Nombre</label>
                    <input 
                      required
                      type="text" 
                      value={editingCustomer.name}
                      onChange={e => setEditingCustomer({...editingCustomer, name: e.target.value})}
                      className="apple-input text-lg py-4"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">WhatsApp</label>
                      <input 
                        required
                        type="text" 
                        value={editingCustomer.whatsapp}
                        onChange={e => setEditingCustomer({...editingCustomer, whatsapp: e.target.value})}
                        className="apple-input text-lg py-4"
                        placeholder="+51..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Email</label>
                      <input 
                        type="email" 
                        value={editingCustomer.email}
                        onChange={e => setEditingCustomer({...editingCustomer, email: e.target.value})}
                        className="apple-input text-lg py-4"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Notas</label>
                    <textarea 
                      value={editingCustomer.notes}
                      onChange={e => setEditingCustomer({...editingCustomer, notes: e.target.value})}
                      className="apple-input text-lg py-4 min-h-[120px] resize-none"
                      placeholder="Notas sobre el cliente..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsCustomerModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-semibold text-lg bg-apple-gray hover:bg-zinc-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 apple-button py-4 text-lg rounded-2xl shadow-lg shadow-apple-accent/20"
                  >
                    {editingCustomer.id ? 'Guardar Cambios' : 'Crear Cliente'}
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

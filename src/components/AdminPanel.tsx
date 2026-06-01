import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabaseClient';
import { Product, Order, Customer, Interaction } from '../types';
import { Package, Plus, Edit2, Trash2, ShoppingBag, ArrowLeft, Save, X, ExternalLink, RefreshCw, Zap, ChevronRight, Users, Settings, MessageCircle, Phone, Mail, Upload, Bell, BellOff, Search, Filter, Share2, Facebook, Instagram, Music, Send, Link, Copy, Download, Globe } from 'lucide-react';
import { buildWhatsAppMessage } from '../lib/whatsapp';
import { motion, AnimatePresence } from 'motion/react';
import ProductModal from './ProductModal';
import ComboModal from './ComboModal';
import OrderModal from './OrderModal';
import AdminLogin from './AdminLogin';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('admin_auth') === 'true');
  const [activeTab, setActiveTab] = useState<'products' | 'combos' | 'orders' | 'crm' | 'settings' | 'labels' | 'lander'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const defaultProductInfo = {
    name: "IMPRESORA TERMICA POS-STAR WP200 80MM USB+RJ11",
    fullName: "IMPRESORA TERMICA POS-STAR WP200 80MM INTERFAZ USB + RJ11 VELOCIDAD 230MM/S",
    price: 203.00,
    brand: "POS-STAR",
    type: "Impresora Térmica",
    interface: "USB + RJ11",
    paperSize: "80MM",
    speed: "230MM/S",
    shipping: "Envío a Todo el Perú",
    deliveryTime: "De 12 a 72 horas",
    offerType: "Precio solo Web",
    driverUrl: "https://drive.google.com/drive/folders/1_ejemplo_id_carpeta_drivers",
    manualUrl: "https://drive.google.com/file/d/1_ejemplo_id_manual_pdf/view",
    yapePhone: "989 007 409",
    yapePhoneRaw: "989007409",
    yapeOwner: "Joaquín García",
    bcpAccount: "191-1875953-0-18",
    bcpAccountRaw: "1911875953018",
    bcpCCI: "002-191-001875953018-53",
    bcpCCIRaw: "00219100187595301853",
    bcpOwner: "COPIERMAX EIR.",
    whatsappPhone: "51905820448",
    edition: "WP200 Pro-Edition",
    model: "WP200",
    originalPrice: 269.00,
    discountText: "-24% Desc.",
    spec1: "Marca de confianza: POS-STAR (Modelo industrial WP200 de alto rendimiento).",
    spec2: "Tecnología: Térmica Directa (Cero costos en cartuchos de tinta).",
    spec3: "Velocidad Profesional: 230 mm/s con sistema de autocorte garantizado.",
    spec4: "Interfaces integradas: Entrada USB y puerto telefónico RJ11 para comandar gavetas portamonedas."
  };

  const defaultProductImages = [
    {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
      title: "Diseño Frontal POS-STAR WP200",
      desc: "Estructura robusta de grado industrial optimizada para espacios reducidos en mostradores y cajas."
    },
    {
      url: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=1000&auto=format&fit=crop",
      title: "Carga Sencilla de Papel 80mm",
      desc: "Compartimento de alimentación superior asistido por resortes. Cero atascos y cambio de rollo en 3 segundos."
    },
    {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
      title: "Velocidad Extrema de 230mm/s",
      desc: "Su cabezal de impresión térmica de alto rendimiento genera boletas y guías al instante con nitidez impecable."
    },
    {
      url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1000&auto=format&fit=crop",
      title: "Conexión Dual USB + RJ11",
      desc: "Se conecta directamente a la PC/Laptop y acciona de forma automática la gaveta portamonedas en cada cobro."
    },
    {
      url: "https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=1000&auto=format&fit=crop",
      title: "Despacho Garantizado a Nivel Nacional",
      desc: "Embalaje reforzado de fábrica listo para envíos express diarios por Olva, Shalom, Marvisur y más."
    },
    {
      url: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=1000&auto=format&fit=crop",
      title: "Cortador Automático de Acero",
      desc: "Guillotina de acero aleado de alta precisión capaz de soportar hasta 1.5 millones de cortes limpios."
    }
  ];

  const [landerConfig, setLanderConfig] = useState<any>({ productInfo: defaultProductInfo, productImages: defaultProductImages });
  const [savingLander, setSavingLander] = useState(false);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCombo, setEditingCombo] = useState<any | null>(null);
  const [editingLabel, setEditingLabel] = useState<any | null>(null);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Search and Filter State
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todas');
  const categories = ['Todas', 'Impresoras Térmicas', 'Gavetas de Dinero', 'Control de Acceso', 'Lector de Código de Barras', 'Monitores Touch', 'PC O LAPTOP', 'Suministros', 'Terminal Punto de Venta'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                         (product.sku && product.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
                         (product.brand && product.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = productCategoryFilter === 'Todas' || product.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      fetchSettings();
      fetchLanderConfig();
      
      // Request notification permission
      if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") setNotificationsEnabled(true);
        });
      }
      
      // Real-time subscriptions
      const productsSub = supabase
        .channel('products-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
        .subscribe();

      const ordersSub = supabase
        .channel('orders-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
          playNotificationSound();
          showNotification(payload.new as Order);
          fetchOrders();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, () => fetchOrders())
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'orders' }, () => fetchOrders())
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
    }
  }, [isAuthenticated]);

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const showNotification = (order: Order) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("¡Nuevo Pedido Recibido!", {
        body: `Cliente: ${order.customer_name}\nTotal: S/ ${order.total.toFixed(2)}`,
        icon: '/favicon.ico'
      });
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchCombos(), fetchOrders(), fetchCustomers(), fetchLabels()]);
    setLoading(false);
  }

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
  }

  async function fetchCombos() {
    const { data, error } = await supabase.from('combos').select('*').order('created_at', { ascending: false });
    if (!error) setCombos(data || []);
  }

  async function fetchLabels() {
    const { data, error } = await supabase.from('labels').select('*').order('created_at', { ascending: false });
    if (!error) setLabels(data || []);
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

  async function fetchLanderConfig() {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'lander_config')
      .single();
    if (!error && data && data.value) {
      setLanderConfig(data.value);
    }
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
      // Clean up the object before sending to Supabase
      const { id, created_at, show_in_popup, ...updateData } = editingProduct as any;
      
      let savedProductId = id;
      if (id) {
        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([updateData])
          .select('id')
          .single();
        if (error) throw error;
        if (data) {
          savedProductId = data.id;
        }
      }

      // Sync the "show_in_popup" state into the general settings!
      if (savedProductId) {
        let updatedSettings = { ...(settings || {}) };
        if (show_in_popup) {
          updatedSettings.quick_sell_product_id = savedProductId;
          updatedSettings.quick_sell_active = true;
        } else if (settings?.quick_sell_product_id === savedProductId) {
          updatedSettings.quick_sell_active = false;
        }

        const { error: settingsError } = await supabase
          .from('settings')
          .upsert({ key: 'general', value: updatedSettings });

        if (!settingsError) {
          setSettings(updatedSettings);
        }
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      let message = error.message || 'Error desconocido';
      if (message.includes('column') && message.includes('does not exist')) {
        message = "Faltan columnas en la base de datos. Por favor, ejecuta el script SQL proporcionado en el editor de Supabase para añadir 'sku', 'colors', 'features' e 'image_urls'.";
      }
      alert(`Error al guardar el producto: ${message}`);
    }
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const { id, created_at, ...updateData } = editingOrder as any;
      
      const { error } = await supabase
        .from('orders')
        .insert([{ ...updateData, status: 'pendiente' }]);
      if (error) throw error;
      
      setIsOrderModalOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error: any) {
      console.error('Error saving order:', error);
      alert(`Error al guardar el pedido: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      const { id, created_at, ...updateData } = editingCustomer as any;
      
      if (id) {
        const { error } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([updateData]);
        if (error) throw error;
      }
      setIsCustomerModalOpen(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      alert(`Error al guardar el cliente: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo) return;

    try {
      const { id, created_at, ...updateData } = editingCombo as any;
      
      if (id) {
        const { error } = await supabase
          .from('combos')
          .update(updateData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('combos')
          .insert([updateData]);
        if (error) throw error;
      }
      setIsComboModalOpen(false);
      setEditingCombo(null);
      fetchCombos();
    } catch (error: any) {
      console.error('Error saving combo:', error);
      alert(`Error al guardar el combo: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleDeleteCombo = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este combo?')) return;
    
    try {
      const { error } = await supabase.from('combos').delete().eq('id', id);
      if (error) throw error;
      fetchCombos();
    } catch (error: any) {
      console.error('Error deleting combo:', error);
      alert(`Error al eliminar el combo: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleSaveLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabel) return;

    try {
      const { id, created_at, ...updateData } = editingLabel as any;
      
      if (id) {
        const { error } = await supabase
          .from('labels')
          .update(updateData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('labels')
          .insert([updateData]);
        if (error) throw error;
      }
      setIsLabelModalOpen(false);
      setEditingLabel(null);
      fetchLabels();
    } catch (error: any) {
      console.error('Error saving label:', error);
      if (error?.message?.includes('duplicate key value') || error?.code === '23505') {
        alert('Ya existe una etiqueta con este nombre. Por favor, elige un nombre diferente.');
      } else {
        alert(`Error al guardar la etiqueta: ${error.message || 'Error desconocido'}`);
      }
    }
  };

  const handleDeleteLabel = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta etiqueta?')) return;
    try {
      const { error } = await supabase.from('labels').delete().eq('id', id);
      if (error) throw error;
      fetchLabels();
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  const handleSaveLanderConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLander(true);
    const formData = new FormData(e.currentTarget);
    
    const updatedLanderConfig = {
      productInfo: {
        name: formData.get('lander_name') as string,
        fullName: formData.get('lander_fullName') as string,
        price: parseFloat(formData.get('lander_price') as string) || 0,
        brand: formData.get('lander_brand') as string,
        type: formData.get('lander_type') as string,
        interface: formData.get('lander_interface') as string,
        paperSize: formData.get('lander_paperSize') as string,
        speed: formData.get('lander_speed') as string,
        shipping: formData.get('lander_shipping') as string,
        deliveryTime: formData.get('lander_deliveryTime') as string,
        offerType: formData.get('lander_offerType') as string,
        driverUrl: formData.get('lander_driverUrl') as string,
        manualUrl: formData.get('lander_manualUrl') as string,
        yapePhone: formData.get('lander_yapePhone') as string,
        yapePhoneRaw: formData.get('lander_yapePhoneRaw') as string,
        yapeOwner: formData.get('lander_yapeOwner') as string,
        bcpAccount: formData.get('lander_bcpAccount') as string,
        bcpAccountRaw: formData.get('lander_bcpAccountRaw') as string,
        bcpCCI: formData.get('lander_bcpCCI') as string,
        bcpCCIRaw: formData.get('lander_bcpCCIRaw') as string,
        bcpOwner: formData.get('lander_bcpOwner') as string,
        whatsappPhone: formData.get('lander_whatsappPhone') as string,
        edition: formData.get('lander_edition') as string,
        model: formData.get('lander_model') as string,
        originalPrice: parseFloat(formData.get('lander_originalPrice') as string) || 0,
        discountText: formData.get('lander_discountText') as string,
        spec1: formData.get('lander_spec1') as string,
        spec2: formData.get('lander_spec2') as string,
        spec3: formData.get('lander_spec3') as string,
        spec4: formData.get('lander_spec4') as string
      },
      productImages: [
        {
          url: formData.get('img_url_0') as string,
          title: formData.get('img_title_0') as string,
          desc: formData.get('img_desc_0') as string
        },
        {
          url: formData.get('img_url_1') as string,
          title: formData.get('img_title_1') as string,
          desc: formData.get('img_desc_1') as string
        },
        {
          url: formData.get('img_url_2') as string,
          title: formData.get('img_title_2') as string,
          desc: formData.get('img_desc_2') as string
        },
        {
          url: formData.get('img_url_3') as string,
          title: formData.get('img_title_3') as string,
          desc: formData.get('img_desc_3') as string
        },
        {
          url: formData.get('img_url_4') as string,
          title: formData.get('img_title_4') as string,
          desc: formData.get('img_desc_4') as string
        },
        {
          url: formData.get('img_url_5') as string,
          title: formData.get('img_title_5') as string,
          desc: formData.get('img_desc_5') as string
        }
      ]
    };

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'lander_config', value: updatedLanderConfig }, { onConflict: 'key' });

      if (error) throw error;
      
      setLanderConfig(updatedLanderConfig);
      localStorage.setItem('lander_config', JSON.stringify(updatedLanderConfig));
      alert('¡Plantilla Landing Page actualizada correctamente en vivo!');
    } catch (error: any) {
      console.error('Error saving lander config:', error);
      alert(`Error al guardar la plantilla: ${error.message || 'Error desconocido'}`);
    } finally {
      setSavingLander(false);
    }
  };

  const exportProductsToCSV = () => {
    const headers = ['Categoría', 'Marca', 'Nombre', 'Descripción', 'Uso/Características', 'Precio', 'Stock', 'SKU'];
    
    const rows = products.map(p => [
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${(p.features || '').replace(/"/g, '""')}"`,
      p.price,
      p.stock || 0,
      `"${(p.sku || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `productos_postec_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportProductsToExcel = () => {
    const data = products.map(p => ({
      'Categoría': p.category || '',
      'Marca': p.brand || '',
      'Nombre': p.name || '',
      'SKU': p.sku || '',
      'Precio': p.price,
      'Stock': p.stock || 0,
      'Descripción': p.description || '',
      'Uso/Características': p.features || '',
      'URL Imagen': p.image_url || '',
      'Etiquetas': (p.labels || []).join(', ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

    // Adjust column widths
    const wscols = [
      {wch: 20}, // Categoría
      {wch: 15}, // Marca
      {wch: 30}, // Nombre
      {wch: 15}, // SKU
      {wch: 10}, // Precio
      {wch: 10}, // Stock
      {wch: 40}, // Descripción
      {wch: 40}, // Características
      {wch: 30}, // URL Imagen
      {wch: 20}  // Etiquetas
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `productos_postec_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportProductsToJSON = () => {
    const data = products.map(p => ({
      id: p.id,
      sku: p.sku,
      marca: p.brand,
      nombre: p.name,
      categoria: p.category,
      precio: p.price,
      descripcion: p.description,
      caracteristicas: p.features,
      stock: p.stock,
      url_imagen: p.image_url,
      colores: p.colors,
      etiquetas: p.labels
    }));
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `productos_postec_bot_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Package size={20} className="text-apple-dark shrink-0" />
            <h1 className="font-semibold text-sm md:text-base tracking-tight truncate max-w-[150px] md:max-w-none">Panel Admin</h1>
            <span className="hidden sm:inline-block bg-apple-gray text-apple-sub text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-apple-border/30">
              Pos-Tec
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            {/* Notification Status */}
            <button 
              onClick={() => {
                if (Notification.permission !== "granted") {
                  Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                      setNotificationsEnabled(true);
                      playNotificationSound();
                    }
                  });
                } else {
                  playNotificationSound();
                }
              }}
              className={`flex items-center gap-1.5 text-[11px] md:text-[12px] font-medium transition-all ${notificationsEnabled ? 'text-apple-accent' : 'text-zinc-400'}`}
              title={notificationsEnabled ? "Notificaciones activadas (Click para probar sonido)" : "Activar notificaciones"}
            >
              {notificationsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
              <span className="hidden sm:inline">{notificationsEnabled ? 'Alertas ON' : 'Alertas OFF'}</span>
            </button>

            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-1.5 text-[11px] md:text-[12px] text-apple-sub font-medium hover:text-apple-accent group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Tienda</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[11px] md:text-[12px] text-red-500 font-medium hover:underline"
            >
              Cerrar <span className="hidden sm:inline">Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Tabs */}
        <div className="flex gap-6 md:gap-10 mb-8 md:mb-16 border-b border-apple-border/20 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'combos', label: 'Combos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
            { id: 'crm', label: 'CRM', icon: Users },
            { id: 'lander', label: 'Plantilla Landing', icon: Globe },
            { id: 'labels', label: 'Etiquetas', icon: Zap },
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-[2.5rem] font-semibold tracking-tight leading-tight">Gestión de Productos</h2>
                <p className="text-apple-sub text-base md:text-lg mt-1 md:mt-2">Administra el inventario de tu tienda.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="flex gap-2">
                  <button 
                    onClick={exportProductsToExcel}
                    className="apple-button-secondary flex-1 sm:flex-none flex items-center justify-center gap-2"
                    title="Exportar a Excel (.xlsx)"
                  >
                    <Download size={20} /> Excel
                  </button>
                  <button 
                    onClick={exportProductsToJSON}
                    className="apple-button-secondary flex-1 sm:flex-none flex items-center justify-center gap-2"
                    title="Exportar para Bot (JSON)"
                  >
                    <MessageCircle size={20} /> JSON
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setEditingProduct({ name: '', description: '', price: 0, category: 'Otros', image_url: '', show_in_popup: false });
                    setIsProductModalOpen(true);
                  }}
                  className="apple-button w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-apple-accent/20"
                >
                  <Plus size={20} /> Nuevo Producto
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-sub" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, SKU o marca..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="apple-input pl-12 py-3 text-sm"
                />
              </div>
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-sub" size={18} />
                <select 
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="apple-input pl-12 py-3 text-sm appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {(productSearch || productCategoryFilter !== 'Todas') && (
                <button 
                  onClick={() => {
                    setProductSearch('');
                    setProductCategoryFilter('Todas');
                  }}
                  className="px-6 py-3 text-sm font-medium text-apple-accent hover:bg-apple-accent/5 rounded-xl transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="apple-card border-none bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-apple-gray/50 text-apple-sub text-[10px] uppercase tracking-widest font-bold border-b border-apple-border/10">
                      <th className="px-10 py-5">Producto</th>
                      <th className="px-10 py-5">Categoría</th>
                      <th className="px-10 py-5">Etiquetas</th>
                      <th className="px-10 py-5">Precio</th>
                      <th className="px-10 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-apple-border/5">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
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
                          <td className="px-10 py-8">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {product.labels?.map((labelName, idx) => {
                                const labelData = labels.find(l => l.name === labelName);
                                return (
                                  <span 
                                    key={idx}
                                    className="text-white text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded shadow-sm"
                                    style={{ backgroundColor: labelData?.color || '#007AFF' }}
                                  >
                                    {labelName}
                                  </span>
                                );
                              })}
                              {(!product.labels || product.labels.length === 0) && (
                                <span className="text-apple-sub text-[10px] italic">Sin etiquetas</span>
                              )}
                            </div>
                          </td>
                          <td className="px-10 py-8 font-semibold text-xl">S/.{product.price.toFixed(2)}</td>
                          <td className="px-10 py-8 text-right">
                            <div className="flex justify-end gap-3">
                              <button 
                                onClick={() => setSharingProduct(product)}
                                className="p-3 hover:bg-apple-gray rounded-full text-apple-sub hover:text-apple-accent transition-all"
                                title="Compartir en redes"
                              >
                                <Share2 size={18} />
                              </button>
                              <button 
                                onClick={() => {
                                  const isPromoPopup = settings?.quick_sell_product_id === product.id && settings?.quick_sell_active !== false;
                                  setEditingProduct({ ...product, show_in_popup: isPromoPopup });
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-10 py-20 text-center text-apple-sub font-medium">
                          No se encontraron productos que coincidan con la búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-apple-border/10">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div key={product.id} className="p-4 flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-apple-gray rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-apple-border/10">
                          <img src={product.image_url || `https://picsum.photos/seed/${product.id}/100/100`} alt="" className="max-h-14 object-contain" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="font-semibold text-base text-apple-dark truncate">{product.name}</div>
                          <div className="text-xs text-apple-sub line-clamp-2 mt-1">{product.description}</div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-apple-dark">S/.{product.price.toFixed(2)}</span>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {product.labels?.slice(0, 2).map((labelName, idx) => {
                                const labelData = labels.find(l => l.name === labelName);
                                return (
                                  <span 
                                    key={idx}
                                    className="text-white text-[8px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded shadow-sm"
                                    style={{ backgroundColor: labelData?.color || '#007AFF' }}
                                  >
                                    {labelName}
                                  </span>
                                );
                              })}
                              <span className="bg-apple-gray text-apple-sub text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-apple-border/20">
                                {product.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSharingProduct(product)}
                          className="flex-1 py-2.5 bg-apple-gray text-apple-dark rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                        >
                          <Share2 size={14} /> Compartir
                        </button>
                        <button 
                          onClick={() => {
                            const isPromoPopup = settings?.quick_sell_product_id === product.id && settings?.quick_sell_active !== false;
                            setEditingProduct({ ...product, show_in_popup: isPromoPopup });
                            setIsProductModalOpen(true);
                          }}
                          className="flex-1 py-2.5 bg-apple-gray text-apple-dark rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                        >
                          <Edit2 size={14} /> Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-apple-sub font-medium">
                    No se encontraron productos.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'combos' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-[2.5rem] font-semibold tracking-tight leading-tight">Gestión de Combos</h2>
                <p className="text-apple-sub text-base md:text-lg mt-1 md:mt-2">Crea packs de productos para emprendedores.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingCombo({ name: '', description: '', price: 0, image_url: '', product_ids: [] });
                  setIsComboModalOpen(true);
                }}
                className="apple-button w-full md:w-auto flex items-center justify-center gap-2 shadow-lg shadow-apple-accent/20"
              >
                <Plus size={20} /> Nuevo Combo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.map(combo => (
                <div key={combo.id} className="apple-card border-none bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="relative h-48 bg-apple-gray flex items-center justify-center">
                    <img 
                      src={combo.image_url || `https://picsum.photos/seed/combo-${combo.id}/400/300`} 
                      alt={combo.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-apple-dark shadow-sm">
                      S/ {combo.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-apple-dark mb-2">{combo.name}</h3>
                    <p className="text-sm text-apple-sub mb-4 line-clamp-2 flex-grow">{combo.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-apple-sub mb-2">Productos Incluidos ({combo.product_ids?.length || 0})</h4>
                      <div className="flex flex-wrap gap-2">
                        {combo.product_ids?.slice(0, 3).map((id: number) => {
                          const product = products.find(p => p.id === id);
                          return product ? (
                            <div key={id} className="flex items-center gap-2 bg-apple-gray/50 rounded-lg p-1.5 pr-3">
                              <img src={product.image_url || `https://picsum.photos/seed/${product.id}/50/50`} alt="" className="w-6 h-6 rounded-md object-cover" />
                              <span className="text-[11px] font-medium text-apple-dark truncate max-w-[100px]">{product.name}</span>
                            </div>
                          ) : null;
                        })}
                        {combo.product_ids?.length > 3 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-apple-gray text-[11px] font-bold text-apple-sub">
                            +{combo.product_ids.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => {
                          setEditingCombo(combo);
                          setIsComboModalOpen(true);
                        }}
                        className="flex-1 py-2.5 bg-apple-gray text-apple-dark rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-apple-gray/80 transition-colors"
                      >
                        <Edit2 size={14} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteCombo(combo.id)}
                        className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {combos.length === 0 && (
                <div className="col-span-full p-12 text-center text-apple-sub font-medium bg-white rounded-3xl border border-apple-border/10">
                  No hay combos creados. Crea el primer pack para emprendedores.
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'orders' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-[2.5rem] font-semibold tracking-tight leading-tight">Registro de Pedidos</h2>
                <p className="text-apple-sub text-base md:text-lg mt-1 md:mt-2">Gestiona las ventas y envíos.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={fetchOrders}
                  className="p-4 hover:bg-apple-gray rounded-full text-apple-sub transition-all hidden md:block"
                >
                  <RefreshCw size={22} />
                </button>
                <button 
                  onClick={() => {
                    setEditingOrder({ customer_name: '', customer_whatsapp: '', total: 0 });
                    setIsOrderModalOpen(true);
                  }}
                  className="apple-button flex-grow md:flex-grow-0 flex items-center justify-center gap-2 shadow-lg shadow-apple-accent/20"
                >
                  <Plus size={20} /> Nuevo Pedido
                </button>
              </div>
            </div>

            <div className="apple-card border-none bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
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

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-apple-border/10">
                {orders.map(order => (
                  <div key={order.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-apple-accent text-sm">#{order.id}</div>
                        <div className="text-[10px] text-apple-sub font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border focus:outline-none transition-all appearance-none cursor-pointer ${
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
                    </div>
                    <div>
                      <div className="font-semibold text-apple-dark text-base">{order.customer_name}</div>
                      <div className="text-xs text-apple-sub font-medium">{order.customer_whatsapp}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-lg font-bold text-apple-dark">S/.{order.total.toFixed(2)}</span>
                      <button 
                        onClick={() => resendWhatsApp(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-semibold"
                      >
                        <ExternalLink size={14} /> WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'crm' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex-grow">
                <h2 className="text-2xl md:text-[2.5rem] font-semibold tracking-tight leading-tight">CRM de Clientes</h2>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-sub" size={18} />
                    <input 
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Buscar por nombre, WhatsApp o email..."
                      className="apple-input pl-12 py-3 text-sm focus:ring-2 focus:ring-apple-accent/20"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingCustomer({ name: '', whatsapp: '', email: '', notes: '' });
                  setIsCustomerModalOpen(true);
                }}
                className="apple-button w-full md:w-auto flex items-center justify-center gap-2 shadow-lg shadow-apple-accent/20"
              >
                <Plus size={20} /> Nuevo Cliente
              </button>
            </div>

            <div className="apple-card border-none bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
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
                    {customers.filter(c => 
                      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      c.whatsapp.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
                      (c.notes && c.notes.toLowerCase().includes(customerSearch.toLowerCase()))
                    ).map(customer => (
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

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-apple-border/10">
                {customers.filter(c => 
                  c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                  c.whatsapp.toLowerCase().includes(customerSearch.toLowerCase()) ||
                  (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
                  (c.notes && c.notes.toLowerCase().includes(customerSearch.toLowerCase()))
                ).map(customer => (
                  <div key={customer.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-apple-dark text-base">{customer.name}</div>
                        <div className="text-xs text-apple-sub font-medium">{customer.email}</div>
                      </div>
                      <div className="text-[10px] text-apple-sub font-bold uppercase tracking-widest">
                        {new Date(customer.last_interaction).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-apple-sub">{customer.whatsapp}</div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedCustomer(customer);
                          fetchInteractions(customer.id);
                          setIsInteractionModalOpen(true);
                        }}
                        className="flex-1 py-2.5 bg-apple-gray text-apple-dark rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={14} /> Historial
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCustomer(customer);
                          setIsCustomerModalOpen(true);
                        }}
                        className="flex-1 py-2.5 bg-apple-gray text-apple-dark rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <Edit2 size={14} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'labels' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-[2.5rem] font-semibold tracking-tight leading-tight">Etiquetas de Productos</h2>
                <p className="text-apple-sub text-base md:text-lg mt-1 md:mt-2">Crea y gestiona etiquetas como "Oferta", "Nuevo", etc.</p>
              </div>
              <button 
                onClick={() => {
                  setEditingLabel({ name: '', color: '#007AFF' });
                  setIsLabelModalOpen(true);
                }}
                className="apple-button w-full md:w-auto flex items-center justify-center gap-2 shadow-lg shadow-apple-accent/20"
              >
                <Plus size={20} /> Nueva Etiqueta
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {labels.map(label => (
                <div key={label.id} className="apple-card p-6 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: label.color }} 
                    />
                    <div>
                      <div className="font-semibold text-lg">{label.name}</div>
                      <div className="text-xs text-apple-sub font-mono uppercase tracking-widest">{label.color}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingLabel(label);
                        setIsLabelModalOpen(true);
                      }}
                      className="p-2 hover:bg-apple-gray rounded-lg text-apple-sub hover:text-apple-accent transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteLabel(label.id)}
                      className="p-2 hover:bg-apple-gray rounded-lg text-apple-sub hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {labels.length === 0 && (
                <div className="col-span-full py-20 text-center text-apple-sub font-medium bg-apple-gray/30 rounded-[2rem] border-2 border-dashed border-apple-border/20">
                  No hay etiquetas creadas. Comienza creando una nueva.
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === 'lander' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-apple-border/10 pb-6">
              <div>
                <h2 className="text-2xl md:text-[2.5rem] font-bold tracking-tight leading-tight">Configuración de Plantilla Landing Page</h2>
                <p className="text-apple-sub text-base md:text-lg mt-1 md:mt-2">Administra el producto de campaña, fotos del carrusel, cuentas bancarias y números de contacto sin tocar código.</p>
              </div>
              <div className="flex gap-2">
                <a 
                  href="/promocion" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl border border-apple-border/20 text-xs font-semibold hover:bg-apple-gray flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={14} /> Ver Landing Online
                </a>
              </div>
            </div>

            <form onSubmit={handleSaveLanderConfig} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* COLUMN 1: PRODUCT DETAILS */}
                <div className="apple-card p-8 md:p-10 space-y-6 bg-white rounded-3xl border border-apple-border/5 shadow-md">
                  <h3 className="text-lg font-black text-apple-dark border-b border-apple-border/10 pb-3 flex items-center gap-2">
                    🛍️ Datos del Producto de Campaña
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Nombre Corto en Landing</label>
                    <input 
                      required
                      name="lander_name" 
                      type="text" 
                      className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                      placeholder="Ej. IMPRESORA TERMICA POS-STAR WP200 80MM USB+RJ11" 
                      defaultValue={landerConfig?.productInfo?.name || ''} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Nombre Completo de Confirmación</label>
                    <textarea 
                      required
                      name="lander_fullName" 
                      rows={2}
                      className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                      placeholder="Ej. IMPRESORA TERMICA POS-STAR WP200 80MM INTERFAZ USB + RJ11 VELOCIDAD 230MM/S" 
                      defaultValue={landerConfig?.productInfo?.fullName || ''} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Precio Fijo en Web (S/.)</label>
                      <input 
                        required
                        name="lander_price" 
                        type="number" 
                        step="0.01"
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="203.00" 
                        defaultValue={landerConfig?.productInfo?.price || ''} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Marca</label>
                      <input 
                        required
                        name="lander_brand" 
                        type="text" 
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="Ej. POS-STAR" 
                        defaultValue={landerConfig?.productInfo?.brand || ''} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Categoría/Tipo</label>
                      <input 
                        required
                        name="lander_type" 
                        type="text" 
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="Ej. Impresora Térmica" 
                        defaultValue={landerConfig?.productInfo?.type || ''} 
                    />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Puertos / Interfaz</label>
                      <input 
                        required
                        name="lander_interface" 
                        type="text" 
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="Ej. USB + RJ11" 
                        defaultValue={landerConfig?.productInfo?.interface || ''} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Ancho de Papel</label>
                      <input 
                        required
                        name="lander_paperSize" 
                        type="text" 
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="Ej. 80MM" 
                        defaultValue={landerConfig?.productInfo?.paperSize || ''} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Velocidad</label>
                      <input 
                        required
                        name="lander_speed" 
                        type="text" 
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="Ej. 230MM/S" 
                        defaultValue={landerConfig?.productInfo?.speed || ''} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Detalle de Envío</label>
                      <input 
                        required
                        name="lander_shipping" 
                        type="text" 
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="Ej. Envío a Todo el Perú" 
                        defaultValue={landerConfig?.productInfo?.shipping || ''} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Tiempo de Entrega</label>
                      <input 
                        required
                        name="lander_deliveryTime" 
                        type="text" 
                        className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                        placeholder="Ej. De 12 a 72 horas" 
                        defaultValue={landerConfig?.productInfo?.deliveryTime || ''} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Texto Leyenda de Oferta</label>
                    <input 
                      required
                      name="lander_offerType" 
                      type="text" 
                      className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                      placeholder="Ej. Precio solo Web" 
                      defaultValue={landerConfig?.productInfo?.offerType || ''} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Enlace del Driver (Google Drive)</label>
                    <input 
                      required
                      name="lander_driverUrl" 
                      type="url" 
                      className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                      placeholder="https://drive.google.com/..." 
                      defaultValue={landerConfig?.productInfo?.driverUrl || ''} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Enlace del Manual PDF (Google Drive)</label>
                    <input 
                      required
                      name="lander_manualUrl" 
                      type="url" 
                      className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                      placeholder="https://drive.google.com/..." 
                      defaultValue={landerConfig?.productInfo?.manualUrl || ''} 
                    />
                  </div>

                  {/* Nuevos Campos Dinámicos de Campaña */}
                  <div className="border-t border-apple-border/10 pt-6 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                      🏷️ Edición, Precios y Especificaciones Adicionales
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Nombre de la Edición (Header)</label>
                        <input 
                          required
                          name="lander_edition" 
                          type="text" 
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. WP200 Pro-Edition" 
                          defaultValue={landerConfig?.productInfo?.edition || ''} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Código de Modelo (Shorthand)</label>
                        <input 
                          required
                          name="lander_model" 
                          type="text" 
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. WP200" 
                          defaultValue={landerConfig?.productInfo?.model || ''} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Precio Comparativo/Original (S/.)</label>
                        <input 
                          required
                          name="lander_originalPrice" 
                          type="number" 
                          step="0.01"
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. 269.00" 
                          defaultValue={landerConfig?.productInfo?.originalPrice || ''} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Porcentaje/Texto de Descuento</label>
                        <input 
                          required
                          name="lander_discountText" 
                          type="text" 
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. -24% Desc." 
                          defaultValue={landerConfig?.productInfo?.discountText || ''} 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Fila del Check de Valor 1 (Bolding automático con ":")</label>
                        <input 
                          required
                          name="lander_spec1" 
                          type="text" 
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. Marca de confianza: POS-STAR (Modelo de alto rendimiento)." 
                          defaultValue={landerConfig?.productInfo?.spec1 || ''} 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Fila del Check de Valor 2 (Bolding automático con ":")</label>
                        <input 
                          required
                          name="lander_spec2" 
                          type="text" 
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. Tecnología: Térmica Directa (Cero costos)." 
                          defaultValue={landerConfig?.productInfo?.spec2 || ''} 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Fila del Check de Valor 3 (Bolding automático con ":")</label>
                        <input 
                          required
                          name="lander_spec3" 
                          type="text" 
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. Velocidad Profesional: 230 mm/s con autocorte." 
                          defaultValue={landerConfig?.productInfo?.spec3 || ''} 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-apple-sub block ml-1">Fila del Check de Valor 4 (Bolding automático con ":")</label>
                        <input 
                          required
                          name="lander_spec4" 
                          type="text" 
                          className="apple-input w-full px-4 py-3 text-sm focus:ring-2 focus:ring-apple-accent/25" 
                          placeholder="Ej. Interfaces integradas: Entrada USB + RJ11." 
                          defaultValue={landerConfig?.productInfo?.spec4 || ''} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: RECIPIENT BANK ACCOUNTS & CONTACT FOR LANDER */}
                <div className="space-y-10">
                  <div className="apple-card p-8 md:p-10 space-y-6 bg-white rounded-3xl border border-apple-border/5 shadow-md">
                    <h3 className="text-lg font-black text-apple-dark border-b border-apple-border/10 pb-3 flex items-center gap-2 font-sans">
                      💳 Recaudación y Contacto Directo
                    </h3>

                    {/* Yape Credentials block */}
                    <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 space-y-4">
                      <h4 className="text-xs font-black text-purple-900 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                        📱 Cuentas Yape Directo
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-purple-700 block font-sans">Celular Yape (Visible)</label>
                          <input 
                            required
                            name="lander_yapePhone" 
                            type="text" 
                            className="apple-input bg-white w-full px-3 py-2 text-xs font-sans font-bold" 
                            placeholder="989 007 409" 
                            defaultValue={landerConfig?.productInfo?.yapePhone || ''} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-purple-700 block font-sans">Celular Yape (Número Puro)</label>
                          <input 
                            required
                            name="lander_yapePhoneRaw" 
                            type="text" 
                            className="apple-input bg-white w-full px-3 py-2 text-xs font-mono" 
                            placeholder="989007409" 
                            defaultValue={landerConfig?.productInfo?.yapePhoneRaw || ''} 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-purple-700 block font-sans">Titular de Cuenta Yape</label>
                        <input 
                          required
                          name="lander_yapeOwner" 
                          type="text" 
                          className="apple-input bg-white w-full px-3 py-2 text-xs font-sans font-semibold" 
                          placeholder="Joaquín García" 
                          defaultValue={landerConfig?.productInfo?.yapeOwner || ''} 
                        />
                      </div>
                    </div>

                    {/* BCP Credentials block */}
                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-4">
                      <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                        🏦 Cuentas Corrientes BCP
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 font-sans">
                          <label className="text-[10px] font-bold uppercase text-indigo-700 block font-sans">Nro de Cuenta BCP (Visible)</label>
                          <input 
                            required
                            name="lander_bcpAccount" 
                            type="text" 
                            className="apple-input bg-white w-full px-3 py-2 text-xs font-mono" 
                            placeholder="191-1875953-0-18" 
                            defaultValue={landerConfig?.productInfo?.bcpAccount || ''} 
                          />
                        </div>
                        <div className="space-y-2 font-sans">
                          <label className="text-[10px] font-bold uppercase text-indigo-700 block font-sans">Nro BCP Puro (Copiar)</label>
                          <input 
                            required
                            name="lander_bcpAccountRaw" 
                            type="text" 
                            className="apple-input bg-white w-full px-3 py-2 text-xs font-mono" 
                            placeholder="1911875953018" 
                            defaultValue={landerConfig?.productInfo?.bcpAccountRaw || ''} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-indigo-700 block font-sans">Nro CCI (Visible)</label>
                          <input 
                            required
                            name="lander_bcpCCI" 
                            type="text" 
                            className="apple-input bg-white w-full px-3 py-2 text-xs font-mono" 
                            placeholder="002-191-001875953018-53" 
                            defaultValue={landerConfig?.productInfo?.bcpCCI || ''} 
                          />
                        </div>
                        <div className="space-y-2 col-span-1">
                          <label className="text-[10px] font-bold uppercase text-indigo-700 block font-sans">Nro CCI Puro (Copiar)</label>
                          <input 
                            required
                            name="lander_bcpCCIRaw" 
                            type="text" 
                            className="apple-input bg-white w-full px-3 py-2 text-xs font-mono" 
                            placeholder="00219100187595301853" 
                            defaultValue={landerConfig?.productInfo?.bcpCCIRaw || ''} 
                          />
                        </div>
                      </div>

                      <div className="space-y-2 font-sans">
                        <label className="text-[10px] font-bold uppercase text-indigo-700 block font-sans">Titular / Razón Social BCP</label>
                        <input 
                          required
                          name="lander_bcpOwner" 
                          type="text" 
                          className="apple-input bg-white w-full px-3 py-2 text-xs font-sans font-semibold" 
                          placeholder="COPIERMAX EIR." 
                          defaultValue={landerConfig?.productInfo?.bcpOwner || ''} 
                        />
                      </div>
                    </div>

                    {/* WhatsApp Redirect settings */}
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/60 space-y-3 font-sans">
                      <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                        💬 Redirección y Notificación WhatsApp
                      </h4>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-emerald-700 block font-sans">Número WhatsApp Destinatario (Con Código País)</label>
                        <input 
                          required
                          name="lander_whatsappPhone" 
                          type="text" 
                          className="apple-input bg-white w-full px-4 py-3 text-xs font-sans font-bold" 
                          placeholder="Ej. 51905820448" 
                          defaultValue={landerConfig?.productInfo?.whatsappPhone || ''} 
                        />
                        <p className="text-[9px] text-zinc-400 font-semibold leading-relaxed">
                          Ingresa el número al cual llegará el informe y confirmación de compra sin el caracter "+" (ej: 51905820448 para Perú).
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* CARD 3: CAROUSEL CHARACTERISTICS AND IMAGES (6 blocks) */}
              <div className="apple-card p-8 md:p-10 space-y-6 bg-white rounded-3xl border border-apple-border/5 shadow-md">
                <h3 className="text-lg font-black text-apple-dark border-b border-apple-border/10 pb-3 flex items-center gap-2 font-sans">
                  🖼️ Fotos del Carrusel y Características Principales (Requerido 6 Bloques)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const img = landerConfig?.productImages?.[index] || { url: '', title: '', desc: '' };
                    return (
                      <div key={index} className="bg-apple-gray/30 p-5 rounded-2xl border border-apple-border/10 space-y-4 text-left">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-apple-sub/10 text-apple-sub px-2 py-0.5 rounded">
                          Bloque {index + 1}
                        </span>

                        <div className="space-y-2 font-sans">
                          <label className="text-[10.5px] font-bold text-apple-sub uppercase tracking-wider block">URL de la Imagen</label>
                          <input 
                            required
                            name={`img_url_${index}`}
                            type="url"
                            className="apple-input bg-white w-full px-3 py-2 text-xs text-zinc-700 font-medium"
                            placeholder="https://images.unsplash.com/..."
                            defaultValue={img.url}
                          />
                        </div>

                        <div className="space-y-2 font-sans">
                          <label className="text-[10.5px] font-bold text-apple-sub uppercase tracking-wider block">Título de Característica</label>
                          <input 
                            required
                            name={`img_title_${index}`}
                            type="text"
                            className="apple-input bg-white w-full px-3 py-2 text-xs font-semibold text-apple-dark"
                            placeholder="Ej. Velocidad Extrema de 230mm/s"
                            defaultValue={img.title}
                          />
                        </div>

                        <div className="space-y-2 font-sans">
                          <label className="text-[10.5px] font-bold text-apple-sub uppercase tracking-wider block">Descripción Detallada</label>
                          <textarea 
                            required
                            name={`img_desc_${index}`}
                            rows={3}
                            className="apple-input bg-white w-full px-3 py-2 text-xs leading-relaxed text-apple-sub font-medium"
                            placeholder="Ej. Estructura robusta de grado industrial optimizada..."
                            defaultValue={img.desc}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SAVE THE WHOLE PRODUCT CAMPAIGN TEMPLATE */}
              <div className="flex justify-end pt-5">
                <button 
                  type="submit" 
                  disabled={savingLander}
                  className="apple-button w-full md:w-auto px-10 py-5 text-base font-bold bg-apple-dark text-white rounded-2xl shadow-xl hover:bg-apple-dark/95 flex items-center justify-center gap-2 group transition-all"
                >
                  {savingLander ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} /> Guardando Cambios...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="group-hover:scale-105 transition-transform" /> Guardar Cambios de Plantilla
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center md:text-left">Configuración de la Tienda</h2>
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
                // Promo 1
                promo1_active: formData.get('promo1_active') === 'true',
                promo1_product_id: formData.get('promo1_product_id') ? parseInt(formData.get('promo1_product_id') as string) : null,
                // Promo 2
                promo2_active: formData.get('promo2_active') === 'true',
                promo2_product_id: formData.get('promo2_product_id') ? parseInt(formData.get('promo2_product_id') as string) : null,
                // Pop-up Venta Rápida
                quick_sell_active: formData.get('quick_sell_active') === 'true',
                quick_sell_product_id: formData.get('quick_sell_product_id') ? parseInt(formData.get('quick_sell_product_id') as string) : null,
              };
              
              const { error } = await supabase
                .from('settings')
                .upsert({ key: 'general', value: newSettings });
                
              if (error) alert('Error al guardar configuración');
              else {
                alert('Configuración guardada correctamente');
                setSettings(newSettings);
              }
            }} className="apple-card p-6 md:p-8 space-y-6">
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
              {/* =========================================================================
                  SECCIÓN: POPUPS DE OFERTAS DIPLOMADOS EN LA PÁGINA PRINCIPAL
                  ========================================================================= */}
              <div className="border-t border-zinc-200/60 pt-6 mt-6 space-y-6">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-150 text-[12px] font-sans font-semibold leading-relaxed text-emerald-900">
                  🎁 <strong>Fijar Productos para Ofertas Flash:</strong> Seleccione de su catálogo de productos registrados cuáles desea promocionar en las ventanas emergentes automáticas para incentivar la venta directa o rápida.
                </div>

                {/* PROMO 1 CONFIG CARD */}
                <div className="p-5 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-200/60 pb-3">
                    <span className="text-[11px] font-black uppercase text-rose-500 tracking-wider">🎯 Oferta Flash 1</span>
                    <select 
                      name="promo1_active" 
                      defaultValue={settings?.promo1_active === false ? 'false' : 'true'}
                      className="text-xs font-bold border border-zinc-200 bg-white rounded-lg px-2.5 py-1 text-zinc-700 outline-none cursor-pointer"
                    >
                      <option value="true">Activo (Mostrar)</option>
                      <option value="false">Inactivo (Ocultar)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block">Seleccionar Producto a Promocionar</label>
                    <select 
                      name="promo1_product_id"
                      defaultValue={settings?.promo1_product_id || ""}
                      className="w-full bg-white border border-zinc-200 px-3 py-3 rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="">-- Seleccionar de Catálogo --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.brand ? `[${p.brand}] ` : ''}{p.name} - S/ {p.price}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PROMO 2 CONFIG CARD */}
                <div className="p-5 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-200/60 pb-3">
                    <span className="text-[11px] font-black uppercase text-amber-500 tracking-wider">🎯 Oferta Flash 2</span>
                    <select 
                      name="promo2_active" 
                      defaultValue={settings?.promo2_active === false ? 'false' : 'true'}
                      className="text-xs font-bold border border-zinc-200 bg-white rounded-lg px-2.5 py-1 text-zinc-700 outline-none cursor-pointer"
                    >
                      <option value="true">Activo (Mostrar)</option>
                      <option value="false">Inactivo (Ocultar)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block">Seleccionar Producto a Promocionar</label>
                    <select 
                      name="promo2_product_id"
                      defaultValue={settings?.promo2_product_id || ""}
                      className="w-full bg-white border border-zinc-200 px-3 py-3 rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="">-- Seleccionar de Catálogo --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.brand ? `[${p.brand}] ` : ''}{p.name} - S/ {p.price}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* QUICK SELL POP-UP CONFIG CARD */}
                <div className="p-5 bg-gradient-to-br from-orange-50/50 to-orange-50/10 rounded-3xl border border-orange-200 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-orange-200/60 pb-3">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider">⚡ Pop-up de Venta Rápida (Producto Estrella)</span>
                    <select 
                      name="quick_sell_active" 
                      defaultValue={settings?.quick_sell_active === false ? 'false' : 'true'}
                      className="text-xs font-bold border border-orange-200 bg-white rounded-lg px-2.5 py-1 text-orange-700 outline-none cursor-pointer"
                    >
                      <option value="true">Activo (Mostrar)</option>
                      <option value="false">Inactivo (Ocultar)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block">Seleccionar Producto Estrella para Venta Rápida</label>
                    <select 
                      name="quick_sell_product_id"
                      defaultValue={settings?.quick_sell_product_id || ""}
                      className="w-full bg-white border border-zinc-200 px-3 py-3 rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="">-- Seleccionar de Catálogo --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.brand ? `[${p.brand}] ` : ''}{p.name} - S/ {p.price}</option>
                      ))}
                    </select>
                  </div>
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
        labelsList={labels}
      />

      {/* Combo Modal */}
      <ComboModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        combo={editingCombo}
        onSave={handleSaveCombo}
        onChange={setEditingCombo}
        products={products}
      />

      {/* Label Modal */}
      <AnimatePresence>
        {isLabelModalOpen && editingLabel && (
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
              onClick={() => setIsLabelModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative glass-card rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-apple-border/10 flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-tight">{editingLabel.id ? 'Editar Etiqueta' : 'Nueva Etiqueta'}</h3>
                <button onClick={() => setIsLabelModalOpen(false)} className="p-3 hover:bg-apple-gray rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveLabel} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Nombre de la Etiqueta</label>
                    <input 
                      required
                      type="text" 
                      value={editingLabel.name}
                      onChange={e => setEditingLabel({...editingLabel, name: e.target.value})}
                      className="apple-input text-lg py-4"
                      placeholder="Ej. Oferta, Nuevo, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold uppercase tracking-widest text-apple-sub ml-1">Color (Hex)</label>
                    <div className="flex gap-4">
                      <input 
                        required
                        type="color" 
                        value={editingLabel.color}
                        onChange={e => setEditingLabel({...editingLabel, color: e.target.value})}
                        className="w-16 h-16 rounded-xl cursor-pointer border-none bg-transparent"
                      />
                      <input 
                        required
                        type="text" 
                        value={editingLabel.color}
                        onChange={e => setEditingLabel({...editingLabel, color: e.target.value})}
                        className="apple-input text-lg py-4 font-mono uppercase"
                        placeholder="#007AFF"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsLabelModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-semibold text-lg bg-apple-gray hover:bg-zinc-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 apple-button py-4 text-lg rounded-2xl shadow-lg shadow-apple-accent/20"
                  >
                    {editingLabel.id ? 'Guardar Cambios' : 'Crear Etiqueta'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        {/* Sharing Modal */}
        <AnimatePresence>
          {sharingProduct && (
            <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
                onClick={() => setSharingProduct(null)} 
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative glass-card rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl p-10 text-center"
              >
                <div className="w-20 h-20 bg-apple-accent/10 text-apple-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Share2 size={40} />
                </div>
                <h3 className="text-2xl font-semibold mb-2 tracking-tight">Compartir Producto</h3>
                <p className="text-apple-sub mb-8 font-medium">{sharingProduct.name}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* WhatsApp */}
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Mira este producto en Pos-Tec Store: ${sharingProduct.name} - ${window.location.origin}/?product=${sharingProduct.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-apple-gray rounded-2xl hover:bg-[#25D366]/10 hover:text-[#25D366] transition-all group"
                  >
                    <Send size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/?product=${sharingProduct.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-apple-gray rounded-2xl hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-all group"
                  >
                    <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Facebook</span>
                  </a>

                  {/* Instagram */}
                  <a 
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-apple-gray rounded-2xl hover:bg-[#E4405F]/10 hover:text-[#E4405F] transition-all group"
                  >
                    <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Instagram</span>
                  </a>

                  {/* TikTok */}
                  <a 
                    href="https://www.tiktok.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-apple-gray rounded-2xl hover:bg-black/10 hover:text-black transition-all group"
                  >
                    <Music size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">TikTok</span>
                  </a>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      const text = `${sharingProduct.name}\nPrecio: S/.${sharingProduct.price.toFixed(2)}\nEnlace: ${window.location.origin}/?product=${sharingProduct.id}`;
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="w-full py-4 bg-apple-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                  >
                    {copied ? <><X size={18} className="rotate-45 text-green-400" /> ¡Copiado!</> : <><Copy size={18} /> Copiar Info y Link</>}
                  </button>
                  <button 
                    onClick={() => setSharingProduct(null)}
                    className="w-full py-4 bg-apple-gray text-apple-dark rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}

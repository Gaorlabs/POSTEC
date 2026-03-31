import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { ShoppingCart, X, Plus, Minus, Send, Package, Search, ChevronRight, ChevronLeft, Globe, Zap, ShieldCheck, ArrowRight, Printer, Banknote, Fingerprint, Barcode, Monitor, Laptop, ScrollText, Store, LayoutGrid, CreditCard, Cpu, Menu } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Product, OrderItem } from '../types';
import { buildWhatsAppMessage } from '../lib/whatsapp';
import { motion, AnimatePresence } from 'motion/react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [category, setCategory] = useState('Todas');
  const [orderForm, setOrderForm] = useState({
    name: '',
    whatsapp: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<'Tienda' | 'Soporte' | 'Controladores'>('Tienda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState('Restaurante');
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getIndustrySolution = (type: string) => {
    switch (type) {
      case 'Restaurante':
        return [
          { icon: <Monitor size={32} />, title: 'Terminal Touch', description: 'Pantalla capacitiva de alta respuesta para una toma de pedidos veloz.' },
          { icon: <Printer size={32} />, title: 'Impresora de Comandas', description: 'Impresión térmica de 250mm/s con corte automático para cocina.' },
          { icon: <Banknote size={32} />, title: 'Gaveta de Dinero', description: 'Apertura automática sincronizada con la venta para mayor seguridad.' }
        ];
      case 'Tienda Retail':
        return [
          { icon: <Barcode size={32} />, title: 'Lector de Códigos', description: 'Escaneo 1D/2D omnidireccional para agilizar el paso por caja.' },
          { icon: <CreditCard size={32} />, title: 'Punto de Venta', description: 'Integración perfecta con sistemas de pago y facturación electrónica.' },
          { icon: <LayoutGrid size={32} />, title: 'Control de Stock', description: 'Software y hardware trabajando juntos para inventarios precisos.' }
        ];
      case 'Almacén':
        return [
          { icon: <Barcode size={32} />, title: 'Lectores Industriales', description: 'Resistentes a caídas y con largo alcance para estanterías altas.' },
          { icon: <Printer size={32} />, title: 'Etiquetadoras', description: 'Impresión de etiquetas adhesivas duraderas para identificación de productos.' },
          { icon: <Cpu size={32} />, title: 'Colectores de Datos', description: 'Terminales móviles para picking y packing sin errores.' }
        ];
      case 'Oficina':
        return [
          { icon: <Fingerprint size={32} />, title: 'Control de Asistencia', description: 'Relojes biométricos para gestión de horarios y accesos.' },
          { icon: <Laptop size={32} />, title: 'Estaciones de Trabajo', description: 'PCs configuradas para alto rendimiento administrativo.' },
          { icon: <ScrollText size={32} />, title: 'Gestión Documental', description: 'Suministros y periféricos para una oficina eficiente.' }
        ];
      default:
        return [];
    }
  };

  const slides = [
    {
      title: "PC o Computadora.",
      subtitle: "Potencia y rendimiento para tu negocio.",
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=1920",
      category: "PC o Computadora",
      color: "from-black"
    },
    {
      title: "Soluciones para Retail.",
      subtitle: "Optimiza tus ventas con tecnología de punta.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1920",
      category: "Impresoras Térmicas",
      color: "from-blue-900/40"
    },
    {
      title: "Puntos de Venta.",
      subtitle: "La mejor experiencia para tus clientes.",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1920",
      category: "Terminal Punto de Venta",
      color: "from-zinc-900"
    },
    {
      title: "Seguridad y Control.",
      subtitle: "Protege lo que más importa.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920",
      category: "Control de Acceso",
      color: "from-slate-900"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['Todas', 'Impresoras Térmicas', 'Gavetas de Dinero', 'Control de Acceso', 'Lector de Código de Barras', 'Monitores Touch', 'PC o Computadora', 'Suministros', 'Terminal Punto de Venta'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Todas': return <LayoutGrid size={22} strokeWidth={1.5} />;
      case 'Impresoras Térmicas': return <Printer size={22} strokeWidth={1.5} />;
      case 'Gavetas de Dinero': return <Banknote size={22} strokeWidth={1.5} />;
      case 'Control de Acceso': return <Fingerprint size={22} strokeWidth={1.5} />;
      case 'Lector de Código de Barras': return <Barcode size={22} strokeWidth={1.5} />;
      case 'Monitores Touch': return <Monitor size={22} strokeWidth={1.5} />;
      case 'PC o Computadora': return <Laptop size={22} strokeWidth={1.5} />;
      case 'Suministros': return <ScrollText size={22} strokeWidth={1.5} />;
      case 'Terminal Punto de Venta': return <Store size={22} strokeWidth={1.5} />;
      default: return <Package size={22} strokeWidth={1.5} />;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = category === 'Todas' 
    ? products 
    : products.filter(p => p.category === category);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderForm.name,
          customer_whatsapp: orderForm.whatsapp,
          customer_address: orderForm.address,
          items: cart,
          total: cartTotal,
          status: 'pendiente'
        }])
        .select();

      if (error) throw error;

      const newOrder = data[0];
      setOrderSuccess(newOrder.id);
      
      const whatsappUrl = buildWhatsAppMessage(
        newOrder.id,
        orderForm.name,
        orderForm.whatsapp,
        orderForm.address,
        cart,
        cartTotal
      );
      window.open(whatsappUrl, '_blank');
      
      setCart([]);
      setOrderForm({ name: '', whatsapp: '', address: '' });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pedido. Por favor intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-dark font-sans selection:bg-apple-accent/10">
      {/* Navigation */}
      <nav className="apple-nav h-16">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => { setCurrentTab('Tienda'); setIsMobileMenuOpen(false); }}
          >
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-apple-dark">
            <button 
              onClick={() => setCurrentTab('Tienda')}
              className={`relative py-5 transition-colors ${currentTab === 'Tienda' ? 'text-apple-accent' : 'hover:text-apple-accent'}`}
            >
              Tienda
              {currentTab === 'Tienda' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-accent" />}
            </button>
            <button 
              onClick={() => setCurrentTab('Soporte')}
              className={`relative py-5 transition-colors ${currentTab === 'Soporte' ? 'text-apple-accent' : 'hover:text-apple-accent'}`}
            >
              Soporte
              {currentTab === 'Soporte' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-accent" />}
            </button>
            <button 
              onClick={() => setCurrentTab('Controladores')}
              className={`relative py-5 transition-colors ${currentTab === 'Controladores' ? 'text-apple-accent' : 'hover:text-apple-accent'}`}
            >
              Controladores
              {currentTab === 'Controladores' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-apple-accent" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-16 left-0 right-0 bg-white border-b border-apple-border p-6 md:hidden z-50 flex flex-col gap-4 text-lg font-semibold"
              >
                <button onClick={() => { setCurrentTab('Tienda'); setIsMobileMenuOpen(false); }} className="text-left py-2">Tienda</button>
                <button onClick={() => { setCurrentTab('Soporte'); setIsMobileMenuOpen(false); }} className="text-left py-2">Soporte</button>
                <button onClick={() => { setCurrentTab('Controladores'); setIsMobileMenuOpen(false); }} className="text-left py-2">Controladores</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-6">
            <button className="opacity-80 hover:opacity-100 transition-opacity">
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative opacity-80 hover:opacity-100 transition-opacity"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-apple-accent text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-6">
        <AnimatePresence mode="wait">
          {currentTab === 'Tienda' && (
            <motion.div
              key="tienda"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Slideshow Section */}
              <section className="pt-12 mb-12 relative group">
                <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden bg-black text-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={slides[currentSlide].image} 
                        alt={slides[currentSlide].title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${slides[currentSlide].color} via-transparent to-transparent`} />
                      
                      <div className="relative h-full flex flex-col items-center justify-center text-center p-12 z-10">
                        <motion.h2 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className="text-[3.5rem] md:text-[5rem] font-semibold tracking-tight leading-[1.1] mb-4"
                        >
                          {slides[currentSlide].title}
                        </motion.h2>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-xl"
                        >
                          {slides[currentSlide].subtitle}
                        </motion.p>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="flex gap-4 justify-center"
                        >
                          <button 
                            onClick={() => setCategory(slides[currentSlide].category)}
                            className="apple-button px-8 py-3 text-lg"
                          >
                            Comprar
                          </button>
                          <button className="apple-button-secondary text-white text-lg hover:text-apple-accent">
                            Más información <ChevronRight size={20} />
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button 
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Indicators */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          currentSlide === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Hero Section */}
              <section className="pt-8 pb-12">
                <div className="flex flex-col items-center text-center mb-16">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[3rem] md:text-[4.5rem] font-semibold tracking-tight leading-[1.1] mb-4"
                  >
                    Tienda. <span className="text-apple-sub">La mejor forma de comprar los productos que amas.</span>
                  </motion.h1>
                </div>

                {/* Category Navigation (Apple Style) */}
                <div className="flex items-center justify-start md:justify-center gap-8 md:gap-12 overflow-x-auto pb-12 scrollbar-hide -mx-6 px-6">
                  {categories.map((cat, idx) => (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={cat}
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setCategory(cat);
                        scrollToProducts();
                      }}
                      className="flex flex-col items-center gap-3 group min-w-[100px] flex-shrink-0"
                    >
                      <motion.div 
                        className={`transition-all duration-500 ${
                          category === cat 
                            ? 'text-apple-accent scale-110' 
                            : 'text-apple-dark opacity-60 group-hover:opacity-100 group-hover:text-apple-accent'
                        }`}
                      >
                        {getCategoryIcon(cat)}
                      </motion.div>
                      <span className={`text-[11px] font-medium transition-colors whitespace-nowrap ${
                        category === cat ? 'text-apple-accent font-bold' : 'text-apple-sub group-hover:text-apple-accent'
                      }`}>
                        {cat}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Solutions Ecosystem Section */}
              <section className="mb-24">
                <div className="mb-12">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-apple-accent font-semibold tracking-widest uppercase text-[11px] mb-3 block"
                  >
                    Ecosistema de Soluciones
                  </motion.span>
                  <h2 className="text-[2rem] md:text-[3rem] font-semibold tracking-tight leading-tight mb-4">
                    Tecnología que impulsa tu éxito.
                  </h2>
                  <p className="text-apple-sub text-lg max-w-2xl font-medium">
                    Diseñamos el flujo de trabajo que tu empresa necesita para escalar al siguiente nivel.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Solution: Retail/POS */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer bg-zinc-900"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1556740734-7f95834d0ff9?auto=format&fit=crop&q=80&w=1200" 
                      alt="Smart POS"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">Puntos de Venta Inteligentes</h3>
                      <p className="text-zinc-300 text-base max-w-md mb-6 line-clamp-2">
                        Elimina las colas y los errores de facturación con terminales touch e impresoras de alta velocidad.
                      </p>
                      <div className="flex items-center gap-2 text-apple-accent font-semibold text-sm group-hover:gap-4 transition-all">
                        Ver equipos POS <ArrowRight size={18} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Secondary: Security */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer bg-zinc-100"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800" 
                      alt="Security"
                      className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-apple-dark">
                        <Fingerprint size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-apple-dark mb-2">Control de Acceso</h3>
                        <p className="text-apple-sub text-[13px] leading-relaxed font-medium">
                          Seguridad biométrica de última generación para proteger tus activos.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tertiary: Logistics */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer bg-apple-gray"
                  >
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-apple-dark">
                        <Barcode size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-apple-dark mb-2">Logística Ágil</h3>
                        <p className="text-apple-sub text-[13px] leading-relaxed font-medium">
                          Lectores industriales diseñados para entornos de alto tráfico.
                        </p>
                      </div>
                      <img 
                        src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=600" 
                        alt="Logistics"
                        className="mt-4 rounded-xl h-40 w-full object-cover shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>

                  {/* Quaternary: Computing/Brain */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2 relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer bg-black"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200" 
                      alt="Computing"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="px-2 py-0.5 rounded-full bg-apple-accent/20 text-apple-accent text-[9px] font-bold uppercase tracking-widest">
                          Infraestructura
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 tracking-tight">Cómputo de Alto Rendimiento</h3>
                      <p className="text-zinc-400 text-base max-w-lg font-medium">
                        PCs configuradas para software de gestión, garantizando estabilidad 24/7.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </section>

              <section className="mb-16 py-12 bg-apple-gray rounded-[2.5rem] overflow-hidden">
                <div className="max-w-6xl mx-auto px-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
                    <div className="text-center lg:text-left">
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Elige tu industria. <span className="text-apple-sub">Nosotros ponemos la tecnología.</span>
                      </h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Restaurante', 'Tienda Retail', 'Almacén', 'Oficina'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedIndustry(type)}
                          className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ${
                            selectedIndustry === type 
                              ? 'bg-apple-dark text-white shadow-lg scale-105' 
                              : 'bg-white text-apple-dark hover:bg-zinc-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedIndustry}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-apple-border/10"
                      >
                        {getIndustrySolution(selectedIndustry).map((item, i) => (
                          <div key={i} className="px-4 py-4 md:py-0 first:pl-0 last:pr-0 flex items-start gap-4 group">
                            <div className="w-10 h-10 bg-apple-gray rounded-xl flex items-center justify-center text-apple-accent shrink-0 group-hover:scale-110 transition-transform duration-500">
                              {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[15px] mb-1 group-hover:text-apple-accent transition-colors">{item.title}</h4>
                              <p className="text-apple-sub text-[13px] leading-relaxed line-clamp-2">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </section>

              {/* Product Section (Compact Editorial Gallery) */}
              <section ref={productsRef} className="py-24 scroll-mt-24 bg-apple-gray/50">
                <div className="max-w-[1400px] mx-auto px-10 mb-20">
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight text-apple-dark"
                  >
                    Nuestra <span className="text-apple-sub/40">Selección.</span>
                  </motion.h2>
                  <p className="mt-6 text-xl text-apple-sub max-w-xl font-medium leading-relaxed">
                    Hardware de alto rendimiento con un diseño impecable.
                  </p>
                </div>

                {loading ? (
                  <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-[500px] bg-white rounded-xl border border-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="max-w-[1600px] mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, idx) => {
                          // Mock data for the new UI model
                          const mockBrands = ['Lenovo', 'Xiaomi', 'Apple', 'Postec', 'Zebra'];
                          const brand = product.brand || mockBrands[idx % mockBrands.length];
                          const discount = product.discount || (idx % 3 === 0 ? 15 + (idx % 5) : 0);
                          const stock = product.stock || 10 + (idx * 5) % 50;
                          const originalPrice = product.original_price || (discount > 0 ? product.price / (1 - discount/100) : product.price * 1.2);

                          return (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              key={product.id} 
                              className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative group"
                            >
                              {/* Top Actions */}
                              <div className="flex justify-end items-center gap-2 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer text-[#70757a] text-sm hover:text-apple-accent transition-colors">
                                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-apple-accent focus:ring-apple-accent" />
                                  <span>Comparar</span>
                                </label>
                              </div>

                              {/* Product Image */}
                              <div 
                                className="relative h-56 w-full mb-6 flex items-center justify-center cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                              >
                                <img 
                                  src={product.image_url || `https://picsum.photos/seed/${product.id}/400/400`} 
                                  alt={product.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex flex-col flex-grow">
                                <span className="text-[11px] font-bold text-[#70757a] uppercase tracking-tight mb-1">
                                  {brand}®
                                </span>
                                <h3 
                                  className="text-[15px] font-bold text-[#202124] leading-tight mb-2 line-clamp-2 min-h-[38px] cursor-pointer hover:text-apple-accent transition-colors"
                                  onClick={() => setSelectedProduct(product)}
                                >
                                  {product.name}
                                </h3>
                                
                                <div className="flex justify-between items-center text-[11px] text-[#70757a] mb-4">
                                  <span>ID {product.id + 3000}</span>
                                  <span className="font-medium">+{stock} Unid.</span>
                                </div>

                                {/* Price Section */}
                                <div className="mt-auto">
                                  <div className="flex items-center gap-2 mb-1">
                                    {discount > 0 && (
                                      <span className="bg-[#e6f4ea] text-[#1e8e3e] px-1.5 py-0.5 rounded text-[11px] font-bold">
                                        -{discount}%
                                      </span>
                                    )}
                                    <span className="text-sm text-[#70757a] line-through">
                                      S/ {originalPrice.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                  <div className="text-[28px] font-bold text-[#202124] leading-none mb-4">
                                    S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </div>

                                  <div className="flex gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(product);
                                      }}
                                      className="flex-grow bg-[#3c4043] hover:bg-[#202124] text-white py-3 rounded-lg flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.98]"
                                    >
                                      <ShoppingCart size={18} />
                                      Agregar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </section>

              {/* Why POSTEC Section */}
              <section className="py-20 border-t border-apple-border/10">
                <div className="max-w-7xl mx-auto px-10">
                  <h2 className="text-[2rem] md:text-[2.75rem] font-semibold text-center mb-16 tracking-tight">
                    La diferencia está <br />
                    <span className="text-apple-sub text-[1.5rem] md:text-[2.25rem]">en los detalles.</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 bg-apple-gray rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                        <ShieldCheck size={36} className="text-apple-accent" />
                      </div>
                      <h4 className="text-2xl font-semibold mb-4">Calidad Pro</h4>
                      <p className="text-apple-sub text-lg leading-relaxed font-medium">
                        Equipos seleccionados bajo los más altos estándares de durabilidad para el uso comercial intensivo.
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 bg-apple-gray rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                        <Zap size={36} className="text-apple-accent" />
                      </div>
                      <h4 className="text-2xl font-semibold mb-4">Soporte Vital</h4>
                      <p className="text-apple-sub text-lg leading-relaxed font-medium">
                        No te dejamos solo. Nuestro equipo técnico está a un clic de distancia para resolver cualquier eventualidad.
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 bg-apple-gray rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                        <Globe size={36} className="text-apple-accent" />
                      </div>
                      <h4 className="text-2xl font-semibold mb-4">Alcance Nacional</h4>
                      <p className="text-apple-sub text-lg leading-relaxed font-medium">
                        Logística optimizada para llegar a cada rincón del Perú con la rapidez que tu negocio exige.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentTab === 'Soporte' && (
            <motion.div
              key="soporte"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-24"
            >
              <div className="text-center mb-16">
                <h1 className="text-[2.5rem] md:text-[3.5rem] font-semibold tracking-tight mb-4">Soporte POSTEC.</h1>
                <p className="text-xl text-apple-sub max-w-2xl mx-auto">Estamos aquí para ayudarte con cualquier duda o problema técnico.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="apple-card p-8 bg-zinc-50 flex flex-col justify-between h-[400px] border-none">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Chat en vivo</h2>
                    <p className="text-lg text-apple-sub">Habla con un experto de POSTEC en tiempo real.</p>
                  </div>
                  <div className="flex justify-center py-8">
                    <div className="w-20 h-20 bg-apple-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-apple-accent/20">
                      <Zap size={32} />
                    </div>
                  </div>
                  <button className="apple-button w-full py-3 text-lg">Iniciar Chat</button>
                </div>
                <div className="apple-card p-8 bg-zinc-50 flex flex-col justify-between h-[400px] border-none">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Llámanos</h2>
                    <p className="text-lg text-apple-sub">Nuestro equipo está disponible de Lunes a Viernes.</p>
                  </div>
                  <div className="flex justify-center py-8">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                      <Package size={32} />
                    </div>
                  </div>
                  <button className="apple-button w-full py-3 text-lg">Ver Números</button>
                </div>
              </div>

              <div className="apple-card p-12 bg-apple-dark text-white text-center border-none">
                <h2 className="text-3xl font-semibold mb-4">¿Buscas manuales?</h2>
                <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">Encuentra guías de usuario, especificaciones técnicas y más para todos tus productos.</p>
                <button className="bg-white text-apple-dark px-8 py-3 rounded-full font-semibold text-lg hover:bg-zinc-200 transition-colors active:scale-95 transition-transform">
                  Ir a Documentación
                </button>
              </div>
            </motion.div>
          )}

          {currentTab === 'Controladores' && (
            <motion.div
              key="controladores"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="py-24"
            >
              <div className="text-center mb-12">
                <h1 className="text-[2.5rem] md:text-[3.5rem] font-semibold tracking-tight mb-4">Controladores.</h1>
                <p className="text-xl text-apple-sub max-w-2xl mx-auto">Descarga el software más reciente para tus dispositivos POSTEC.</p>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="apple-card overflow-hidden border-none bg-apple-gray/30">
                  <div className="p-8 border-b border-apple-border/20 bg-apple-gray/50">
                    <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-sm">
                      <Search size={20} className="text-apple-sub" />
                      <input 
                        type="text" 
                        placeholder="Busca por modelo o número de serie..."
                        className="flex-1 bg-transparent outline-none text-lg font-medium"
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-apple-border/10">
                    {[
                      { name: 'Driver Impresora Térmica 80mm', version: 'v2.4.1', size: '12MB', date: 'Mar 2024' },
                      { name: 'Driver Lector de Código de Barras 2D', version: 'v1.0.5', size: '4MB', date: 'Feb 2024' },
                      { name: 'Software de Configuración de Cajón', version: 'v3.1.0', size: '8MB', date: 'Ene 2024' },
                      { name: 'Driver Pantalla Táctil POS-15', version: 'v5.2.2', size: '45MB', date: 'Dic 2023' },
                    ].map((driver, i) => (
                      <div key={i} className="p-6 flex items-center justify-between hover:bg-white/50 transition-colors">
                         <div>
                           <h3 className="text-lg font-semibold mb-1">{driver.name}</h3>
                           <p className="text-apple-sub text-sm font-medium">Versión {driver.version} • {driver.size} • {driver.date}</p>
                         </div>
                         <button className="apple-button-secondary text-base group">
                           Descargar <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-apple-gray flex items-center justify-between">
                <h2 className="text-xl font-semibold">Tu bolsa</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-apple-gray rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                    <ShoppingCart size={48} strokeWidth={1.5} />
                    <p className="text-lg">Tu bolsa está vacía.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-24 h-24 bg-apple-gray rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src={`https://picsum.photos/seed/${item.id}/200/200`} alt={item.name} className="max-h-20 object-contain" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <p className="font-semibold text-sm">S/.{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-3 border border-apple-border rounded-lg px-2 py-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="text-zinc-400 hover:text-apple-dark"><Minus size={14} /></button>
                              <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="text-zinc-400 hover:text-apple-dark"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-apple-accent text-xs font-medium hover:underline">Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-8 border-t border-apple-gray">
                      <div className="flex justify-between text-lg font-semibold mb-8">
                        <span>Total</span>
                        <span>S/.{cartTotal.toFixed(2)}</span>
                      </div>
                      
                      <form onSubmit={handleCheckout} className="space-y-4">
                        <input 
                          required
                          type="text" 
                          placeholder="Nombre completo"
                          value={orderForm.name}
                          onChange={e => setOrderForm({...orderForm, name: e.target.value})}
                          className="w-full bg-apple-gray border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-apple-accent transition-all"
                        />
                        <input 
                          required
                          type="tel" 
                          placeholder="WhatsApp"
                          value={orderForm.whatsapp}
                          onChange={e => setOrderForm({...orderForm, whatsapp: e.target.value})}
                          className="w-full bg-apple-gray border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-apple-accent transition-all"
                        />
                        <textarea 
                          required
                          placeholder="Dirección de entrega"
                          value={orderForm.address}
                          onChange={e => setOrderForm({...orderForm, address: e.target.value})}
                          className="w-full bg-apple-gray border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-apple-accent transition-all h-24 resize-none"
                        />
                        <button 
                          disabled={isSubmitting}
                          className="apple-button w-full py-4 text-lg mt-4"
                        >
                          {isSubmitting ? 'Procesando...' : 'Pagar'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setOrderSuccess(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white p-12 rounded-[2rem] max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={40} />
              </div>
              <h2 className="text-3xl font-semibold mb-2 tracking-tight">¡Gracias por tu pedido!</h2>
              <p className="text-zinc-500 mb-8">
                Tu orden <span className="font-semibold text-apple-dark">#{orderSuccess}</span> ha sido recibida. 
                Te hemos redirigido a WhatsApp para completar la transacción.
              </p>
              <button 
                onClick={() => setOrderSuccess(null)}
                className="apple-button w-full"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-apple-dark text-white py-20">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <Logo className="text-white" />
              </div>
              <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
                Líderes en soluciones tecnológicas para puntos de venta en todo el Perú. 
                Ofrecemos equipos de alta calidad con garantía y soporte especializado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-6 uppercase tracking-widest text-zinc-400">Categorías</h4>
              <ul className="space-y-3 text-zinc-300 text-sm">
                {categories.slice(1).map(c => (
                  <li key={c}>
                    <button onClick={() => { setCategory(c); scrollToProducts(); }} className="hover:text-apple-accent transition-colors">
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-6 uppercase tracking-widest text-zinc-400">Contacto</h4>
              <ul className="space-y-3 text-zinc-300 text-sm">
                <li className="flex items-center gap-2">Lima, Perú</li>
                <li className="flex items-center gap-2">WhatsApp: +51 {import.meta.env.VITE_WHATSAPP_NUMBER}</li>
                <li className="flex items-center gap-2">Soporte 24/7</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-zinc-800 text-zinc-500 text-[12px] flex justify-between items-center">
            <p>© 2026 POSTEC Store. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Help Chat */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isHelpMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-white/80 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl mb-2 flex flex-col gap-1 min-w-[220px]"
            >
              {[
                { label: 'Ventas / Info Producto', icon: <Store size={18} />, msg: 'Hola, necesito información sobre un producto.' },
                { label: 'Soporte Técnico', icon: <Zap size={18} />, msg: 'Hola, necesito soporte técnico para mi equipo.' },
                { label: 'Garantía', icon: <ShieldCheck size={18} />, msg: 'Hola, necesito ayuda sobre una garantía.' },
                { label: 'Controladores', icon: <ScrollText size={18} />, msg: 'Hola, necesito ayuda con un controlador.' },
              ].map((option, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const url = `https://wa.me/51900000000?text=${encodeURIComponent(option.msg)}`;
                    window.open(url, '_blank');
                    setIsHelpMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-apple-gray rounded-2xl transition-all text-left group"
                >
                  <div className="text-apple-accent group-hover:scale-110 transition-transform">
                    {option.icon}
                  </div>
                  <span className="text-[14px] font-medium text-zinc-800">{option.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
          className={`p-4 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-500 ${
            isHelpMenuOpen ? 'bg-zinc-900 text-white' : 'bg-apple-accent text-white'
          }`}
        >
          <div className={`transition-transform duration-500 ${isHelpMenuOpen ? 'rotate-45' : ''}`}>
            {isHelpMenuOpen ? <X size={24} /> : <Zap size={24} fill="currentColor" />}
          </div>
          {!isHelpMenuOpen && (
            <span className="font-medium pr-2">¿Necesitas ayuda?</span>
          )}
        </motion.button>
      </div>

      {/* Product Experience View (Apple Style) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto p-4 md:p-12"
          >
            <div className="max-w-6xl mx-auto">
              {/* Navigation Bar */}
              <nav className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-apple-sub text-sm">
                  <button onClick={() => setSelectedProduct(null)} className="hover:text-apple-dark">Home</button>
                  <span>/</span>
                  <span className="text-apple-dark font-medium">{selectedProduct.name}</span>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 hover:bg-apple-gray rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </nav>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="flex flex-col gap-4">
                  <div className="bg-apple-gray rounded-3xl p-8 flex items-center justify-center aspect-square">
                    <img 
                      src={selectedProduct.image_url || `https://picsum.photos/seed/${selectedProduct.id}/1200/800`}
                      alt={selectedProduct.name}
                      className="max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-apple-gray rounded-xl aspect-square border border-apple-border/20" />
                    ))}
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col">
                  <h1 className="text-4xl font-semibold tracking-tight mb-4">{selectedProduct.name}</h1>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl font-semibold">S/ {selectedProduct.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    <span className="text-apple-sub line-through">S/ {(selectedProduct.price * 1.2).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    <span className="bg-apple-dark text-white text-xs px-2 py-1 rounded">-20%</span>
                  </div>
                  
                  <div className="text-apple-sub mb-8 leading-relaxed">
                    {selectedProduct.description}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Color:</label>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-black border-2 border-apple-dark" />
                      <div className="w-8 h-8 rounded-full bg-gray-300" />
                      <div className="w-8 h-8 rounded-full bg-zinc-800" />
                    </div>
                  </div>

                  <div className="flex gap-4 mb-8">
                    <div className="flex items-center border border-apple-border rounded-lg">
                      <button className="px-4 py-2">-</button>
                      <span className="px-4 py-2 font-medium">1</span>
                      <button className="px-4 py-2">+</button>
                    </div>
                    <button 
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-grow bg-[#4A148C] text-white py-3 rounded-lg font-semibold hover:bg-[#311B92] transition-colors"
                    >
                      ADD TO CART
                    </button>
                  </div>
                  
                  <button className="w-full bg-[#FFEB3B] text-black py-3 rounded-lg font-semibold hover:bg-[#FDD835] transition-colors mb-8">
                    BUY NOW
                  </button>

                  <div className="text-sm text-apple-sub">
                    <p>SKU: {selectedProduct.id + 5000}</p>
                    <p>Share: Facebook Twitter Pinterest</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  Clock, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Check, 
  ArrowLeft, 
  Send, 
  Plus, 
  Minus, 
  Cpu, 
  Award,
  Globe,
  Tag,
  ThumbsUp,
  FileText,
  ShoppingBag,
  Smartphone,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  ShoppingCart,
  Image as ImageIcon
} from 'lucide-react';
import { Logo } from './Logo';

const productImages = [
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

export default function ProductLandingPage() {
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev => (prev + 1) % productImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev => (prev - 1 + productImages.length) % productImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);
  
  // Virtual Store States
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'bcp'>('yape');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [yapeOperationCode, setYapeOperationCode] = useState('');
  const [orderStep, setOrderStep] = useState<'idle' | 'sending' | 'confirmed'>('idle');

  // Customer states for Checkout matching proforma/webhook
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const productInfo = {
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
    offerType: "Precio solo Web"
  };

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  // Dynamic calculations
  const unitPrice = productInfo.price;
  const rawSubtotal = unitPrice * quantity;
  
  // Base landing purchases (S/ 203.00 includes IGV)
  const calculatedTotal = rawSubtotal;
  const calculatedSubtotal = calculatedTotal / 1.18;
  const calculatedIGV = calculatedTotal - calculatedSubtotal;

  const handleConfirmPurchase = async () => {
    if (!clientName) {
      alert('Por favor complete su Nombre Completo para registrar su pedido.');
      return;
    }
    if (!clientPhone) {
      alert('Por favor complete su Número de Teléfono/WhatsApp.');
      return;
    }
    if (!deliveryAddress) {
      alert('Por favor complete su Dirección de Entrega para planificar el despacho.');
      return;
    }
    if (paymentMethod === 'yape' && !yapeOperationCode) {
      alert('Por favor coloque el Código o Número de Operación de su Yape para verificar el pago.');
      return;
    }

    setOrderStep('sending');

    const formattedDate = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const purchaseTotalText = calculatedTotal.toFixed(2);
    
    let paymentDetailsText = '';
    if (paymentMethod === 'yape') {
      paymentDetailsText = `*Método de Pago: Yape*\n` +
                           `• *Destino:* Yape al +51 989 007 409 (Joaquin Garcia)\n` +
                           `• *Código de Operación:* ${yapeOperationCode}\n`;
    } else {
      paymentDetailsText = `*Método de Pago: Transferencia BCP*\n` +
                           `• *Destino:* BCP Cuenta Corriente: 191-1875953-0-18 (COPIERMAX EIR.)\n` +
                           `• *Referencia de Operación BCP (opcional):* ${yapeOperationCode || 'Adjuntaré captura de constancia por WhatsApp'}\n`;
    }

    const message = `*📦 NUEVO PEDIDO - TIENDA VIRTUAL POS-TEC 📦*\n\n` +
                    `*Fecha:* ${formattedDate}\n` +
                    `*Cliente:* ${clientName}\n` +
                    `*Celular / WhatsApp:* ${clientPhone}\n` +
                    `*Dirección de Entrega:* ${deliveryAddress}\n\n` +
                    `*Detalle del Equipo:*\n` +
                    `• *Producto:* ${productInfo.fullName}\n` +
                    `• *Cantidad:* ${quantity} unidad(es)\n` +
                    `• *Monto Cobrado:* S/ ${purchaseTotalText} PEN (IGV Incluido)\n\n` +
                    `*Validación de Depósito:*\n` +
                    paymentDetailsText + `\n` +
                    `_Un agente de ventas POS-TEC validará el comprobante de inmediato para despachar el equipo._`;

    // Optionally trigger n8n Webhook directly from localstorage
    const n8nWebhookUrl = localStorage.getItem('n8n_webhook_url') || '';
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'virtual_store_purchase',
            clientName,
            clientPhone,
            deliveryAddress,
            paymentMethod,
            yapeOperationCode,
            total: purchaseTotalText,
            quantity,
            product: "Impresora Térmica POS-STAR WP200",
            date: formattedDate
          })
        });
      } catch (err) {
        console.warn("Fallo envio webhook para compra:", err);
      }
    }

    // Short timeout to simulate system validation and WhatsApp redirection
    setTimeout(() => {
      setOrderStep('confirmed');
      const encodedText = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=51905820448&text=${encodedText}`;
      window.open(url, '_blank');
      setIsOrdered(true);
    }, 1200);
  };

  const handleWhatsAppOrder = () => {
    handleConfirmPurchase();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-apple-accent/10">
      
      {/* Embedded High Fidelity CSS Print Override Ruleset */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: block !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Hide absolutely everything else */
          header, footer, nav, aside, .no-print, .fixed, .sticky, main > *:not(#quote-generator-section) {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          /* Just print the preview canvas container */
          #quote-generator-section {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            border: none !important;
          }
          #quote-left-panel {
            display: none !important;
          }
          #quote-right-preview {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Background Blobs for Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-apple-accent/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-apple-accent/5 blur-[120px]" />
      </div>

      {/* Header (No Regresar Link, strictly premium display) */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#E5E5E7] py-4 px-6 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-apple-accent/10 flex items-center justify-center">
              <Printer className="w-4.5 h-4.5 text-apple-accent" />
            </div>
            <span className="text-sm font-bold tracking-tight text-[#1D1D1F]">WP200 Pro-Edition</span>
          </div>
          <Logo className="h-8" />
          <div className="block">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Oferta Disponible
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1100px] mx-auto px-6 py-12 relative z-10 space-y-16">
        {/* Core Product Presentation Card */}
        <div className="bg-white rounded-[2.5rem] border border-[#E5E5E7] p-6 md:p-12 shadow-2xl shadow-zinc-100 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Premium Interactive Photo Gallery (6 High-Fidelity Photos) */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Main Picture Frame */}
            <div className="relative aspect-square w-full rounded-2xl bg-white border border-[#E5E5E7] overflow-hidden flex items-center justify-center shadow-lg group">
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className="bg-apple-accent text-white font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md shadow-apple-accent/20">
                  {productInfo.offerType}
                </span>
                <span className="bg-[#1D1D1F] text-white font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                  6 Fotos
                </span>
              </div>

              {/* Click to zoom badge */}
              <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md text-[#1D1D1F] font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md border border-[#E5E5E7] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <ImageIcon size={12} className="text-apple-accent animate-pulse" />
                Click para ampliar foto
              </div>

              <motion.div 
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-full cursor-zoom-in relative flex items-center justify-center p-4 bg-zinc-50"
                whileHover={{ scale: 1.015 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <img 
                  src={productImages[activeImageIndex].url} 
                  alt={productImages[activeImageIndex].title} 
                  className="w-full h-full object-cover rounded-xl select-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Thumbnail Selectors (Active border highlighting) */}
            <div className="grid grid-cols-6 gap-2">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-white transition-all duration-200 cursor-pointer ${activeImageIndex === i ? 'border-apple-accent scale-105 shadow-md shadow-apple-accent/15' : 'border-[#E5E5E7] opacity-75 hover:opacity-100 hover:border-zinc-400'}`}
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-black/5 transition-opacity ${activeImageIndex === i ? 'opacity-0' : 'opacity-100'}`} />
                </button>
              ))}
            </div>

            {/* Active Image Title / Context */}
            <div className="bg-[#F5F5F7] p-4 rounded-xl border border-zinc-200/40 text-left">
              <h5 className="font-extrabold text-[#1D1D1F] text-xs uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-apple-accent rounded-full animate-ping" />
                {productImages[activeImageIndex].title}
              </h5>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-1">
                {productImages[activeImageIndex].desc}
              </p>
            </div>
          </div>

          {/* Right Column: Premium Pitch & Features */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-[#1D1D1F] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest leading-none">
                <Tag size={12} className="text-apple-accent" />
                SOPORTE WEB EXCLUSIVO
              </span>
              
              <h1 className="text-3xl md:text-3.5xl font-extrabold tracking-tight leading-tight text-[#1D1D1F]">
                {productInfo.fullName}
              </h1>

              <div className="flex items-end gap-3 pt-2">
                <span className="text-4xl md:text-5xl font-black text-apple-accent tracking-tighter">
                  S/ {productInfo.price.toFixed(2)}
                </span>
                <span className="text-[#86868B] text-sm font-medium line-through mb-1.5">
                  S/ 269.00
                </span>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mb-2 tracking-wider">
                  -24% Desc.
                </span>
              </div>
            </div>

            {/* Quick Specs Checklist */}
            <div className="border-t border-b border-[#E5E5E7] py-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                  <strong>Marca de confianza:</strong> {productInfo.brand} (Modelo industrial WP200 de alto rendimiento).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                  <strong>Tecnología:</strong> Térmica Directa (Cero costos en cartuchos de tinta).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                  <strong>Velocidad Profesional:</strong> 230 mm/s con sistema de autocorte garantizado.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                  <strong>Interfaces integradas:</strong> Entrada USB y puerto telefónico RJ11 para comandar gavetas portamonedas.
                </span>
              </div>
            </div>

            {/* Delivery/Shipping details */}
            <div className="bg-[#F5F5F7] p-5 rounded-2xl grid grid-cols-2 gap-4 border border-zinc-200/40">
              <div className="flex gap-3">
                <div className="p-2.5 bg-white shadow-sm text-apple-accent rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div className="space-y-0.5">
                  <h6 className="font-bold text-xs text-[#1D1D1F]">Envío Nacional</h6>
                  <p className="text-[11px] text-zinc-500 font-medium leading-tight">{productInfo.shipping}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2.5 bg-white shadow-sm text-apple-accent rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div className="space-y-0.5">
                  <h6 className="font-bold text-xs text-[#1D1D1F]">Tiempo Entrega</h6>
                  <p className="text-[11px] text-zinc-500 font-medium leading-tight">{productInfo.deliveryTime}</p>
                </div>
              </div>
            </div>

            {/* Call to Actions - Seamless Desktop & Mobile Rhythm */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans">Monto Unitario Web:</span>
                <span className="text-xl font-extrabold text-[#10B981] font-sans">S/ {unitPrice.toFixed(2)} PEN <span className="text-[10px] text-zinc-400 font-semibold">(IGV Incl.)</span></span>
              </div>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('checkout-area');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full bg-[#10B981] hover:bg-[#07a370] active:scale-[0.982] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/15 font-black text-sm md:text-base tracking-tight transition-all cursor-pointer font-sans"
              >
                🛒 COMPRAR EN TIENDA (Yape / BCP)
              </button>

              <p className="text-center text-[10px] text-zinc-400 font-semibold leading-relaxed max-w-sm mx-auto font-sans">
                Compra protegida. El despacho se programa hoy mismo tras finalizar su orden y se asiste para la conexión en minutos.
              </p>
            </div>

          </div>

        </div>

        {/* SECTION: Ficha Técnica & Ventajas (Guarantees) */}
        {/* Placed prominently here, ABOVE the Checkout Area, ensuring the user reads it before they reach the payment step */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <h4 className="text-lg font-black uppercase tracking-tight text-[#1D1D1F] flex items-center gap-2">
              <Cpu size={20} className="text-apple-accent" />
              Especificaciones & Confianza POS-STAR
            </h4>
            <span className="text-xs text-zinc-450 font-bold hidden sm:inline">Modelo WP200 • Grado Industrial</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Detailed Specs Board */}
            <div className="md:col-span-2 bg-white rounded-[2rem] border border-[#E5E5E7] p-8 shadow-lg flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-apple-accent/5 text-apple-accent rounded-xl">
                    <FileText size={18} />
                  </div>
                  <h3 className="text-base font-bold text-[#1D1D1F]">Ficha Técnica Oficial del Equipo</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Marca autorizada</span>
                    <span className="text-xs font-bold text-[#1D1D1F]">{productInfo.brand}</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Clase de Dispositivo</span>
                    <span className="text-xs font-bold text-[#1D1D1F]">{productInfo.type}</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Interface de Conexión</span>
                    <span className="text-xs font-bold text-[#1D1D1F]">{productInfo.interface}</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Ancho Máximo de Rollo</span>
                    <span className="text-xs font-bold text-[#1D1D1F]">{productInfo.paperSize}</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Velocidad Máxima</span>
                    <span className="text-xs font-bold text-[#1D1D1F]">{productInfo.speed}</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Puerto telefónico RJ11</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check size={14} className="text-emerald-500" />
                      Apertura de gaveta automática
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-dashed border-zinc-200 mt-5 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                <span className="text-[11px] text-zinc-500 font-medium">Controladores oficiales incluidos y soporte de instalación remota.</span>
                <span className="text-[10px] font-bold text-apple-accent uppercase tracking-widest flex items-center gap-1">
                  <Globe size={11} /> POS-STAR ORIGINAL WP200
                </span>
              </div>
            </div>

            {/* Direct Sales Info banner / Highlights */}
            <div className="bg-[#0a0a0a] text-white rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-apple-accent/10 blur-[50px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-apple-accent/5 blur-[50px] translate-y-1/2 -translate-x-1/2" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-apple-accent border border-white/10 rounded-xl">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wide">¿Por qué elegir POS-TEC?</h4>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} />
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold"><strong>Precios importación:</strong> Despachos sin sobrecostos de exhibición física.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} />
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold"><strong>Garantía Real 1 Año:</strong> Cobertura directa del servicio técnico y reposición.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} />
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold"><strong>Envío Inmediato:</strong> Remisión diaria garantizada en agencias líderes del Perú.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 relative z-10 border-t border-white/10 mt-6 flex justify-between items-center text-[9px] text-zinc-500">
                <span>RUC: 20536729659</span>
                <span className="font-mono">POS-TEC © {new Date().getFullYear()}</span>
              </div>
            </div>

          </div>
        </div>

        {/* STANDALONE SECURE E-COMMERCE CART & CHECKOUT SHOP EXPERIENCE */}
        <section id="checkout-area" className="bg-zinc-100 rounded-[2.5rem] p-1.5 md:p-3 shadow-2xl relative overflow-hidden scroll-mt-20">
          
          {orderStep === 'confirmed' ? (
            /* SUCCESS CASE MESSAGE STATE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[2.2rem] text-center p-8 md:p-14 space-y-6 max-w-2xl mx-auto my-6 border border-zinc-200"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Check className="stroke-[3]" size={32} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#1D1D1F] tracking-tight leading-tight font-sans">
                  ¡Pedido Recibido con Éxito!
                </h3>
                <p className="text-sm text-zinc-600 font-bold leading-relaxed max-w-md mx-auto font-sans">
                  Tu comprobante ha sido despachado de forma oficial. Un especialista de soporte programará tu entrega y envío nacional de inmediato por WhatsApp.
                </p>
              </div>

              {/* Dynamic printable receipt ticket */}
              <div className="p-5 bg-[#F5F5F7] rounded-2xl border border-zinc-200 text-left text-xs font-semibold text-zinc-700 space-y-2.5 shadow-inner">
                <div className="font-bold border-b border-dashed border-zinc-300 pb-2 text-center text-zinc-500 uppercase tracking-widest text-[9px] font-sans">Boleta Automatizada POS-TEC</div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60">
                  <span className="text-zinc-400 text-[10px] uppercase font-sans">Titular Comprador:</span>
                  <span className="font-extrabold text-[#1D1D1F] font-sans">{clientName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60">
                  <span className="text-zinc-400 text-[10px] uppercase font-sans">Celular y WSP:</span>
                  <span className="font-mono text-[#1D1D1F]">{clientPhone}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60">
                  <span className="text-zinc-400 text-[10px] uppercase font-sans">Dirección de Despacho:</span>
                  <span className="font-extrabold text-[#1D1D1F] text-right max-w-[220px] truncate font-sans">{deliveryAddress}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60">
                  <span className="text-zinc-400 text-[10px] uppercase font-sans">Abonado vía:</span>
                  <span className="font-bold text-zinc-900 uppercase font-sans">{paymentMethod === 'yape' ? '📱 Yape (Joaquin Garcia)' : '🏦 BCP (COPIERMAX EIR.)'}</span>
                </div>
                {yapeOperationCode && (
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60">
                    <span className="text-purple-600 text-[10px] uppercase font-sans font-bold">Código Operación:</span>
                    <span className="font-mono text-purple-700 font-black">{yapeOperationCode}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-zinc-400 text-[10px] uppercase font-sans">Monto Total Liquidado:</span>
                  <span className="font-black text-emerald-600 text-sm font-sans">S/ {calculatedTotal.toFixed(2)} PEN</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => {
                    const paymentDetailsText = paymentMethod === 'yape' 
                      ? `*Método de Pago: Yape*\n• *Destino:* Yape al +51 989 007 409 (Joaquin Garcia)\n• *Código de Operación:* ${yapeOperationCode}`
                      : `*Método de Pago: Transferencia BCP*\n• *Destino:* BCP Cuenta Corriente: 191-1875953-0-18 (COPIERMAX EIR.)\n• *Referencia Op (opcional):* ${yapeOperationCode || 'Se adjunta captura'}`;

                    const messageText = `*📦 COPIA PEDIDO REGISTRADO - POS-TEC 📦*\n\n` +
                                        `*Fecha:* ${new Date().toLocaleDateString()}\n` +
                                        `*Cliente:* ${clientName}\n` +
                                        `*Teléfono:* ${clientPhone}\n` +
                                        `*Dirección de Entrega:* ${deliveryAddress}\n\n` +
                                        `*Producto:* Impresora Térmica WP200\n` +
                                        `*Cantidad:* ${quantity} unidad(es)\n` +
                                        `*Total:* S/ ${calculatedTotal.toFixed(2)}\n\n` +
                                        `*Validación:*\n${paymentDetailsText}`;
                    const encoded = encodeURIComponent(messageText);
                    window.open(`https://api.whatsapp.com/send?phone=51905820448&text=${encoded}`, '_blank');
                  }}
                  className="bg-[#10B981] hover:bg-[#07a370] text-white py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-sans shadow-md shadow-emerald-500/10"
                >
                  💬 Reabrir Chat con Asesor WSP
                </button>
                <button 
                  onClick={() => { setOrderStep('idle'); setYapeOperationCode(''); }}
                  className="bg-zinc-100 hover:bg-zinc-200 text-[#1D1D1F] py-3.5 px-6 rounded-xl font-bold text-xs transition-all cursor-pointer font-sans"
                >
                  Hacer Otro Pedido
                </button>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE CAR + CHECKOUT STOREFLOW */
            <div className="bg-white rounded-[2.2rem] border border-zinc-200/80 p-6 md:p-10 shadow-lg space-y-8">
              
              {/* E-Commerce Checkout Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-200 font-sans">
                    <Lock size={10} className="text-emerald-600 shrink-0" />
                    Pasarela de Caja 100% Segura
                  </span>
                  <h3 className="text-2xl font-black text-[#1D1D1F] tracking-tight font-sans flex items-center gap-2">
                    <ShoppingCart size={22} className="text-[#10B981]" />
                    Resumen de Pedido y Caja
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Estás procesando tu pedido desde nuestra Tienda Virtual. Modifica la canasta o completa la orden de forma segura.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 border border-zinc-200 rounded-xl px-4 py-2 bg-[#F5F5F7]">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  Soporte Telefónico Listo
                </div>
              </div>

              {/* Two Column Shop layout: Left (Cart Recup) & Right (Formal Despacho) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COLUMN LEFT: Carrito de Compras (5 cols) */}
                <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-200/85 pb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1D1D1F] flex items-center gap-1.5">
                      🛒 Carrito de Compras
                    </h4>
                    <span className="bg-apple-accent text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full select-none">
                      x{quantity} {quantity === 1 ? 'ítem' : 'ítems'}
                    </span>
                  </div>

                  {/* Cart Product Row */}
                  <div className="bg-white border border-zinc-200/80 rounded-xl p-3.5 flex gap-3.5 items-center relative">
                    <div className="w-16 h-16 rounded-lg bg-zinc-100 overflow-hidden relative shrink-0 border border-zinc-200">
                      <img 
                        src={productImages[0].url} 
                        alt="WP200" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">{productInfo.brand}</span>
                      <h5 className="font-extrabold text-xs text-[#1D1D1F] tracking-tight leading-tight">
                        Impresora Térmica WP200 80mm
                      </h5>
                      <p className="text-xs font-black text-[#10B981]">
                        S/ {unitPrice.toFixed(2)} <span className="text-[9px] text-[#86868B] font-semibold">(c/u)</span>
                      </p>
                    </div>

                    {/* Integrated Counter Inside Product */}
                    <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200/80 rounded-full p-0.5 shadow-sm scale-90 origin-right shrink-0">
                      <button 
                        type="button"
                        onClick={handleDecrement}
                        className="w-7 h-7 rounded-full bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-700 font-bold transition-all cursor-pointer"
                        title="Disminuir"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs font-black text-[#1D1D1F] select-none">{quantity}</span>
                      <button 
                        type="button"
                        onClick={handleIncrement}
                        className="w-7 h-7 rounded-full bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-700 font-bold transition-all cursor-pointer"
                        title="Incrementar"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Financial Invoice Details */}
                  <div className="space-y-2 border-t border-zinc-200/85 pt-3.5 text-xs text-zinc-600 font-semibold">
                    <div className="flex justify-between items-center text-zinc-500">
                      <span>Valor de Compra Neto:</span>
                      <span>S/ {calculatedSubtotal.toFixed(2)} PEN</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500">
                      <span>I.G.V. Nacional (18%):</span>
                      <span>S/ {calculatedIGV.toFixed(2)} PEN</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-200/60 pb-3">
                      <span>Despacho Programado:</span>
                      <span className="text-emerald-600 font-bold uppercase tracking-wider">¡Envío Gratuito!</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-[#1D1D1F]">
                      <span className="font-extrabold">Total Facturado Tienda:</span>
                      <span className="text-xl font-black text-[#10B981] tracking-tighter">
                        S/ {calculatedTotal.toFixed(2)} PEN
                      </span>
                    </div>
                  </div>

                  {/* Shop Reassurance Badge */}
                  <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 text-left space-y-1 pointer-events-none select-none">
                    <span className="font-extrabold text-[10px] uppercase text-emerald-800 tracking-wide flex items-center gap-1 leading-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Beneficio Web Disponible Hoy
                    </span>
                    <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">
                      Este precio y despacho express inmediato a la agencia se encuentra reservado. Finaliza tu orden para programarlo.
                    </p>
                  </div>
                </div>

                {/* COLUMN RIGHT: Formalización Despacho y Pago (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* STEP 1: Datos de Entrega */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-450 flex items-center gap-2 border-l-3 border-apple-accent pl-2.5">
                      1. Datos Reservados de Entrega
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Nombre Completo del Titular / Razón Social <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Ej. Carlos García Mendoza" 
                          className="w-full bg-[#F5F5F7]/30 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Número de Celular con WhatsApp <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Ej. 989007409" 
                          className="w-full bg-[#F5F5F7]/30 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Dirección de Despacho Completa <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Ej. Av. Colonial 1200, cercado de Lima / o agencia Shalom" 
                          className="w-full bg-[#F5F5F7]/30 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: Elección de Forma de Pago */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-450 flex items-center gap-2 border-l-3 border-apple-accent pl-2.5">
                      2. Abonar Depósito Oficial de Caja
                    </h4>

                    {/* Pay Tabs toggle controls */}
                    <div className="grid grid-cols-2 gap-2 bg-[#F5F5F7] p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('yape')}
                        className={`py-3.5 px-3 rounded-lg text-xs font-black tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${paymentMethod === 'yape' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10' : 'hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-900'}`}
                      >
                        📱 Yape Directo (Sin comisiones)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('bcp')}
                        className={`py-3.5 px-3 rounded-lg text-xs font-black tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${paymentMethod === 'bcp' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-900'}`}
                      >
                        🏦 Transferencia BCP
                      </button>
                    </div>

                    {paymentMethod === 'yape' ? (
                      /* YAPE PAYMENT DETAILS CARD */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-purple-50/50 border border-purple-200 p-5 rounded-2xl space-y-4 text-left"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 bg-purple-500/10 rounded-xl text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Smartphone size={20} />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-black tracking-widest uppercase text-purple-600 block">Canal Oficial Yape</span>
                            <h6 className="text-[15px] font-black text-purple-950 leading-tight font-sans">Código QR / Celular: +51 989 007 409</h6>
                            <p className="text-xs text-purple-800 font-bold font-sans">Titular de Operaciones: Joaquín Garcia</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-purple-100">
                          <label className="text-[10px] font-black text-purple-800 uppercase tracking-widest block">
                            Ingresa tu Código / Número de Operación de Yape <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            value={yapeOperationCode}
                            onChange={(e) => setYapeOperationCode(e.target.value)}
                            placeholder="Ej. OP: 198275"
                            className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-xs text-purple-950 font-black placeholder-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-inner font-mono"
                          />
                          <p className="text-[9px] text-purple-600 font-semibold leading-relaxed">
                            Abona la suma total de <strong>S/ {calculatedTotal.toFixed(2)}</strong> a Joaquín de forma directa y remite el número de operación arriba para pre-validar tu envío de inmediato.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      /* BCP PAYMENT DETAILS CARD */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-indigo-50/50 border border-indigo-200 p-5 rounded-2xl space-y-4 text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl text-[#005cbb] flex items-center justify-center shrink-0 mt-0.5 font-black text-base">
                            🏦
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-black tracking-widest uppercase text-indigo-600 block">Depósitos Banco BCP</span>
                            <h6 className="text-[14px] font-black text-indigo-950 leading-tight font-mono select-all">Cta Cte: 191-1875953-0-18</h6>
                            <p className="text-xs text-indigo-900 font-bold font-sans">Titular Jurídico: COPIERMAX EIR.</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Cuenta Corriente en Soles del Banco Comercial</p>
                          </div>
                        </div>

                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-250 text-yellow-800 text-[10px] font-bold leading-relaxed">
                          ⚠️ Deberás enviar la constancia de pago al número de WhatsApp de POS-TEC para validar la acreditación bancaria y autorizar el despacho prioritario inmediatamente.
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block">
                            Nro. de Operación o Transferencia BCP (Opcional)
                          </label>
                          <input 
                            type="text"
                            value={yapeOperationCode}
                            onChange={(e) => setYapeOperationCode(e.target.value)}
                            placeholder="Ej. OP-10493 (o déjalo en blanco para enviar foto)"
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-650 transition-all font-sans"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON WITH SECURE SYMBOLS */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
                      <Lock size={12} className="text-emerald-500 shrink-0" />
                      Checkout cifrado de 256 bits. Redirección WSP oficial.
                    </span>

                    <button 
                      onClick={handleConfirmPurchase}
                      disabled={orderStep === 'sending'}
                      className="w-full md:w-auto bg-[#10B981] hover:bg-[#07a370] disabled:bg-zinc-300 text-white font-sans font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 border border-emerald-600 text-sm tracking-tight transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/15 cursor-pointer animate-pulse-subtle"
                    >
                      {orderStep === 'sending' ? (
                        <span>Validando transacción...</span>
                      ) : (
                        <>
                          <Send size={13} className="fill-white" />
                          🔒 COMPLETAR COMPRA EXCELENTE (S/ {calculatedTotal.toFixed(2)})
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
              
            </div>
          )}
        </section>

      </main>

      {/* Dynamic Lightbox Modal for zooming in on click */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-4 md:p-8 select-none no-print"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full cursor-pointer transition-all duration-200 z-[100]"
              title="Cerrar (Esc)"
            >
              <X size={24} />
            </button>

            {/* Main content frame */}
            <div className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center">
              
              {/* Previous Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev - 1 + productImages.length) % productImages.length);
                }}
                className="absolute left-4 md:-left-16 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full cursor-pointer transition-all duration-200 z-[90]"
                title="Anterior"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Main Image */}
              <motion.img 
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={productImages[activeImageIndex].url} 
                alt={productImages[activeImageIndex].title} 
                className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />

              {/* Next Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev + 1) % productImages.length);
                }}
                className="absolute right-4 md:-right-16 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full cursor-pointer transition-all duration-200 z-[90]"
                title="Siguiente"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Captions */}
            <div className="mt-6 text-center max-w-xl px-4 space-y-1">
              <p className="text-white font-extrabold text-sm uppercase tracking-wide">
                {productImages[activeImageIndex].title}
              </p>
              <p className="text-zinc-300 text-xs text-center">
                {productImages[activeImageIndex].desc}
              </p>
              <p className="text-zinc-500 text-[10px] font-mono font-medium pt-2 text-center">
                Imagen {activeImageIndex + 1} de {productImages.length} • Usa ◄ ► o Esc
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust banner */}
      <footer className="bg-white border-t border-[#E5E5E7] py-8 text-center mt-20 relative z-10 no-print">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#86868B] font-medium">Importadores Directos de Tecnología POS para tu Negocio</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Pagos 100% seguros</span>
            <div className="flex gap-1.5">
              <div className="w-8 h-5 bg-[#F5F5F7] rounded border border-zinc-200" />
              <div className="w-8 h-5 bg-[#F5F5F7] rounded border border-zinc-200" />
              <div className="w-8 h-5 bg-[#F5F5F7] rounded border border-zinc-200" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

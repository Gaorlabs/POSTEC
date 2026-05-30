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
  Download,
  ExternalLink,
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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'bcp'>('yape');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [yapeOperationCode, setYapeOperationCode] = useState('');
  const [orderStep, setOrderStep] = useState<'idle' | 'sending' | 'confirmed'>('idle');

  // Customer states for Checkout matching proforma/webhook
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Google Drive Help Guide States
  const [isDriveGuideOpen, setIsDriveGuideOpen] = useState(false);
  const [driveGuideTab, setDriveGuideTab] = useState<'driver' | 'manual'>('driver');

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
    offerType: "Precio solo Web",
    driverUrl: "https://drive.google.com/drive/folders/1_ejemplo_id_carpeta_drivers",
    manualUrl: "https://drive.google.com/file/d/1_ejemplo_id_manual_pdf/view"
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

    setOrderStep('sending');

    const formattedDate = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const purchaseTotalText = calculatedTotal.toFixed(2);
    
    const message = `*📦 NUEVO PEDIDO - TIENDA VIRTUAL POS-TEC 📦*\n\n` +
                    `*Fecha:* ${formattedDate}\n` +
                    `*Cliente:* ${clientName}\n` +
                    `*Celular / WhatsApp:* ${clientPhone}\n` +
                    `*Dirección de Entrega:* ${deliveryAddress}\n\n` +
                    `*Detalle del Equipo:*\n` +
                    `• *Producto:* ${productInfo.fullName}\n` +
                    `• *Cantidad:* ${quantity} unidad(es)\n` +
                    `• *Monto a Pagar:* S/ ${purchaseTotalText} PEN (IGV Incluido)\n\n` +
                    `*Forma de Pago Requerida:* Pagar con Yape o Transferencia Bancaria BCP\n\n` +
                    `_Adjuntaré captura de mi Yape o transferencia BCP por este medio para validar mi pago de inmediato y proceder con el despacho del equipo._`;

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
            paymentMethod: 'yape_bcp_whatsapp',
            yapeOperationCode: 'whatsapp_transfer',
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
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-[#10B981] hover:bg-[#07a370] active:scale-[0.982] text-white py-4.5 px-6 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xl shadow-emerald-500/15 font-black tracking-tight transition-all cursor-pointer font-sans"
              >
                <span className="text-base md:text-lg flex items-center gap-1.5 justify-center">
                  🛒 COMPRAR EN TIENDA ON-LINE
                </span>
                <span className="text-[11px] font-bold opacity-90 text-emerald-100">
                  Aceptamos Yape y Cuentas BCP Directo
                </span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-zinc-400">
                <span className="flex items-center gap-1">📱 Pago con Yape</span>
                <span className="text-zinc-300">•</span>
                <span className="flex items-center gap-1">🏦 Depósito BCP</span>
              </div>

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

                {/* Recursos de Soporte y Descarga de Controladores */}
                <div className="mt-6 pt-5 border-t border-zinc-100 space-y-3.5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      📁 Descarga de Recursos y Soporte Técnico
                    </h4>
                    <button 
                      onClick={() => {
                        setDriveGuideTab('driver');
                        setIsDriveGuideOpen(true);
                      }}
                      className="text-[10px] font-bold text-apple-accent hover:underline flex items-center gap-1 cursor-pointer hover:opacity-85"
                    >
                      💡 Tutorial: ¿Cómo subir con Google Drive?
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={productInfo.driverUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (productInfo.driverUrl.includes('_ejemplo_')) {
                          e.preventDefault();
                          setDriveGuideTab('driver');
                          setIsDriveGuideOpen(true);
                        }
                      }}
                      className="flex items-center gap-3 p-3.5 bg-[#F5F5F7] hover:bg-[#EAEAEF] rounded-2xl border border-zinc-200/40 transition-all hover:scale-[1.01] active:scale-[0.99] group text-left cursor-pointer"
                    >
                      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl group-hover:bg-emerald-200 transition-colors">
                        <Download size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-black text-[#1D1D1F] block leading-snug font-sans flex items-center gap-1">
                          Controladores (Drivers) Windows
                          {productInfo.driverUrl.includes('_ejemplo_') && <span className="text-[8px] font-bold bg-amber-150 text-amber-800 px-1.5 py-0.2 rounded-full shrink-0">Configura</span>}
                        </span>
                        <span className="text-[9px] text-zinc-500 block truncate font-sans">Compatible Win 10 & 11 • Auto-instalador</span>
                      </div>
                    </a>

                    <a
                      href={productInfo.manualUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (productInfo.manualUrl.includes('_ejemplo_')) {
                          e.preventDefault();
                          setDriveGuideTab('manual');
                          setIsDriveGuideOpen(true);
                        }
                      }}
                      className="flex items-center gap-3 p-3.5 bg-[#F5F5F7] hover:bg-[#EAEAEF] rounded-2xl border border-zinc-200/40 transition-all hover:scale-[1.01] active:scale-[0.99] group text-left cursor-pointer"
                    >
                      <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-xl group-hover:bg-indigo-200 transition-colors">
                        <FileText size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-black text-[#1D1D1F] block leading-snug font-sans flex items-center gap-1">
                          Manual de Usuario Oficial PDF
                          {productInfo.manualUrl.includes('_ejemplo_') && <span className="text-[8px] font-bold bg-amber-150 text-amber-800 px-1.5 py-0.2 rounded-full shrink-0">Configura</span>}
                        </span>
                        <span className="text-[9px] text-zinc-500 block truncate font-sans">Guía de instalación con comandos ESC/POS</span>
                      </div>
                    </a>
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

        {/* SECCIÓN FINAL DE COMPRA - BOTÓN GIGANTE DE COBRO (Yape / BCP) */}
        <div className="bg-white rounded-[2.5rem] border border-[#E5E5E7] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
          {/* Subtle Ambient Background Blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-250">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Oferta Garantizada vía Canal Online
            </span>
            
            <h2 className="text-2xl md:text-3.5xl font-extrabold text-[#1D1D1F] tracking-tight leading-tight">
              ¿Listo para potenciar la facturación de tu negocio?
            </h2>

            <p className="text-[#86868B] text-sm md:text-base font-medium leading-relaxed">
              Consigue la Impresora de Boletas Térmicas <strong className="text-[#1D1D1F]">POS-STAR WP200</strong> al mejor precio de importación del Perú. Despacho inmediato de almacén y soporte de configuración total.
            </p>

            {/* Clear Payment Brand Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2 max-w-md mx-auto">
              <div className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl py-3 px-5 flex items-center justify-center gap-2 text-xs font-black text-purple-700">
                <Smartphone size={16} />
                📱 Paga con Cuenta YAPE
              </div>
              <div className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-2xl py-3 px-5 flex items-center justify-center gap-2 text-xs font-black text-indigo-700">
                🏦 Cuenta Corriente BCP
              </div>
            </div>

            {/* Massive Call-to-Action Buy Button */}
            <div className="pt-2">
              <motion.button 
                onClick={() => setIsCheckoutOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-[#10B981] hover:bg-[#07a370] text-white hover:text-white font-sans font-black py-5 md:py-6 px-10 rounded-2.5rem flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 shadow-2xl shadow-emerald-500/25 text-lg md:text-xl tracking-tight transition-all cursor-pointer border-b-4 border-emerald-700"
              >
                <span>🛒 ADQUIRIR EQUIPO EN TIENDA VIRTUAL</span>
                <span className="bg-emerald-950/30 text-emerald-100 text-xs px-3.5 py-1 rounded-full border border-white/10 font-bold uppercase tracking-wider">
                  S/ {unitPrice.toFixed(2)} PEN (Yape / BCP)
                </span>
              </motion.button>
              
              <div className="pt-4 flex items-center justify-center gap-2.5 text-[10px] text-zinc-450 font-bold uppercase tracking-wider">
                <Lock size={12} className="text-[#10B981]" />
                <span>Haz clic para iniciar el proceso de compra automática • Conexión de seguridad SSL</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* MODAL OVERLAY: FULL VIRTUAL STORE CHECKOUT PROCESS FLOW */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[9990] overflow-y-auto no-print flex items-center justify-center p-4">
            
            {/* Dark Blurred Glass Background Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box Frame */}
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#E5E5E7] pointer-events-auto z-10 max-h-[92vh] flex flex-col"
            >
              {/* Visual Decorative Stripe */}
              <div className="h-2 bg-gradient-to-r from-purple-500 via-[#10B981] to-[#005cbb]" />
              
              {/* Header inside Modal */}
              <div className="px-6 md:px-10 pt-8 pb-4 flex items-center justify-between border-b border-zinc-100">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-250 font-sans">
                    <Lock size={10} className="text-emerald-600 shrink-0" />
                    Pasarela de Tienda Virtual Segura
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-[#1D1D1F] tracking-tight font-sans flex items-center gap-2">
                    <ShoppingCart size={22} className="text-[#10B981]" />
                    Resumen de Pedido y Caja
                  </h3>
                </div>
                
                {/* Close Button Button */}
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-zinc-400 hover:text-zinc-650 bg-[#F5F5F7] hover:bg-[#E5E5E7] p-2.5 rounded-full cursor-pointer transition-all duration-200 shrink-0 shadow-sm"
                  title="Regresar a la Tienda"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Modal Content View */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
                
                {orderStep === 'confirmed' ? (
                  /* SUCCESS CASE MESSAGE STATE */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-6 max-w-2xl mx-auto"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                      <Check className="stroke-[3]" size={32} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-[#1D1D1F] tracking-tight leading-tight font-sans">
                        ¡Pedido Recibido con Éxito!
                      </h3>
                      <p className="text-sm text-zinc-600 font-bold leading-relaxed max-w-md mx-auto font-sans">
                        Tu comprobante ha sido despachado de forma oficial. Un especialista de soporte validará tu entrega y envío nacional de inmediato por WhatsApp.
                      </p>
                    </div>

                    {/* Dynamic printable receipt ticket */}
                    <div className="p-5 bg-[#F5F5F7] rounded-2xl border border-zinc-200 text-left text-xs font-semibold text-zinc-700 space-y-2.5 shadow-inner">
                      <div className="font-bold border-b border-dashed border-zinc-300 pb-2 text-center text-zinc-400 uppercase tracking-widest text-[9px] font-sans">Boleta Automatizada POS-TEC</div>
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
                        <span className="font-bold text-zinc-905 uppercase font-sans">Pagar con Yape o Cuenta BCP</span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5">
                        <span className="text-zinc-450 text-[10px] uppercase font-sans">Monto Total Liquidado:</span>
                        <span className="font-black text-emerald-600 text-sm font-sans">S/ {calculatedTotal.toFixed(2)} PEN</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={() => {
                          const messageText = `*📦 COPIA PEDIDO REGISTRADO - POS-TEC 📦*\n\n` +
                                              `*Fecha:* ${new Date().toLocaleDateString()}\n` +
                                              `*Cliente:* ${clientName}\n` +
                                              `*Teléfono:* ${clientPhone}\n` +
                                              `*Dirección de Entrega:* ${deliveryAddress}\n\n` +
                                              `*Producto:* Impresora Térmica WP200\n` +
                                              `*Cantidad:* ${quantity} unidad(es)\n` +
                                              `*Total:* S/ ${calculatedTotal.toFixed(2)}\n\n` +
                                              `*Método de Pago Requerido:* Yape o Transferencia BCP\n` +
                                              `_Adjuntaré captura de constancia de pago por este chat de WhatsApp._`;
                          const encoded = encodeURIComponent(messageText);
                          window.open(`https://api.whatsapp.com/send?phone=51905820448&text=${encoded}`, '_blank');
                        }}
                        className="bg-[#10B981] hover:bg-[#07a370] text-white py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-sans shadow-md shadow-emerald-500/10"
                      >
                        💬 Reabrir Chat con Asesor WSP
                      </button>
                      <button 
                        onClick={() => { setOrderStep('idle'); setIsCheckoutOpen(false); }}
                        className="bg-zinc-100 hover:bg-zinc-200 text-[#1D1D1F] py-3.5 px-6 rounded-xl font-bold text-xs transition-all cursor-pointer font-sans"
                      >
                        Hacer Otro Pedido
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* CART + CHECKOUT STOREFLOW */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
                    
                    {/* COLUMN LEFT: Carrito de Compras (5 cols) */}
                    <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-5">
                      <div className="flex items-center justify-between border-b border-zinc-200/85 pb-3">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1D1D1F] flex items-center gap-1.5">
                          🛒 Carrito de Compras
                        </h4>
                        <span className="bg-[#1D1D1F] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full select-none">
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
                          La tarifa promo con envío Priority Gratis a todo el país estará reservada temporalmente al procesar esta orden.
                        </p>
                      </div>
                    </div>

                    {/* COLUMN RIGHT: Formalización Despacho y Pago (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* STEP 1: Datos de Entrega */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-550 flex items-center gap-2 border-l-3 border-[#10B981] pl-2.5">
                          1. Información para Entrega
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Nombre Completo del Titular <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="Ej. Juan Pérez Alvarado" 
                              className="w-full bg-[#F5F5F7]/30 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Celular con WhatsApp <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="Ej. 989007409" 
                              className="w-full bg-[#F5F5F7]/30 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Dirección Completa o Agencia <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Ej. Av. Arequipa 1234 / Agencia Shalom Chimbote" 
                              className="w-full bg-[#F5F5F7]/30 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* STEP 2: Elección de Forma de Pago Yape u BCP Simplificada */}
                      <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-left">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 font-sans">
                          💳 Formas de Pago Aceptadas
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-purple-500/5 p-3 rounded-xl border border-purple-200/50 flex items-center gap-2 text-[11px] font-black text-purple-700">
                            📱 Yape Directo
                          </div>
                          <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-200/50 flex items-center gap-2 text-[11px] font-black text-indigo-700">
                            🏦 Cuenta BCP
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-650 leading-relaxed font-semibold">
                          💡 <strong className="text-zinc-800">Proceso muy sencillo:</strong> Al hacer clic en el botón de abajo, se creará tu orden automática con envío gratuito a tu dirección y se abrirá nuestro WhatsApp oficial para que puedas enviar tu comprobante de Yape o BCP de forma rápida y segura. ¡Tu despacho se programa al instante!
                        </p>
                      </div>

                      {/* SUBMIT BUTTON WITH SECURE SYMBOLS */}
                      <div className="pt-4 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5">
                          <Lock size={12} className="text-emerald-500 shrink-0" />
                          Pedido rápido sin complicaciones. Conexión SSL segura.
                        </span>

                        <button 
                          onClick={handleConfirmPurchase}
                          disabled={orderStep === 'sending'}
                          className="w-full md:w-auto bg-[#10B981] hover:bg-[#07a370] disabled:bg-zinc-300 text-white font-sans font-black py-4.5 px-8 rounded-2xl flex items-center justify-center gap-2 border border-emerald-600 text-sm tracking-tight transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/15 cursor-pointer"
                        >
                          {orderStep === 'sending' ? (
                            <span>Procesando pedido...</span>
                          ) : (
                            <>
                              🛒 COMPRAR CON YAPE / BCP (S/ {calculatedTotal.toFixed(2)})
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {/* Google Drive Configuration Guide Modal */}
      <AnimatePresence>
        {isDriveGuideOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-md no-print">
            {/* Modal backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setIsDriveGuideOpen(false)}
            />

            {/* Modal container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] border border-[#E5E5E7] p-8 shadow-2xl z-10 flex flex-col gap-6"
            >
              {/* Close pin */}
              <button 
                onClick={() => setIsDriveGuideOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-650 p-2 hover:bg-zinc-100 rounded-full cursor-pointer transition-all"
                title="Cerrar"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest uppercase text-apple-accent block">Soporte Técnico POS-STAR</span>
                <h3 className="text-xl font-extrabold text-[#1D1D1F] tracking-tight">Manual de Configuración con Google Drive</h3>
                <p className="text-xs text-zinc-500">Aprende a alojar y enlazar tus propios archivos gratis usando tu cuenta de Google Drive.</p>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 bg-zinc-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDriveGuideTab('driver')}
                  className={`py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${driveGuideTab === 'driver' ? 'bg-white text-apple-accent shadow-sm' : 'text-zinc-550 hover:text-zinc-800'}`}
                >
                  Drivers Windows
                </button>
                <button
                  type="button"
                  onClick={() => setDriveGuideTab('manual')}
                  className={`py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${driveGuideTab === 'manual' ? 'bg-white text-apple-accent shadow-sm' : 'text-zinc-550 hover:text-zinc-800'}`}
                >
                  Manual de Usuario PDF
                </button>
              </div>

              <div className="space-y-4 text-left">
                {driveGuideTab === 'driver' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-650 font-semibold leading-relaxed">
                      Para que tus clientes descarguen el controlador (Driver) de la impresora <strong>POS-STAR WP200</strong>, sigue estos pasos sencillos:
                    </p>

                    <ol className="text-xs text-zinc-700 space-y-3.5 list-decimal list-inside font-semibold leading-relaxed">
                      <li>
                        <span className="text-zinc-900 font-bold">Sube el archivo comprimido (.zip o .rar)</span> de los controladores de instalación a tu cuenta de <span className="text-[#10B981] font-bold">Google Drive</span>.
                      </li>
                      <li>
                        Haz clic derecho sobre el archivo en Drive y selecciona <span className="text-zinc-900 font-bold">Compartir &gt; Compartir</span>.
                      </li>
                      <li>
                        En el apartado de acceso general, cambia <span className="bg-zinc-150 px-1.5 py-0.5 rounded text-zinc-800 font-mono text-[10px]">Restringido</span> a <span className="text-emerald-700 font-bold">"Cualquier persona con el enlace"</span> (en rol de Lector).
                      </li>
                      <li>
                        Haz clic en el botón <span className="text-[#1D1D1F] font-bold">Copiar enlace</span> y presiona "Hecho".
                      </li>
                      <li>
                        Abre el archivo de código <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800 font-mono text-[9px] font-medium">/src/components/ProductLandingPage.tsx</code> y actualiza la propiedad <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-amber-800 font-mono text-[9px]">driverUrl</code> dentro del objeto <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-900 font-mono text-[9px]">productInfo</code> (línea 111 de este archivo).
                      </li>
                    </ol>

                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-semibold leading-relaxed">
                      📌 <strong className="font-bold">Ejemplo de Enlace:</strong> Debe verse similar a:<br />
                      <span className="font-mono text-[10px] text-zinc-500 select-all block mt-1 break-all bg-white p-2 rounded border border-zinc-200">https://drive.google.com/drive/folders/1A_B_C_D_E...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-650 font-semibold leading-relaxed">
                      Sigue estas instrucciones para enlazar el manual de usuario oficial en formato PDF para la ticketera de 80mm:
                    </p>

                    <ol className="text-xs text-zinc-700 space-y-3.5 list-decimal list-inside font-semibold leading-relaxed">
                      <li>
                        <span className="text-zinc-900 font-bold">Sube el manual de usuario en formato PDF</span> a tu espacio personal de <span className="text-blue-600 font-bold">Google Drive</span>.
                      </li>
                      <li>
                        Haz clic derecho sobre el archivo PDF en Drive y escoge <span className="text-zinc-900 font-bold">Compartir &gt; Compartir</span>.
                      </li>
                      <li>
                        Asegúrate de que los permisos estén establecidos en <span className="text-emerald-700 font-bold">"Cualquier persona con el enlace puede ver"</span> (Lector).
                      </li>
                      <li>
                        Haz clic en <span className="text-[#1D1D1F] font-bold">Copiar enlace</span>.
                      </li>
                      <li>
                        Abre el archivo de código <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800 font-mono text-[9px] font-medium">/src/components/ProductLandingPage.tsx</code> y reemplaza la propiedad <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-amber-800 font-mono text-[9px]">manualUrl</code> en el objeto <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-900 font-mono text-[9px]">productInfo</code> (línea 112 de este archivo).
                      </li>
                    </ol>

                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-semibold leading-relaxed">
                      📌 <strong className="font-bold">Ejemplo de Enlace PDF:</strong> Debe verse similar a:<br />
                      <span className="font-mono text-[10px] text-zinc-500 select-all block mt-1 break-all bg-white p-2 rounded border border-zinc-200">https://drive.google.com/file/d/1X_Y_Z.../view</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 font-sans">
                <button 
                  type="button"
                  onClick={() => setIsDriveGuideOpen(false)}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
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

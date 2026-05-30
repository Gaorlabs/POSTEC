import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Copy
} from 'lucide-react';
import { Logo } from './Logo';

export default function ProductLandingPage() {
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  
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
          
          {/* Left Column: Premium Interactive Mockup / Product Visual */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square w-full rounded-3xl bg-gradient-to-tr from-zinc-50 to-zinc-100 border border-zinc-200/60 overflow-hidden flex items-center justify-center p-8 group shadow-lg"
            >
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-apple-accent text-white font-bold text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md shadow-apple-accent/20">
                  {productInfo.offerType}
                </span>
              </div>

              {/* High-quality vector representation/mock of POS-STAR WP200 printer */}
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                <motion.div 
                  className="w-48 h-48 bg-zinc-900 rounded-[2rem] shadow-2xl relative flex flex-col justify-between p-4 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {/* Printer details */}
                  <div className="h-6 w-full bg-zinc-800 rounded-lg flex items-center justify-between px-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">POS-STAR</div>
                  </div>
                  
                  {/* Paper slot & receipt */}
                  <div className="relative my-2 w-full flex flex-col items-center">
                    <div className="w-full h-2.5 bg-zinc-950 rounded-full border-t border-zinc-700 relative z-20 shadow-inner" />
                    {/* Paper sheet printing out */}
                    <motion.div 
                      key={quantity}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-[85%] bg-white border border-zinc-200 shadow-md p-3 text-[7px] text-zinc-900 rounded-b-md relative z-10 flex flex-col gap-1 select-none"
                    >
                      <div className="font-bold border-b border-dashed border-zinc-300 pb-1 text-center">TICKET COMPRA</div>
                      <div className="flex justify-between">
                        <span>{productInfo.brand} WP200</span>
                        <span>S/ {productInfo.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-apple-accent">
                        <span>Cant: x{quantity}</span>
                        <span>S/ {calculatedTotal.toFixed(2)}</span>
                      </div>
                      <div className="text-center opacity-60 pt-1 text-[5px]">¡Envío 12-72 horas a todo el Perú!</div>
                    </motion.div>
                  </div>

                  {/* Feed and Power buttons */}
                  <div className="flex justify-between items-center mt-2 px-2">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 active:bg-zinc-700" />
                  </div>
                </motion.div>

                {/* Styled connection port indicators */}
                <div className="flex gap-4 mt-8 opacity-60">
                  <span className="text-[10px] bg-zinc-200 px-2.5 py-1 rounded-md font-mono tracking-tight text-zinc-700">{productInfo.interface}</span>
                  <span className="text-[10px] bg-zinc-200 px-2.5 py-1 rounded-md font-mono tracking-tight text-zinc-700">{productInfo.paperSize}</span>
                </div>
              </div>
            </motion.div>

            {/* Quality Seals / Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-apple-accent/10 rounded-xl text-apple-accent shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#1D1D1F]">Garantía Corporativa</h5>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">Soporte técnico directo.</p>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#1D1D1F]">Calidad POS-STAR</h5>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">Marca certificada.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Pitch & Features */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-[#1D1D1F] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest leading-none">
                <Tag size={12} className="text-apple-accent" />
                PRECIO WEB EXCLUSIVO
              </span>
              
              <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight leading-tight text-[#1D1D1F]">
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
                  <strong>Marca reconocida:</strong> {productInfo.brand} (Modelo industrial WP200).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                  <strong>Tecnología:</strong> Térmica Directa (No requiere tinta o cartucho costoso).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                  <strong>Velocidad Extrema:</strong> 230 mm/s con sistema de corte automático premium.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                  <strong>Conectividad total:</strong> Interfaz USB y puerto telefónico RJ11 para apertura de gaveta de dinero automática.
                </span>
              </div>
            </div>

            {/* Delivery/Shipping details */}
            <div className="bg-[#F5F5F7] p-5 rounded-3xl grid grid-cols-2 gap-4 border border-zinc-200/40">
              <div className="flex gap-3">
                <div className="p-2.5 bg-white shadow-sm text-apple-accent rounded-xl shrink-0 h-10 w-10 flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div className="space-y-0.5">
                  <h6 className="font-bold text-xs text-[#1D1D1F]">Despacho Nacional</h6>
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

            {/* Call to Actions - Dedicated Scroll anchor for perfect mobile/desktop rhythm */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans">Precio Especial Web:</span>
                <span className="text-xl font-extrabold text-[#10B981] font-sans">S/ {calculatedTotal.toFixed(2)} PEN <span className="text-[10px] text-zinc-400 font-semibold font-sans">(IGV Incl.)</span></span>
              </div>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('checkout-area');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full bg-[#10B981] hover:bg-[#07a370] active:scale-[0.98] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/15 font-black text-sm md:text-base tracking-tight transition-all cursor-pointer font-sans"
              >
                🛒 COMPRAR AHORA (Yape / BCP)
              </button>

              <p className="text-center text-[10px] text-zinc-400 font-semibold leading-relaxed max-w-xs mx-auto font-sans">
                No arriesgues tu inversión. Al hacer tu pedido, un especialista te atenderá de forma inmediata por WhatsApp y programará el despacho hoy mismo.
              </p>
            </div>

          </div>

        </div>

        {/* Detailed Technical Specs Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Detailed Specs Board */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-[#E5E5E7] p-8 md:p-10 shadow-lg flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-apple-accent/5 text-apple-accent rounded-xl">
                  <Cpu size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">Ficha Técnica Detallada</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#F5F5F7] rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Marca</span>
                  <span className="text-sm font-bold text-[#1D1D1F]">{productInfo.brand}</span>
                </div>
                <div className="p-4 bg-[#F5F5F7] rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo de Equipo</span>
                  <span className="text-sm font-bold text-[#1D1D1F]">{productInfo.type}</span>
                </div>
                <div className="p-4 bg-[#F5F5F7] rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Interfaz de Conexión</span>
                  <span className="text-sm font-bold text-[#1D1D1F]">{productInfo.interface}</span>
                </div>
                <div className="p-4 bg-[#F5F5F7] rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tamaño Máximo de Papel</span>
                  <span className="text-sm font-bold text-[#1D1D1F]">{productInfo.paperSize}</span>
                </div>
                <div className="p-4 bg-[#F5F5F7] rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Velocidad Máxima</span>
                  <span className="text-sm font-bold text-[#1D1D1F]">{productInfo.speed}</span>
                </div>
                <div className="p-4 bg-[#F5F5F7] rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Puerto RJ11</span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                    <Check size={16} className="text-emerald-500" />
                    Compatible con Gaveta
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-dashed border-zinc-200 mt-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
              <span className="text-xs text-zinc-500 font-medium">¿Deseas soporte o controladores? Pídelos al ordenar.</span>
              <span className="text-xs font-bold text-apple-accent uppercase tracking-widest flex items-center gap-1">
                <Globe size={14} /> pos-star wp200 wifi/usb
              </span>
            </div>
          </div>

          {/* Direct Sales Info banner / Highlights */}
          <div className="bg-[#0a0a0a] text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-apple-accent/10 blur-[50px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-apple-accent/5 blur-[50px] translate-y-1/2 -translate-x-1/2" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 text-apple-accent border border-white/10 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <h4 className="text-lg font-bold">¿Por qué comprar aquí?</h4>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium"><strong>Precio solo Web:</strong> Ofrecemos los mejores precios directo de importación sin intermediarios físicos.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium"><strong>Garantía Real:</strong> Tu compra incluye 1 año de garantía de fábrica y asesoría al conectar de forma remota.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium"><strong>Envío Express:</strong> Gestión inmediata del despacho hacia agencias nacionales (Olva, Shalom, Marvisur).</p>
                </div>
              </div>
            </div>

            <div className="pt-8 relative z-10 border-t border-white/10 mt-6">
              <p className="text-[10px] text-zinc-500 text-center font-medium font-mono">POS-TEC © {new Date().getFullYear()}</p>
            </div>
          </div>

        </div>

        {/* Standalone Interactive Purchase Checkout Area */}
        <section id="checkout-area" className="bg-white rounded-[2.5rem] border border-[#E5E5E7] p-6 md:p-10 shadow-2xl relative overflow-hidden scroll-mt-20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none animate-pulse" />
          
          {orderStep === 'confirmed' ? (
            /* SUCCESS CASE MESSAGE STATE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8 space-y-6 max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Check className="stroke-[3]" size={32} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-zinc-905 tracking-tight leading-tight font-sans">
                  ¡Pago exitoso! 
                </h3>
                <p className="text-sm text-zinc-650 font-bold leading-relaxed font-sans">
                  En breve se comunicará un asesor de ventas por WhatsApp (WSP) para coordinar el envío de su equipo de inmediato.
                </p>
              </div>

              {/* Dynamic printable receipt ticket */}
              <div className="p-5 bg-zinc-50 rounded-3xl border border-zinc-200 text-left text-xs font-semibold text-zinc-700 space-y-2.5 shadow-inner">
                <div className="font-bold border-b border-dashed pb-2 text-center text-zinc-500 uppercase tracking-widest text-[10px] font-sans">Copia de Pedido Registrado</div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-zinc-450 text-[10px] uppercase font-sans">Cliente:</span>
                  <span className="font-extrabold text-zinc-900 font-sans">{clientName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-zinc-450 text-[10px] uppercase font-sans">Contacto:</span>
                  <span className="font-mono text-zinc-900">{clientPhone}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-zinc-450 text-[10px] uppercase font-sans">Dirección de Entrega:</span>
                  <span className="font-extrabold text-zinc-900 text-right max-w-[200px] truncate font-sans">{deliveryAddress}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-zinc-455 text-[10px] uppercase font-sans">Método Pago:</span>
                  <span className="font-bold text-zinc-900 uppercase font-sans">{paymentMethod === 'yape' ? 'Yape (Joaquin Garcia)' : 'Banco BCP (COPIERMAX EIR.)'}</span>
                </div>
                {paymentMethod === 'yape' && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-zinc-450 text-[10px] uppercase font-sans">Código Operación:</span>
                    <span className="font-mono text-purple-600 font-bold">{yapeOperationCode}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-zinc-450 text-[10px] uppercase font-sans">Total del Pedido:</span>
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
                  className="bg-[#10B981] hover:bg-[#07a370] text-white py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
                >
                  💬 Reabrir WhatsApp del Asesor
                </button>
                <button 
                  onClick={() => { setOrderStep('idle'); setYapeOperationCode(''); }}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-3 px-6 rounded-xl font-bold text-xs transition-all cursor-pointer font-sans"
                >
                  Hacer Otro Pedido
                </button>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE CHECKOUT FORM STATE */
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
                <div>
                  <span className="bg-emerald-500/10 text-emerald-700 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 font-sans">
                    Soporte de Envío Asegurado
                  </span>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight mt-2.5 font-sans">
                    Formulario de Pedido Web
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed font-sans">
                    Llena los datos para formalizar el despacho inmediato de tu Impresora Térmica POS-STAR WP200.
                  </p>
                </div>
                
                {/* Dynamically calculated price label inside checkout */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-left md:text-right shrink-0 min-w-[200px]">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-sans">Total estimado a pagar</span>
                  <span className="text-3xl font-black text-[#10B981] block mt-0.5 select-none font-sans">
                    S/ {calculatedTotal.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-bold block mt-0.5 font-sans">IGV 18% Incluido (S/ {calculatedIGV.toFixed(2)} PEN)</span>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-[#10B981] border-l-4 border-[#10B981] pl-3 font-sans">
                    1. Datos de Entrega
                  </h4>

                  {/* Quantity selector inside process */}
                  <div className="flex items-center justify-between bg-[#F8F9FA] border p-4.5 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest block leading-none font-sans">Cantidad</span>
                      <span className="text-xs text-zinc-500 font-semibold mt-1 block font-sans">Equipos: S/ 203.00 c/u</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-full p-1 shadow-sm">
                      <button 
                        onClick={handleDecrement}
                        className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-750 font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-extrabold text-[#1D1D1F] select-none font-sans">{quantity}</span>
                      <button 
                        onClick={handleIncrement}
                        className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-750 font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Tu Nombre Completo / Razón Social <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Carlos García" 
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all shadow-inner font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Teléfono / WhatsApp de Contacto <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ej. 989007409" 
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all shadow-inner font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block font-sans">Dirección de Entrega Completa <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Ej. Jr. Huancavelica 450, Cercado de Lima" 
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all shadow-inner font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Select Payment Method */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-[#10B981] border-l-4 border-[#10B981] pl-3 font-sans">
                    2. Elige tu Forma de Pago
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-200">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('yape')}
                      className={`py-3 px-3 rounded-xl text-xs font-black tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${paymentMethod === 'yape' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900'}`}
                    >
                      <span>📱 Yape</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('bcp')}
                      className={`py-3 px-3 rounded-xl text-xs font-black tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans ${paymentMethod === 'bcp' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900'}`}
                    >
                      <span>🏦 Cuenta BCP</span>
                    </button>
                  </div>

                  {paymentMethod === 'yape' ? (
                    /* YAPE PAYMENT DETAILS */
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-50/50 border border-purple-200 p-5 rounded-3xl space-y-4 text-left"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Smartphone size={20} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black tracking-widest uppercase text-purple-600 font-sans">Instrucciones de Yape</span>
                          <h6 className="text-[15px] font-black text-purple-950 leading-tight font-sans">Yapea al +51 989 007 409</h6>
                          <p className="text-xs text-purple-855 font-bold font-sans">Titular: Joaquin garcia</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-purple-100">
                        <label className="text-[10px] font-black text-purple-700 uppercase tracking-widest block font-sans">
                          Ingresa tu Código de Pago / Operación <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          value={yapeOperationCode}
                          onChange={(e) => setYapeOperationCode(e.target.value)}
                          placeholder="Ej. OP: 198275"
                          className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-xs text-purple-950 font-black placeholder-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm font-sans font-mono"
                        />
                        <p className="text-[10px] text-purple-500 font-semibold leading-relaxed font-sans">
                          Por favor yapee la suma correspondiente de S/ {calculatedTotal.toFixed(2)} y coloque el código arriba para remitir su pedido.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* BCP PAYMENT DETAILS */
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-50/50 border border-indigo-200 p-5 rounded-3xl space-y-4 text-left"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl text-[#005cbb] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          🏦
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black tracking-widest uppercase text-indigo-600 font-sans">Transferencia BCP Directa</span>
                          <h6 className="text-[14px] font-black text-indigo-950 leading-tight select-all font-mono">191-1875953-0-18</h6>
                          <p className="text-xs text-indigo-855 font-bold font-sans">Titular: COPIERMAX EIR.</p>
                          <p className="text-xs text-zinc-500 font-sans">Cuenta Corriente Soles</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-800 text-[11px] font-bold leading-relaxed font-sans">
                        ⚠️ Deberás enviar la constancia de pago al número de WhatsApp del Pos-Tec para poder coordinar de inmediato el envío de tu equipo y confirmar el pago.
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block font-sans">
                          Nro. de Operación BCP (opcional)
                        </label>
                        <input 
                          type="text"
                          value={yapeOperationCode}
                          onChange={(e) => setYapeOperationCode(e.target.value)}
                          placeholder="Ej. OP-10493 (o déjalo vacío para enviar foto en el chat)"
                          className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm font-sans"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button 
                  onClick={handleConfirmPurchase}
                  disabled={orderStep === 'sending'}
                  className="w-full md:w-auto bg-[#10B981] hover:bg-[#07a370] disabled:bg-zinc-300 text-white py-4 px-8 rounded-2xl flex items-center justify-center gap-2.5 border border-emerald-600 font-black text-sm tracking-tight transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer font-sans"
                >
                  {orderStep === 'sending' ? (
                    <span>Procesando Pedido...</span>
                  ) : (
                    <>
                      <Send size={14} className="fill-white" />
                      Enviar Pedido Exitoso (S/ {calculatedTotal.toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

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

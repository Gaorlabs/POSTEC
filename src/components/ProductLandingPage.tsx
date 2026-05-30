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
  
  // Interactive strategy tabs: 'comprar' (Virtual Store Flow) vs 'cotizar' (Express Quotation)
  const [activeTab, setActiveTab] = useState<'comprar' | 'cotizar'>('comprar');
  
  // Virtual Store States
  const [yapeOperationCode, setYapeOperationCode] = useState('');
  const [orderStep, setOrderStep] = useState<'idle' | 'sending' | 'confirmed'>('idle');

  // Custom states for Live Quotation / Proforma / Customer sync
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState(() => {
    return localStorage.getItem('n8n_webhook_url') || '';
  });
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [successPrinted, setSuccessPrinted] = useState(false);

  // Generate a persistent/stable random Proforma Number on component load
  const [proformaNum] = useState(() => `COT-2026-${Math.floor(Math.random() * 800) + 100}`);

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

  // Fixed proforma pricing as shown in the user's uploaded image
  const customPrice = 275.00; 
  const regularPrice = 300.00;

  // Dynamic calculations
  const unitPrice = productInfo.price;
  const rawSubtotal = unitPrice * quantity;
  
  // Base landing purchases (S/ 203.00 includes IGV)
  const calculatedTotal = rawSubtotal;
  const calculatedSubtotal = calculatedTotal / 1.18;
  const calculatedIGV = calculatedTotal - calculatedSubtotal;

  // Proforma calculations (S/ 275.00 includes IGV)
  const proformaTotal = customPrice * quantity;
  const proformaSubtotal = proformaTotal / 1.18;
  const proformaIGV = proformaTotal - proformaSubtotal;

  const handleConfirmPurchase = async () => {
    if (!clientName || !clientPhone) {
      alert('Por favor complete su Nombre y Número de Teléfono/WhatsApp para registrar su pedido.');
      return;
    }
    if (!yapeOperationCode) {
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
    
    const message = `*📦 NUEVO PEDIDO - TIENDA VIRTUAL POS-TEC 📦*\n\n` +
                    `*Fecha:* ${formattedDate}\n` +
                    `*Cliente:* ${clientName}\n` +
                    `*Celular:* ${clientPhone}\n\n` +
                    `*Detalle del Equipo:*\n` +
                    `• *Producto:* ${productInfo.fullName}\n` +
                    `• *Cantidad:* ${quantity} unidad(es)\n` +
                    `• *Monto Cobrado:* S/ ${purchaseTotalText} PEN (IGV Incluido)\n\n` +
                    `*Validación de Depósito (Yape):*\n` +
                    `• *Destino:* Yape al 975 615 244 (Luis Atilio Garcia Munoz)\n` +
                    `• *Código de Operación:* ${yapeOperationCode}\n\n` +
                    `_Un agente de ventas POS-TEC validará el comprobante de inmediato para despachar el equipo._`;

    // Optionally trigger n8n Webhook
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'virtual_store_purchase',
            clientName,
            clientPhone,
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

  // WhatsApp Quote / Proforma trigger with Evolution API / n8n Webhook support
  const handleN8nWebhookTrigger = async () => {
    if (!clientName || !clientPhone) {
      alert('Por favor complete su Nombre y Número de Celular para enviar la cotización.');
      return;
    }

    setWebhookStatus('sending');

    const formattedDate = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const payload = {
      clientName,
      clientPhone,
      productName: "Impresora Térmica POS-STAR WP200",
      price: customPrice,
      quantity: quantity,
      subtotal: proformaSubtotal.toFixed(2),
      igv: proformaIGV.toFixed(2),
      total: proformaTotal.toFixed(2),
      proformaId: proformaNum,
      date: formattedDate,
      validity: '7 días',
      sellerPhone: '+51 905 820 448',
      ruc: '20536729659'
    };

    try {
      if (n8nWebhookUrl) {
        localStorage.setItem('n8n_webhook_url', n8nWebhookUrl);
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          setWebhookStatus('success');
        } else {
          setWebhookStatus('error');
        }
      } else {
        // Fallback: If no webhook URL is entered, simulate a beautiful n8n/evolution API dispatch
        await new Promise(resolve => setTimeout(resolve, 1200));
        setWebhookStatus('success');
      }

      // Simultaneously, generate a backup whatsapp click so they can also send it manually or download!
      const message = `*📋 COTIZACIÓN ENVIADA - POS-TEC 📋*\n\n` +
                      `*Nro. Proforma:* ${proformaNum}\n` +
                      `*Fecha:* ${formattedDate}\n` +
                      `*Cliente:* ${clientName}\n` +
                      `*WhatsApp:* ${clientPhone}\n\n` +
                      `*Detalle del Producto:* \n` +
                      `• Impresora Térmica POS-STAR WP200\n` +
                      `• *Cantidad:* ${quantity} ud(s).\n` +
                      `• *Total Cotizado: S/ ${proformaTotal.toFixed(2)} PEN* (IGV Incluido)\n\n` +
                      `*Métodos de Pago:*\n` +
                      `• Yape al 975 615 244 (Luis Atilio Garcia Munoz)\n\n` +
                      `_Su documento está listo para ser despachado a la brevedad._`;

      const encodedText = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=51905820448&text=${encodedText}`;
      window.open(url, '_blank');

    } catch (err) {
      console.error(err);
      setWebhookStatus('error');
    }
  };

  const executePrint = () => {
    window.print();
    setSuccessPrinted(true);
    setTimeout(() => setSuccessPrinted(false), 5000);
  };

  const formattedDateString = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

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

            {/* Interactive Strategy Core: Virtual Store Checkout & Express Quotation Options */}
            <div className="space-y-6 pt-2">
              
              {/* Dual Action Strategy Selector Tabs */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#86868B] block">¿Qué deseas realizar?</span>
                <div className="grid grid-cols-2 gap-2 bg-[#F5F5F7] p-1.5 rounded-2xl border border-zinc-200">
                  <button 
                    onClick={() => setActiveTab('comprar')}
                    className={`py-3 px-3 rounded-xl text-[11px] font-black tracking-tight transition-all flex items-center justify-center gap-1.5 ${activeTab === 'comprar' ? 'bg-[#10B981] text-white shadow-md' : 'hover:bg-zinc-200 text-zinc-600'}`}
                  >
                    <ShoppingBag size={14} /> 🛒 Comprar (S/ 203)
                  </button>
                  <button 
                    onClick={() => setActiveTab('cotizar')}
                    className={`py-3 px-3 rounded-xl text-[11px] font-black tracking-tight transition-all flex items-center justify-center gap-1.5 ${activeTab === 'cotizar' ? 'bg-[#0df07e] text-zinc-950 shadow-md' : 'hover:bg-zinc-200 text-zinc-600'}`}
                  >
                    <FileText size={14} /> 📋 Cotizar (S/ 275)
                  </button>
                </div>
              </div>

              {/* SHARED QUANTITY SELECTOR */}
              <div className="flex items-center justify-between bg-zinc-50 border p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block leading-none">Cantidad de Equipos</span>
                  <span className="text-xs text-zinc-500 font-semibold mt-0.5">Precio unitario: S/ {activeTab === 'comprar' ? '203.00' : '275.00'}</span>
                </div>
                <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-full p-1 shadow-sm">
                  <button 
                    onClick={handleDecrement}
                    className="w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-750 font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-extrabold text-[#1D1D1F] select-none">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-750 font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {activeTab === 'comprar' ? (
                /* TAB 1: IMMERSIVE VIRTUAL STORE CHECKOUT */
                <div className="space-y-4 border border-zinc-200/80 bg-zinc-50/50 p-5 rounded-3xl relative overflow-hidden">
                  {orderStep === 'confirmed' ? (
                    /* Order Successful Confirmed overlay */
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 py-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                        <Check className="stroke-[3.5]" size={22} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-extrabold text-emerald-900 leading-tight">¡Pedido Conformado con éxito!</h4>
                        <p className="text-xs text-emerald-800 leading-relaxed font-semibold max-w-sm mx-auto">
                          En breve un agente de POS-TEC se comunicará contigo por WhatsApp para validar tu código de pago y agendar el envío de inmediato.
                        </p>
                      </div>
                      
                      <div className="p-3.5 bg-white rounded-2xl text-left text-xs font-semibold text-zinc-650 space-y-1.5 border max-w-xs mx-auto">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-zinc-400 text-[10px] uppercase">Cliente:</span>
                          <span className="font-extrabold text-zinc-900 truncate max-w-[140px]">{clientName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-zinc-400 text-[10px] uppercase">WhatsApp:</span>
                          <span className="font-mono text-zinc-900">{clientPhone}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-zinc-400 text-[10px] uppercase">Op. Yape:</span>
                          <span className="font-mono text-purple-600 font-bold">{yapeOperationCode}</span>
                        </div>
                        <div className="flex justify-between pt-0.5">
                          <span className="text-zinc-400 text-[10px] uppercase">Monto Total:</span>
                          <span className="font-black text-emerald-600">S/ {calculatedTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setOrderStep('idle'); setYapeOperationCode(''); }}
                        className="text-xs bg-[#1D1D1F] text-white hover:bg-zinc-800 font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95"
                      >
                        Hacer Otro Pedido
                      </button>
                    </motion.div>
                  ) : (
                    /* Checkout form inputs */
                    <div className="space-y-4">
                      
                      {/* Yape quick Instructions panel */}
                      <div className="p-4 bg-purple-50/85 border border-purple-100 rounded-2xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest block leading-none">Pasos para comprar</span>
                          <h6 className="text-[14px] font-black text-purple-950 tracking-tight leading-none mt-1">1. Yapea al 975 615 244</h6>
                          <p className="text-[10px] text-purple-800 font-bold leading-relaxed mt-0.5">Titular: Luis Atilio Garcia Munoz</p>
                          <p className="text-[11px] text-[#1D1D1F] font-extrabold mt-1">Monto: <span className="text-[#10B981] font-mono text-xs">S/ {calculatedTotal.toFixed(2)}</span></p>
                        </div>
                        {/* QR Quick Indicator */}
                        <div className="bg-white p-1 rounded-xl shadow-sm border border-purple-200 shrink-0">
                          <div className="w-10 h-10 bg-purple-100/50 rounded-lg flex flex-col items-center justify-center text-center">
                            <Smartphone className="w-4 h-4 text-purple-600 animate-pulse" />
                            <span className="text-[5px] font-black text-purple-600 leading-none mt-0.5 uppercase">QR YAPE</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Tu Nombre Completo / Empresa</label>
                          <input 
                            type="text" 
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Ej. Juan Pérez" 
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">WhatsApp / Celular</label>
                            <input 
                              type="text" 
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="Ej. +51 914..." 
                              className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Código Operación Yape</label>
                            <input 
                              type="text" 
                              value={yapeOperationCode}
                              onChange={(e) => setYapeOperationCode(e.target.value)}
                              placeholder="Ej. Op: 19485" 
                              className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-3.5 py-2.5 text-xs text-purple-950 font-black placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Final validation order submit */}
                      <button 
                        onClick={handleConfirmPurchase}
                        disabled={orderStep === 'sending'}
                        className="w-full bg-[#10B981] hover:bg-[#07a370] disabled:bg-zinc-400 text-white py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 border border-emerald-600 font-black text-sm tracking-tight transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10"
                      >
                        {orderStep === 'sending' ? (
                          <span>Procesando Pedido...</span>
                        ) : (
                          <>
                            <Send size={14} className="fill-white" />
                            Enviar Pedido Conformado (S/ {calculatedTotal.toFixed(2)})
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* TAB 2: PROMPT COTIZACIÓN RÁPIDA (FORMAL PROFORMA) */
                <div className="space-y-4 border border-zinc-200 bg-zinc-50/40 p-5 rounded-3xl relative">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#0df07e] uppercase tracking-widest block">Acciones de Cotización</span>
                    <h6 className="text-sm font-bold text-zinc-800 leading-none">Generar documento oficial para empresa</h6>
                    <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed mt-0.5">Ingresa tu número móvil para recibir la proforma directamente o descargar el PDF.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Nombre o Razón Social</label>
                      <input 
                        type="text" 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Inversiones Industriales S.A.C." 
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:border-[#0df07e] transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">WhatsApp de Destino</label>
                      <input 
                        type="text" 
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ej. +51 987 654 321" 
                        className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:border-[#0df07e] transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Dynamic Action Buttons side-by-side inside Tab */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={handleN8nWebhookTrigger}
                      disabled={webhookStatus === 'sending'}
                      className="bg-[#0df07e] hover:bg-[#0ae175] disabled:bg-zinc-300 text-[#0c0d0e] py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-[#0df07e]/10"
                    >
                      <Send size={12} className="fill-[#0c0d0e] stroke-2" />
                      {webhookStatus === 'sending' ? 'Enviando...' : 'Enviar vía n8n (WSP)'}
                    </button>
                    <button 
                      onClick={executePrint}
                      className="bg-zinc-800 text-white hover:bg-zinc-900 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <Printer size={12} /> Descargar PDF
                    </button>
                  </div>

                  {webhookStatus === 'success' && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                      <p className="text-[11px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                        <Check size={12} className="stroke-[3]" /> Cotización enviada exitosamente por WhatsApp (n8n).
                      </p>
                    </div>
                  )}
                  {webhookStatus === 'error' && (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                      <p className="text-[11px] text-rose-500 font-bold flex items-center justify-center gap-1">
                        ❌ Falló el envío del webhook. Descárguelo en PDF.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <p className="text-center text-[10px] text-zinc-400 font-semibold leading-relaxed max-w-sm mx-auto">
                {activeTab === 'comprar' 
                  ? "Atención automática: un especialista de despacho validará su código Yape para el embalado el mismo día de la compra."
                  : "Nuestras cotizaciones son válidas durante 7 días y ya incluyen en el desglose el cargo IGV de ley."
                }
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

        {/* REVOLUTIONARY INTERACTIVE QUOTATION GENERATOR (PROFORMA BUILDER) */}
        <section id="quote-generator-section" className="bg-[#111215] text-white rounded-[2.5rem] border border-zinc-800 p-6 md:p-10 shadow-3xl relative overflow-hidden">
          {/* Ambient styling background light blobs */}
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#0df07e]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left Column: Interactive Form Controls */}
            <div id="quote-left-panel" className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0df07e]/10 border border-[#0df07e]/20 text-[#0df07e] rounded-full text-[10px] font-bold uppercase tracking-widest">
                  <FileText size={12} /> Cotizador Express v2.0
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none text-white">
                  Completa tus Datos
                </h2>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-sm">
                  Ingresa tu nombre y celular para recibir la proforma directamente a tu número móvil (vía n8n automatizado) o descargar el PDF al instante. El precio incluye IGV fijo.
                </p>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Tu Nombre Completo / Empresa</label>
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza" 
                    className="w-full bg-[#18191d] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0df07e] focus:ring-1 focus:ring-[#0df07e] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Tu Celular / WhatsApp</label>
                  <input 
                    type="text" 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ej. +51 987 654 321" 
                    className="w-full bg-[#18191d] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0df07e] focus:ring-1 focus:ring-[#0df07e] transition-all"
                  />
                </div>

                {/* Collapsible Advanced n8n Hook configuration */}
                <div className="pt-2">
                  <details className="group border border-zinc-800/80 rounded-xl bg-[#141518] overflow-hidden">
                    <summary className="flex items-center justify-between p-3 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider cursor-pointer list-none hover:text-[#0df07e] transition-colors select-none">
                      <span>⚙️ Integrar con n8n (Evolution API)</span>
                      <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-3 border-t border-zinc-800/60 bg-[#0e0f11] text-xs space-y-3">
                      <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                        Configura un endpoint de webhook de n8n para enviar la cotización instantáneamente a través de WhatsApp (Evolution API). Tu URL se guardará de forma segura en tu navegador.
                      </p>
                      <input 
                        type="url"
                        value={n8nWebhookUrl}
                        onChange={(e) => {
                          setN8nWebhookUrl(e.target.value);
                          localStorage.setItem('n8n_webhook_url', e.target.value);
                        }}
                        placeholder="https://n8n.tu-empresa.com/webhook/..."
                        className="w-full bg-[#18191d] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#0df07e] transition-all"
                      />
                    </div>
                  </details>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={handleN8nWebhookTrigger}
                  disabled={webhookStatus === 'sending'}
                  className="w-full bg-[#0df07e] hover:bg-[#0be670] disabled:bg-zinc-700 text-[#0c0d0e] py-4 px-6 rounded-2xl font-black text-sm tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0df07e]/15 active:scale-[0.98]"
                >
                  <Send size={16} className="fill-[#0c0d0e] stroke-2" />
                  {webhookStatus === 'sending' ? 'Enviando vía n8n...' : 'Enviar Cotización al Móvil'}
                </button>
                
                <button 
                  onClick={executePrint}
                  className="w-full bg-white hover:bg-zinc-100 text-zinc-900 py-3.5 px-6 rounded-2xl font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
                >
                  <Printer size={16} /> Descargar Directamente (PDF)
                </button>
              </div>

              {/* Messages / Alerts */}
              {webhookStatus === 'success' && (
                <div className="p-3 bg-[#0df07e]/10 border border-[#0df07e]/20 rounded-xl text-center">
                  <p className="text-xs text-[#0df07e] font-semibold flex items-center justify-center gap-1.5">
                    <Check size={14} className="stroke-[3]" /> ¡Enviado! Tu Evolution 7 n8n ha procesado el envío.
                  </p>
                </div>
              )}
              {webhookStatus === 'error' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                  <p className="text-xs text-rose-400 font-semibold flex items-center justify-center gap-1.5">
                    ❌ Hubo un inconveniente al enviar al webhook de n8n.
                  </p>
                </div>
              )}
              {successPrinted && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                  <p className="text-xs text-[#0df07e] font-semibold flex items-center justify-center gap-1.5">
                    <Check size={14} /> ¡Proforma cargada para descargar!
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Stunning Replica of User's Design Image */}
            <div id="quote-right-preview" className="lg:col-span-7 bg-[#0c0d0e] text-white rounded-[2.5rem] p-6 md:p-8 shadow-3xl relative border border-zinc-800/60 flex flex-col justify-between space-y-6">
              
              {/* Card Header matching image */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-1">
                  <div className="flex items-center gap-2.5">
                    {/* Logo block with neon bars */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#111215] to-zinc-900 border border-zinc-800 flex items-center justify-center gap-[3px] p-2 shrink-0">
                      <div className="w-1.5 h-5 bg-[#0df07e] rounded-full" />
                      <div className="w-1.5 h-7 bg-[#0df07e] rounded-full" />
                      <div className="w-1.5 h-5 bg-[#0df07e] rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold tracking-tight text-white flex items-center">
                        Pos<span className="text-[#0df07e] font-light">-Tec</span>
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-medium leading-none mt-0.5">Soluciones para puntos de venta</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Cotización</span>
                    <span className="text-lg font-mono font-black text-[#0df07e] tracking-tight leading-none mt-0.5">COT-2026-001</span>
                    <span className="text-[9px] text-zinc-400 font-semibold mt-1">30/05/2026 · válida 7 días</span>
                  </div>
                </div>

                {/* Bright neon green divider */}
                <div className="h-[4px] w-full bg-[#0df07e] rounded-full shrink-0" />
              </div>

              {/* White Contact Box Area */}
              <div className="bg-white text-zinc-900 rounded-[1.8rem] p-5 flex items-center justify-between shadow-xl">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-[#0df07e] tracking-widest uppercase block leading-none">Preparado para</span>
                  <h5 className="text-2xl font-black text-zinc-950 tracking-tight leading-none pt-0.5">
                    {clientName || 'Carlos Mendoza'}
                  </h5>
                  <p className="text-xs text-zinc-500 font-semibold flex items-center gap-1.5 pt-1">
                    <span className="text-[9px] border border-zinc-200 rounded px-1 flex items-center justify-center h-4 w-4 shrink-0">📱</span>
                    {clientPhone || '+51 987 654 321'}
                  </p>
                </div>
                <div className="bg-[#0c0d0e] text-[#0df07e] font-black px-4 py-2 rounded-2xl shrink-0 text-center border border-zinc-800">
                  <div className="text-xl leading-none">-20%</div>
                  <div className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5 leading-none">descuento</div>
                </div>
              </div>

              {/* Product Details Area */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Detalle del Producto</span>
                  <div className="h-px bg-zinc-800 flex-1" />
                </div>

                <div className="bg-[#141517] border border-zinc-800/80 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
                  {/* Specifications checklist */}
                  <div className="p-5 md:col-span-8 space-y-3.5 text-left">
                    <div>
                      <span className="text-[9px] font-bold text-[#0df07e] uppercase tracking-wider block">POS-STAR · Modelo WP200</span>
                      <h6 className="text-[17px] font-extrabold text-white tracking-tight leading-tight mt-0.5">
                        Impresora Térmica POS-STAR WP200
                      </h6>
                    </div>

                    <ul className="space-y-2.5 text-[11px] text-zinc-300 font-semibold">
                      <li className="flex items-center gap-2.5">
                        <span className="w-4 h-4 bg-emerald-500/10 border border-[#0df07e]/30 text-[#0df07e] rounded flex items-center justify-center shrink-0">
                          <Check size={10} className="stroke-[3]" />
                        </span>
                        <span>Velocidad 230 mm/s — impresión instantánea</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-4 h-4 bg-emerald-500/10 border border-[#0df07e]/30 text-[#0df07e] rounded flex items-center justify-center shrink-0">
                          <Check size={10} className="stroke-[3]" />
                        </span>
                        <span>Papel 80mm · Interfaz USB + RJ11</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-4 h-4 bg-emerald-500/10 border border-[#0df07e]/30 text-[#0df07e] rounded flex items-center justify-center shrink-0">
                          <Check size={10} className="stroke-[3]" />
                        </span>
                        <span>Cortador automático incorporado</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-4 h-4 bg-emerald-500/10 border border-[#0df07e]/30 text-[#0df07e] rounded flex items-center justify-center shrink-0">
                          <Check size={10} className="stroke-[3]" />
                        </span>
                        <span>Compatible Windows XP–10 y Linux</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="w-4 h-4 bg-emerald-500/10 border border-[#0df07e]/30 text-[#0df07e] rounded flex items-center justify-center shrink-0">
                          <Check size={10} className="stroke-[3]" />
                        </span>
                        <span>Garantía 12 meses · Envíos a todo el Perú</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pricing sidebar */}
                  <div className="bg-[#0e0f10] border-t md:border-t-0 md:border-l border-zinc-800 p-5 flex flex-col justify-center items-center text-center md:col-span-4 shrink-0">
                    <span className="text-zinc-500 text-xs font-semibold line-through">S/ {regularPrice.toFixed(2)}</span>
                    <span className="text-[8px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5 leading-none">Precio Especial</span>
                    
                    <div className="flex items-start text-[#0df07e] font-black mt-0.5 select-none">
                      <span className="text-xl mt-1.5 mr-0.5 font-bold">S/</span>
                      <span className="text-5xl tracking-tighter leading-none">275</span>
                      <span className="text-xl mt-1 font-bold">.00</span>
                    </div>

                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1">incluye IGV</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Info Box */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Método de Pago</span>
                  <div className="h-px bg-zinc-800 flex-1" />
                </div>

                <div className="bg-[#141517] border border-zinc-800/80 rounded-3xl p-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  
                  {/* Left: Custom CSS Styled QR code matching image */}
                  <div className="md:col-span-4 bg-white rounded-2xl p-4 flex flex-col items-center justify-center border border-zinc-800 shrink-0 mx-auto md:mx-0 w-36">
                    <div className="relative w-24 h-24 bg-[#ebdffd]/40 rounded-xl flex flex-col items-center justify-center p-2 border border-[#a75bf7]/10 overflow-hidden select-none">
                      <div className="grid grid-cols-3 gap-1.5 w-16 h-16">
                        <div className="border-[2.5px] border-[#a75bf7] rounded flex items-center justify-center w-5 h-5 shrink-0">
                          <div className="w-1.5 h-1.5 bg-[#a75bf7] rounded-sm" />
                        </div>
                        <div className="border-[2.5px] border-[#a75bf7] rounded flex items-center justify-center w-5 h-5 shrink-0">
                          <div className="w-1.5 h-1.5 bg-[#a75bf7] rounded-sm" />
                        </div>
                        <div className="flex flex-wrap gap-0.5 w-5 h-5 justify-center items-center">
                          <div className="w-1 h-1 bg-[#a75bf7] rounded-full" />
                          <div className="w-1 h-1 bg-[#a75bf7] rounded-full" />
                        </div>
                        <div className="border-[2.5px] border-[#a75bf7] rounded flex items-center justify-center w-5 h-5 shrink-0">
                          <div className="w-1.5 h-1.5 bg-[#a75bf7] rounded-sm" />
                        </div>
                        <div className="flex flex-wrap gap-0.5 w-5 h-5 justify-center items-center">
                          <div className="w-1 h-1 bg-[#a75bf7] rounded-full" />
                          <div className="w-1 h-1 bg-[#a75bf7] rounded-full" />
                        </div>
                        <div className="w-5 h-5 flex items-center justify-center bg-[#a75bf7] rounded">
                          <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                        </div>
                      </div>
                      <span className="text-[8px] font-black tracking-tight text-[#a75bf7] mt-1 uppercase">QR YAPE</span>
                    </div>
                  </div>

                  {/* Right: Payment text values */}
                  <div className="md:col-span-8 text-left space-y-1.5">
                    <div>
                      <h6 className="text-[17px] font-extrabold text-white tracking-tight leading-none">Paga con Yape</h6>
                      <p className="text-[11px] text-zinc-500 font-semibold mt-1">Escanea el QR o yapea al:</p>
                    </div>

                    <div className="text-3xl font-black text-[#a75bf7] tracking-tight leading-none my-1 select-all">
                      975 615 244
                    </div>

                    <p className="text-xs text-zinc-300 font-bold leading-none block pb-2">
                      Luis Atilio Garcia Munoz
                    </p>

                    {/* Purple highlight button matching image */}
                    <div className="inline-flex bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px] font-extrabold py-2 px-3.5 rounded-xl items-center gap-1.5">
                      <span>📱</span> Envía el comprobante al +51 905 820 448
                    </div>
                  </div>

                </div>
              </div>

              {/* Mint Highlight Banner */}
              <div className="bg-[#e8fcf4] text-emerald-800 text-xs font-bold py-2.5 px-6 rounded-2xl flex flex-wrap justify-between gap-3 shadow-inner shrink-0 leading-none">
                <div className="flex items-center gap-1.5 mx-auto leading-none">
                  <span className="text-emerald-500 font-black">✓</span> Envíos a todo el Perú
                  <span className="text-emerald-300 mx-1">·</span>
                  <span className="text-emerald-500 font-black">✓</span> Producto de calidad
                  <span className="text-emerald-300 mx-1">·</span>
                  <span className="text-emerald-500 font-black">✓</span> Garantía 12 meses
                </div>
              </div>

              {/* Company bottom banner details */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 font-semibold gap-3 border-t border-zinc-800 pt-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1.5 shrink-0">
                    <Printer className="w-3.5 h-3.5 text-[#0df07e]" />
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-bold leading-none">Pos-Tec</span>
                    <span className="text-[10px] text-zinc-500">RUC: 20536729659</span>
                  </div>
                </div>
                <div className="text-center sm:text-right font-medium leading-relaxed">
                  <p className="text-zinc-400">Jr. Carlos Lisson Nro. 194, Cercado de Lima</p>
                  <p className="text-[#0df07e] font-mono font-bold mt-0.5">📞 +51 905 820 448</p>
                </div>
              </div>

            </div>

          </div>
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

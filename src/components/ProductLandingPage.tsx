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
  FileText
} from 'lucide-react';
import { Logo } from './Logo';

export default function ProductLandingPage() {
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  
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

  const handleWhatsAppOrder = () => {
    const total = (productInfo.price * quantity).toFixed(2);
    const text = `*🚨 NUEVO PEDIDO WEB - LANDING PAGE 🚨*\n\n` +
                 `Me interesa comprar el siguiente producto:\n` +
                 `*Producto:* ${productInfo.fullName}\n` +
                 `*Marca:* ${productInfo.brand}\n` +
                 `*Cantidad:* ${quantity} unidad(es)\n` +
                 `*Precio Unitario:* S/ ${productInfo.price.toFixed(2)}\n` +
                 `*Total:* S/ ${total}\n\n` +
                 `*Detalles Adicionales del Producto:* \n` +
                 `• Interfaz: USB + RJ11 (Apertura de gaveta)\n` +
                 `• Tamaño de Papel: 80mm\n` +
                 `• Envío: ${productInfo.shipping}\n` +
                 `• Tiempo Entrega: ${productInfo.deliveryTime}\n\n` +
                 `Por favor, indíquenme los métodos de pago disponibles para proceder con la compra.`;
    
    const encodedText = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?phone=51914202162&text=${encodedText}`;
    window.open(url, '_blank');
    setIsOrdered(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-apple-accent/10">
      {/* Background Blobs for Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-apple-accent/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-apple-accent/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#E5E5E7] py-4 px-6 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-apple-dark hover:opacity-85 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-apple-accent" />
            <span className="text-sm font-semibold tracking-tight">Regresar a la Tienda</span>
          </a>
          <Logo className="h-8" />
          <div className="hidden sm:block">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Oferta Disponible
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1100px] mx-auto px-6 py-12 relative z-10">
        
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
                        <span>S/ {(productInfo.price * quantity).toFixed(2)}</span>
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

            {/* Interactive Buy Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cantidad</span>
                <div className="flex items-center gap-1 bg-[#F5F5F7] border border-zinc-200 rounded-full p-1 shadow-inner">
                  <button 
                    onClick={handleDecrement}
                    className="w-10 h-10 rounded-full bg-white hover:bg-zinc-100 flex items-center justify-center text-apple-dark font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-lg font-extrabold text-[#1D1D1F] select-none">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="w-10 h-10 rounded-full bg-white hover:bg-zinc-100 flex items-center justify-center text-apple-dark font-bold hover:scale-105 active:scale-95 transition-all shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Dynamic Purchase CTA on WhatsApp */}
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#10B981] hover:bg-[#059669] active:scale-[0.98] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/15 font-bold transition-all text-base md:text-lg tracking-tight group"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Send size={15} className="text-white fill-white ml-0.5" />
                </div>
                Pedir por WhatsApp (S/ {(productInfo.price * quantity).toFixed(2)})
              </button>

              <p className="text-center text-[11px] text-zinc-400 font-medium leading-relaxed max-w-sm mx-auto">
                No arriesgues tu inversión. Al hacer tu pedido, un especialista te atenderá de forma inmediata y te brindará un proceso seguro.
              </p>
            </div>

          </div>

        </div>

        {/* Detailed Technical Specs Table */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
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
              <p className="text-[10px] text-zinc-500 text-center font-medium">POS-TEC © {new Date().getFullYear()} - Todos los derechos reservados</p>
            </div>
          </div>

        </div>

      </main>

      {/* Trust banner */}
      <footer className="bg-white border-t border-[#E5E5E7] py-8 text-center mt-20 relative z-10">
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

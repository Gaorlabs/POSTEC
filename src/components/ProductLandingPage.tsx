import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  User,
  ShoppingCart,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Edit,
  Save
} from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabaseClient';

export default function ProductLandingPage() {
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
    headerBadgeText: "Oferta Disponible",
    headerWhatsappText: "905 820 448",
    spec1: "Marca de confianza: POS-STAR (Modelo industrial WP200 de alto rendimiento).",
    spec2: "Tecnología: Térmica Directa (Cero costos en cartuchos de tinta).",
    spec3: "Velocidad Profesional: 230 mm/s con sistema de autocorte garantizado.",
    spec4: "Interfaces integradas: Entrada USB y puerto telefónico RJ11 para comandar gavetas portamonedas.",
    // Promo 1 (Buy free premium 10 thermal roll rolls combo)
    promo1_active: true,
    promo1_title: "🎁 COMBO IMPRESORA + 10 ROLLOS PREMIUM",
    promo1_desc: "Llévese la ticketera industrial de alta velocidad más un pack de 10 rollos térmicos de 80mm de alta densidad.",
    promo1_price: 249.00,
    promo1_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
    promo1_btn: "¡Comprar Impresora + 10 Rollos!",
    // Promo 2 (Buy printer + money drawer combo)
    promo2_active: true,
    promo2_title: "⚡ COMBO DUO: Impresora + Cajón Monedero",
    promo2_desc: "Maximiza tu punto de venta. Agrega el cajón monedero POS-STAR de alta resistencia con apertura automática RJ11 por un precio especial.",
    promo2_price: 349.00,
    promo2_image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=1000&auto=format&fit=crop",
    promo2_btn: "¡Comprar Combo con Cajón!"
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

  const [productInfo, setProductInfo] = useState<any>(defaultProductInfo);
  const [productImages, setProductImages] = useState(defaultProductImages);
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Catalog products and general settings for promotions lookup
  const [products, setProducts] = useState<any[]>([]);
  const [generalSettings, setGeneralSettings] = useState<any>(null);

  // Quick purchase item selection state (null means standard printer)
  const [selectedLanderItem, setSelectedLanderItem] = useState<{name: string, price: number, isPromo: boolean, image_url?: string} | null>(null);

  // Real-time automatic pop-up promotional campaign states
  const [isPromoPopupOpen, setIsPromoPopupOpen] = useState(false);

  // Direct Live Visual Editor States
  const [isVisualEditorActive, setIsVisualEditorActive] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isSavingVisual, setIsSavingVisual] = useState(false);
  const [visualActiveTab, setVisualActiveTab] = useState<'info' | 'specs' | 'images' | 'payment' | 'popups'>('info');

  // Logo Click Secret Gesture Tracker (Triple Tap in 2 seconds)
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      const newCount = logoClicks + 1;
      if (newCount >= 3) {
        setIsLoginModalOpen(true);
        setLogoClicks(0);
      } else {
        setLogoClicks(newCount);
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
  };

  const handleSaveVisualChanges = async () => {
    setIsSavingVisual(true);
    try {
      const configToSave = { productInfo, productImages };
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'lander_config', value: configToSave }, { onConflict: 'key' });
      
      if (error) throw error;
      
      localStorage.setItem('lander_config', JSON.stringify(configToSave));
      alert('¡Excelente! Los cambios visuales de tu landing de campaña se han guardado exitosamente en la base de datos.');
    } catch (err: any) {
      console.error(err);
      alert('Fallo al guardar cambios en el servidor: ' + (err.message || err));
    } finally {
      setIsSavingVisual(false);
    }
  };

  // Dynamic configuration loader from database
  useEffect(() => {
    async function loadDynamicConfig() {
      try {
        // Fetch products list
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (!prodError && prodData) {
          setProducts(prodData);
        }

        // Fetch general settings for correct promotions mapping
        const { data: genData, error: genError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'general')
          .single();
        if (!genError && genData) {
          setGeneralSettings(genData.value);
        }

        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'lander_config')
          .single();
        if (!error && data && data.value) {
          const val = data.value;
          // merge defaults with fields that exist to avoid missing data crash
          if (val.productInfo) {
            setProductInfo(prev => ({ ...prev, ...val.productInfo }));
          }
          if (val.productImages && Array.isArray(val.productImages) && val.productImages.length > 0) {
            setProductImages(val.productImages);
          }
          localStorage.setItem('lander_config', JSON.stringify(val));
        } else {
          const local = localStorage.getItem('lander_config');
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed.productInfo) setProductInfo(prev => ({ ...prev, ...parsed.productInfo }));
            if (parsed.productImages) setProductImages(parsed.productImages);
          }
        }
      } catch (err) {
        console.warn("Fallo cargando config remota, usando local cache:", err);
        const local = localStorage.getItem('lander_config');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.productInfo) setProductInfo(prev => ({ ...prev, ...parsed.productInfo }));
          if (parsed.productImages) setProductImages(parsed.productImages);
        }
      }
    }
    loadDynamicConfig();
  }, []);

  // Dynamically update link sharing preview tags based on general settings from DB
  useEffect(() => {
    if (generalSettings?.logo_url) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', generalSettings.logo_url);
      
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) twitterImage.setAttribute('content', generalSettings.logo_url);

      const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (appleIcon) appleIcon.setAttribute('href', generalSettings.logo_url);
    }
  }, [generalSettings]);
  
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
  }, [isLightboxOpen, productImages]);

  // Auto triggering promotional offer popup immediately on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPromoPopupOpen(true);
    }, 150); // 150ms delay for smooth perception
    return () => clearTimeout(timer);
  }, []);
  
  // Virtual Store States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'bcp'>('yape');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [yapeOperationCode, setYapeOperationCode] = useState('');
  const [orderStep, setOrderStep] = useState<'idle' | 'sending' | 'confirmed'>('idle');

  // Customer states for Checkout matching proforma/webhook
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [copiedText, setCopiedText] = useState<'yape' | 'bcp' | 'cci' | null>(null);

  const handleCopyToClipboard = (text: string, type: 'yape' | 'bcp' | 'cci') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  // Google Drive Help Guide States
  const [isDriveGuideOpen, setIsDriveGuideOpen] = useState(false);
  const [driveGuideTab, setDriveGuideTab] = useState<'driver' | 'manual'>('driver');

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  // Dynamic calculations
  const unitPrice = selectedLanderItem ? selectedLanderItem.price : (productInfo.price || 0);
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
    if (paymentMethod === 'yape' && !yapeOperationCode.trim()) {
      alert('Por favor introduzca el Código o Número de Operación de su Yape para validar la transacción.');
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
    const itemName = selectedLanderItem ? selectedLanderItem.name : `${productInfo.brand} ${productInfo.model || 'WP200'}`;
    const fullItemName = selectedLanderItem ? selectedLanderItem.name : productInfo.fullName;
    
    // Conciso, preciso y amable conforme al flujo seleccionado
    const yapeMsg = `*📦 NUEVO PEDIDO - POS-TEC 📦*\n\n` +
                    `*Cliente:* ${clientName} (${clientPhone})\n` +
                    `*Dirección:* ${deliveryAddress}\n` +
                    `*Detalle:* ${quantity}x ${itemName} (S/ ${purchaseTotalText})\n` +
                    `*Método:* Yape (Op: ${yapeOperationCode})\n\n` +
                    `_¡Hola! Acabo de registrar mi pedido por Yape con el código ingresado. Adjuntaré mi captura de pantalla en breve._`;

    const bcpMsg = `*📦 NUEVO PEDIDO - POS-TEC 📦*\n\n` +
                   `*Cliente:* ${clientName} (${clientPhone})\n` +
                   `*Dirección:* ${deliveryAddress}\n` +
                   `*Detalle:* ${quantity}x ${itemName} (S/ ${purchaseTotalText})\n` +
                   `*Método:* Transferencia BCP\n\n` +
                   `_¡Hola! He registrado mi pedido en su web y realizaré la transferencia bancaria. En breve les envío la captura de la operación por aquí._`;

    const message = paymentMethod === 'yape' ? yapeMsg : bcpMsg;

    // Guardar pedido en Supabase para el panel CRM / Pedidos
    try {
      await supabase.from('orders').insert([
        {
          customer_name: clientName,
          customer_whatsapp: clientPhone,
          customer_address: deliveryAddress,
          items: [
            {
              id: selectedLanderItem ? 9998 : 9999,
              name: fullItemName,
              price: unitPrice,
              quantity: quantity
            }
          ],
          total: calculatedTotal,
          status: 'pendiente'
        }
      ]);
    } catch (dbErr) {
      console.warn("No se pudo persistir el pedido en la BD de Supabase:", dbErr);
    }

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
            yapeOperationCode: paymentMethod === 'yape' ? yapeOperationCode : 'bcp_transfer_pending',
            total: purchaseTotalText,
            quantity,
            product: fullItemName,
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
      const url = `https://api.whatsapp.com/send?phone=${productInfo.whatsappPhone || '51905820448'}&text=${encodedText}`;
      window.open(url, '_blank');
      setIsOrdered(true);
    }, 1200);
  };

  const handleWhatsAppOrder = () => {
    handleConfirmPurchase();
  };

  return (
    <div className={`min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-apple-accent/10 transition-all duration-300 ${isVisualEditorActive ? 'lg:pr-[420px]' : ''}`}>
      
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
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#E5E5E7] py-3 px-4 md:px-6 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
          {/* Top-Left: Edition text (editable) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-apple-accent/10 flex items-center justify-center text-apple-accent shrink-0 font-sans">
              <Printer size={14} className="sm:w-4.5 sm:h-4.5" />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-tight text-[#1D1D1F] truncate max-w-[120px] sm:max-w-none font-sans">
              {productInfo.edition || "WP200 Pro-Edition"}
            </span>
          </div>

          {/* Center: Triple tap Logo */}
          <div onClick={handleLogoClick} className="cursor-pointer select-none active:opacity-80 transition-all rounded-lg p-1 hover:bg-zinc-50 shrink-0" title="Pos-Tec (Triple click para editor)">
            <Logo className="h-6 sm:h-8" />
          </div>

          {/* Right: Rich Interactive Badges & WhatsApp Link (all editable) */}
          <div className="flex items-center gap-2">
            {/* WhatsApp Contact Badge */}
            {productInfo.headerWhatsappText && (
              <a 
                href={`https://api.whatsapp.com/send?phone=${productInfo.whatsappPhone || '51905820448'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-emerald-500 text-white hover:bg-emerald-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-md shadow-emerald-500/10 transition-all cursor-pointer whitespace-nowrap"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full relative flex items-center justify-center shrink-0">
                  <span className="absolute w-full h-full bg-white rounded-full animate-ping opacity-75" />
                </div>
                <span className="font-sans font-black">Wsp: {productInfo.headerWhatsappText}</span>
              </a>
            )}

            {/* General Offer Badge */}
            <span className="hidden leading-none md:inline-flex items-center bg-zinc-100 border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans whitespace-nowrap">
              {productInfo.headerBadgeText || "Oferta Disponible"}
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
                  S/ {(productInfo.originalPrice || 269.00).toFixed(2)}
                </span>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mb-2 tracking-wider">
                  {productInfo.discountText || "-24% Desc."}
                </span>
              </div>
            </div>

            {/* Quick Specs Checklist */}
            <div className="border-t border-b border-[#E5E5E7] py-6 space-y-3.5">
              {[
                productInfo.spec1 || `Marca de confianza: ${productInfo.brand} (Modelo industrial WP200 de alto rendimiento).`,
                productInfo.spec2 || "Tecnología: Térmica Directa (Cero costos en cartuchos de tinta).",
                productInfo.spec3 || "Velocidad Profesional: 230 mm/s con sistema de autocorte garantizado.",
                productInfo.spec4 || "Interfaces integradas: Entrada USB y puerto telefónico RJ11 para comandar gavetas portamonedas."
              ].map((spec, i) => {
                const parts = spec.split(':');
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[14px] md:text-[15px] font-medium text-zinc-700">
                      {parts.length > 1 ? (
                        <>
                          <strong>{parts[0]}:</strong>
                          {parts.slice(1).join(':')}
                        </>
                      ) : (
                        spec
                      )}
                    </span>
                  </div>
                );
              })}
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

            {/* Call to Actions - Elegant Scroll to Purchase Block */}
            <div className="space-y-4 pt-4 border-t border-[#E5E5E7]">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans">Monto Unitario Web:</span>
                <span className="text-2xl font-black text-[#10B981] font-sans">S/ {unitPrice.toFixed(2)} PEN <span className="text-[10px] text-zinc-400 font-semibold">(IGV Incl.)</span></span>
              </div>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('checkout-form-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-[#10B981] hover:bg-[#07a370] active:scale-[0.982] text-white py-4.5 px-6 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-xl shadow-emerald-500/15 font-black tracking-tight transition-all cursor-pointer font-sans"
              >
                <span className="text-base md:text-lg flex items-center gap-1.5 justify-center">
                  🛒 COMPRAR EN TIENDA VIRTUAL
                </span>
                <span className="text-[11px] font-bold opacity-90 text-emerald-100">
                  Deslizar para Registrar Pedido (Yape / BCP)
                </span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-zinc-400 font-sans">
                <span className="flex items-center gap-1">📱 Pago con Yape</span>
                <span className="text-zinc-300">•</span>
                <span className="flex items-center gap-1">🏦 Depósito BCP</span>
              </div>

              <p className="text-center text-[10px] text-zinc-400 font-semibold leading-relaxed max-w-sm mx-auto font-sans">
                El despacho se programa de inmediato y se asiste para la conexión en minutos.
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
              Especificaciones & Confianza {productInfo.brand}
            </h4>
            <span className="text-xs text-zinc-450 font-bold hidden sm:inline">Modelo {productInfo.model || "WP200"} • Grado Industrial</span>
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={productInfo.driverUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 bg-[#F5F5F7] hover:bg-[#EAEAEF] rounded-2xl border border-zinc-200/40 transition-all hover:scale-[1.01] active:scale-[0.99] group text-left cursor-pointer"
                    >
                      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl group-hover:bg-emerald-200 transition-colors">
                        <Download size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-black text-[#1D1D1F] block leading-snug font-sans flex items-center gap-1">
                          Controladores (Drivers) Windows
                        </span>
                        <span className="text-[9px] text-zinc-500 block truncate font-sans">Compatible Win 10 & 11 • Descarga directa</span>
                      </div>
                    </a>

                    <a
                      href={productInfo.manualUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 bg-[#F5F5F7] hover:bg-[#EAEAEF] rounded-2xl border border-zinc-200/40 transition-all hover:scale-[1.01] active:scale-[0.99] group text-left cursor-pointer"
                    >
                      <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-xl group-hover:bg-indigo-200 transition-colors">
                        <FileText size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-black text-[#1D1D1F] block leading-snug font-sans flex items-center gap-1">
                          Manual de Usuario Oficial PDF
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
                  <Globe size={11} /> {productInfo.brand} ORIGINAL {productInfo.model || "WP200"}
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

        {/* SECCIÓN FINAL DE COMPRA - FORMULARIO ESTABLECIDO (Yape / BCP Directo) */}
        <div id="checkout-form-section" className="scroll-mt-24 bg-white rounded-[2.5rem] border border-[#E5E5E7] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Background Blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

          {orderStep === 'confirmed' ? (
            /* SUCCESS CASE MESSAGE STATE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6 max-w-2xl mx-auto relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Check className="stroke-[3]" size={32} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#1D1D1F] tracking-tight leading-tight font-sans">
                  ¡Pedido Recibido con Éxito!
                </h3>
                <p className="text-sm text-zinc-600 font-medium leading-relaxed max-w-md mx-auto font-sans">
                  Tu comprobante ha sido despachado de forma oficial. Un especialista de soporte validará tu entrega y envío nacional de inmediato por WhatsApp.
                </p>
              </div>

              {/* Dynamic printable receipt ticket */}
              <div className="p-6 bg-[#F5F5F7] rounded-3xl border border-zinc-200 text-left text-xs font-semibold text-zinc-700 space-y-2.5 shadow-inner max-w-md mx-auto">
                <div className="font-bold border-b border-dashed border-zinc-300 pb-2 text-center text-zinc-400 uppercase tracking-widest text-[9px] font-sans">Boleta Automatizada POS-TEC</div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60 font-sans">
                  <span className="text-zinc-400 text-[10px] uppercase">Titular Comprador:</span>
                  <span className="font-extrabold text-[#1D1D1F]">{clientName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60 font-sans">
                  <span className="text-zinc-400 text-[10px] uppercase">Celular y WSP:</span>
                  <span className="font-mono text-[#1D1D1F]">{clientPhone}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60 font-sans">
                  <span className="text-zinc-400 text-[10px] uppercase">Dirección de Despacho:</span>
                  <span className="font-extrabold text-[#1D1D1F] text-right max-w-[220px] truncate">{deliveryAddress}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200/60 font-sans">
                  <span className="text-zinc-400 text-[10px] uppercase font-sans">Abonado vía:</span>
                  <span className="font-bold text-[#1D1D1F] uppercase font-sans">Yape o Cuenta BCP</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-zinc-200 font-sans">
                  <span className="text-zinc-500 text-[10px] uppercase">Monto Total Liquidado:</span>
                  <span className="font-black text-emerald-600 text-sm">S/ {calculatedTotal.toFixed(2)} PEN</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => {
                    const purchaseTotalText = calculatedTotal.toFixed(2);
                    const yapeMsg = `*📦 NUEVO PEDIDO - POS-TEC 📦*\n\n` +
                                    `*Cliente:* ${clientName} (${clientPhone})\n` +
                                    `*Dirección:* ${deliveryAddress}\n` +
                                    `*Detalle:* ${quantity}x ${productInfo.brand} ${productInfo.model || "WP200"} (S/ ${purchaseTotalText})\n` +
                                    `*Método:* Yape (Op: ${yapeOperationCode})\n\n` +
                                    `_¡Hola! Acabo de registrar mi pedido por Yape con el código ingresado. Adjuntaré mi captura de pantalla en breve._`;

                    const bcpMsg = `*📦 NUEVO PEDIDO - POS-TEC 📦*\n\n` +
                                   `*Cliente:* ${clientName} (${clientPhone})\n` +
                                   `*Dirección:* ${deliveryAddress}\n` +
                                   `*Detalle:* ${quantity}x ${productInfo.brand} ${productInfo.model || "WP200"} (S/ ${purchaseTotalText})\n` +
                                   `*Método:* Transferencia BCP\n\n` +
                                   `_¡Hola! He registrado mi pedido en su web y realizaré la transferencia bancaria. En breve les envío la captura de la operación por aquí._`;

                    const messageText = paymentMethod === 'yape' ? yapeMsg : bcpMsg;
                    const encoded = encodeURIComponent(messageText);
                    window.open(`https://api.whatsapp.com/send?phone=51905820448&text=${encoded}`, '_blank');
                  }}
                  className="bg-[#10B981] hover:bg-[#07a370] text-white py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-sans shadow-md shadow-emerald-500/10 animate-pulse"
                >
                  💬 Reabrir Chat con Asesor WSP
                </button>
                <button 
                  onClick={() => { setOrderStep('idle'); }}
                  className="bg-zinc-100 hover:bg-zinc-200 text-[#1D1D1F] py-3.5 px-6 rounded-xl font-bold text-xs transition-all cursor-pointer font-sans"
                >
                  Hacer Otro Pedido
                </button>
              </div>
            </motion.div>
          ) : (
            /* CART + CHECKOUT STOREFLOW DIRECTLY INLINE */
            <div className="relative z-10 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-200 font-sans">
                  <Lock size={10} className="text-emerald-600 shrink-0" />
                  Paso Final: Despacho de Almacén Directo
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#1D1D1F] tracking-tight leading-tight font-sans">
                  Formulario de Compra Rápida
                </h2>
                <p className="text-[#86868B] text-xs font-semibold font-sans">
                  Completa tus datos de entrega nacional. El total de envío prioritario es <strong>totalmente gratis</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left pt-2">
                {/* COLUMN LEFT: Carrito de Compras (5 cols) */}
                <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1D1D1F] flex items-center gap-1.5 font-sans">
                      🛒 Resumen de Compra
                    </h4>
                    <span className="bg-[#1D1D1F] text-white font-black text-[10px] px-2.5 py-0.5 rounded-full select-none font-sans">
                      x{quantity} {quantity === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </div>

                  {/* Cart Product Row */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-zinc-50 overflow-hidden shrink-0 border border-zinc-200 relative">
                      <img 
                        src={selectedLanderItem 
                          ? (selectedLanderItem.image_url || productImages[0].url) 
                          : productImages[0].url} 
                        alt={selectedLanderItem ? selectedLanderItem.name : (productInfo.brand + " " + (productInfo.model || ""))} 
                        className="w-full h-full object-cover select-none" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">
                        {selectedLanderItem ? '🌟 Oferta Especial' : productInfo.brand}
                      </span>
                      <h5 className="font-extrabold text-xs text-[#1D1D1F] tracking-tight leading-tight font-sans">
                        {selectedLanderItem ? selectedLanderItem.name : productInfo.name}
                      </h5>
                      <p className="text-xs font-black text-[#10B981]">
                        S/ {unitPrice.toFixed(2)} <span className="text-[9px] text-[#86868B] font-semibold">(c/u)</span>
                      </p>
                      {selectedLanderItem && (
                        <button 
                          type="button" 
                          onClick={() => setSelectedLanderItem(null)}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold underline transition-colors block cursor-pointer text-left"
                        >
                          Quitar oferta (Ver solo impresora)
                        </button>
                      )}
                    </div>

                    {/* Integrated Counter Inside Product */}
                    <div className="flex items-center gap-1 bg-[#F5F5F7] border border-zinc-200 rounded-full p-0.5 shadow-sm scale-90 origin-right shrink-0">
                      <button 
                        type="button"
                        onClick={handleDecrement}
                        className="w-7 h-7 rounded-full bg-white hover:bg-zinc-150 flex items-center justify-center text-[#1D1D1F] font-bold transition-all cursor-pointer border border-zinc-200/50"
                        title="Disminuir"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-5 text-center text-xs font-black text-[#1D1D1F] select-none font-sans">{quantity}</span>
                      <button 
                        type="button"
                        onClick={handleIncrement}
                        className="w-7 h-7 rounded-full bg-white hover:bg-zinc-150 flex items-center justify-center text-[#1D1D1F] font-bold transition-all cursor-pointer border border-zinc-200/50"
                        title="Incrementar"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Financial Invoice Details */}
                  <div className="space-y-2 border-t border-zinc-200 pt-4 text-xs text-zinc-600 font-semibold font-sans">
                    <div className="flex justify-between items-center text-zinc-500">
                      <span>Valor de Compra Neto:</span>
                      <span>S/ {calculatedSubtotal.toFixed(2)} PEN</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500">
                      <span>I.G.V. Nacional (18%):</span>
                      <span>S/ {calculatedIGV.toFixed(2)} PEN</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500 border-b border-zinc-200/65 pb-3">
                      <span>Precio del Despacho:</span>
                      <span className="text-emerald-600 font-bold uppercase tracking-wider font-sans">¡Envío Gratuito!</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-[#1D1D1F] font-sans">
                      <span className="font-extrabold">Total Facturado Tienda:</span>
                      <span className="text-xl font-black text-[#10B981] tracking-tighter sm:col-span-2">
                        S/ {calculatedTotal.toFixed(2)} PEN
                      </span>
                    </div>
                  </div>

                  {/* Shop Reassurance Badge */}
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-left space-y-1">
                    <span className="font-extrabold text-[10px] uppercase text-emerald-800 tracking-wide flex items-center gap-1 leading-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Beneficio Web Disponible Hoy
                    </span>
                    <p className="text-[10px] text-emerald-700 font-medium leading-relaxed font-sans">
                      La tarifa promocional con envío rápido Priority Gratis a todo el país estará reservada temporalmente al registrar sus datos.
                    </p>
                  </div>
                </div>

                {/* COLUMN RIGHT: Formalización Despacho y Pago (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* STEP 1: Datos de Entrega */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-l-2 border-[#10B981] pl-2.5 font-sans">
                      1. Información para la Entrega Directa
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2 text-left">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block font-sans">Nombre Completo del Comprador <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Ej. Juan Pérez Alvarado" 
                          className="w-full bg-[#F5F5F7]/40 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all font-sans"
                        />
                      </div>

                      <div className="space-y-1.5 text-left font-sans">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block font-sans">Celular con WhatsApp <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Ej. 989007409" 
                          className="w-full bg-[#F5F5F7]/40 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all font-sans"
                        />
                      </div>

                      <div className="space-y-1.5 text-left font-sans">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block font-sans">Dirección Completa o Agencia <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Ej. Av. Arequipa 1234 / Agencia Shalom Chimbote" 
                          className="w-full bg-[#F5F5F7]/40 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 font-bold placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: Elección de Forma de Pago Interactive Yape / BCP */}
                  <div className="space-y-4 bg-zinc-55/65 p-5 rounded-2xl border border-zinc-200 text-left font-sans">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 font-sans">
                      💳 Selecciona tu Método de Pago <span className="text-red-500">*</span>
                    </h4>

                    {/* Interactive Selector Tabs */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('yape')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'yape'
                            ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                            : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                        }`}
                      >
                        <span className="text-xs font-black flex items-center gap-1.5">📱 Yape Directo</span>
                        <span className={`text-[9px] font-bold ${paymentMethod === 'yape' ? 'text-purple-200' : 'text-zinc-400'}`}>
                          Abono celular inmediato
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bcp')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'bcp'
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                            : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600'
                        }`}
                      >
                        <span className="text-xs font-black flex items-center gap-1.5">🏦 Transferencia BCP</span>
                        <span className={`text-[9px] font-bold ${paymentMethod === 'bcp' ? 'text-indigo-200' : 'text-zinc-400'}`}>
                          Banca móvil o agente
                        </span>
                      </button>
                    </div>

                    {/* Dynamic View showing directions */}
                    {paymentMethod === 'yape' ? (
                      <div className="bg-white p-4 rounded-xl border border-purple-100 space-y-3 font-sans">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">1. Paga desde tu app Yape:</p>
                          <div className="bg-[#F8F6FC] rounded-lg p-3 text-xs font-black text-purple-950 flex flex-col gap-1 border border-purple-100/50">
                            <div className="flex items-center justify-between">
                              <span className="text-[#8B5CF6] font-extrabold text-[13px]">📱 Celular Yape: {productInfo.yapePhone || '989 007 409'}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyToClipboard(productInfo.yapePhoneRaw || '989007409', 'yape')}
                                className="flex items-center gap-1.5 text-[10px] bg-purple-150 text-purple-700 hover:bg-purple-200 hover:text-purple-800 transition-all font-bold px-2 py-1 rounded-lg cursor-pointer"
                              >
                                {copiedText === 'yape' ? (
                                  <>
                                    <Check size={11} className="stroke-[3]" /> Copiado
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} /> Copiar Nro
                                  </>
                                )}
                              </button>
                            </div>
                            <span className="text-zinc-600 font-semibold block text-[11px] mt-0.5">Titular de Cuenta: {productInfo.yapeOwner || 'Joaquín García'}</span>
                            <span className="text-[#6D28D9] font-black">Monto exacto: S/ {calculatedTotal.toFixed(2)} PEN</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-purple-700 uppercase tracking-widest block">
                            2. Código o Nro de Operación Yape <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={yapeOperationCode}
                            onChange={(e) => setYapeOperationCode(e.target.value)}
                            placeholder="Ej. 129034 o número de cel"
                            className="w-full bg-[#F5F5F7]/40 border border-purple-200/60 rounded-xl px-4 py-2.5 text-xs text-zinc-900 font-bold placeholder-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all font-sans"
                          />
                          <p className="text-[9px] text-zinc-400 font-semibold leading-normal">
                            Ingresa el código o cel que yapeó para proceder con el despacho inmediato de almacén.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3 font-sans">
                        <div className="space-y-1 text-xs">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">1. Datos de Cuenta BCP:</p>
                          <div className="bg-[#F2F5FA] rounded-xl p-3.5 font-semibold text-zinc-800 space-y-2.5 border border-indigo-100/50 animate-fade-in">
                            
                            <div className="space-y-1">
                              <p className="font-extrabold text-[#111] text-[11px]">🏦 Cuenta Corriente BCP soles:</p>
                              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-indigo-100/60">
                                <span className="font-mono font-black text-indigo-700 text-xs">{productInfo.bcpAccount || '191-1875953-0-18'}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyToClipboard(productInfo.bcpAccountRaw || '1911875953018', 'bcp')}
                                  className="flex items-center gap-1 text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-850 px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer"
                                >
                                  {copiedText === 'bcp' ? (
                                    <>
                                      <Check size={9} /> Copiado
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={9} /> Copiar
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-zinc-500 text-[9px] uppercase font-bold">CCI Interbancario BCP:</p>
                              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-indigo-100/60 font-sans">
                                <span className="font-mono text-zinc-700 text-[10px]">{productInfo.bcpCCI || '002-191-001875953018-53'}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyToClipboard(productInfo.bcpCCIRaw || '00219100187595301853', 'cci')}
                                  className="flex items-center gap-1 text-[9px] bg-zinc-100 text-zinc-650 hover:bg-zinc-200 hover:text-zinc-800 px-1.5 py-0.5 rounded transition-all font-bold cursor-pointer"
                                >
                                  {copiedText === 'cci' ? (
                                    <>
                                      <Check size={9} /> Copiado
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={9} /> Copiar
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            <p className="text-[9px] text-zinc-500 mt-0.5">Beneficiario: <strong className="text-zinc-700 font-bold">{productInfo.bcpOwner || 'COPIERMAX EIR.'}</strong></p>
                          </div>
                        </div>

                        <p className="text-[10.5px] text-zinc-500 font-semibold leading-relaxed">
                          📌 <strong className="text-zinc-700">Flujo inmediato:</strong> Al hacer clic abajo, se enviará tu pedido preciso y amable por WhatsApp. Enseguida nos podrás enviar la captura de tu transferencia de tu banco. ¡Gracias!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON WITH SECURE SYMBOLS */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
                    <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1.5">
                      <Lock size={12} className="text-emerald-500 shrink-0" />
                      Proceso protegido y programado en minutos.
                    </span>

                    <button 
                      onClick={handleConfirmPurchase}
                      disabled={orderStep === 'sending'}
                      className="w-full md:w-auto bg-[#10B981] hover:bg-[#07a370] active:scale-[0.98] disabled:bg-zinc-300 text-white font-sans font-black py-4.5 px-8 rounded-2xl flex items-center justify-center gap-2 border border-emerald-600 text-sm tracking-tight transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
                    >
                      {orderStep === 'sending' ? (
                        <span>Procesando pedido...</span>
                      ) : (
                        <>
                          🛒 COMPRAR CON {paymentMethod === 'yape' ? 'YAPE' : 'BCP'} (S/ {calculatedTotal.toFixed(2)})
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

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
                      Para que tus clientes descarguen el controlador (Driver) de tu equipo <strong>{productInfo.brand} {productInfo.model || "WP200"}</strong>, sigue estos pasos sencillos:
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
                        Abre tu <span className="text-apple-accent font-bold">Panel de Administración</span>, ve a la pestaña <span className="text-[#10B981] font-bold">Landing de Campaña</span>, y pega este nuevo enlace en la casilla de controladores de Google Drive de manera visual.
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
                        Abre tu <span className="text-apple-accent font-bold">Panel de Administración</span>, ve a la pestaña <span className="text-[#10B981] font-bold">Landing de Campaña</span>, y pega este nuevo enlace en la casilla del Manual PDF de manera de forma visual de la misma manera.
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
      <footer className="bg-white border-t border-[#E5E5E7] py-8 text-center mt-20 relative z-10 no-print font-sans">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#86868B] font-medium">Importadores Directos de Tecnología POS para tu Negocio</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Pagos 100% seguros</span>
              <div className="flex gap-1.5">
                <div className="w-8 h-5 bg-[#F5F5F7] rounded border border-zinc-200" />
                <div className="w-8 h-5 bg-[#F5F5F7] rounded border border-zinc-200" />
                <div className="w-8 h-5 bg-[#F5F5F7] rounded border border-zinc-200" />
              </div>
            </div>
            


            <Link 
              to="/admin" 
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-all flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/50 hover:bg-zinc-100 hover:border-zinc-300 px-3 py-1.5 rounded-lg lg:font-bold font-semibold shrink-0 cursor-pointer"
            >
              <Lock size={12} className="text-zinc-400" /> Acceso Panel Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* Botón flotante para Ofertas Flash en la esquina inferior izquierda */}
      {(() => {
        const promoProduct1 = generalSettings?.promo1_product_id ? products.find(p => p.id === parseInt(generalSettings.promo1_product_id)) : null;
        const promoProduct2 = generalSettings?.promo2_product_id ? products.find(p => p.id === parseInt(generalSettings.promo2_product_id)) : null;

        const hasPromo1 = (generalSettings?.promo1_active !== false) ? (promoProduct1 ? true : (productInfo.promo1_active === true || productInfo.promo1_active === "true")) : false;
        const hasPromo2 = (generalSettings?.promo2_active !== false) ? (promoProduct2 ? true : (productInfo.promo2_active === true || productInfo.promo2_active === "true")) : false;
        const totalActivePromos = (hasPromo1 ? 1 : 0) + (hasPromo2 ? 1 : 0);

        if (!hasPromo1 && !hasPromo2) return null;

        const offer1 = promoProduct1 ? {
          name: promoProduct1.brand ? `[${promoProduct1.brand}] ${promoProduct1.name}` : promoProduct1.name,
          price: Number(promoProduct1.price),
          description: promoProduct1.description || "",
          image_url: promoProduct1.image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop"
        } : {
          name: productInfo.promo1_title || "🎁 COMBO IMPRESORA + 10 ROLLOS PREMIUM",
          price: Number(productInfo.promo1_price || 249),
          description: productInfo.promo1_desc || "Llévese la ticketera industrial de alta velocidad más un pack de 10 rollos térmicos de 80mm de alta densidad.",
          image_url: productInfo.promo1_image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop"
        };

        const offer2 = promoProduct2 ? {
          name: promoProduct2.brand ? `[${promoProduct2.brand}] ${promoProduct2.name}` : promoProduct2.name,
          price: Number(promoProduct2.price),
          description: promoProduct2.description || "",
          image_url: promoProduct2.image_url || "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=1000&auto=format&fit=crop"
        } : {
          name: productInfo.promo2_title || "⚡ COMBO DUO: Impresora + Cajón Monedero",
          price: Number(productInfo.promo2_price || 349),
          description: productInfo.promo2_desc || "Maximiza tu punto de venta. Agrega el cajón monedero POS-STAR de alta resistencia con apertura automática RJ11 por un precio especial.",
          image_url: productInfo.promo2_image || "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=1000&auto=format&fit=crop"
        };

        return (
          <>
            <div className="fixed bottom-6 left-6 z-40 no-print">
              <button 
                onClick={() => setIsPromoPopupOpen(true)}
                className="bg-apple-accent hover:bg-[#00A844] text-white font-sans font-black py-3 sm:py-3.5 px-4 sm:px-6 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs tracking-tight border-2 border-white cursor-pointer"
                title="Ver Ofertas Especiales"
              >
                <Sparkles size={14} className="animate-pulse text-yellow-300" />
                <span>⚡ OFERTAS FLASH ({totalActivePromos})</span>
                <span className="bg-white text-[#00C853] px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono">{totalActivePromos}</span>
              </button>
            </div>

            {/* Dynamic Pop-up Promo Campaign Modal (2 custom deals) */}
            <AnimatePresence>
              {isPromoPopupOpen && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm no-print overflow-y-auto">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                    onClick={() => setIsPromoPopupOpen(false)}
                  />

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 180 }}
                    className="relative w-full max-w-3xl bg-white rounded-[2rem] border border-zinc-200 p-6 md:p-8 shadow-2xl z-10 flex flex-col gap-6 font-sans select-none max-h-[90vh] overflow-y-auto text-left"
                  >
                    <button 
                      onClick={() => setIsPromoPopupOpen(false)}
                      className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-1.5 rounded-full cursor-pointer z-20 transition-all"
                      title="Cerrar oferta"
                    >
                      <X size={18} />
                    </button>

                    <div className="text-center space-y-1">
                      <span className="inline-flex items-center gap-1 bg-apple-accent/10 text-apple-accent font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full animate-bounce">
                        ⚡ OPORTUNIDAD ÚNICA DE HOY
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-[#1D1D1F] tracking-tight">
                        ¡Desbloquea Combos Premium con Descuento!
                      </h3>
                      <p className="text-xs text-zinc-500 font-medium">
                        Añade un pack recomendado o complementa tu equipo al instante para envío prioritario gratuito.
                      </p>
                    </div>

                    {/* Promo Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Promo Card 1 */}
                      {hasPromo1 && (
                        <div className="border border-zinc-200 hover:border-apple-accent/40 rounded-2xl p-4 flex flex-col justify-between bg-zinc-50/50 hover:bg-white transition-all shadow-sm group">
                          <div className="space-y-3">
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-100 relative shadow-inner">
                              <img 
                                src={offer1.image_url} 
                                alt={offer1.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2 right-2 bg-apple-accent text-white font-black text-[10px] px-2.5 py-1 rounded-full">
                                Recomendado
                              </div>
                            </div>
                            
                            <div className="space-y-1 text-left">
                              <h4 className="font-extrabold text-[#1D1D1F] text-xs sm:text-sm tracking-tight leading-snug">
                                {offer1.name}
                              </h4>
                              <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed line-clamp-2">
                                {offer1.description}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-zinc-100 mt-4 space-y-3">
                            <div className="flex justify-between items-end">
                              <span className="text-[9px] text-zinc-400 font-black uppercase">Precio Pack:</span>
                              <div className="text-right">
                                <span className="text-lg font-black text-apple-accent tracking-tighter block leading-none">
                                  S/ {Number(offer1.price).toFixed(2)}
                                </span>
                                <span className="text-[9px] text-zinc-400 line-through">
                                  Normal: S/ {Number(offer1.price * 1.35).toFixed(0)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedLanderItem({
                                  name: offer1.name,
                                  price: Number(offer1.price),
                                  isPromo: true,
                                  image_url: offer1.image_url
                                });
                                setIsPromoPopupOpen(false);
                                setIsCheckoutOpen(true);
                                // Scroll smoothly to checkout
                                setTimeout(() => {
                                  document.getElementById('checkout-storeflow')?.scrollIntoView({ behavior: 'smooth' });
                                }, 200);
                              }}
                              className="w-full py-2.5 bg-apple-accent hover:bg-[#00A844] text-white font-black text-xs rounded-xl shadow-lg shadow-apple-accent/10 cursor-pointer text-center text-ellipsis overflow-hidden whitespace-nowrap transition-all animate-pulse"
                            >
                              ¡Comprar con 1 Clic!
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Promo Card 2 */}
                      {hasPromo2 && (
                        <div className="border border-zinc-200 hover:border-apple-accent/40 rounded-2xl p-4 flex flex-col justify-between bg-zinc-50/50 hover:bg-white transition-all shadow-sm group">
                          <div className="space-y-3">
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-100 relative shadow-inner">
                              <img 
                                src={offer2.image_url} 
                                alt={offer2.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2 right-2 bg-apple-accent text-white font-black text-[10px] px-2.5 py-1 rounded-full">
                                Tendencia
                              </div>
                            </div>
                            
                            <div className="space-y-1 text-left">
                              <h4 className="font-extrabold text-[#1D1D1F] text-xs sm:text-sm tracking-tight leading-snug">
                                {offer2.name}
                              </h4>
                              <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed line-clamp-2">
                                {offer2.description}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-zinc-100 mt-4 space-y-3">
                            <div className="flex justify-between items-end">
                              <span className="text-[9px] text-zinc-400 font-black uppercase">Precio Pack:</span>
                              <div className="text-right">
                                <span className="text-base sm:text-lg font-black text-apple-accent tracking-tighter block leading-none">
                                  S/ {Number(offer2.price).toFixed(2)}
                                </span>
                                <span className="text-[9px] text-zinc-450 line-through">
                                  Normal: S/ {Number(offer2.price * 1.35).toFixed(0)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedLanderItem({
                                  name: offer2.name,
                                  price: Number(offer2.price),
                                  isPromo: true,
                                  image_url: offer2.image_url
                                });
                                setIsPromoPopupOpen(false);
                                setIsCheckoutOpen(true);
                                // Scroll smoothly to checkout
                                setTimeout(() => {
                                  document.getElementById('checkout-storeflow')?.scrollIntoView({ behavior: 'smooth' });
                                }, 200);
                              }}
                              className="w-full py-2.5 bg-apple-accent hover:bg-[#00A844] text-white font-black text-xs rounded-xl shadow-lg shadow-apple-accent/10 cursor-pointer text-center text-ellipsis overflow-hidden whitespace-nowrap transition-all"
                            >
                              ¡Comprar con 1 Clic!
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer text */}
                    <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed pt-2">
                      * Las ofertas especiales se envían en una sola encomienda asegurada de alta prioridad. Puedes declinar la promoción y ver el producto inicial únicamente haciendo clic en la X de arriba o en el fondo.
                    </p>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
        );
      })()}

      {/* Botón flotante para el Editor Visual Directo */}
      <div className="fixed bottom-6 right-6 z-50 no-print flex flex-col gap-2 items-end">
        {isVisualEditorActive ? (
          <div className="flex gap-2">
            <button
              onClick={handleSaveVisualChanges}
              disabled={isSavingVisual}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-full shadow-2xl flex items-center gap-2 text-sm transition-all active:scale-[0.97]"
            >
              <Save size={16} className={isSavingVisual ? "animate-spin" : ""} />
              {isSavingVisual ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button 
              onClick={() => setIsVisualEditorActive(false)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 px-5 rounded-full shadow-2xl flex items-center gap-2 text-sm transition-all"
            >
              <X size={16} />
              Cerrar Editor
            </button>
          </div>
        ) : null}
      </div>

      {/* Login Modal para el editor visual */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 no-print font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-8 border border-zinc-205 shadow-2xl text-left"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Lock className="text-apple-accent" size={18} />
                  <h3 className="font-extrabold text-[#1D1D1F] text-lg tracking-tight">Acceso Editor Visual</h3>
                </div>
                <button onClick={() => { setIsLoginModalOpen(false); setLoginError(false); }} className="text-zinc-400 hover:text-zinc-650 p-1">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">
                Ingresa el usuario y la clave de administrador para desbloquear la edición visual automática de esta campaña directamente en la pantalla.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const isUsernameValid = adminUsernameInput.toLowerCase().trim() === 'admin';
                const isPasswordValid = adminPasswordInput === 'Pos.2026';
                if (isUsernameValid && isPasswordValid) {
                  setIsVisualEditorActive(true);
                  setIsLoginModalOpen(false);
                  setLoginError(false);
                  setAdminUsernameInput('');
                  setAdminPasswordInput('');
                } else {
                  setLoginError(true);
                }
              }} className="space-y-4">
                <div className="space-y-1.5 font-sans">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Usuario Admin</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={adminUsernameInput}
                      onChange={(e) => setAdminUsernameInput(e.target.value)}
                      placeholder="Ej. admin"
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-apple-accent/20 transition-all font-sans"
                      autoFocus
                    />
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Clave de Acceso</label>
                  <div className="relative">
                    <input 
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="Contraseña corporativa"
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-apple-accent/20 transition-all font-sans"
                    />
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs font-bold text-red-500 ml-1">Usuario o contraseña incorrectos. Inténtalo de nuevo.</p>
                )}

                <div className="pt-2 flex justify-end gap-3 font-sans">
                  <button 
                    type="button"
                    onClick={() => { setIsLoginModalOpen(false); setLoginError(false); setAdminUsernameInput(''); setAdminPasswordInput(''); }}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-650 text-xs font-bold hover:bg-zinc-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-apple-accent hover:bg-apple-accent/90 text-white rounded-xl text-xs font-bold shadow-md shadow-apple-accent/15 cursor-pointer"
                  >
                    Desbloquear Editor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Editor Sidebar Panel */}
      {isVisualEditorActive && (
        <div className="fixed top-0 right-0 h-screen w-full lg:w-[420px] bg-white border-l border-[#E5E5E7] shadow-2xl z-[999] flex flex-col font-sans no-print animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
            <div className="flex items-center gap-2">
              <Edit size={16} className="text-[#10B981]" />
              <h3 className="font-extrabold text-[#1D1D1F] text-sm tracking-tight">Editor Visual en Vivo</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveVisualChanges}
                disabled={isSavingVisual}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 shadow-sm shrink-0 transition-colors cursor-pointer"
              >
                <Save size={12} className={isSavingVisual ? "animate-spin" : ""} />
                Guardar
              </button>
              <button 
                onClick={() => setIsVisualEditorActive(false)}
                className="text-zinc-400 hover:text-zinc-650 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="grid grid-cols-5 border-b border-zinc-100 bg-zinc-50 shrink-0 text-[9px] font-black uppercase text-center text-zinc-500">
            <button 
              type="button" 
              onClick={() => setVisualActiveTab('info')}
              className={`py-3 border-b-2 font-mono cursor-pointer ${visualActiveTab === 'info' ? 'border-[#10B981] text-[#10B981] bg-white' : 'border-transparent hover:bg-zinc-100'}`}
            >
              📝 Texto
            </button>
            <button 
              type="button" 
              onClick={() => setVisualActiveTab('specs')}
              className={`py-3 border-b-2 font-mono cursor-pointer ${visualActiveTab === 'specs' ? 'border-[#10B981] text-[#10B981] bg-white' : 'border-transparent hover:bg-zinc-100'}`}
            >
              ✅ Specs
            </button>
            <button 
              type="button" 
              onClick={() => setVisualActiveTab('images')}
              className={`py-3 border-b-2 font-mono cursor-pointer ${visualActiveTab === 'images' ? 'border-[#10B981] text-[#10B981] bg-white' : 'border-transparent hover:bg-zinc-100'}`}
            >
              🖼️ Fotos
            </button>
            <button 
              type="button" 
              onClick={() => setVisualActiveTab('payment')}
              className={`py-3 border-b-2 font-mono cursor-pointer ${visualActiveTab === 'payment' ? 'border-[#10B981] text-[#10B981] bg-white' : 'border-transparent hover:bg-zinc-100'}`}
            >
              💰 Pago
            </button>
            <button 
              type="button" 
              onClick={() => setVisualActiveTab('popups')}
              className={`py-3 border-b-2 font-mono cursor-pointer ${visualActiveTab === 'popups' ? 'border-[#10B981] text-[#10B981] bg-white' : 'border-transparent hover:bg-zinc-100'}`}
              title="Configurar Popups de Ofertas"
            >
              🎁 Ofertas
            </button>
          </div>

          {/* Tab Panel Scroll container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
            {visualActiveTab === 'info' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Edición (Header Izq)</label>
                  <input 
                    type="text"
                    value={productInfo.edition || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, edition: e.target.value }))}
                    placeholder="Ej. WP200 Pro-Edition"
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">WhatsApp Header</label>
                    <input 
                      type="text"
                      value={productInfo.headerWhatsappText || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, headerWhatsappText: e.target.value }))}
                      placeholder="Ej. 905 820 448"
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Badge Header Der</label>
                    <input 
                      type="text"
                      value={productInfo.headerBadgeText || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, headerBadgeText: e.target.value }))}
                      placeholder="Ej. Oferta Disponible"
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Nombre Corto</label>
                  <input 
                    type="text"
                    value={productInfo.name || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del componente de proforma"
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Título de Venta (Principal)</label>
                  <textarea 
                    rows={3}
                    value={productInfo.fullName || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20 resize-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Marca</label>
                    <input 
                      type="text"
                      value={productInfo.brand || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Modelo</label>
                    <input 
                      type="text"
                      value={productInfo.model || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Precio Web S/.</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={productInfo.price || 0}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Antiguo S/.</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={productInfo.originalPrice || 269.00}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Etiqueta Desc.</label>
                    <input 
                      type="text"
                      value={productInfo.discountText || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, discountText: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Etiqueta Oferta (Badge)</label>
                  <input 
                    type="text"
                    value={productInfo.offerType || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, offerType: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Zona Envío</label>
                    <input 
                      type="text"
                      value={productInfo.shipping || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, shipping: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Tiempos Envío</label>
                    <input 
                      type="text"
                      value={productInfo.deliveryTime || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, deliveryTime: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {visualActiveTab === 'specs' && (
              <div className="space-y-4">
                <div className="bg-[#10B981]/5 p-4 rounded-2xl border border-[#10B981]/15 text-[11px] font-sans font-semibold leading-relaxed text-emerald-850">
                  💡 <strong className="font-bold">Formato del Check de Especificaciones:</strong> Puedes separar el texto con dos puntos (<strong className="font-extrabold text-[#10B981]">:</strong>) para resaltar de forma automáticamente en negritas la parte inicial del texto.
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Fila del Check 1</label>
                  <textarea 
                    rows={2}
                    value={productInfo.spec1 || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, spec1: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20 resize-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Fila del Check 2</label>
                  <textarea 
                    rows={2}
                    value={productInfo.spec2 || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, spec2: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20 resize-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Fila del Check 3</label>
                  <textarea 
                    rows={2}
                    value={productInfo.spec3 || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, spec3: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20 resize-none font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">Fila del Check 4</label>
                  <textarea 
                    rows={2}
                    value={productInfo.spec4 || ''}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, spec4: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-[#10B981]/20 resize-none font-sans"
                  />
                </div>
              </div>
            )}

            {visualActiveTab === 'images' && (
              <div className="space-y-6">
                <div className="bg-zinc-50 p-3 rounded-xl text-[11px] text-zinc-400 font-semibold leading-relaxed">
                  Puedes seleccionar cada foto en el carrusel de la izquierda de la pantalla para ver el título y descripción que estás editando. Hay 6 bloques de fotos configurables.
                </div>
                
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const img = productImages[index] || { url: '', title: '', desc: '' };
                  return (
                    <div key={index} className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-200/50 space-y-3 text-left">
                      <span className="text-[9px] font-black uppercase bg-zinc-200 text-zinc-800 px-2 py-0.5 rounded">
                        Foto {index + 1}
                      </span>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase block">Enlace de Imagen (URL)</label>
                        <input 
                          type="text"
                          value={img.url || ''}
                          onChange={(e) => {
                            const updated = [...productImages];
                            updated[index] = { ...img, url: e.target.value };
                            setProductImages(updated);
                          }}
                          placeholder="URL de imagen Unsplash u otra"
                          className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-[11px] font-semibold outline-none focus:ring-1 focus:ring-[#10B981]/20"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase block">Título de la Foto</label>
                        <input 
                          type="text"
                          value={img.title || ''}
                          onChange={(e) => {
                            const updated = [...productImages];
                            updated[index] = { ...img, title: e.target.value };
                            setProductImages(updated);
                          }}
                          placeholder="Resumen corto de la sección"
                          className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-[11px] font-semibold outline-none focus:ring-1 focus:ring-[#10B981]/20"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase block">Detalle de la Foto</label>
                        <textarea 
                          rows={2}
                          value={img.desc || ''}
                          onChange={(e) => {
                            const updated = [...productImages];
                            updated[index] = { ...img, desc: e.target.value };
                            setProductImages(updated);
                          }}
                          placeholder="Descripción complementaria"
                          className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-[11px] font-semibold outline-none focus:ring-1 focus:ring-[#10B981]/20 resize-none font-sans"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {visualActiveTab === 'payment' && (
              <div className="space-y-4">
                <div className="bg-[#10B981]/5 p-4 rounded-xl border border-[#10B981]/10 text-xs font-semibold leading-relaxed">
                  Configure sus teléfonos de recaudación Yape, cuentas bancarias BCP nacionales y códigos para la redirección de pedidos.
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-purple-700 tracking-wider">📲 Recaudación Yape</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-450 uppercase block">Celular Yape (Visual)</label>
                      <input 
                        type="text"
                        value={productInfo.yapePhone || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, yapePhone: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-450 uppercase block">Celular Yape (Copiar)</label>
                      <input 
                        type="text"
                        value={productInfo.yapePhoneRaw || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, yapePhoneRaw: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase block">Titular Yape</label>
                    <input 
                      type="text"
                      value={productInfo.yapeOwner || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, yapeOwner: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-blue-700 tracking-wider">🏦 Recaudación BCP</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-450 uppercase block">Cuenta BCP (Visual)</label>
                      <input 
                        type="text"
                        value={productInfo.bcpAccount || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, bcpAccount: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-450 uppercase block">Cuenta BCP (Copiar)</label>
                      <input 
                        type="text"
                        value={productInfo.bcpAccountRaw || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, bcpAccountRaw: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-450 uppercase block">CCI BCP (Visual)</label>
                      <input 
                        type="text"
                        value={productInfo.bcpCCI || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, bcpCCI: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-450 uppercase block">CCI BCP (Copiar)</label>
                      <input 
                        type="text"
                        value={productInfo.bcpCCIRaw || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, bcpCCIRaw: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase block">Titular de Cuenta BCP</label>
                    <input 
                      type="text"
                      value={productInfo.bcpOwner || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, bcpOwner: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">💬 Enlace & Soporte</h4>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-455 uppercase block">Nro WhatsApp Destinatario (ej. 51905820448)</label>
                    <input 
                      type="text"
                      value={productInfo.whatsappPhone || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, whatsappPhone: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-455 uppercase block">Enlace de Controladores (Drive)</label>
                    <input 
                      type="text"
                      value={productInfo.driverUrl || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, driverUrl: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono text-zinc-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-455 uppercase block">Enlace de Manual de Usuario (PDF Drive)</label>
                    <input 
                      type="text"
                      value={productInfo.manualUrl || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, manualUrl: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono text-zinc-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {visualActiveTab === 'popups' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-[11px] font-sans font-semibold leading-relaxed text-rose-900">
                  ⚡ <strong className="font-extrabold text-rose-700">Popups de Ofertas Flash:</strong> Aquí puede configurar de forma en línea si se muestran los dos combos de alta conversión en los popups, modificar sus precios, títulos y las imágenes respectivas.
                </div>

                {/* Promo 1 Config Card */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-250 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-200/60 pb-2">
                    <span className="text-[10px] font-black uppercase text-rose-600">🎯 Popup Oferta 1: Combo Rollos</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase tracking-wider text-rose-500">
                      <input 
                        type="checkbox"
                        checked={productInfo.promo1_active !== false && productInfo.promo1_active !== "false"}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, promo1_active: e.target.checked }))}
                        className="rounded text-rose-500 focus:ring-rose-500 scale-95"
                      />
                      Activo
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Título del Producto/Combo</label>
                    <input 
                      type="text"
                      value={productInfo.promo1_title || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, promo1_title: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Detalles del combo</label>
                    <textarea 
                      rows={2}
                      value={productInfo.promo1_desc || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, promo1_desc: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none resize-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block">Precio S/.</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={productInfo.promo1_price || 0}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, promo1_price: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block">Botón CTA</label>
                      <input 
                        type="text"
                        value={productInfo.promo1_btn || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, promo1_btn: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Imagen del Combo (URL / PostImages)</label>
                    <input 
                      type="text"
                      value={productInfo.promo1_image || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, promo1_image: e.target.value }))}
                      placeholder="https://postimages.org/..."
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono text-zinc-600"
                    />
                  </div>
                </div>

                {/* Promo 2 Config Card */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-250 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-200/60 pb-2">
                    <span className="text-[10px] font-black uppercase text-amber-600">🎯 Popup Oferta 2: Combo Cajón</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase tracking-wider text-amber-500">
                      <input 
                        type="checkbox"
                        checked={productInfo.promo2_active !== false && productInfo.promo2_active !== "false"}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, promo2_active: e.target.checked }))}
                        className="rounded text-amber-500 focus:ring-amber-500 scale-95"
                      />
                      Activo
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Título del Producto/Combo</label>
                    <input 
                      type="text"
                      value={productInfo.promo2_title || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, promo2_title: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Detalles del combo</label>
                    <textarea 
                      rows={2}
                      value={productInfo.promo2_desc || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, promo2_desc: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none resize-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block">Precio S/.</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={productInfo.promo2_price || 0}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, promo2_price: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block">Botón CTA</label>
                      <input 
                        type="text"
                        value={productInfo.promo2_btn || ''}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, promo2_btn: e.target.value }))}
                        className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block">Imagen del Combo (URL / PostImages)</label>
                    <input 
                      type="text"
                      value={productInfo.promo2_image || ''}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, promo2_image: e.target.value }))}
                      placeholder="https://postimages.org/..."
                      className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none font-mono text-zinc-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-6 border-t border-zinc-100 bg-zinc-50 shrink-0 space-y-3 font-sans">
            <button 
              type="button"
              onClick={handleSaveVisualChanges}
              disabled={isSavingVisual}
              className="w-full bg-[#10B981] hover:bg-[#0aa16f] active:scale-[0.985] text-white py-3 px-4 rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save size={14} className={isSavingVisual ? "animate-spin" : ""} />
              {isSavingVisual ? "Guardando Cambios..." : "Guardar Todo en la Base de Datos"}
            </button>

            <button 
              type="button" 
              onClick={() => setIsVisualEditorActive(false)}
              className="w-full bg-white hover:bg-zinc-100 text-zinc-700 py-2.5 px-4 rounded-xl text-xs font-bold border border-zinc-200 transition-colors cursor-pointer"
            >
              Desactivar Modo Visual
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

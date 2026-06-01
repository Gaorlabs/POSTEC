import { OrderItem } from '../types';

export function buildWhatsAppMessage(
  orderId: number,
  customerName: string,
  customerWhatsapp: string,
  customerAddress: string,
  items: OrderItem[],
  total: number,
  paymentMethod?: 'yape' | 'bcp',
  targetWhatsapp?: string
): string {
  const itemsText = items
    .map((item) => `• ${item.quantity}x ${item.name} — S/.${item.price.toFixed(2)}`)
    .join('\n');

  const paymentText = paymentMethod === 'yape' ? 'Yape' : paymentMethod === 'bcp' ? 'Cuenta BCP' : 'No especificado';

  const message = `Hola, acabo de realizar un pedido en la tienda. En breve envío la captura del pago.

*Mis datos:*
👤 Nombre: ${customerName}
📍 Entrega: ${customerAddress}
💳 Pago por: ${paymentText}

*Pedido #${orderId}:*
${itemsText}

💰 *Total a pagar: S/.${total.toFixed(2)}*`;

  const cleanNumber = (targetWhatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '905820448').trim().replace(/[^0-9]/g, '');
  const destination = cleanNumber.startsWith('51') ? cleanNumber : `51${cleanNumber}`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${destination}?text=${encodedMessage}`;
}

export function buildProductInquiryMessage(productId: number, productName: string): string {
  const message = `Hola Pos-Tec, me interesa este producto: [ID: ${productId}] ${productName}. Deseo más información.`;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/51${whatsappNumber}?text=${encodedMessage}`;
}

export function buildCartQuoteMessage(items: OrderItem[], total: number): string {
  const itemsText = items
    .map((item) => `• ${item.quantity}x ${item.name}`)
    .join('\n');

  const message = `Hola Pos-Tec, deseo solicitar una cotización por los siguientes productos:

${itemsText}

Total estimado: S/.${total.toFixed(2)}

Quedo atento a su respuesta.`;

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/51${whatsappNumber}?text=${encodedMessage}`;
}

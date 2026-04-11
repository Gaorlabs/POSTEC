import { OrderItem } from '../types';

export function buildWhatsAppMessage(
  orderId: number,
  customerName: string,
  customerWhatsapp: string,
  customerAddress: string,
  items: OrderItem[],
  total: number
): string {
  const itemsText = items
    .map((item) => `• ${item.quantity}x ${item.name} — S/.${item.price.toFixed(2)}`)
    .join('\n');

  const message = `🛒 *NUEVO PEDIDO #${orderId}*

👤 Cliente: ${customerName}
📱 WhatsApp: ${customerWhatsapp}
📍 Dirección: ${customerAddress}

*Productos:*
${itemsText}

💰 *TOTAL: S/.${total.toFixed(2)}*

_Pedido realizado desde la tienda online_`;

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/51${whatsappNumber}?text=${encodedMessage}`;
}

export function buildProductInquiryMessage(productId: number, productName: string): string {
  const message = `Hola Pos-Tec, me interesa este producto: [ID: ${productId}] ${productName}. Deseo más información.`;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/51${whatsappNumber}?text=${encodedMessage}`;
}

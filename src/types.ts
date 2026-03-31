export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount?: number;
  brand?: string;
  stock?: number;
  category: string;
  image_url: string | null;
  created_at?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_whatsapp: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  status: 'pendiente' | 'pagado' | 'enviado' | 'cancelado';
  created_at: string;
}

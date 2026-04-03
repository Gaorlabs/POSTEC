export interface Product {
  id: number;
  name: string;
  sku?: string;
  colors?: string[];
  labels?: string[];
  description: string;
  features?: string;
  price: number;
  original_price?: number;
  discount?: number;
  brand?: string;
  stock?: number;
  category: string;
  image_url: string | null;
  image_urls?: string[];
  created_at?: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
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

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  last_interaction: string;
  notes: string;
  created_at: string;
}

export interface Interaction {
  id: string;
  customer_id: string;
  type: 'whatsapp' | 'llamada' | 'email';
  content: string;
  created_at: string;
}

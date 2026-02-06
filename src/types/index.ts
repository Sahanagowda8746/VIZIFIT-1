export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'hoodie' | 'tshirt' | 'dress' | 'jacket' | 'pants';
  isAIDesign?: boolean;
  aiPrompt?: string;
  aiDesignFee?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customDesign?: {
    prompt: string;
    image: string;
    fee: number;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type DesignComplexity = 'simple' | 'detailed' | 'complex';

export const DESIGN_FEES: Record<DesignComplexity, number> = {
  simple: 10,
  detailed: 20,
  complex: 30,
};

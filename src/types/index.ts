export type Category = {
  id: string;
  name: string;
}

export type GlobalOption = {
  id: string;
  type: 'color' | 'assembly';
  name: string;
  price?: number;
  image?: string;
  categoryIds?: string[];
  group?: string; // e.g., 'Entremeio', 'Crucifixo'
}

export type Variation = {
  id: string;
  name: string;
  price: number;
  image: string;
}

export type CustomizationList = {
  id: string;
  title: string;
  options: string; // Comma separated
}

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Até 5 imagens por produto
  category?: string; // Legado / categoria principal
  categories?: string[]; // Múltiplas categorias
  subcategory?: string;
  isCustomizable?: boolean; // Legacy/Montagem
  hasAssemblyOption?: boolean;
  hasColorOption?: boolean;
  isActive?: boolean;
  isFeatured?: boolean; // Produto em Destaque na Home
  availableColors?: string;
  hasNameOption?: boolean;
  namePrice?: number;
  variations?: Variation[];
  customizationLists?: CustomizationList[];
  selectedVariation?: any;
}

export type CartItem = Product & {
  quantity: number;
  selectedVariation?: any;
}

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string, productName?: string) => void;
  updateQuantity: (productId: string, quantity: number, productName?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  step: 'cart' | 'checkout';
  setStep: (step: 'cart' | 'checkout') => void;
}

export type ShopSettings = {
  name: string;
  whatsapp: string;
  niche: string;
  instagram: string;
  tiktok: string;
  slogan: string;
}

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  date: string;
  created_at?: string;
}

export type Order = {
  id: string;
  client_name: string;
  cep: string;
  cidade_uf: string;
  payment_method: string;
  total_price: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  status: 'pending' | 'approved' | 'cancelled';
  created_at?: string;
}

// Dummy export to ensure this is treated as a module with values if needed
export const TYPES_VERSION = "1.0.0";

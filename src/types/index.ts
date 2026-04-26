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
  category?: string;
  subcategory?: string;
  isCustomizable?: boolean;
  isActive?: boolean;
  availableColors?: string;
  hasNameOption?: boolean;
  variations?: Variation[];
  customizationLists?: CustomizationList[];
}

export type CartItem = Product & {
  quantity: number;
  selectedVariation?: Variation;
}

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string, productName?: string) => void;
  updateQuantity: (productId: string, quantity: number, productName?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Dummy export to ensure this is treated as a module with values if needed
export const TYPES_VERSION = "1.0.0";

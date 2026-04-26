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
  availableColors?: string; // Comma separated colors
  hasNameOption?: boolean;
}

export type CartItem = Product & {
  quantity: number;
}

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Dummy export to ensure this is treated as a module with values if needed
export const TYPES_VERSION = "1.0.0";

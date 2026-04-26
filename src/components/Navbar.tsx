import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const { settings } = useData();

  return (
    <nav className="fixed top-0 left-0 right-0 glass-morphism z-40 border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center text-gold font-serif text-sm">
            {settings.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-none text-gold uppercase tracking-wider">
              {settings.name}
            </span>
            <span className="text-[8px] text-gold/60 uppercase tracking-[0.2em] font-medium">
              {settings.slogan}
            </span>
          </div>
        </div>

        <button
          onClick={onCartClick}
          className="relative p-2 text-gold hover:bg-gold/10 rounded-full transition-colors"
        >
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-gold text-navy text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-navy">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

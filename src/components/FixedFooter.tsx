import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FixedFooterProps {
  onClick: () => void;
}

export const FixedFooter: React.FC<FixedFooterProps> = ({ onClick }) => {
  const { totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-40 md:hidden"
        >
          <button
            onClick={onClick}
            className="w-full bg-navy border border-gold/20 text-gold p-4 rounded-2xl flex items-center justify-between shadow-2xl active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gold w-10 h-10 rounded-xl flex items-center justify-center text-navy">
                <ShoppingBag size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-gold/40 leading-none mb-1">Ver Carrinho</p>
                <p className="font-bold">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <ArrowRight size={20} className="text-gold" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

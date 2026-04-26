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
            className="w-full gold-bg-gradient text-navy p-5 rounded-[24px] flex items-center justify-between shadow-2xl active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-navy/10 w-12 h-12 rounded-xl flex items-center justify-center text-navy shadow-inner group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black text-navy/40 tracking-widest leading-none mb-1">Ver Carrinho</p>
                <p className="font-black text-lg leading-none">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black tabular-nums">
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <div className="bg-navy/10 p-2 rounded-full group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} strokeWidth={3} />
              </div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const { settings } = useData();

  const handleCheckout = () => {
    const message = `Olá Ateliê Entre Santos! Gostaria de fazer um pedido:\n\n` +
      cart.map(item => `📦 *${item.quantity}x ${item.name}*\n   ${(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`).join('\n\n') +
      `\n\n━━━━━━━━━━━━━━━\n*💰 Total: ${totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n━━━━━━━━━━━━━━━\n\n🙌 Juntos a caminho da santidade!\n\nAguardando confirmação...`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="bg-whatsapp/10 p-2 rounded-xl text-whatsapp">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900">Seu Carrinho</h2>
                  <p className="text-xs text-gray-500">{totalItems} itens selecionados</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <X size={48} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Seu carrinho está vazio</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-whatsapp font-bold hover:underline"
                  >
                    Voltar para a loja
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-1">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-whatsapp">
                          {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gold/10 bg-navy space-y-4">
                <div className="flex items-center justify-between text-gold">
                  <span className="font-serif font-medium uppercase tracking-widest text-xs opacity-60">Total do Pedido:</span>
                  <span className="text-3xl font-bold">
                    {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full gold-bg-gradient text-navy py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-gold/30 active:scale-95 hover:scale-[1.02]"
                >
                  <MessageCircle size={24} />
                  Enviar Pedido no WhatsApp
                </button>
                <p className="text-[9px] text-center text-gold/40 uppercase tracking-[0.2em] font-black">
                  Finalize sua compra de forma segura no WhatsApp
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

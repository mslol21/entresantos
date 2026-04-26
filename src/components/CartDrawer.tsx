import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, MessageCircle, ShoppingBag } from 'lucide-react';
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
            className="fixed inset-0 bg-navy/80 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-navy z-50 shadow-[0_0_50px_-12px_rgba(212,175,55,0.15)] flex flex-col border-l border-gold/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-gold/10 flex items-center justify-between bg-navy-light/50 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-gold/10 p-3 rounded-2xl text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <ShoppingBag size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-2xl text-gold uppercase tracking-widest">Meu Carrinho</h2>
                  <p className="text-[10px] text-gold/40 uppercase tracking-[0.2em] font-black">{totalItems} itens selecionados</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-gold/10 rounded-full transition-all text-gold/40 hover:text-gold hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-premium">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-navy-light p-10 rounded-full mb-8 border border-gold/5 shadow-2xl relative"
                  >
                    <ShoppingBag size={64} className="text-gold/10" strokeWidth={1} />
                    <div className="absolute inset-0 bg-gold/5 rounded-full blur-2xl animate-pulse" />
                  </motion.div>
                  <h3 className="text-gold/80 font-serif text-2xl mb-3">Carrinho Vazio</h3>
                  <p className="text-gold/30 text-xs uppercase tracking-[0.3em] font-medium leading-loose mb-10">
                    Sua jornada de fé aguarda a primeira peça exclusiva.
                  </p>
                  <button
                    onClick={onClose}
                    className="text-navy bg-gold px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20"
                  >
                    Explorar Coleções
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div 
                      key={`${item.id}-${item.name}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-5 p-4 bg-navy-light/40 rounded-[24px] border border-gold/5 group hover:border-gold/20 hover:bg-navy-light/60 transition-all duration-500"
                    >
                      <div className="w-24 h-24 bg-navy rounded-2xl overflow-hidden flex-shrink-0 border border-gold/10 shadow-inner group-hover:border-gold/30 transition-colors">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-gold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-gold-light transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[9px] text-gold/30 uppercase tracking-widest font-medium">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.name)}
                            className="text-gold/20 hover:text-red-500 transition-all p-1 hover:bg-red-500/5 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-bold text-gold text-lg tabular-nums">
                            {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <div className="flex items-center gap-4 bg-navy/80 px-4 py-2 rounded-xl border border-gold/10 shadow-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.name)}
                              className="text-gold/40 hover:text-gold transition-all active:scale-75"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="text-sm font-black w-6 text-center text-gold tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.name)}
                              className="text-gold/40 hover:text-gold transition-all active:scale-75"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-gold/10 bg-navy-light/80 backdrop-blur-2xl space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gold/40 text-[10px] uppercase tracking-[0.2em] font-black">
                    <span>Subtotal</span>
                    <span className="tabular-nums">
                      {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gold">
                    <span className="font-serif font-bold text-lg">Total do Pedido</span>
                    <span className="text-3xl font-black tabular-nums drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                      {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full gold-bg-gradient text-navy py-6 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-gold/30 active:scale-[0.98] hover:scale-[1.02] hover:shadow-gold/40 group"
                >
                  <MessageCircle size={24} strokeWidth={2.5} className="group-hover:animate-bounce" />
                  Finalizar no WhatsApp
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-gold/30 uppercase tracking-[0.15em] font-black">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Atendimento Personalizado via WhatsApp
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

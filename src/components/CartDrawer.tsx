import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { settings } = useData();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [cidadeUf, setCidadeUf] = useState('');
  const [pagamento, setPagamento] = useState<'Pix' | 'Cartão' | 'Boleto'>('Pix');
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCep(value);
    
    if (value.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCidadeUf(`${data.localidade}/${data.uf}`);
        } else {
          setCidadeUf('');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleCheckout = () => {
    const formattedItems = cart.map(item => {
      const formattedName = item.name.includes('(')
        ? item.name.replace(/\s*\(([^)]+)\)/, ' — $1')
        : item.name;
      const itemSubtotal = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return `${item.quantity}x ${formattedName}\n💲 ${itemSubtotal}`;
    }).join('\n\n');

    const totalFormatted = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const message = `Olá, Ateliê Entre Santos! 🙏\n\n` +
      `Gostaria de fazer um pedido:\n\n` +
      `📦 *ITENS DO PEDIDO*\n` +
      `${formattedItems}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `💰 *Total: ${totalFormatted}*\n` +
      `━━━━━━━━━━━━━━━\n\n` +
      `👤 *MEUS DADOS*\n` +
      `Nome: ${nome.trim()}\n` +
      `CEP: ${cep.trim()}\n` +
      `Cidade/UF: ${cidadeUf.trim()}\n\n` +
      `💳 *Pagamento:* ${pagamento}\n\n` +
      `🙌 Juntos a caminho da santidade!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after checkout
    setTimeout(() => {
      clearCart();
      setStep('cart');
      setNome('');
      setCep('');
      setCidadeUf('');
      onClose();
    }, 1000);
  };

  const handleCloseWrapper = () => {
    setStep('cart');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseWrapper}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col border-l border-gold/20"
          >
            {/* Header */}
            <div className="p-8 border-b border-gold/20 flex items-center justify-between bg-cream sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-gold/10 p-3 rounded-full text-gold-dark border border-gold/25 shadow-sm">
                  <ShoppingBag size={24} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h2 className="font-serif font-bold text-2xl text-navy uppercase tracking-widest">
                    {step === 'cart' ? 'Meu Carrinho' : 'Finalizar Pedido'}
                  </h2>
                  <p className="text-[10px] text-navy/40 uppercase tracking-[0.2em] font-black">
                    {step === 'cart' ? `${totalItems} itens selecionados` : 'Preencha seus dados'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseWrapper}
                className="p-2.5 hover:bg-navy/5 rounded-full transition-all text-navy/40 hover:text-navy hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items Area / Form Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-premium">
              {step === 'cart' ? (
                cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-8">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white p-10 rounded-full mb-8 border border-gold/15 shadow-md relative"
                    >
                      <ShoppingBag size={64} className="text-gold/20" strokeWidth={1} />
                      <div className="absolute inset-0 bg-gold/5 rounded-full blur-2xl animate-pulse" />
                    </motion.div>
                    <h3 className="text-navy/80 font-serif text-2xl mb-3">Carrinho Vazio</h3>
                    <p className="text-navy/60 text-xs uppercase tracking-[0.3em] font-medium leading-loose mb-10">
                      Sua jornada de fé aguarda a primeira peça exclusiva.
                    </p>
                    <button
                      onClick={handleCloseWrapper}
                      className="text-navy bg-gold px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20 cursor-pointer"
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
                        className="flex flex-col p-5 bg-white rounded-[32px] border border-gold/15 group hover:border-gold/30 hover:shadow-premium transition-all duration-500"
                      >
                        <div className="flex gap-5 text-left">
                          <div className="w-24 h-24 bg-cream-light rounded-[20px] overflow-hidden flex-shrink-0 border border-gold/15 group-hover:border-gold/30 transition-colors">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                            />
                          </div>
                          <div className="flex-grow flex flex-col py-1">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <div>
                                <h4 className="font-bold text-navy text-base line-clamp-1 leading-tight group-hover:text-gold-dark transition-colors">
                                  {item.name.split('(')[0].trim()}
                                </h4>
                                <p className="text-[10px] text-navy/40 uppercase tracking-[0.15em] font-black">{item.category}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id, item.name)}
                                className="text-navy/20 hover:text-red-500 transition-all p-2 hover:bg-red-500/5 rounded-full cursor-pointer"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="flex-grow">
                              {item.name.includes('(') && (
                                <div className="bg-cream-light p-2 rounded-xl border border-gold/15 mt-1">
                                  <p className="text-[10px] text-navy/60 leading-relaxed italic">
                                    {item.name.match(/\(([^)]+)\)/)?.[1].split(',').map((detail, idx) => (
                                      <span key={idx} className="inline-flex items-center gap-1 mr-2 mb-1 px-2 py-0.5 bg-gold/10 rounded-full border border-gold/20 text-gold-dark">
                                        <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                                        {detail.trim()}
                                      </span>
                                    ))}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gold/10">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-navy/40 uppercase tracking-widest font-black mr-2">Qtd:</span>
                            <div className="flex items-center gap-4 bg-cream px-4 py-2 rounded-full border border-gold/25 shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.name)}
                                className="text-navy/55 hover:text-navy transition-all active:scale-75 cursor-pointer"
                              >
                                <Minus size={14} strokeWidth={3} />
                              </button>
                              <span className="text-sm font-black w-6 text-center text-navy tabular-nums">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.name)}
                                className="text-navy/55 hover:text-navy transition-all active:scale-75 cursor-pointer"
                              >
                                <Plus size={14} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-navy/40 uppercase tracking-[0.2em] font-black leading-none mb-1">Subtotal</p>
                            <span className="font-bold text-navy text-lg tabular-nums">
                              {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-6 p-2 text-left">
                  <div>
                    <label className="label-base" htmlFor="nome">Seu Nome *</label>
                    <input
                      id="nome"
                      type="text"
                      required
                      placeholder="Digite seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="label-base" htmlFor="cep">Seu CEP *</label>
                    <div className="relative">
                      <input
                        id="cep"
                        type="text"
                        required
                        maxLength={8}
                        placeholder="Apenas números (Ex: 01001000)"
                        value={cep}
                        onChange={handleCepChange}
                        className="input-base pr-12"
                      />
                      {loadingCep && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label-base" htmlFor="cidadeUf">Cidade / UF *</label>
                    <input
                      id="cidadeUf"
                      type="text"
                      required
                      placeholder="Ex: São Paulo/SP"
                      value={cidadeUf}
                      onChange={(e) => setCidadeUf(e.target.value)}
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="label-base">Forma de Pagamento *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Pix', 'Cartão', 'Boleto'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPagamento(method)}
                          className={`py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all active:scale-95 cursor-pointer ${
                            pagamento === method
                              ? 'bg-navy text-white border-navy shadow-sm'
                              : 'bg-white text-navy/70 border-gold/25 hover:border-gold/50'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Area */}
            {cart.length > 0 && (
              step === 'cart' ? (
                <div className="p-8 border-t border-gold/20 bg-white shadow-lg space-y-6">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between text-navy/50 text-[10px] uppercase tracking-[0.2em] font-black">
                      <span>Subtotal</span>
                      <span className="tabular-nums">
                        {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-navy">
                      <span className="font-serif font-bold text-lg">Total do Pedido</span>
                      <span className="text-3xl font-black tabular-nums">
                        {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full gold-bg-gradient text-white py-6 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-gold/20 active:scale-[0.98] hover:scale-[1.02] group cursor-pointer"
                  >
                    <MessageCircle size={24} strokeWidth={2.5} className="group-hover:animate-bounce" />
                    Avançar para Checkout
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-navy/40 uppercase tracking-[0.15em] font-black">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Atendimento Personalizado via WhatsApp
                  </div>
                </div>
              ) : (
                <div className="p-8 border-t border-gold/20 bg-white shadow-lg space-y-4">
                  <div className="flex items-center justify-between text-navy mb-2">
                    <span className="font-serif font-bold text-lg text-left">Total do Pedido</span>
                    <span className="text-2xl font-black tabular-nums">
                      {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={!nome.trim() || !cep.trim() || !cidadeUf.trim()}
                    className={`w-full gold-bg-gradient text-white py-6 rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-gold/20 active:scale-[0.98] hover:scale-[1.02] group cursor-pointer ${
                      (!nome.trim() || !cep.trim() || !cidadeUf.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <MessageCircle size={24} strokeWidth={2.5} className="group-hover:animate-bounce" />
                    Finalizar no WhatsApp
                  </button>
                  
                  <button
                    onClick={() => setStep('cart')}
                    className="w-full text-center text-xs font-bold uppercase tracking-widest text-navy/55 hover:text-navy py-2 transition-colors cursor-pointer"
                  >
                    Voltar para o Carrinho
                  </button>
                </div>
              )
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

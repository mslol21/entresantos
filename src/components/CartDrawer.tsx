import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { RosaryVectorIcon } from './icons/ProductIcons';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart, step, setStep } = useCart();
  const { settings, addOrder } = useData();

  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [cidadeUf, setCidadeUf] = useState('');
  const pagamento = 'Pix';
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
          const endereco = data.logradouro ? `${data.logradouro}, ${data.bairro} — ${data.localidade}/${data.uf}` : `${data.localidade}/${data.uf}`;
          setCidadeUf(endereco);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleCheckout = async () => {
    const formattedItems = cart.map(item => {
      let details = '';
      if (item.customization) {
        const s = item.customization.selections || {};
        const parts = [
          `Código: ${item.customization.code}`,
          `Modelo: ${item.customization.model || s.model?.name || 'Tradicional'}`,
          `Contas Ave-Marias: ${s.bead?.name || 'Clássicas'}`,
          `Contas Pai-Nossos: ${s.ourFather?.name || s.bead?.name || 'Padrão'}`,
          `Entremeio: ${s.centerpiece?.name || 'N. Sra. Aparecida'}`,
          `Crucifixo: ${s.crucifix?.name || 'Barroco'}`,
        ];
        if (s.extras && Array.isArray(s.extras) && s.extras.length > 0) {
          parts.push(`Extras: ${s.extras.map((e: any) => e.name).join(', ')}`);
        }
        if (s.customName) {
          parts.push(`Nome Gravado: ${s.customName}`);
        }
        if (s.customMessage) {
          parts.push(`Cartão: "${s.customMessage}"`);
        }
        if (s.notes) {
          parts.push(`Obs: ${s.notes}`);
        }
        details = `\n   └─ *Configuração Exclusiva:*\n      • ` + parts.join('\n      • ');
      } else if (item.name.includes('(')) {
        details = item.name.replace(/\s*\(([^)]+)\)/, '\n   └─ Customização: $1');
      }

      const itemSubtotal = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const mainName = item.name.split('(')[0].trim();
      return `• *${item.quantity}x ${mainName}*${details}\n  Subtotal: ${itemSubtotal}`;
    }).join('\n\n');

    const totalFormatted = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const message = `✨ *NOVO PEDIDO - ATELIÊ ENTRE SANTOS* ✨\n\n` +
      `👤 *DADOS DO CLIENTE*\n` +
      `• *Nome:* ${nome.trim()}\n` +
      `• *CEP:* ${cep.trim()}\n` +
      `• *Endereço/Cidade:* ${cidadeUf.trim()}\n` +
      `• *Forma de Pagamento:* ${pagamento} (Chave Pix no Atendimento)\n\n` +
      `📦 *ITENS SOLICITADOS*\n` +
      `${formattedItems}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *VALOR TOTAL: ${totalFormatted}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🙏 *Muito obrigado pela preferência! Juntos a caminho da santidade.*`;
    
    // Prepare items JSON list for Supabase
    const itemsJson = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      customization: item.customization || undefined
    }));

    // Log the order to the database as pending
    try {
      await addOrder({
        client_name: nome.trim(),
        cep: cep.trim(),
        cidade_uf: cidadeUf.trim(),
        payment_method: pagamento,
        total_price: totalPrice,
        items: itemsJson
      });
    } catch (err) {
      console.error('Erro ao registrar pedido no sistema:', err);
    }

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
                className="p-2.5 hover:bg-navy/5 rounded-full transition-all text-navy/40 hover:text-navy hover:rotate-90 cursor-pointer"
                aria-label="Fechar"
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
                        key={`${item.id}-${item.name}-${item.customization?.code || ''}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col p-5 bg-white rounded-[32px] border border-gold/15 group hover:border-gold/30 hover:shadow-premium transition-all duration-500"
                      >
                        <div className="flex gap-5 text-left">
                          <div className="w-24 h-24 bg-cream-light rounded-[20px] overflow-hidden flex-shrink-0 border border-gold/15 group-hover:border-gold/30 transition-colors flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                              />
                            ) : (
                              <RosaryVectorIcon size={32} className="text-gold-dark" />
                            )}
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
                                aria-label="Remover item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            {/* Customization Details Rendering */}
                            <div className="flex-grow">
                              {item.customization ? (
                                <div className="bg-cream/70 p-3 rounded-2xl border border-gold/20 mt-1 space-y-1.5 text-[11px] text-navy/70">
                                  <div className="flex items-center gap-1.5 font-mono font-bold text-navy text-xs">
                                    <Sparkles size={12} className="text-gold-dark" />
                                    <span>{item.customization.code}</span>
                                    <span className="text-[10px] font-sans font-normal text-navy/50">• {item.customization.model}</span>
                                  </div>
                                  <p className="line-clamp-2 text-[10px] text-navy/65">
                                    {[
                                      item.customization.selections?.bead?.name && `Contas: ${item.customization.selections.bead.name}`,
                                      item.customization.selections?.centerpiece?.name && `Entremeio: ${item.customization.selections.centerpiece.name}`,
                                      item.customization.selections?.crucifix?.name && `Cruz: ${item.customization.selections.crucifix.name}`,
                                      item.customization.selections?.customName && `Nome: ${item.customization.selections.customName}`
                                    ].filter(Boolean).join(' • ')}
                                  </p>
                                </div>
                              ) : item.name.includes('(') ? (
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
                              ) : null}
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
                                aria-label="Diminuir quantidade"
                              >
                                <Minus size={14} strokeWidth={3} />
                              </button>
                              <span className="text-sm font-black w-6 text-center text-navy tabular-nums">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.name)}
                                className="text-navy/55 hover:text-navy transition-all active:scale-75 cursor-pointer"
                                aria-label="Aumentar quantidade"
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
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Como podemos te chamar?"
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="label-base flex items-center justify-between" htmlFor="cep">
                      <span>CEP para Entrega *</span>
                      {loadingCep && <span className="text-xs text-gold-dark font-medium animate-pulse">Buscando endereço...</span>}
                    </label>
                    <input
                      id="cep"
                      type="text"
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      maxLength={8}
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="label-base" htmlFor="cidadeUf">Endereço Completo & Cidade/UF *</label>
                    <input
                      id="cidadeUf"
                      type="text"
                      value={cidadeUf}
                      onChange={(e) => setCidadeUf(e.target.value)}
                      placeholder="Rua, Número, Bairro — Cidade/UF"
                      className="input-base"
                    />
                  </div>

                  <div className="p-4 bg-cream/70 rounded-2xl border border-gold/20 text-xs text-navy/70 space-y-1">
                    <p className="font-bold text-navy">💳 Pagamento Seguro via Pix</p>
                    <p>Você receberá a chave Pix e confirmará os detalhes do pedido diretamente no WhatsApp do Ateliê.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gold/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy/50 uppercase tracking-widest">Total do Pedido</span>
                  <span className="text-2xl font-serif font-bold text-navy">
                    {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                {step === 'cart' ? (
                  <button
                    onClick={() => setStep('checkout')}
                    className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest justify-center shadow-lg cursor-pointer"
                  >
                    Avançar para Dados de Entrega
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={!nome.trim() || !cep.trim() || !cidadeUf.trim()}
                      className="btn-whatsapp w-full py-4 text-xs font-bold uppercase tracking-widest justify-center shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <MessageCircle size={18} />
                      Confirmar Pedido via WhatsApp
                    </button>
                    <button
                      onClick={() => setStep('cart')}
                      className="w-full py-2.5 text-xs text-navy/50 hover:text-navy font-bold uppercase tracking-wider text-center cursor-pointer"
                    >
                      Voltar ao Carrinho
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

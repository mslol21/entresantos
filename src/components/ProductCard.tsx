import React, { useState } from 'react';
import { Plus, Settings2, Check, X, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customOptions, setCustomOptions] = useState({
    cor: '',
    nome: '',
    entremeio: '',
    crucifixo: ''
  });

  const isMonteSeuTerco = product.isCustomizable;
  const hasNameOption = product.hasNameOption; // Use strictly what's in the DB
  const colorList = product.availableColors 
    ? product.availableColors.split(',').map(c => c.trim()).filter(c => c !== '') 
    : [];
  
  // A product needs customizer if it's a special item, has name option or has specific color list
  // If it doesn't have these, but "cor" is still required, we might still show customizer.
  // Let's assume if it has NO specific colors and NO name option and NOT monte-seu-terco, it's a direct buy.
  const needsCustomizer = isMonteSeuTerco || hasNameOption || colorList.length > 0;

  const handleDirectAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleAddToCart = () => {
    let customName = product.name;
    const details = [];
    
    if (customOptions.cor) details.push(`Cor: ${customOptions.cor}`);
    if (customOptions.nome && hasNameOption) details.push(`Nome: ${customOptions.nome}`);
    if (isMonteSeuTerco) {
      if (customOptions.entremeio) details.push(`Entremeio: ${customOptions.entremeio}`);
      if (customOptions.crucifixo) details.push(`Crucifixo: ${customOptions.crucifixo}`);
    }
    
    if (details.length > 0) {
      customName = `${product.name} (${details.join(', ')})`;
    }
    
    addToCart({ ...product, name: customName });
    setShowCustomizer(false);
    setCustomOptions({ cor: '', nome: '', entremeio: '', crucifixo: '' });
  };

  const nameLength = customOptions.nome.length;

  const renderMedia = () => {
    const url = product.image;
    if (!url) return <div className="w-full h-full bg-navy-light flex items-center justify-center text-gold/20"><ShoppingBag size={48} /></div>;

    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

    if (isVideo) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`}
            className="w-full h-full object-cover pointer-events-none scale-150"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        );
      }
      return (
        <video 
          src={url} 
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <img
        src={url}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
    );
  };

  return (
    <div className="card-premium group flex flex-col h-full relative overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-navy-light">
        {renderMedia()}
        {needsCustomizer && (
          <div className="absolute top-4 left-4 bg-gold/90 text-navy px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <Settings2 size={10} strokeWidth={3} />
            Personalizável
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[11px] text-gold/40 uppercase tracking-[0.25em] font-black">
            {product.category}
          </span>
        </div>
        <h3 className="font-serif font-bold text-xl md:text-2xl text-gold mb-3 group-hover:text-gold-light transition-colors line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-xs md:text-sm text-gold/50 mb-6 line-clamp-3 flex-grow leading-relaxed font-medium">
          {product.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto pt-6 border-t border-gold/10 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gold/30 block mb-0.5 uppercase tracking-widest font-black">Investimento</span>
            <span className="text-2xl font-bold text-gold tabular-nums leading-none">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          
          {needsCustomizer ? (
            <button
              onClick={() => setShowCustomizer(true)}
              className="w-full sm:w-auto gold-bg-gradient text-navy px-6 py-3.5 rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
            >
              <Settings2 size={18} strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-wider">Opções</span>
            </button>
          ) : (
            <button
              onClick={handleDirectAdd}
              className="w-full sm:w-auto bg-gold/10 text-gold border border-gold/30 px-6 py-3.5 rounded-2xl hover:bg-gold hover:text-navy transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-wider">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Customizer Overlay */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 bg-navy z-20 p-6 flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-serif font-bold text-gold text-lg">Personalizar</h4>
                <p className="text-[10px] text-gold/40 uppercase tracking-widest">{product.name}</p>
              </div>
              <button 
                onClick={() => setShowCustomizer(false)} 
                className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold hover:bg-gold/20 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-8 flex-grow pb-24">
              {/* Color Selection */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                  1. Escolha a Cor <span className="text-red-500">*</span>
                </label>
                {colorList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {colorList.map(color => (
                      <button
                        key={color}
                        onClick={() => setCustomOptions({...customOptions, cor: color})}
                        className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                          customOptions.cor === color 
                            ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20' 
                            : 'bg-navy-light text-gold/60 border-gold/10 hover:border-gold/30'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative group">
                    <input 
                      type="text"
                      placeholder="Ex: Azul Celeste, Rosa Quartzo..."
                      value={customOptions.cor}
                      onChange={(e) => setCustomOptions({...customOptions, cor: e.target.value})}
                      className="w-full bg-navy-light border border-gold/20 rounded-2xl p-5 text-gold text-sm focus:border-gold outline-none transition-all placeholder:text-gold/20"
                      autoFocus
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/20 group-focus-within:text-gold transition-colors">
                      <Check size={20} />
                    </div>
                  </div>
                )}
              </div>

              {isMonteSeuTerco && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                      2. Selecione o Entremeio <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Nossa Senhora Aparecida', 'Nossa Senhora das Graças', 'Sagrado Coração de Jesus', 'Santo Expedito', 'São Bento'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setCustomOptions({...customOptions, entremeio: opt})}
                          className={`flex items-center justify-between p-4 rounded-xl text-xs font-bold transition-all border ${
                            customOptions.entremeio === opt 
                              ? 'bg-gold/10 text-gold border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                              : 'bg-navy-light/50 text-gold/40 border-gold/5 hover:border-gold/20'
                          }`}
                        >
                          {opt}
                          {customOptions.entremeio === opt && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                      3. Escolha o Crucifixo <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Clássico Dourado', 'Trabalhado Luxo', 'Cruz de São Bento', 'Minimalista'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setCustomOptions({...customOptions, crucifixo: opt})}
                          className={`flex items-center justify-between p-4 rounded-xl text-xs font-bold transition-all border ${
                            customOptions.crucifixo === opt 
                              ? 'bg-gold/10 text-gold border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                              : 'bg-navy-light/50 text-gold/40 border-gold/5 hover:border-gold/20'
                          }`}
                        >
                          {opt}
                          {customOptions.crucifixo === opt && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {hasNameOption && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                      {isMonteSeuTerco ? '4.' : '2.'} Nome na Peça <span className="text-gold/20 font-normal">(Opcional)</span>
                    </label>
                    <span className={`text-[10px] font-black tracking-tighter ${nameLength > 10 ? 'text-red-500' : 'text-gold/40'}`}>
                      {nameLength}/10
                    </span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Ex: Maria"
                      maxLength={10}
                      value={customOptions.nome}
                      onChange={(e) => setCustomOptions({...customOptions, nome: e.target.value})}
                      className={`w-full bg-navy-light border rounded-2xl p-5 text-gold text-sm outline-none transition-all placeholder:text-gold/20 ${
                        nameLength > 10 ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gold/10 focus:border-gold shadow-inner'
                      }`}
                    />
                    {customOptions.nome && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                        {customOptions.nome.split('').map((char, i) => (
                          <span key={i} className="w-5 h-5 bg-gold text-navy rounded-sm flex items-center justify-center text-[10px] font-black border border-gold-dark shadow-sm">
                            {char.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-gold/30 italic flex items-center gap-1.5 px-1">
                    <Check size={10} />
                    Personalização artesanal com contas de letras inclusas.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gold/10 bg-navy sticky bottom-0 z-30 pb-4">
              <div className="mb-4 px-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[9px] uppercase font-black text-gold/30 tracking-[0.2em]">Resumo</span>
                  <span className="text-gold font-bold text-lg tabular-nums">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="text-[10px] text-gold/50 font-medium italic">
                  {customOptions.cor ? `Cor: ${customOptions.cor}` : 'Selecione a cor...'}
                  {customOptions.nome && ` • Nome: ${customOptions.nome}`}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!customOptions.cor || (isMonteSeuTerco && (!customOptions.entremeio || !customOptions.crucifixo))}
                className="w-full gold-bg-gradient text-navy py-5 rounded-[22px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all shadow-2xl shadow-gold/30 active:scale-[0.98] hover:shadow-gold/40"
              >
                <ShoppingBag size={18} strokeWidth={2.5} />
                Adicionar ao Carrinho
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

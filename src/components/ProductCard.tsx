import React, { useState } from 'react';
import { Plus, Settings2, Check, X, ShoppingBag } from 'lucide-react';
import type { Product, Variation, GlobalOption } from '../types';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { globalOptions } = useData();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | GlobalOption | null>(null);

  const [customOptions, setCustomOptions] = useState<Record<string, string>>({});

  const relevantColors = globalOptions.filter(o => o.type === 'color' && o.categoryIds?.includes(product.category || ''));
  const relevantAssembly = globalOptions.filter(o => o.type === 'assembly' && o.categoryIds?.includes(product.category || ''));

  const isMonteSeuTerco = product.isCustomizable;
  const hasNameOption = product.hasNameOption;
  const colorList = product.availableColors 
    ? product.availableColors.split(',').map(c => c.trim()).filter(c => c !== '') 
    : [];
  
  const needsCustomizer = isMonteSeuTerco || hasNameOption || colorList.length > 0 || (product.variations && product.variations.length > 0) || relevantColors.length > 0 || relevantAssembly.length > 0;

  const handleDirectAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  // Price Calculation: Base + Variation Add-on + Assembly Add-ons
  const getBasePrice = () => {
    // If it's a legacy variation (Variation type), it usually replaces the price
    if (selectedVariation && !('type' in selectedVariation)) return selectedVariation.price;
    return product.price;
  };

  const getAddonsPrice = () => {
    let total = 0;
    // Add Global Color price if selected
    if (selectedVariation && 'type' in selectedVariation) {
      total += selectedVariation.price || 0;
    }
    // Add Assembly options prices
    relevantAssembly.forEach(opt => {
      if (customOptions[opt.id]) total += opt.price || 0;
    });
    return total;
  };

  const displayPrice = getBasePrice() + getAddonsPrice();
  const displayImage = selectedVariation ? selectedVariation.image : product.image;

  const handleAddToCart = () => {
    let customName = product.name;
    const details = [];
    
    if (selectedVariation) {
      details.push(`${selectedVariation.name}`);
    } else if (customOptions.cor) {
      details.push(`Cor: ${customOptions.cor}`);
    }

    if (customOptions.nome && hasNameOption) details.push(`Nome: ${customOptions.nome}`);
    
    // Add all dynamic customization lists
    if (product.customizationLists) {
      product.customizationLists.forEach(list => {
        if (customOptions[list.id]) {
          details.push(`${list.title}: ${customOptions[list.id]}`);
        }
      });
    }

    // Add relevant assembly options
    relevantAssembly.forEach(opt => {
      if (customOptions[opt.id]) {
        details.push(`${opt.name}`);
      }
    });

    if (details.length > 0) {
      customName = `${product.name} (${details.join(', ')})`;
    }
    
    addToCart({ 
      ...product, 
      name: customName, 
      price: displayPrice, 
      image: displayImage,
      selectedVariation: selectedVariation || undefined 
    });
    
    setShowCustomizer(false);
    setCustomOptions({});
    setSelectedVariation(null);
  };

  const nameLength = (customOptions.nome || '').length;

  const renderMedia = () => {
    const url = displayImage;
    if (!url) return <div className="w-full h-full bg-navy-light flex items-center justify-center text-gold/20"><ShoppingBag size={48} /></div>;
    // ... (rest of renderMedia stays similar but uses displayImage)

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
              {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
              {/* Global Colors (Library) */}
              {relevantColors.length > 0 && (
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                    Cores / Materiais <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {relevantColors.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariation(v)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-3 ${
                          selectedVariation?.id === v.id 
                            ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20' 
                            : 'bg-navy-light text-gold/60 border-gold/10 hover:border-gold/30'
                        }`}
                      >
                        <div className="w-12 h-12 bg-navy rounded-lg overflow-hidden flex-shrink-0 border border-gold/10">
                          {v.image ? (
                            v.image.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={v.image} className="w-full h-full object-cover" />
                            ) : (
                              <img src={v.image} className="w-full h-full object-cover" />
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gold/10"><ShoppingBag size={16} /></div>
                          )}
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                          <span>{v.name}</span>
                          {v.price && v.price > 0 && (
                            <span className="text-[8px] opacity-60">
                              + {(v.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Old Variations Section (Hidden if Global Colors exist to avoid redundancy) */}
              {(!relevantColors.length && product.variations && product.variations.length > 0) && (
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                    Escolha a Variação <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {product.variations.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariation(v)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-3 ${
                          selectedVariation?.id === v.id 
                            ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20' 
                            : 'bg-navy-light text-gold/60 border-gold/10 hover:border-gold/30'
                        }`}
                      >
                        <img src={v.image} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex flex-col items-start leading-tight">
                          <span>{v.name}</span>
                          <span className="text-[8px] opacity-60">{v.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection (Legacy / Additional) */}
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

              {/* Global Assembly Options */}
              {relevantAssembly.length > 0 && (
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                    Escolha as Opções <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {relevantAssembly.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setCustomOptions(prev => ({ ...prev, [opt.id]: opt.name }))}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-3 ${
                          customOptions[opt.id] === opt.name 
                            ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20' 
                            : 'bg-navy-light text-gold/60 border-gold/10 hover:border-gold/30'
                        }`}
                      >
                        <div className="w-10 h-10 bg-navy rounded-lg overflow-hidden flex-shrink-0 border border-gold/10">
                          {opt.image ? (
                            opt.image.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={opt.image} className="w-full h-full object-cover" />
                            ) : (
                              <img src={opt.image} className="w-full h-full object-cover" />
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gold/10"><Check size={16} /></div>
                          )}
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                          <span>{opt.name}</span>
                          {opt.price && opt.price > 0 && <span className="text-[8px] opacity-60">+ R$ {opt.price.toFixed(2)}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Customization Lists (Legacy) */}
              {(!relevantAssembly.length && product.customizationLists) && product.customizationLists.map((list) => (
                <div key={list.id} className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                    {list.title} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {list.options.split(',').map(opt => opt.trim()).filter(o => o).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setCustomOptions(prev => ({ ...prev, [list.id]: opt }))}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${
                          customOptions[list.id] === opt 
                            ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20' 
                            : 'bg-navy-light text-gold/60 border-gold/10 hover:border-gold/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {hasNameOption && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-black text-gold/40 block tracking-[0.2em]">
                      Nome na Peça <span className="text-gold/20 font-normal">(Opcional)</span>
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
                  <span className="text-gold font-bold text-lg tabular-nums">{displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="text-[10px] text-gold/50 font-medium italic">
                  {selectedVariation ? `Opção: ${selectedVariation.name}` : (customOptions.cor ? `Cor: ${customOptions.cor}` : 'Selecione a cor...')}
                  {customOptions.nome && ` • Nome: ${customOptions.nome}`}
                  {product.customizationLists?.map(list => customOptions[list.id] && ` • ${list.title}: ${customOptions[list.id]}`)}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={
                  (!selectedVariation && !customOptions.cor && colorList.length > 0) || 
                  (product.customizationLists?.some(list => !customOptions[list.id]))
                }
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

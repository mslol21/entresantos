import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Settings2, Check, X, ShoppingBag, Minus, Clock, Heart, Share2, Download } from 'lucide-react';
import type { Product, Variation, GlobalOption } from '../types';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const getColorHex = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('areia')) return '#E2DBD0';
  if (lower.includes('bege')) return '#D4C4B5';
  if (lower.includes('off-white') || lower.includes('off white')) return '#F5F2EB';
  if (lower.includes('nude')) return '#E3C8B7';
  if (lower.includes('terracota')) return '#C06C53';
  if (lower.includes('cinza quente')) return '#9E948B';
  if (lower.includes('marrom claro')) return '#92765A';
  if (lower.includes('branco')) return '#FFFFFF';
  if (lower.includes('preto')) return '#1A1A1A';
  if (lower.includes('azul')) return '#6A8CA6';
  if (lower.includes('rosa')) return '#E0A899';
  if (lower.includes('verde')) return '#7B8E78';
  if (lower.includes('dourado') || lower.includes('ouro')) return '#D4AF37';
  return '#666666';
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { globalOptions, settings } = useData();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | GlobalOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const [customOptions, setCustomOptions] = useState<Record<string, string>>({});

  const isMonteSeuTerco = product.isCustomizable;
  const hasNameOption = product.hasNameOption;
  const hasColorOption = product.hasColorOption;

  const relevantColors = hasColorOption ? globalOptions.filter(o => o.type === 'color' && o.categoryIds?.includes(product.category || '')) : [];
  const relevantAssembly = isMonteSeuTerco ? globalOptions.filter(o => o.type === 'assembly' && o.categoryIds?.includes(product.category || '')) : [];

  const colorList = product.availableColors 
    ? product.availableColors.split(',').map(c => c.trim()).filter(c => c !== '') 
    : [];
  
  const needsCustomizer = isMonteSeuTerco || hasNameOption || hasColorOption || (product.variations && product.variations.length > 0) || (product.customizationLists && product.customizationLists.length > 0) || relevantColors.length > 0 || relevantAssembly.length > 0;

  const showSuccessFeedback = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    showSuccessFeedback();
  };

  // Price Calculation: Base + Variation Add-on + Assembly Add-ons
  const getBasePrice = () => {
    // If it's a legacy variation (Variation type), it usually replaces the price
    if (selectedVariation && !('type' in (selectedVariation as any))) return (selectedVariation as any).price || 0;
    return product.price;
  };

  const getAddonsPrice = () => {
    let total = 0;
    // Add Global Color price if selected
    if (selectedVariation && 'type' in (selectedVariation as any)) {
      total += (selectedVariation as any).price || 0;
    }
    // Add Assembly options prices
    relevantAssembly.forEach(opt => {
      if (customOptions[`${opt.group}_id`] === opt.id) {
        total += opt.price || 0;
      }
    });
    // Add Name price if filled
    if (customOptions.nome && product.namePrice) {
      total += product.namePrice;
    }
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
      if (opt.group && customOptions[`${opt.group}_id`] === opt.id) {
        details.push(`${opt.group}: ${opt.name}`);
      }
    });

    if (details.length > 0) {
      customName = `${product.name} (${details.join(', ')})`;
    }
    
    addToCart({ 
      ...product, 
      name: customName, 
      price: displayPrice, 
      image: displayImage || product.image,
      selectedVariation: selectedVariation || undefined
    } as Product, quantity);
    
    showSuccessFeedback();
    setShowCustomizer(false);
    setCustomOptions({});
    setSelectedVariation(null);
    setQuantity(1);
  };

  const handleWhatsAppRequest = () => {
    let customName = product.name;
    const details = [];
    
    if (selectedVariation) {
      details.push(`${selectedVariation.name}`);
    } else if (customOptions.cor) {
      details.push(`Cor: ${customOptions.cor}`);
    }

    if (customOptions.nome && hasNameOption) details.push(`Nome: ${customOptions.nome}`);
    
    if (product.customizationLists) {
      product.customizationLists.forEach(list => {
        if (customOptions[list.id]) {
          details.push(`${list.title}: ${customOptions[list.id]}`);
        }
      });
    }

    relevantAssembly.forEach(opt => {
      if (opt.group && customOptions[`${opt.group}_id`] === opt.id) {
        details.push(`${opt.group}: ${opt.name}`);
      }
    });

    if (details.length > 0) {
      customName = `${product.name} (${details.join(', ')})`;
    }

    const message = `Olá Ateliê Entre Santos! Gostaria de encomendar este produto:\n\n📦 *${quantity}x ${customName}*\n💰 *Preço Unitário: ${displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n💵 *Total: ${(displayPrice * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n\nAguardando confirmação! 🙌`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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
    <>
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
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <AnimatePresence>
                {isAdded && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute -top-12 right-0 bg-green-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 z-10"
                  >
                    <Check size={12} strokeWidth={4} />
                    Adicionado!
                  </motion.div>
                )}
              </AnimatePresence>

              {needsCustomizer ? (
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="w-full sm:w-auto gold-bg-gradient text-navy px-6 py-3.5 rounded-full hover:scale-105 transition-all active:scale-95 shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
                >
                  <Settings2 size={18} strokeWidth={2.5} />
                  <span className="text-[11px] font-black uppercase tracking-wider">Opções</span>
                </button>
              ) : (
                <button
                  onClick={handleDirectAdd}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isAdded 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-navy'
                  }`}
                >
                  {isAdded ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={2.5} />}
                  <span className="text-[11px] font-black uppercase tracking-wider">{isAdded ? 'No Carrinho' : 'Add'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacious Modal Customizer via Portal */}
      {createPortal(
        <AnimatePresence>
          {showCustomizer && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto" onClick={() => setShowCustomizer(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-navy-light border border-gold/15 rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92vh] md:max-h-[85vh] text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  onClick={() => {
                    setShowCustomizer(false);
                    setCustomOptions({});
                    setSelectedVariation(null);
                    setQuantity(1);
                  }}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-navy border border-gold/20 hover:border-gold/50 rounded-full flex items-center justify-center text-gold hover:bg-gold/10 transition-all active:scale-95"
                >
                  <X size={18} />
                </button>

                {/* Left Column: Image/Media */}
                <div className="w-full md:w-1/2 bg-navy/60 flex flex-col p-6 border-b md:border-b-0 md:border-r border-gold/10 min-h-[280px] md:min-h-0 relative">
                  {/* Breadcrumbs */}
                  <div className="text-[10px] text-gold/30 uppercase tracking-widest mb-3 font-medium">
                    Início / Catálogo / {product.category || 'Peças'} / {product.name}
                  </div>
                  
                  {/* Media Wrapper */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-gold/10 bg-navy-light/40 flex-grow flex items-center justify-center">
                    {renderMedia()}
                    
                    {/* Floating elements on media */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <button className="w-8 h-8 bg-navy/80 hover:bg-navy border border-gold/20 rounded-full flex items-center justify-center text-gold hover:scale-110 active:scale-95 transition-all shadow-lg">
                        <Heart size={14} />
                      </button>
                      <button className="w-8 h-8 bg-navy/80 hover:bg-navy border border-gold/20 rounded-full flex items-center justify-center text-gold hover:scale-110 active:scale-95 transition-all shadow-lg">
                        <Share2 size={14} />
                      </button>
                      <button className="w-8 h-8 bg-navy/80 hover:bg-navy border border-gold/20 rounded-full flex items-center justify-center text-gold hover:scale-110 active:scale-95 transition-all shadow-lg">
                        <Download size={14} />
                      </button>
                    </div>

                    {needsCustomizer && (
                      <div className="absolute top-3 left-3 bg-gold/90 text-navy px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] flex items-center gap-1 shadow-lg">
                        <Settings2 size={9} strokeWidth={3} />
                        Personalizável
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Customizer Form */}
                <div className="w-full md:w-1/2 overflow-y-auto p-6 md:p-8 flex flex-col bg-navy-light/20 scrollbar-thin">
                  <span className="text-[10px] text-gold/50 uppercase tracking-[0.2em] font-black mb-1 block">
                    {product.category || 'Peças'}
                  </span>
                  <h2 className="font-serif font-bold text-gold text-2xl md:text-3xl mb-2 leading-tight">
                    {product.name}
                  </h2>

                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-[10px] text-gold/30 uppercase font-black tracking-widest mr-2">Investimento:</span>
                    <span className="text-xs text-gold/30 line-through mr-1">
                      {(displayPrice * 1.25).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-xl md:text-2xl font-serif font-bold text-gold tabular-nums">
                      {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gold/60 mb-5 bg-navy/40 px-3 py-2 border border-gold/5 rounded-full w-fit">
                    <Clock size={12} className="text-gold" />
                    <span>Prazo: Feito sob encomenda para você</span>
                  </div>

                  <p className="text-xs text-gold/50 leading-relaxed mb-6 font-medium border-t border-gold/5 pt-4">
                    {product.description}
                  </p>

                  {/* Personalizer Container */}
                  <div className="bg-navy/30 border border-gold/10 rounded-[24px] p-5 mb-6 space-y-6">
                    <div className="flex items-center gap-2 border-b border-gold/10 pb-3 mb-1">
                      <Check size={14} className="text-gold" />
                      <span className="text-[10px] font-bold text-gold/80 uppercase tracking-widest">Opções de Personalização</span>
                    </div>

                    {/* Global Colors */}
                    {relevantColors.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase font-black text-gold/40 block tracking-[0.15em]">
                          Cores / Materiais <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {relevantColors.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariation(v)}
                              className={`p-1.5 rounded-xl text-[10px] font-bold transition-all border flex items-center gap-2 ${
                                selectedVariation?.id === v.id 
                                  ? 'bg-gold text-navy border-gold shadow-md' 
                                  : 'bg-navy-light/60 text-gold/60 border-gold/10 hover:border-gold/20'
                              }`}
                            >
                              <div className="w-9 h-9 bg-navy rounded-lg overflow-hidden flex-shrink-0 border border-gold/10">
                                {v.image ? (
                                  v.image.match(/\.(mp4|webm|ogg)$/i) ? (
                                    <video src={v.image} className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={v.image} className="w-full h-full object-cover" />
                                  )
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gold/10"><ShoppingBag size={12} /></div>
                                )}
                              </div>
                              <div className="flex flex-col items-start leading-tight text-left">
                                <span className="line-clamp-1 text-[10px]">{v.name}</span>
                                {v.price && v.price > 0 && (
                                  <span className="text-[8px] opacity-60">
                                    + R$ {v.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Old Variations */}
                    {(!relevantColors.length && product.variations && product.variations.length > 0) && (
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase font-black text-gold/40 block tracking-[0.15em]">
                          Escolha a Variação <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {product.variations.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariation(v)}
                              className={`p-1.5 rounded-xl text-[10px] font-bold transition-all border flex items-center gap-2 ${
                                selectedVariation?.id === v.id 
                                  ? 'bg-gold text-navy border-gold shadow-md' 
                                  : 'bg-navy-light/60 text-gold/60 border-gold/10 hover:border-gold/20'
                              }`}
                            >
                              <img src={v.image} className="w-8 h-8 rounded-lg object-cover" />
                              <div className="flex flex-col items-start leading-tight text-left">
                                <span className="line-clamp-1 text-[10px]">{v.name}</span>
                                <span className="text-[8px] opacity-60">R$ {v.price.toFixed(2)}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Selection */}
                    {hasColorOption && (!relevantColors.length || colorList.length > 0) && (
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase font-black text-gold/40 block tracking-[0.15em]">
                          Escolha a Cor <span className="text-red-500">*</span>
                        </label>
                        {colorList.length > 0 ? (
                          <div className="flex flex-wrap gap-2.5">
                            {colorList.map(color => {
                              const hex = getColorHex(color);
                              const isSelected = customOptions.cor === color;
                              return (
                                <button
                                  key={color}
                                  onClick={() => setCustomOptions({...customOptions, cor: color})}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                                    isSelected 
                                      ? 'border-gold scale-110 shadow-lg ring-2 ring-gold/20' 
                                      : 'border-gold/15 hover:border-gold/40'
                                  }`}
                                  style={{ backgroundColor: hex }}
                                  title={color}
                                >
                                  {isSelected && (
                                    <Check size={12} className={color.toLowerCase().includes('white') || color.toLowerCase().includes('branco') || color.toLowerCase().includes('areia') || color.toLowerCase().includes('off') ? 'text-navy' : 'text-white'} strokeWidth={4} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="relative">
                            <input 
                              type="text"
                              placeholder="Ex: Azul Celeste, Rosa Quartzo..."
                              value={customOptions.cor}
                              onChange={(e) => setCustomOptions({...customOptions, cor: e.target.value})}
                              className="w-full bg-navy border border-gold/15 rounded-xl p-3 text-gold text-xs focus:border-gold outline-none transition-all placeholder:text-gold/25"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assembly Groups */}
                    {['Entremeio', 'Crucifixo', 'Outros'].map(groupName => {
                      const groupItems = relevantAssembly.filter(o => o.group === groupName);
                      if (groupItems.length === 0) return null;

                      return (
                        <div key={groupName} className="space-y-3">
                          <label className="text-[9px] uppercase font-black text-gold/40 block tracking-[0.15em]">
                            Escolha o {groupName} <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {groupItems.map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => setCustomOptions(prev => ({ ...prev, [groupName]: opt.name, [`${groupName}_id`]: opt.id }))}
                                className={`p-1.5 rounded-xl text-[10px] font-bold transition-all border flex items-center gap-2 ${
                                  customOptions[groupName] === opt.name 
                                    ? 'bg-gold text-navy border-gold shadow-md' 
                                    : 'bg-navy-light/60 text-gold/60 border-gold/10 hover:border-gold/20'
                                }`}
                              >
                                <div className="w-8 h-8 bg-navy rounded-lg overflow-hidden flex-shrink-0 border border-gold/10">
                                  {opt.image ? (
                                    opt.image.match(/\.(mp4|webm|ogg)$/i) ? (
                                      <video src={opt.image} className="w-full h-full object-cover" />
                                    ) : (
                                      <img src={opt.image} className="w-full h-full object-cover" />
                                    )
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gold/10"><Check size={12} /></div>
                                  )}
                                </div>
                                <div className="flex flex-col items-start leading-tight text-left">
                                  <span className="line-clamp-1 text-[10px]">{opt.name}</span>
                                  {opt.price && opt.price > 0 && <span className="text-[8px] opacity-60">+ R$ {opt.price.toFixed(2)}</span>}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Customization Lists */}
                    {(!relevantAssembly.length && product.customizationLists) && product.customizationLists.map((list) => (
                      <div key={list.id} className="space-y-3">
                        <label className="text-[9px] uppercase font-black text-gold/40 block tracking-[0.15em]">
                          {list.title} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {list.options.split(',').map(opt => opt.trim()).filter(o => o).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setCustomOptions(prev => ({ ...prev, [list.id]: opt }))}
                              className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                                customOptions[list.id] === opt 
                                  ? 'bg-gold text-navy border-gold shadow-md' 
                                  : 'bg-navy-light/60 text-gold/60 border-gold/10 hover:border-gold/25'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Name Input */}
                    {hasNameOption && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] uppercase font-black text-gold/40 block tracking-[0.15em]">
                            Nome na Peça {product.namePrice && product.namePrice > 0 && <span className="text-gold/60">(+ R$ {product.namePrice.toFixed(2)})</span>}
                          </label>
                          <span className={`text-[9px] font-black tracking-tighter ${nameLength > 10 ? 'text-red-500' : 'text-gold/40'}`}>
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
                            className={`w-full bg-navy border rounded-xl p-3 text-gold text-xs outline-none transition-all placeholder:text-gold/25 ${
                              nameLength > 10 ? 'border-red-500 shadow-lg' : 'border-gold/15 focus:border-gold shadow-inner'
                            }`}
                          />
                        </div>
                        <p className="text-[8px] text-gold/30 italic flex items-center gap-1 px-1">
                          <Check size={9} />
                          Personalização artesanal inclusa.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Actions */}
                  <div className="mt-auto pt-6 border-t border-gold/15 bg-navy-light/10 sticky bottom-0 z-20 pb-2">
                    <div className="flex justify-between items-end mb-4 px-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black text-gold/30 tracking-[0.15em] mb-1.5">Quantidade</span>
                        <div className="flex items-center gap-3.5 bg-navy border border-gold/10 px-3 py-1.5 rounded-full">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="text-gold/40 hover:text-gold transition-colors p-1"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="text-gold font-black text-xs w-4 text-center">{quantity}</span>
                          <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="text-gold/40 hover:text-gold transition-colors p-1"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] uppercase font-black text-gold/30 tracking-[0.15em] mb-1">Total Parcial</span>
                        <span className="text-gold font-bold text-2xl font-serif tabular-nums">
                          {(displayPrice * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-2">
                      <button
                        onClick={handleAddToCart}
                        disabled={
                          (!selectedVariation && !customOptions.cor && colorList.length > 0) || 
                          (relevantAssembly.some(opt => opt.group && opt.group !== 'Outros' && !customOptions[opt.group]))
                        }
                        className="w-full bg-gold text-navy py-4 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-[0.98] hover:scale-[1.01]"
                      >
                        <ShoppingBag size={14} strokeWidth={2.5} />
                        Adicionar ao Carrinho
                      </button>
                      
                      <button
                        onClick={handleWhatsAppRequest}
                        disabled={
                          (!selectedVariation && !customOptions.cor && colorList.length > 0) || 
                          (relevantAssembly.some(opt => opt.group && opt.group !== 'Outros' && !customOptions[opt.group]))
                        }
                        className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-[0.98] hover:scale-[1.01]"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.002-5.037-2.824-6.861-1.821-1.821-4.246-2.822-6.84-2.822-5.432 0-9.855 4.37-9.858 9.732-.001 1.761.488 3.48 1.416 4.978l-.974 3.56 3.662-.958zm12.335-7.564c-.33-.165-1.951-.951-2.253-1.061-.301-.11-.52-.165-.74.165-.22.33-.85.85-1.04 1.062-.19.213-.38.24-.71.075-.33-.165-1.395-.506-2.659-1.621-.982-.87-1.644-1.945-1.836-2.274-.192-.33-.02-.507.145-.671.149-.147.33-.382.495-.572.165-.189.22-.325.33-.541.11-.217.055-.407-.028-.571-.082-.165-.74-1.785-1.013-2.446-.266-.64-.537-.553-.74-.564-.172-.008-.37-.01-.568-.01-.198 0-.522.074-.795.37-.273.298-1.042 1.003-1.042 2.447 0 1.444 1.053 2.839 1.2 3.037.147.198 2.072 3.12 5.019 4.385.701.302 1.248.482 1.674.618.705.224 1.346.192 1.854.116.565-.084 1.951-.789 2.227-1.55.275-.762.275-1.417.192-1.55-.083-.133-.302-.217-.632-.381z"/>
                        </svg>
                        Solicitar via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

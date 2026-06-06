import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Share2, Download, ShoppingBag, MessageCircle, Clock, 
  Minus, Plus, ArrowLeft, Settings2, Check 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import type { Product, Variation, GlobalOption } from '../types';

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

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, globalOptions, settings, categories, loading } = useData();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Variation | GlobalOption | null>(null);
  const [customOptions, setCustomOptions] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (id) {
      const favorites = JSON.parse(localStorage.getItem('es_favorites') || '[]');
      setIsFavorite(favorites.includes(id));
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!id) return;
    const favorites = JSON.parse(localStorage.getItem('es_favorites') || '[]');
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fid: string) => fid !== id);
      setIsFavorite(false);
    } else {
      updated = [...favorites, id];
      setIsFavorite(true);
    }
    localStorage.setItem('es_favorites', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin" />
          <p className="text-navy font-serif animate-pulse">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <h2 className="font-serif text-2xl text-navy">Produto não encontrado</h2>
        <Link to="/" className="btn-primary">Voltar para a Loja</Link>
      </div>
    );
  }

  const isMonteSeuTerco = product.isCustomizable;
  const hasNameOption = product.hasNameOption;
  const hasColorOption = product.hasColorOption;

  const relevantColors = hasColorOption ? globalOptions.filter(o => o.type === 'color' && o.categoryIds?.includes(product.category || '')) : [];
  const relevantAssembly = isMonteSeuTerco ? globalOptions.filter(o => o.type === 'assembly' && o.categoryIds?.includes(product.category || '')) : [];

  const colorList = product.availableColors 
    ? product.availableColors.split(',').map(c => c.trim()).filter(c => c !== '') 
    : [];

  const needsCustomizer = isMonteSeuTerco || hasNameOption || hasColorOption || (product.variations && product.variations.length > 0) || (product.customizationLists && product.customizationLists.length > 0) || relevantColors.length > 0 || relevantAssembly.length > 0;

  const getBasePrice = () => {
    if (selectedVariation && !('type' in (selectedVariation as any))) return (selectedVariation as any).price || 0;
    return product.price;
  };

  const getAddonsPrice = () => {
    let total = 0;
    if (selectedVariation && 'type' in (selectedVariation as any)) {
      total += (selectedVariation as any).price || 0;
    }
    relevantAssembly.forEach(opt => {
      if (customOptions[`${opt.group}_id`] === opt.id) {
        total += opt.price || 0;
      }
    });
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
    
    addToCart({ 
      ...product, 
      name: customName, 
      price: displayPrice, 
      image: displayImage || product.image,
      selectedVariation: selectedVariation || undefined
    } as Product, quantity);
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  const categoryData = categories.find(c => c.id === product.category);

  return (
    <div className="pt-24 min-h-screen bg-cream text-navy font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy/60 hover:text-navy transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          
          <div className="flex items-center gap-2 text-xs text-navy/40 uppercase tracking-widest">
            <Link to="/" className="hover:text-navy transition-colors">Início</Link>
            <span>/</span>
            <span className="hover:text-navy transition-colors">{categoryData?.name || product.category}</span>
            <span>/</span>
            <span className="text-navy/70 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square rounded-[32px] overflow-hidden bg-white border border-gold/15 shadow-premium group">
              <img 
                src={displayImage || product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                {needsCustomizer && (
                  <span className="badge-custom flex items-center gap-1 bg-gold text-navy font-black">
                    <Settings2 size={10} strokeWidth={3} />
                    Personalizável
                  </span>
                )}
              </div>

              {/* Floating Action Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                <button 
                  onClick={toggleFavorite}
                  className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${isFavorite ? 'text-red-500' : 'text-navy/60'}`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy/60 hover:text-navy transition-transform hover:scale-110 active:scale-95"
                >
                  <Share2 size={18} />
                </button>
                <a 
                  href={displayImage || product.image}
                  download={`${product.name}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy/60 hover:text-navy transition-transform hover:scale-110 active:scale-95"
                >
                  <Download size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Metadata, Customizer & CTAs */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-[11px] text-gold-dark uppercase tracking-[0.25em] font-black block mb-2">
                {categoryData?.name || product.category}
              </span>
              <h1 className="font-serif font-bold text-3xl md:text-4xl text-navy leading-tight mb-3">
                {product.name}
              </h1>
              <p className="text-sm text-navy/60 font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price section */}
            <div className="py-4 border-t border-b border-gold/15 flex items-baseline gap-4">
              <span className="text-3xl font-serif font-bold text-navy">
                {displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              {getBasePrice() > 0 && displayPrice !== product.price && (
                <span className="text-[10px] font-black uppercase tracking-wider text-gold-dark bg-gold/10 px-2.5 py-1 rounded-full">
                  Com personalizações
                </span>
              )}
            </div>

            {/* Delivery/Production Clock Info */}
            <div className="flex items-center gap-2 text-xs font-bold text-navy/50">
              <Clock size={16} className="text-gold-dark" />
              <span>Prazo de produção: 5 dias úteis</span>
            </div>

            {/* Customizer Panel */}
            {needsCustomizer && (
              <div className="bg-cream-light rounded-[24px] border border-gold/15 p-6 space-y-5">
                <div className="flex items-center gap-2 text-navy border-b border-gold/10 pb-3">
                  <Settings2 size={16} strokeWidth={2.5} className="text-gold" />
                  <span className="font-serif font-bold text-sm tracking-wider uppercase">Opções de Personalização</span>
                </div>

                {/* Colors Swatches Option */}
                {relevantColors.length > 0 && (
                  <div className="space-y-2">
                    <label className="label-base">Selecione a Cor</label>
                    <div className="flex flex-wrap gap-2.5">
                      {relevantColors.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            if (customOptions.cor === opt.name) {
                              setCustomOptions(prev => {
                                const next = { ...prev };
                                delete next.cor;
                                return next;
                              });
                              setSelectedVariation(null);
                            } else {
                              setCustomOptions(prev => ({ ...prev, cor: opt.name }));
                              setSelectedVariation(opt);
                            }
                          }}
                          className={`w-9 h-9 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                            customOptions.cor === opt.name
                              ? 'border-gold scale-110 shadow-lg'
                              : 'border-navy/10 hover:border-navy/40'
                          }`}
                          style={{ backgroundColor: getColorHex(opt.name) }}
                          title={opt.name}
                        >
                          {customOptions.cor === opt.name && (
                            <Check size={14} strokeWidth={3} className={opt.name.toLowerCase().includes('branco') ? 'text-navy' : 'text-white'} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy String Colors Option */}
                {relevantColors.length === 0 && colorList.length > 0 && (
                  <div className="space-y-2">
                    <label className="label-base">Opções de Cor</label>
                    <div className="flex flex-wrap gap-2.5">
                      {colorList.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCustomOptions(prev => ({ ...prev, cor: color }))}
                          className={`w-9 h-9 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                            customOptions.cor === color
                              ? 'border-gold scale-110 shadow-lg'
                              : 'border-navy/10 hover:border-navy/40'
                          }`}
                          style={{ backgroundColor: getColorHex(color) }}
                          title={color}
                        >
                          {customOptions.cor === color && (
                            <Check size={14} strokeWidth={3} className={color.toLowerCase().includes('branco') ? 'text-navy' : 'text-white'} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variations (Fabric/Finish/Size) as Pill Buttons */}
                {product.variations && product.variations.length > 0 && (
                  <div className="space-y-2">
                    <label className="label-base">Escolha uma Variação</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variations.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            if (selectedVariation?.id === v.id) {
                              setSelectedVariation(null);
                            } else {
                              setSelectedVariation(v);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            selectedVariation?.id === v.id
                              ? 'bg-navy text-white border-navy shadow-md'
                              : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
                          }`}
                        >
                          {v.name} (+{v.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assembly Options (Crucifixos, Entremeios, etc.) */}
                {relevantAssembly.length > 0 && (
                  <div className="space-y-4 pt-2 border-t border-gold/10">
                    {Array.from(new Set(relevantAssembly.map(a => a.group))).map(group => {
                      if (!group) return null;
                      const optsInGroup = relevantAssembly.filter(a => a.group === group);
                      return (
                        <div key={group} className="space-y-2">
                          <label className="label-base">Escolha o {group}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {optsInGroup.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setCustomOptions(prev => {
                                    const next = { ...prev };
                                    if (next[`${group}_id`] === opt.id) {
                                      delete next[group];
                                      delete next[`${group}_id`];
                                    } else {
                                      next[group] = opt.name;
                                      next[`${group}_id`] = opt.id;
                                    }
                                    return next;
                                  });
                                }}
                                className={`p-3 rounded-2xl text-left text-xs font-bold border flex flex-col gap-1 transition-all ${
                                  customOptions[`${group}_id`] === opt.id
                                    ? 'bg-navy text-white border-navy shadow-md'
                                    : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
                                }`}
                              >
                                <span>{opt.name}</span>
                                {opt.price && opt.price > 0 ? (
                                  <span className={customOptions[`${group}_id`] === opt.id ? 'text-gold' : 'text-gold-dark'}>
                                    +{opt.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                  </span>
                                ) : null}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text fields customization (e.g. Engraving Name) */}
                {hasNameOption && (
                  <div className="space-y-1">
                    <label className="label-base" htmlFor="nome">
                      Nome para Personalizar {product.namePrice ? `(+ ${product.namePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})` : ''}
                    </label>
                    <input 
                      type="text" 
                      id="nome"
                      placeholder="Digite o nome (Ex: Maria)"
                      value={customOptions.nome || ''}
                      onChange={(e) => setCustomOptions(prev => ({ ...prev, nome: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                )}

                {/* Customization Lists (e.g. Fabrics/Acabamentos defined on product) */}
                {product.customizationLists && product.customizationLists.map(list => (
                  <div key={list.id} className="space-y-2">
                    <label className="label-base">{list.title}</label>
                    <div className="flex flex-wrap gap-2">
                      {list.options.split(',').map(opt => opt.trim()).map(option => (
                        <button
                          key={option}
                          onClick={() => setCustomOptions(prev => ({ ...prev, [list.id]: option }))}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            customOptions[list.id] === option
                              ? 'bg-navy text-white border-navy shadow-md'
                              : 'bg-white text-navy/70 border-navy/15 hover:border-navy/40'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="label-base">Quantidade</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:text-navy hover:border-navy/40 active:scale-95 transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-lg font-serif font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:text-navy hover:border-navy/40 active:scale-95 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={(!selectedVariation && !customOptions.cor && colorList.length > 0) || (relevantAssembly.some(opt => opt.group && opt.group !== 'Outros' && !customOptions[opt.group]))}
                className="w-full btn-primary py-4 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-[0.98] hover:scale-[1.01]"
              >
                {isAdded ? <Check size={14} strokeWidth={3} /> : <ShoppingBag size={14} strokeWidth={2.5} />}
                {isAdded ? 'Adicionado!' : `Adicionar ao Carrinho — ${(displayPrice * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
              </button>

              <button
                onClick={handleWhatsAppRequest}
                disabled={(!selectedVariation && !customOptions.cor && colorList.length > 0) || (relevantAssembly.some(opt => opt.group && opt.group !== 'Outros' && !customOptions[opt.group]))}
                className="w-full btn-whatsapp py-4 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale transition-all shadow-lg active:scale-[0.98] hover:scale-[1.01]"
              >
                <MessageCircle size={14} strokeWidth={2.5} />
                Solicitar via WhatsApp
              </button>
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Plus, Settings2, Check, X } from 'lucide-react';
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

  const isMonteSeuTerco = product.isCustomizable; // Use the flag from admin
  const hasNameOption = product.hasNameOption !== false; // Default to true
  const colorList = product.availableColors 
    ? product.availableColors.split(',').map(c => c.trim()).filter(c => c !== '') 
    : [];

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
    if (!url) return null;

    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');

    if (isVideo) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
            className="w-full h-full object-cover pointer-events-none"
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
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    );
  };

  return (
    <div className="card-premium group flex flex-col h-full relative overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-navy-light">
        {renderMedia()}
        <div className="absolute top-3 left-3 bg-gold/90 text-navy px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm">
          <Settings2 size={12} />
          Personalizável
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-base text-gold mb-1 group-hover:text-gold-light transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[10px] text-gold/60 mb-3 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gold/10">
          <div>
            <span className="text-[9px] text-gold/40 block mb-0.5 uppercase tracking-tighter">Preço</span>
            <span className="text-lg font-bold text-gold">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          
          <button
            onClick={() => setShowCustomizer(true)}
            className="gold-bg-gradient text-navy p-2 rounded-lg hover:scale-110 transition-transform active:scale-95 shadow-lg shadow-gold/20 flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span className="text-[10px] font-bold uppercase">Add</span>
          </button>
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
            
            <div className="space-y-6 flex-grow pb-20">
              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gold/40 block tracking-widest">
                  Cor Desejada <span className="text-red-500">*</span> <span className="text-gold/20">(Obrigatório)</span>
                </label>
                {colorList.length > 0 ? (
                  <select 
                    value={customOptions.cor}
                    onChange={(e) => setCustomOptions({...customOptions, cor: e.target.value})}
                    className="w-full bg-navy-light border border-gold/20 rounded-xl p-4 text-gold text-sm focus:border-gold outline-none"
                  >
                    <option value="">Selecione uma cor...</option>
                    {colorList.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text"
                    placeholder="Ex: Azul, Rosa, Pérola..."
                    value={customOptions.cor}
                    onChange={(e) => setCustomOptions({...customOptions, cor: e.target.value})}
                    className="w-full bg-navy-light border border-gold/20 rounded-xl p-4 text-gold text-sm focus:border-gold outline-none transition-all"
                    autoFocus
                  />
                )}
              </div>

              {isMonteSeuTerco && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gold/40 block tracking-widest">
                      Entremeio <span className="text-gold/20">(Obrigatório)</span>
                    </label>
                    <select 
                      value={customOptions.entremeio}
                      onChange={(e) => setCustomOptions({...customOptions, entremeio: e.target.value})}
                      className="w-full bg-navy-light border border-gold/20 rounded-xl p-4 text-gold text-sm focus:border-gold outline-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="Nossa Senhora Aparecida">Nossa Senhora Aparecida</option>
                      <option value="Nossa Senhora das Graças">Nossa Senhora das Graças</option>
                      <option value="Sagrado Coração de Jesus">Sagrado Coração de Jesus</option>
                      <option value="Santo Expedito">Santo Expedito</option>
                      <option value="São Bento">São Bento</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gold/40 block tracking-widest">
                      Crucifixo <span className="text-gold/20">(Obrigatório)</span>
                    </label>
                    <select 
                      value={customOptions.crucifixo}
                      onChange={(e) => setCustomOptions({...customOptions, crucifixo: e.target.value})}
                      className="w-full bg-navy-light border border-gold/20 rounded-xl p-4 text-gold text-sm focus:border-gold outline-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="Clássico Dourado">Clássico Dourado</option>
                      <option value="Trabalhado Luxo">Trabalhado Luxo</option>
                      <option value="Cruz de São Bento">Cruz de São Bento</option>
                      <option value="Minimalista">Minimalista</option>
                    </select>
                  </div>
                </>
              )}

              {hasNameOption && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-gold/40 block tracking-widest">
                      Nome na Peça <span className="text-gold/20">(Opcional)</span>
                    </label>
                    <span className={`text-[10px] font-bold ${nameLength > 10 ? 'text-red-500' : 'text-gold/40'}`}>
                      {nameLength}/10 letras
                    </span>
                  </div>
                  <input 
                    type="text"
                    placeholder="Ex: Maria"
                    maxLength={10}
                    value={customOptions.nome}
                    onChange={(e) => setCustomOptions({...customOptions, nome: e.target.value})}
                    className={`w-full bg-navy-light border rounded-xl p-4 text-gold text-sm outline-none transition-all ${
                      nameLength > 10 ? 'border-red-500' : 'border-gold/20 focus:border-gold'
                    }`}
                  />
                  <p className="text-[9px] text-gold/30 italic">Personalização artesanal com contas de letras.</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gold/10 bg-navy sticky bottom-0">
              <button
                onClick={handleAddToCart}
                disabled={!customOptions.cor || (isMonteSeuTerco && (!customOptions.entremeio || !customOptions.crucifixo))}
                className="w-full gold-bg-gradient text-navy py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all shadow-xl shadow-gold/20"
              >
                <Check size={20} />
                Confirmar Escolha
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

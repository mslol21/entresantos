import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';

export const FeaturedProducts: React.FC = () => {
  const { products, loading } = useData();
  const { addToCart, setIsCartOpen } = useCart();

  // Get products marked as featured, or fallback to the top 4 active products
  const featuredList = React.useMemo(() => {
    const active = products.filter(p => p.isActive !== false);
    const explicitlyFeatured = active.filter(p => p.isFeatured);
    if (explicitlyFeatured.length > 0) {
      return explicitlyFeatured;
    }
    return active.slice(0, 4);
  }, [products]);

  if (loading || featuredList.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 px-4 relative overflow-hidden bg-gradient-to-b from-cream/40 via-amber-50/20 to-transparent">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-200/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gold/15 text-gold-dark px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] border border-gold/30 mb-3"
            >
              <Sparkles size={14} className="text-gold-dark animate-pulse" />
              <span>Seleção Especial de Fé</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-navy"
            >
              Destaques da <span className="bg-gradient-to-r from-gold-dark via-amber-600 to-amber-800 bg-clip-text text-transparent">Devoção</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-navy/70 text-sm md:text-base mt-2 max-w-xl leading-relaxed"
            >
              As peças mais amadas e escolhidas pelos nossos fiéis. Artesanato sagrado com oração e benção em cada detalhe.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <a
              href="#produtos"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-navy/70 hover:text-navy group transition-colors"
            >
              <span>Ver Todo o Catálogo</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Featured Products Grid / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredList.map((product, idx) => {
            const displayImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-[28px] border border-gold/25 p-4 shadow-lg hover:shadow-2xl hover:border-gold/50 transition-all duration-500 flex flex-col justify-between group relative overflow-hidden text-left"
              >
                {/* Floating Star Badge */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 bg-gradient-to-r from-gold to-amber-500 text-navy font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  <Star size={12} className="fill-navy" />
                  <span>Destaque</span>
                </div>

                {/* Product Image Container */}
                <div>
                  <div className="relative aspect-square rounded-[20px] overflow-hidden bg-cream-light border border-gold/15 mb-4 group-hover:border-gold/30 transition-colors">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Quick Overlay Action */}
                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Link
                        to={`/produto/${product.id}`}
                        className="w-10 h-10 bg-white/90 text-navy rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        title="Ver Detalhes"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          addToCart(product);
                          setIsCartOpen(true);
                        }}
                        className="w-10 h-10 bg-gold text-navy rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        title="Adicionar ao Carrinho"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Product Category & Title */}
                  <span className="text-[10px] text-navy/40 font-black uppercase tracking-widest block mb-1">
                    {product.category || 'Ateliê Entre Santos'}
                  </span>

                  <Link to={`/produto/${product.id}`}>
                    <h3 className="font-serif font-bold text-navy text-lg line-clamp-1 group-hover:text-gold-dark transition-colors mb-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-navy/60 text-xs line-clamp-2 mb-4 min-h-[32px] leading-relaxed">
                    {product.description || 'Peça devocional artesanal confeccionada com amor e oração.'}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-gold/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-navy/40 font-black uppercase tracking-wider block">Valor</span>
                    <span className="text-xl font-bold text-navy tabular-nums">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product);
                      setIsCartOpen(true);
                    }}
                    className="bg-navy hover:bg-gold text-white hover:text-navy px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Garantir</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Truck } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToCatalog = () => {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-24 pb-6 md:pt-28 md:pb-10 px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Compact Hero Card Container with Glassmorphism */}
        <div className="bg-gradient-to-br from-white/90 via-cream/80 to-amber-50/60 backdrop-blur-xl border border-gold/25 rounded-[32px] p-6 sm:p-8 md:p-12 shadow-xl relative overflow-hidden">
          
          {/* Subtle decorative background pattern */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-5">
              
              {/* Top Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/15 to-amber-500/10 text-gold-dark px-4 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] border border-gold/30 shadow-xs"
              >
                <Sparkles size={14} className="text-gold-dark animate-pulse" />
                <span>Ateliê Católico • Terços & Devoção</span>
              </motion.div>

              {/* Compact Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif font-bold text-navy leading-[1.15]"
              >
                Leve a sua devoção <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-gold-dark via-amber-600 to-amber-800 bg-clip-text text-transparent">
                  sempre com você
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-navy/70 text-sm md:text-base max-w-xl leading-relaxed"
              >
                Terços, dezenas e artigos sacros personalizados com oração, fé e acabamento refinado. Peças únicas feitas sob medida para abençoar o seu dia a dia.
              </motion.p>

              {/* CTA Button & Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <button
                  onClick={scrollToCatalog}
                  className="bg-navy hover:bg-navy-light text-white px-8 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-navy/20 cursor-pointer group border border-gold/30"
                >
                  <span>Explorar Coleções</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-navy/70 px-2">
                  <div className="flex items-center gap-1.5">
                    <Heart size={15} className="text-gold fill-gold/20" />
                    <span>100% Personalizável</span>
                  </div>
                  <span className="text-gold/40">•</span>
                  <div className="flex items-center gap-1.5">
                    <Truck size={15} className="text-gold" />
                    <span>Envio Brasil</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature Chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold text-navy/60"
              >
                <span className="bg-white/80 border border-gold/20 px-3 py-1 rounded-lg shadow-2xs">✨ Contas Selecionadas</span>
                <span className="bg-white/80 border border-gold/20 px-3 py-1 rounded-lg shadow-2xs">🙏 Feito Sob Oração</span>
                <span className="bg-white/80 border border-gold/20 px-3 py-1 rounded-lg shadow-2xs">🎁 Embalagem Especial</span>
              </motion.div>

            </div>

            {/* Right Media Column - Modern Compact Visual Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-gold/25 shadow-md group">
                <img
                  src="/hero.png"
                  alt="Ateliê Entre Santos - Terços e Devoção"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-80" />

                {/* Floating Glassmorphic Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/85 backdrop-blur-md p-3.5 rounded-xl border border-gold/30 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gold/15 text-gold-dark flex items-center justify-center font-bold text-base border border-gold/30">
                      🕊️
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-serif font-bold text-navy">Feito com Amor & Fé</p>
                      <p className="text-[10px] text-navy/60 font-medium">Cada conta uma oração</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-gold/20 text-gold-dark px-2.5 py-1 rounded-full border border-gold/30">
                    Exclusivo
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

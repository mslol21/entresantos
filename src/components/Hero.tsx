import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-32 pb-20 px-4 bg-navy overflow-hidden relative min-h-[85vh] flex items-center">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full font-medium text-xs mb-8 border border-gold/20 tracking-widest uppercase"
            >
              <Zap size={14} />
              <span>Juntos a caminho da santidade</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.1] text-gold"
            >
              Leve a sua devoção <br className="hidden md:block" />
              <span className="gold-gradient">sempre com você</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gold/60 mb-10 max-w-xl leading-relaxed"
            >
              Artesanato católico personalizado com amor e oração. Terços, pulseiras e acessórios feitos à mão para fortalecer sua fé no dia a dia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                onClick={scrollToCatalog}
                className="w-full sm:w-auto gold-bg-gradient text-navy px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-gold/20 hover:scale-105 active:scale-95"
              >
                Conhecer Coleções
                <ArrowRight size={22} />
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-gold/20 shadow-2xl group">
              <img 
                src="/hero.png" 
                alt="Devoção e Fé" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
            </div>
            
            {/* Decorative Floating Element */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-navy-light border border-gold/20 p-6 rounded-3xl backdrop-blur-md shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                  <Zap size={24} />
                </div>
                <div>
                  <div className="text-gold font-bold text-sm">Feito à Mão</div>
                  <div className="text-gold/40 text-[10px] uppercase tracking-widest">100% Personalizado</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

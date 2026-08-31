import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {

  return (
    <section className="pt-[4.75rem] md:pt-[5.25rem] relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-light via-[#F9F6EE] to-[#F2EDD6]" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-amber-50/60 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Column */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] border border-gold/25"
            >
              <Sparkles size={12} className="animate-pulse" />
              Artesanato Católico Contemporâneo
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-navy leading-[1.05] tracking-tight"
            >
              Fé feita<br />à mão.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-navy/65 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Terços, acessórios e coleções criados artesanalmente para carregar, presentear e viver sua fé todos os dias.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/colecoes"
                className="btn-primary group"
              >
                Conhecer as coleções
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/personalize"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-navy/20 text-navy font-sans text-sm font-medium tracking-wide rounded-full transition-all duration-300 hover:border-navy hover:bg-navy/5"
              >
                Personalizar minha peça
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {[
                '✦ Feito à mão',
                '✦ Peças personalizadas',
                '✦ Colecionáveis',
                '✦ Envio para todo o Brasil',
              ].map((chip) => (
                <span key={chip} className="text-xs text-navy/50 font-medium">
                  {chip}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-3xl overflow-hidden border border-gold/20 shadow-2xl">
                <img
                  src="/hero.jpg"
                  alt="Ateliê Entre Santos — Terços e peças artesanais de fé"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gold/20 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center border border-gold/25 flex-shrink-0">
                      🕊️
                    </div>
                    <div>
                      <p className="text-xs font-serif font-bold text-navy">Feito com amor e fé</p>
                      <p className="text-[11px] text-navy/55 font-medium">Cada peça, uma oração</p>
                    </div>
                    <span className="ml-auto text-[9px] font-black uppercase tracking-wider bg-gold/15 text-gold-dark px-2.5 py-1 rounded-full border border-gold/20 whitespace-nowrap">
                      Artesanal
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-100/60 rounded-full blur-3xl" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

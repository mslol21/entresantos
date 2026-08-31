import React from 'react';
import { Link } from 'react-router-dom';
import { GalleryHorizontal, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

const STATUS_MAP = {
  active: { label: 'Ativa', dot: 'bg-emerald-400' },
  coming_soon: { label: 'Em breve', dot: 'bg-amber-400' },
  ended: { label: 'Encerrada', dot: 'bg-gray-400' },
};

const Collections: React.FC = () => {
  const { collections } = useData();

  const sorted = [...collections]
    .filter(c => c.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen">
      {/* Header */}
      <div className="bg-navy text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-navy-light opacity-90" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="text-[11px] text-gold/60 uppercase tracking-[0.3em] font-bold mb-4">Exclusivas</p>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-gold mb-4">
            Coleções Entre Santos
          </h1>
          <p className="text-white/60 max-w-lg mx-auto text-sm leading-relaxed">
            Histórias de fé transformadas em peças para carregar, presentear e colecionar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((col, idx) => {
              const status = STATUS_MAP[col.status] || STATUS_MAP.active;
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    to={`/colecoes/${col.slug}`}
                    className="group block bg-white border border-gold/15 hover:border-gold/40 rounded-3xl overflow-hidden shadow-premium hover:shadow-gold transition-all duration-400 hover:-translate-y-1"
                  >
                    <div className="relative aspect-video overflow-hidden bg-cream">
                      {col.image ? (
                        <img
                          src={col.image}
                          alt={col.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-amber-50">
                          <GalleryHorizontal size={56} className="text-gold/25" />
                        </div>
                      )}
                    </div>

                    <div className="p-7">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
                        <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">{status.label}</span>
                        {col.total_items && col.total_items > 0 && (
                          <>
                            <span className="text-navy/20">•</span>
                            <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">{col.total_items} peças</span>
                          </>
                        )}
                      </div>

                      <h2 className="font-serif font-bold text-2xl text-navy mb-3 group-hover:text-gold-dark transition-colors">
                        {col.name}
                      </h2>
                      {col.description && (
                        <p className="text-navy/55 text-sm leading-relaxed mb-5 line-clamp-3">
                          {col.description}
                        </p>
                      )}

                      <span className="inline-flex items-center gap-2 text-xs font-bold text-gold-dark group-hover:gap-3 uppercase tracking-widest transition-all">
                        Conhecer a coleção <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Fallback with Guardiões da Fé
          <div className="text-center py-8">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to="/colecoes/guardioes-da-fe"
                  className="group block bg-white border border-gold/20 hover:border-gold/40 rounded-3xl overflow-hidden shadow-premium hover:shadow-gold transition-all duration-400"
                >
                  <div className="aspect-video bg-gradient-to-br from-cream via-amber-50 to-cream-light flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-8xl mb-4">⚔️</p>
                      <p className="text-[11px] text-navy/40 uppercase tracking-widest font-bold">Coleção 01</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">Ativa • 3 peças</span>
                    </div>
                    <h2 className="font-serif font-bold text-3xl text-navy mb-3 group-hover:text-gold-dark transition-colors">
                      Guardiões da Fé
                    </h2>
                    <p className="text-navy/55 text-sm leading-relaxed mb-5">
                      Uma coleção dedicada aos santos guardiões. Cada peça celebra um protetor da fé, trazendo sua história e significado em forma de arte artesanal.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-dark group-hover:gap-3 uppercase tracking-widest transition-all">
                      Conhecer a coleção <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-50">
                {['Coleção Marias', 'Santos do Brasil', 'Arcanjos'].map(name => (
                  <div key={name} className="bg-white border border-gold/10 rounded-2xl p-6 text-center">
                    <p className="text-2xl mb-2">🌟</p>
                    <p className="font-serif font-bold text-navy/50 text-sm">{name}</p>
                    <p className="text-[10px] text-navy/30 uppercase tracking-widest mt-1">Em breve</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;

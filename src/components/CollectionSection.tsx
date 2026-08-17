import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GalleryHorizontal } from 'lucide-react';
import { useData } from '../context/DataContext';

const STATUS_MAP = {
  active: { label: 'Disponível', color: 'bg-emerald-100 text-emerald-700' },
  coming_soon: { label: 'Em breve', color: 'bg-amber-100 text-amber-700' },
  ended: { label: 'Encerrada', color: 'bg-gray-100 text-gray-500' },
};

export const CollectionSection: React.FC = () => {
  const { collections } = useData();

  // Show only active collections, up to 3
  const activeCollections = collections
    .filter(c => c.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .slice(0, 3);

  if (activeCollections.length === 0) {
    // Show the placeholder for Guardiões da Fé
    return <GuardioesFallback />;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">Exclusivas</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-4">Coleções Entre Santos</h2>
          <p className="text-navy/60 max-w-lg mx-auto text-sm leading-relaxed">
            Histórias de fé transformadas em peças para carregar, presentear e colecionar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {activeCollections.map((col, idx) => {
            const statusInfo = STATUS_MAP[col.status] || STATUS_MAP.active;
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link
                  to={`/colecoes/${col.slug}`}
                  className="group block bg-white border border-gold/15 hover:border-gold/35 rounded-3xl overflow-hidden shadow-premium hover:shadow-gold transition-all duration-400 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                    {col.image ? (
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-amber-50">
                        <GalleryHorizontal size={48} className="text-gold/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {col.total_items && col.total_items > 0 && (
                        <span className="text-[9px] text-navy/40 font-bold uppercase tracking-widest">
                          {col.total_items} peças
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-navy mb-2 group-hover:text-gold-dark transition-colors">
                      {col.name}
                    </h3>
                    {col.description && (
                      <p className="text-navy/60 text-xs leading-relaxed mb-4 line-clamp-2">
                        {col.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-navy/50 group-hover:text-navy uppercase tracking-widest transition-colors group-hover:gap-3">
                      Conhecer a coleção <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/colecoes" className="btn-primary inline-flex">
            Ver todas as coleções
          </Link>
        </div>
      </div>
    </section>
  );
};

// Fallback when no collections are in the database yet
const GuardioesFallback: React.FC = () => {
  const guardians = [
    { n: '01', name: 'São Bento', keywords: 'Proteção • Fé • Perseverança' },
    { n: '02', name: 'São Miguel Arcanjo', keywords: 'Coragem • Proteção • Confiança' },
    { n: '03', name: 'Nossa Senhora Aparecida', keywords: 'Fé • Esperança • Devoção' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">Exclusivas</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-4">Coleções Entre Santos</h2>
          <p className="text-navy/60 max-w-lg mx-auto text-sm leading-relaxed">
            Histórias de fé transformadas em peças para carregar, presentear e colecionar.
          </p>
        </div>

        <div className="mt-12 bg-gradient-to-br from-cream via-white to-amber-50 border border-gold/20 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:flex-1">
              <span className="text-[9px] text-gold-dark font-bold uppercase tracking-[0.3em] bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                Estreia
              </span>
              <h3 className="font-serif font-bold text-3xl sm:text-4xl text-navy mt-4 mb-4">
                Guardiões da Fé
              </h3>
              <p className="text-navy/60 leading-relaxed mb-6 max-w-md">
                Uma coleção de peças artesanais dedicadas aos santos guardiões. Cada peça celebra um protetor da fé, trazendo sua história e devoção em forma de arte.
              </p>
              <Link to="/colecoes/guardioes-da-fe" className="btn-primary inline-flex">
                Conhecer a coleção <ArrowRight size={15} />
              </Link>
            </div>

            <div className="md:flex-1 w-full">
              <div className="space-y-3">
                {guardians.map(g => (
                  <div key={g.n} className="flex items-center gap-4 bg-white border border-gold/15 rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-black text-gold-dark">Nº{g.n}</span>
                    </div>
                    <div>
                      <p className="font-serif font-bold text-navy text-sm">{g.name}</p>
                      <p className="text-[11px] text-navy/50 font-medium">{g.keywords}</p>
                    </div>
                    <span className="ml-auto text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Disponível
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

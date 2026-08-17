import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';

const ITEM_STATUS = {
  available: { label: 'Disponível', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-400' },
  sold_out: { label: 'Esgotado', color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-400' },
  coming_soon: { label: 'Em breve', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  ended: { label: 'Encerrado', color: 'text-gray-500', bg: 'bg-gray-50', dot: 'bg-gray-400' },
};

// Static data for Guardiões da Fé fallback
const GUARDIOES_SAINTS = [
  { n: 1, slug: 'sao-bento', name: 'São Bento', keywords: 'Proteção • Fé • Perseverança', status: 'available' as const },
  { n: 2, slug: 'sao-miguel-arcanjo', name: 'São Miguel Arcanjo', keywords: 'Coragem • Proteção • Confiança', status: 'available' as const },
  { n: 3, slug: 'nossa-senhora-aparecida', name: 'Nossa Senhora Aparecida', keywords: 'Fé • Esperança • Devoção', status: 'available' as const },
];

const CollectionDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { collections, saints, products } = useData();

  const collection = collections.find(c => c.slug === slug);
  const collectionSaints = collection
    ? saints.filter(s => s.collection_id === collection.id).sort((a, b) => (a.collection_number ?? 0) - (b.collection_number ?? 0))
    : slug === 'guardioes-da-fe' ? [] : [];

  const collectionProducts = collection
    ? products.filter(p => p.collection_id === collection.id && p.isActive !== false)
    : [];

  // If no DB data, show static Guardiões da Fé content
  const isGuardioes = slug === 'guardioes-da-fe';
  const saintsToShow = collectionSaints.length > 0 ? collectionSaints : (isGuardioes ? GUARDIOES_SAINTS : []);

  const title = collection?.name ?? (isGuardioes ? 'Guardiões da Fé' : 'Coleção');
  const description = collection?.description ?? (isGuardioes
    ? 'Uma coleção de peças artesanais dedicadas aos santos guardiões. Cada peça celebra um protetor da fé, trazendo sua história, significado e devoção em forma de arte.'
    : '');
  const totalItems = collection?.total_items ?? saintsToShow.length;

  const availableCount = saintsToShow.filter(s => (s as any).status !== 'coming_soon' && (s as any).status !== 'ended').length;
  const progress = totalItems > 0 ? Math.round((availableCount / totalItems) * 100) : 0;

  return (
    <div className="pt-[4.5rem] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-gold/10 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/colecoes" className="inline-flex items-center gap-2 text-xs text-navy/50 hover:text-navy transition-colors">
            <ArrowLeft size={14} /> Coleções
          </Link>
        </div>
      </div>

      {/* Hero da coleção */}
      <div className="bg-gradient-to-br from-navy via-navy-light to-navy py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {collection?.banner ? (
              <div className="lg:w-1/2 rounded-2xl overflow-hidden aspect-video">
                <img src={collection.banner} alt={title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="lg:w-1/2 rounded-2xl aspect-video bg-white/5 border border-gold/10 flex items-center justify-center">
                <span className="text-8xl">⚔️</span>
              </div>
            )}
            <div className="lg:w-1/2 text-center lg:text-left">
              <p className="text-[11px] text-gold/60 uppercase tracking-[0.3em] font-bold mb-4">Coleção Entre Santos</p>
              <h1 className="font-serif font-bold text-4xl sm:text-5xl text-gold mb-4">{title}</h1>
              {description && (
                <p className="text-white/60 leading-relaxed mb-6">{description}</p>
              )}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-white/70">{availableCount} disponíveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span className="text-white/70">{totalItems - availableCount} em breve</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progresso da coleção */}
      <div className="bg-cream border-b border-gold/10 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-navy/50 mb-2 font-medium">
                <span>Progresso da coleção</span>
                <span>{availableCount}/{totalItems} peças</span>
              </div>
              <div className="h-2 bg-navy/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-serif font-bold text-navy">{progress}%</span>
              <p className="text-[10px] text-navy/40 uppercase tracking-widest">completo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Santos da coleção */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif font-bold text-2xl text-navy mb-6">Peças da Coleção</h2>
        <div className="space-y-3 mb-12">
          {saintsToShow.map((saint, idx) => {
            const status = (saint as any).status || 'available';
            const statusInfo = ITEM_STATUS[status as keyof typeof ITEM_STATUS] || ITEM_STATUS.available;
            const number = String((saint as any).collection_number ?? (saint as any).n ?? idx + 1).padStart(2, '0');
            return (
              <motion.div
                key={(saint as any).id ?? (saint as any).slug}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <Link
                  to={`/santos/${(saint as any).slug}`}
                  className="group flex items-center gap-5 p-5 bg-white border border-gold/15 hover:border-gold/40 rounded-2xl hover:shadow-premium transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-gold-dark">Nº{number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-navy text-base group-hover:text-gold-dark transition-colors">
                      {(saint as any).name}
                    </p>
                    {(saint as any).keywords && (
                      <p className="text-[11px] text-navy/50 font-medium mt-0.5">{(saint as any).keywords}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <ArrowRight size={14} className="text-navy/30 group-hover:text-navy/60 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Produtos da coleção */}
        {collectionProducts.length > 0 && (
          <>
            <h2 className="font-serif font-bold text-2xl text-navy mb-6">Complete sua coleção</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {collectionProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        {collectionProducts.length === 0 && (
          <div className="text-center py-8 bg-cream/50 rounded-2xl border border-gold/10">
            <p className="text-navy/50 text-sm">Produtos desta coleção em breve na loja.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;

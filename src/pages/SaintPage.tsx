import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, QrCode } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';

const SaintPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { saints, collections, products } = useData();

  const saint = saints.find(s => s.slug === slug);

  // Products related to this saint
  const relatedProducts = saint
    ? products.filter(p => p.saint_id === saint.id && p.isActive !== false)
    : [];

  // Collection
  const collection = saint?.collection_id
    ? collections.find(c => c.id === saint.collection_id)
    : null;

  if (!saint) {
    return (
      <div className="pt-[4.5rem] min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center max-w-md px-4">
          <p className="text-6xl mb-4">🕊️</p>
          <h1 className="font-serif font-bold text-2xl text-navy mb-3">Página não encontrada</h1>
          <p className="text-navy/55 text-sm mb-6">
            Esta página ainda não foi criada ou o endereço está incorreto.
          </p>
          <Link to="/" className="btn-primary inline-flex">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[4.5rem] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-gold/10 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/colecoes" className="inline-flex items-center gap-2 text-xs text-navy/50 hover:text-navy transition-colors">
            <ArrowLeft size={14} /> Coleções
          </Link>
          {collection && (
            <>
              <span className="text-navy/20">/</span>
              <Link to={`/colecoes/${collection.slug}`} className="text-xs text-navy/50 hover:text-navy transition-colors">
                {collection.name}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-navy-light to-navy py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Image */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gold/30 overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center">
              {saint.image ? (
                <img src={saint.image} alt={saint.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">🕊️</span>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              {saint.collection_number && (
                <p className="text-[11px] text-gold/60 uppercase tracking-[0.3em] font-bold mb-3">
                  {collection?.name} — Nº {String(saint.collection_number).padStart(2, '0')}
                </p>
              )}
              <h1 className="font-serif font-bold text-4xl sm:text-5xl text-gold mb-3">
                {saint.name}
              </h1>
              {saint.subtitle && (
                <p className="text-white/60 text-base mb-3">{saint.subtitle}</p>
              )}
              {saint.keywords && (
                <p className="text-gold/70 font-medium tracking-wide">{saint.keywords}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {saint.history && (
              <div>
                <h2 className="font-serif font-bold text-xl text-navy mb-4">História</h2>
                <p className="text-navy/70 leading-relaxed whitespace-pre-wrap">{saint.history}</p>
              </div>
            )}

            {saint.meaning && (
              <div>
                <h2 className="font-serif font-bold text-xl text-navy mb-4">Significado</h2>
                <p className="text-navy/70 leading-relaxed">{saint.meaning}</p>
              </div>
            )}

            {saint.curiosities && (
              <div>
                <h2 className="font-serif font-bold text-xl text-navy mb-4">Curiosidades</h2>
                <p className="text-navy/70 leading-relaxed">{saint.curiosities}</p>
              </div>
            )}

            {saint.prayer && (
              <div className="bg-cream/70 border border-gold/20 rounded-2xl p-6">
                <h2 className="font-serif font-bold text-xl text-navy mb-4">Oração</h2>
                <p className="text-navy/70 leading-relaxed italic whitespace-pre-wrap">{saint.prayer}</p>
              </div>
            )}

            {!saint.history && !saint.meaning && !saint.prayer && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <p className="text-amber-700 text-sm">
                  O conteúdo desta página está sendo preparado. Em breve você encontrará a história, significado e oração de {saint.name}.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collection link */}
            {collection && (
              <div className="bg-white border border-gold/15 rounded-2xl p-5">
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-3">Parte da coleção</p>
                <Link to={`/colecoes/${collection.slug}`} className="font-serif font-bold text-navy hover:text-gold-dark transition-colors text-lg block mb-2">
                  {collection.name}
                </Link>
                <Link to={`/colecoes/${collection.slug}`} className="text-xs text-gold-dark font-bold hover:underline">
                  Ver coleção completa →
                </Link>
              </div>
            )}

            {/* QR Code info */}
            {saint.qr_code_url && (
              <div className="bg-white border border-gold/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode size={16} className="text-navy" />
                  <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">QR Code</p>
                </div>
                <img src={saint.qr_code_url} alt="QR Code" className="w-full rounded-xl" />
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif font-bold text-2xl text-navy mb-6">
              Peças relacionadas a {saint.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaintPage;

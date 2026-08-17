import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryCards } from '../components/CategoryCards';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { CollectionSection } from '../components/CollectionSection';
import { TrustSection } from '../components/TrustSection';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PersonalizeTeaser: React.FC = () => (
  <section className="py-20 px-4 bg-cream/60">
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-white to-amber-50 border border-gold/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="md:flex-1 text-center md:text-left">
          <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">Exclusivo para você</p>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy mb-4">
            Personalize<br />sua peça
          </h2>
          <p className="text-navy/60 text-sm leading-relaxed mb-6 max-w-md">
            Escolha o produto, a devoção, as cores e adicione um toque pessoal — nome, data ou mensagem especial.
          </p>
          <Link to="/personalize" className="btn-primary inline-flex">
            Começar agora
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="md:flex-1 flex flex-wrap gap-3 justify-center">
          {['Terço', 'Pulseira', 'Phone Charm', 'Dezena'].map(p => (
            <Link
              key={p}
              to={`/personalize?produto=${encodeURIComponent(p)}`}
              className="px-5 py-3 bg-white border border-gold/25 rounded-2xl text-sm font-bold text-navy hover:bg-gold/10 hover:border-gold/50 transition-all shadow-sm"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const MomentosTeaser: React.FC = () => {
  const moments = [
    { icon: '💧', label: 'Batismo' },
    { icon: '🍞', label: 'Primeira Comunhão' },
    { icon: '✝️', label: 'Crisma' },
    { icon: '💍', label: 'Casamento' },
    { icon: '🕊️', label: 'Encontros e retiros' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">Especial</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy">Momentos de Fé</h2>
          </div>
          <Link
            to="/momentos-de-fe"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-navy transition-colors uppercase tracking-wider group"
          >
            Ver todos
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {moments.map(m => (
            <Link
              key={m.label}
              to={`/momentos-de-fe?evento=${encodeURIComponent(m.label)}`}
              className="group flex flex-col items-center gap-3 p-6 bg-white border border-gold/15 rounded-2xl hover:border-gold/40 hover:shadow-premium transition-all text-center"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{m.icon}</span>
              <span className="text-xs font-bold text-navy/70 group-hover:text-navy uppercase tracking-wider">{m.label}</span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-navy/50 text-sm mb-4">O Ateliê aceita pedidos personalizados em quantidade para eventos especiais.</p>
          <Link to="/momentos-de-fe" className="text-gold-dark font-bold text-sm hover:text-gold-dark/80 inline-flex items-center gap-1 group">
            Solicitar orçamento <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Categorias principais */}
      <CategoryCards />

      {/* 3. Mais Amados */}
      <FeaturedProducts />

      {/* 4. Coleções Entre Santos */}
      <CollectionSection />

      {/* 5. Personalize sua peça */}
      <PersonalizeTeaser />

      {/* 6. Momentos de Fé */}
      <MomentosTeaser />

      {/* 7. Confiança */}
      <TrustSection />
    </>
  );
};

export default Home;

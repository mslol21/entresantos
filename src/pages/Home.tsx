import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryCards } from '../components/CategoryCards';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { CollectionSection } from '../components/CollectionSection';
import { TrustSection } from '../components/TrustSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const PersonalizeTeaser: React.FC = () => (
  <section className="py-20 px-4 bg-cream/60">
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-white via-amber-50/50 to-cream border border-gold/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="md:flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/25 text-gold-dark text-[10px] font-black uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>Ateliê Sob Medida</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy mb-4">
            Monte seu Terço ou<br />Personalize sua Peça
          </h2>
          <p className="text-navy/60 text-sm leading-relaxed mb-6 max-w-md">
            Experimente nosso construtor visual 2D para montar seu terço com contas, medalhas e crucifixos exclusivos, ou personalize pulseiras e lembranças de fé.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link to="/monte-seu-terco" className="btn-primary inline-flex">
              Monte seu Terço (2D)
              <ArrowRight size={15} />
            </Link>
            <Link to="/personalize" className="px-6 py-3.5 border-2 border-navy/20 text-navy font-bold text-xs uppercase tracking-wider rounded-full hover:border-navy hover:bg-navy/5 transition-all">
              Outras Peças
            </Link>
          </div>
        </div>
        <div className="md:flex-1 flex flex-wrap gap-3 justify-center">
          <Link
            to="/monte-seu-terco"
            className="px-6 py-4 bg-gradient-to-r from-navy to-navy-light text-gold border border-gold/30 rounded-2xl text-sm font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>Monte seu Terço</span>
          </Link>
          {['Pulseira', 'Phone Charm', 'Dezena'].map(p => (
            <Link
              key={p}
              to={`/personalize?produto=${encodeURIComponent(p)}`}
              className="px-5 py-3.5 bg-white border border-gold/25 rounded-2xl text-sm font-bold text-navy hover:bg-gold/10 hover:border-gold/50 transition-all shadow-sm"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

import { 
  BaptismVectorIcon, 
  CommunionVectorIcon, 
  CrismaVectorIcon, 
  WeddingVectorIcon, 
  RetiroVectorIcon 
} from '../components/icons/ProductIcons';

const MomentosTeaser: React.FC = () => {
  const moments = [
    { iconComponent: <BaptismVectorIcon size={28} className="text-blue-600" />, label: 'Batismo' },
    { iconComponent: <CommunionVectorIcon size={28} className="text-gold-dark" />, label: 'Primeira Comunhão' },
    { iconComponent: <CrismaVectorIcon size={28} className="text-amber-600" />, label: 'Crisma' },
    { iconComponent: <WeddingVectorIcon size={28} className="text-gold-dark" />, label: 'Casamento' },
    { iconComponent: <RetiroVectorIcon size={28} className="text-emerald-700" />, label: 'Encontros e retiros' },
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
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-navy hover:text-gold-dark transition-colors"
          >
            Ver todas as ocasiões
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {moments.map(m => (
            <Link
              key={m.label}
              to={`/momentos-de-fe#${encodeURIComponent(m.label.toLowerCase())}`}
              className="p-6 bg-white border border-gold/15 rounded-3xl text-center hover:border-gold/40 hover:bg-gold/5 transition-all shadow-sm group flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-gold/20 shadow-xs">
                {m.iconComponent}
              </div>
              <span className="font-serif font-bold text-sm text-navy block leading-tight">{m.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <CategoryCards />
      <FeaturedProducts />
      <CollectionSection />
      <PersonalizeTeaser />
      <MomentosTeaser />
      <TrustSection />
    </div>
  );
};

export default Home;

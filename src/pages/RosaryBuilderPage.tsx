import React from 'react';
import { Link } from 'react-router-dom';
import { RosaryBuilder } from '../components/rosary-builder/RosaryBuilder';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';

const RosaryBuilderPage: React.FC = () => {
  return (
    <div className="pt-[4.5rem] min-h-screen bg-cream">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-navy via-navy to-navy-light text-white py-12 px-4 relative overflow-hidden border-b border-gold/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-70 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Link
              to="/personalize"
              className="inline-flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold uppercase tracking-widest font-bold transition-colors"
            >
              <ArrowLeft size={13} /> Central de Personalização
            </Link>
          </div>

          <p className="text-[11px] text-gold/60 uppercase tracking-[0.3em] font-black mb-2">
            Ateliê Virtual • Experiência Exclusiva
          </p>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-gold mb-3">
            Monte seu Terço
          </h1>
          <p className="text-white/65 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Escolha cada detalhe — modelo, contas, medalha central e crucifixo. Acompanhe sua criação em tempo real e receba uma peça artesanal feita exclusivamente para você.
          </p>
        </div>
      </div>

      {/* Main Builder Container */}
      <RosaryBuilder />

      {/* Trust & Craftsmanship Footer Info */}
      <div className="bg-white/60 border-t border-gold/15 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs text-navy/60 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gold-dark" />
            <span>Feito artesanalmente à mão com oração</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-gold-dark" />
            <span>Materiais nobres & acabamento refinado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold-dark font-bold text-sm">📦</span>
            <span>Embalagem especial de presente e envio seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosaryBuilderPage;

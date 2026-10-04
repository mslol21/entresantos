import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gold/20 p-8 shadow-premium space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center mx-auto border border-gold/30">
          <Compass size={32} />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-dark">Erro 404</span>
          <h1 className="font-serif font-bold text-3xl text-navy">Página Não Encontrada</h1>
          <p className="text-sm text-navy/60">
            A página que você procura não existe, foi movida ou o endereço foi digitado incorretamente.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Voltar para a Página Inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

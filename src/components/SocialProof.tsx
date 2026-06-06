import React from 'react';
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: <Zap className="text-gold-dark" size={24} />,
    title: "Pedido Direto no Zap",
    description: "Sem intermediários, direto com o ateliê."
  },
  {
    icon: <ShieldCheck className="text-gold-dark" size={24} />,
    title: "Sem Cadastro",
    description: "Processo simples focado na sua comodidade."
  },
  {
    icon: <CheckCircle className="text-gold-dark" size={24} />,
    title: "Rápido e Simples",
    description: "Sua peça de fé pronta para entrega."
  }
];

export const SocialProof: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-transparent border-y border-gold/15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-gold/15 shadow-premium transition-transform hover:-translate-y-1">
              <div className="mt-1 bg-gold/15 p-2.5 rounded-full text-gold-dark">
                {benefit.icon}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-navy mb-1">{benefit.title}</h3>
                <p className="text-sm text-navy/60">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

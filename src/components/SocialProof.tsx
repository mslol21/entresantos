import React from 'react';
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: <Zap className="text-gold" size={24} />,
    title: "Pedido Direto no Zap",
    description: "Sem intermediários, direto com o ateliê."
  },
  {
    icon: <ShieldCheck className="text-gold" size={24} />,
    title: "Sem Cadastro",
    description: "Processo simples focado na sua comodidade."
  },
  {
    icon: <CheckCircle className="text-gold" size={24} />,
    title: "Rápido e Simples",
    description: "Sua peça de fé pronta para entrega."
  }
];

export const SocialProof: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-navy-light border-y border-gold/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-navy border border-gold/10 transition-transform hover:-translate-y-1">
              <div className="mt-1 bg-gold/10 p-2 rounded-lg">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-bold text-gold mb-1">{benefit.title}</h3>
                <p className="text-sm text-gold/60">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

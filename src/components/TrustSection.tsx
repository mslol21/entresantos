import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

export const TrustSection: React.FC = () => {
  const { settings } = useData();

  const pillars = [
    {
      icon: '🤲',
      title: 'Feito à mão',
      description: 'Cada peça é preparada artesanalmente com cuidado, amor e atenção a cada detalhe.',
    },
    {
      icon: '✏️',
      title: 'Personalização',
      description: 'Algumas criações podem ser feitas especialmente para você, com o nome, data ou devoção que quiser.',
    },
    {
      icon: '📦',
      title: 'Envio seguro',
      description: 'Enviamos para todo o Brasil com embalagem especial, para sua peça chegar intacta e bonita.',
    },
    {
      icon: '💬',
      title: 'Atendimento próximo',
      description: 'Estamos disponíveis pelo WhatsApp para esclarecer dúvidas, ajudar na escolha e acompanhar seu pedido.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-navy text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gold mb-3">
            Por que o Ateliê Entre Santos?
          </h2>
          <p className="text-white/55 max-w-md mx-auto text-sm">
            Mais do que produtos — peças com história, intenção e cuidado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/30 hover:bg-white/8 transition-all"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="font-serif font-bold text-gold mb-2 text-base">{p.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>

        {settings.whatsapp && (
          <div className="text-center mt-12">
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp inline-flex"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.099 1.51 5.828L.057 23.805a.5.5 0 0 0 .609.637l6.183-1.621A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 0 1-5.002-1.368l-.358-.214-3.713.974.99-3.617-.234-.372A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              Falar pelo WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

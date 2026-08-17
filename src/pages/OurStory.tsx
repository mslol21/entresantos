import React from 'react';
import { useData } from '../context/DataContext';
import { MessageCircle, Heart } from 'lucide-react';

const OurStory: React.FC = () => {
  const { settings } = useData();

  const hasAboutContent = settings.about_text || settings.about_image;

  return (
    <div className="pt-[4.5rem] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-cream to-amber-50 border-b border-gold/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">A marca</p>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-navy mb-4">Nossa História</h1>
          <p className="text-navy/60 text-base leading-relaxed max-w-xl mx-auto">
            Conheca quem está por trás de cada peça do Ateliê Entre Santos.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {hasAboutContent ? (
          <div className="space-y-16">
            {settings.about_image && (
              <div className="rounded-3xl overflow-hidden aspect-video">
                <img src={settings.about_image} alt="Ateliê Entre Santos" className="w-full h-full object-cover" />
              </div>
            )}
            {settings.about_text && (
              <div className="prose prose-navy max-w-none">
                <p className="text-navy/70 leading-relaxed text-base whitespace-pre-wrap">{settings.about_text}</p>
              </div>
            )}
          </div>
        ) : (
          // Placeholder when content is not yet filled in the admin
          <div className="space-y-12">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex gap-3">
                <span className="text-2xl">✏️</span>
                <div>
                  <p className="font-bold text-amber-800 mb-1">Conteúdo a ser preenchido</p>
                  <p className="text-amber-700 text-sm">
                    Acesse o painel administrativo e vá em <strong>Configurações</strong> para preencher a história do ateliê, adicionar fotos e contar quem está por trás de cada peça.
                  </p>
                </div>
              </div>
            </div>

            {/* Placeholder sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: '🌱', title: 'Como tudo começou', desc: 'A história da fundação do Ateliê, sua origem e motivação.' },
                { icon: '🤲', title: 'Quem produz', desc: 'Conheça a artesã e o processo de produção de cada peça.' },
                { icon: '✝️', title: 'Nosso propósito', desc: 'O que nos move a criar peças de fé com cuidado e amor.' },
                { icon: '💛', title: 'Nossos valores', desc: 'O que o Ateliê Entre Santos acredita e pratica a cada criação.' },
              ].map(s => (
                <div key={s.title} className="bg-white border border-gold/15 rounded-2xl p-6">
                  <span className="text-3xl block mb-4">{s.icon}</span>
                  <h3 className="font-serif font-bold text-lg text-navy mb-2">{s.title}</h3>
                  <p className="text-navy/50 text-sm leading-relaxed">{s.desc}</p>
                  <p className="text-[10px] text-navy/30 mt-3 uppercase tracking-widest font-bold">
                    A ser preenchido no admin
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-navy/50 text-sm mb-4">Enquanto isso, você pode falar diretamente conosco:</p>
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp inline-flex"
                >
                  <MessageCircle size={16} />
                  Falar pelo WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {/* Values always visible */}
        <div className="mt-16 bg-navy rounded-3xl p-8 text-center">
          <Heart size={32} className="text-gold mx-auto mb-4" />
          <h2 className="font-serif font-bold text-2xl text-gold mb-3">
            Fé feita à mão.
          </h2>
          <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
            Terços, acessórios, presentes e coleções religiosas produzidos artesanalmente para acompanhar momentos especiais da caminhada de fé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { 
  BaptismVectorIcon, 
  CommunionVectorIcon, 
  CrismaVectorIcon, 
  WeddingVectorIcon, 
  RetiroVectorIcon 
} from '../components/icons/ProductIcons';

const MOMENTS = [
  {
    id: 'batismo',
    label: 'Batismo',
    iconComponent: <BaptismVectorIcon size={26} className="text-blue-600" />,
    description: 'Lembranças artesanais para celebrar o sacramento do Batismo.',
    suggestions: ['Terço infantil', 'Pulseira com medalha', 'Chaveiro personalizado'],
  },
  {
    id: 'primeira_comunhao',
    label: 'Primeira Comunhão',
    iconComponent: <CommunionVectorIcon size={26} className="text-gold-dark" />,
    description: 'Peças especiais para este momento tão significativo da vida de fé.',
    suggestions: ['Terço branco', 'Dezena personalizada', 'Pulseira com cruz'],
  },
  {
    id: 'crisma',
    label: 'Crisma',
    iconComponent: <CrismaVectorIcon size={26} className="text-amber-600" />,
    description: 'Acessórios para os jovens que confirmam sua fé no Espírito Santo.',
    suggestions: ['Terço personalizado', 'Pulseira com nome', 'Phone charm'],
  },
  {
    id: 'casamento',
    label: 'Casamento',
    iconComponent: <WeddingVectorIcon size={26} className="text-gold-dark" />,
    description: 'Lembranças para o dia mais especial do casal.',
    suggestions: ['Terço de noiva', 'Dezena de casamento', 'Pulseiras para padrinhos'],
  },
  {
    id: 'retiro',
    label: 'Encontros e Retiros',
    iconComponent: <RetiroVectorIcon size={26} className="text-emerald-700" />,
    description: 'Lembranças para grupos em retiros espirituais e encontros de fé.',
    suggestions: ['Pulseiras em quantidade', 'Chaveiros', 'Dezenas personalizadas'],
  },
];

const MomentsFaith: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { settings, addQuote } = useData();

  const initialMoment = MOMENTS.find(m =>
    searchParams.get('evento')?.toLowerCase().includes(m.label.toLowerCase())
  );
  const [selectedMoment, setSelectedMoment] = useState(initialMoment || null);
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    event_type: initialMoment?.id || '',
    product: '',
    quantity: '',
    event_date: '',
    customization: '',
    notes: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMomentSelect = (moment: typeof MOMENTS[0]) => {
    setSelectedMoment(moment);
    updateForm('event_type', moment.id);
  };

  const buildWhatsAppMessage = () => {
    const parts = [
      `✨ *ORÇAMENTO — ATELIÊ ENTRE SANTOS* ✨`,
      ``,
      `📅 *Evento:* ${selectedMoment?.label || form.event_type}`,
      `👤 *Nome:* ${form.name}`,
      `📱 *WhatsApp:* ${form.whatsapp}`,
      form.email ? `📧 *E-mail:* ${form.email}` : '',
      `📦 *Produto desejado:* ${form.product}`,
      form.quantity ? `🔢 *Quantidade aproximada:* ${form.quantity}` : '',
      form.event_date ? `📅 *Data do evento:* ${form.event_date}` : '',
      form.customization ? `✏️ *Personalização:* ${form.customization}` : '',
      form.notes ? `📝 *Observações:* ${form.notes}` : '',
      ``,
      `🙏 Aguardo o orçamento!`,
    ].filter(Boolean);
    return parts.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Save lead to database
      await addQuote({
        name: form.name,
        whatsapp: form.whatsapp,
        email: form.email || undefined,
        event_type: form.event_type,
        product: form.product,
        quantity: form.quantity ? parseInt(form.quantity) : undefined,
        event_date: form.event_date || undefined,
        customization: form.customization || undefined,
        notes: form.notes || undefined,
      });
      setFormSent(true);
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err);
      // Even if DB fails, allow WhatsApp
      setFormSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen">
      {/* Header */}
      <div className="bg-cream border-b border-gold/10 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">Para cada celebração</p>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-navy mb-4">Momentos de Fé</h1>
          <p className="text-navy/60 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            O Ateliê Entre Santos cria peças artesanais especiais para os momentos mais significativos da sua jornada de fé — com possibilidade de pedidos personalizados em quantidade.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Momento cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {MOMENTS.map((moment, idx) => (
            <motion.button
              key={moment.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              onClick={() => handleMomentSelect(moment)}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center ${
                selectedMoment?.id === moment.id
                  ? 'border-navy bg-navy text-white'
                  : 'border-gold/15 bg-white text-navy hover:border-gold/40 hover:bg-gold/5'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-xs">
                {moment.iconComponent}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider leading-tight">{moment.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Selected moment detail + form */}
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Moment info */}
            <div className="bg-gradient-to-br from-cream to-amber-50 border border-gold/20 rounded-3xl p-8">
              <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mb-4 border border-gold/25 shadow-xs">
                {selectedMoment.iconComponent}
              </div>
              <h2 className="font-serif font-bold text-2xl text-navy mb-3">{selectedMoment.label}</h2>
              <p className="text-navy/60 text-sm leading-relaxed mb-6">{selectedMoment.description}</p>

              <div className="mb-6">
                <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-3">Sugestões populares</p>
                <ul className="space-y-2">
                  {selectedMoment.suggestions.map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-navy/70">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/80 rounded-2xl border border-gold/15">
                <Users size={18} className="text-gold-dark flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-navy">Pedidos em quantidade</p>
                  <p className="text-[11px] text-navy/50">Aceitamos pedidos para grupos e eventos especiais.</p>
                </div>
              </div>
            </div>

            {/* Quote form */}
            <div className="bg-white border border-gold/15 rounded-3xl p-8">
              {formSent ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🙏</div>
                  <h3 className="font-serif font-bold text-xl text-navy mb-2">Recebemos seu interesse!</h3>
                  <p className="text-navy/55 text-sm leading-relaxed mb-6">
                    Seu pedido de orçamento foi registrado. Agora clique abaixo para falar conosco pelo WhatsApp e continuar o atendimento.
                  </p>
                  <button onClick={handleWhatsApp} className="btn-whatsapp w-full justify-center">
                    <MessageCircle size={16} />
                    Continuar pelo WhatsApp
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif font-bold text-xl text-navy mb-6">Solicitar orçamento</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-base">Nome *</label>
                      <input required type="text" value={form.name} onChange={e => updateForm('name', e.target.value)}
                        placeholder="Seu nome" className="input-base" />
                    </div>
                    <div>
                      <label className="label-base">WhatsApp *</label>
                      <input required type="tel" value={form.whatsapp} onChange={e => updateForm('whatsapp', e.target.value)}
                        placeholder="(11) 99999-9999" className="input-base" />
                    </div>
                  </div>

                  <div>
                    <label className="label-base">Produto desejado *</label>
                    <input required type="text" value={form.product} onChange={e => updateForm('product', e.target.value)}
                      placeholder="Ex: Pulseiras personalizadas, Terços..." className="input-base" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-base">Quantidade aproximada</label>
                      <input type="number" min="1" value={form.quantity} onChange={e => updateForm('quantity', e.target.value)}
                        placeholder="Ex: 30" className="input-base" />
                    </div>
                    <div>
                      <label className="label-base">Data do evento</label>
                      <input type="date" value={form.event_date} onChange={e => updateForm('event_date', e.target.value)}
                        className="input-base" />
                    </div>
                  </div>

                  <div>
                    <label className="label-base">Personalização desejada</label>
                    <input type="text" value={form.customization} onChange={e => updateForm('customization', e.target.value)}
                      placeholder="Ex: nome do evento, data, devoção..." className="input-base" />
                  </div>

                  <div>
                    <label className="label-base">Observações</label>
                    <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)}
                      placeholder="Algum detalhe adicional..." rows={3} className="input-base resize-none" />
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="btn-primary w-full justify-center mt-2">
                    {isSubmitting ? 'Enviando...' : 'Solicitar orçamento'}
                    <ArrowRight size={15} />
                  </button>

                  {settings.whatsapp && (
                    <button type="button" onClick={handleWhatsApp} className="btn-whatsapp w-full justify-center">
                      <MessageCircle size={16} />
                      Ou fale agora pelo WhatsApp
                    </button>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MomentsFaith;

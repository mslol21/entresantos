import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const PRODUCTS = ['Terço', 'Pulseira', 'Phone Charm', 'Dezena'];
const DEVOTIONS = [
  'Nossa Senhora Aparecida',
  'São Bento',
  'São Miguel Arcanjo',
  'São José',
  'Nossa Senhora Auxiliadora',
  'Sagrado Coração de Jesus',
  'Outro',
];
const COLORS = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Nude', hex: '#E3C8B7' },
  { name: 'Rosa', hex: '#F4A0A0' },
  { name: 'Azul', hex: '#6A8CA6' },
  { name: 'Verde', hex: '#7B8E78' },
  { name: 'Dourado', hex: '#D4AF37' },
  { name: 'Preto', hex: '#1A1A1A' },
  { name: 'Areia', hex: '#E2DBD0' },
  { name: 'Terracota', hex: '#C06C53' },
  { name: 'Roxo', hex: '#8B5CF6' },
];

const steps = ['Produto', 'Devoção', 'Cores', 'Personalização', 'Resumo'];

const Personalize: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { settings } = useData();

  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(searchParams.get('produto') || '');
  const [selectedDevotion, setSelectedDevotion] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customization, setCustomization] = useState({
    name: '',
    initial: '',
    date: '',
    message: '',
    notes: '',
  });

  const canProceed = [
    !!selectedProduct,
    !!selectedDevotion,
    selectedColors.length > 0,
    true, // customization is optional
    true,
  ][step];

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const buildWhatsAppMessage = () => {
    const parts = [
      `✨ *PERSONALIZAÇÃO — ATELIÊ ENTRE SANTOS* ✨`,
      ``,
      `📦 *Produto:* ${selectedProduct}`,
      `🙏 *Devoção:* ${selectedDevotion}`,
      `🎨 *Cores:* ${selectedColors.join(', ')}`,
    ];
    if (customization.name) parts.push(`✏️ *Nome:* ${customization.name}`);
    if (customization.initial) parts.push(`🔤 *Inicial:* ${customization.initial}`);
    if (customization.date) parts.push(`📅 *Data:* ${customization.date}`);
    if (customization.message) parts.push(`💬 *Mensagem:* ${customization.message}`);
    if (customization.notes) parts.push(`📝 *Observações:* ${customization.notes}`);
    parts.push(``, `🙏 Aguardo o contato para combinar detalhes e valores!`);
    return parts.join('\n');
  };

  const handleFinish = () => {
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
      {steps.map((s, idx) => (
        <React.Fragment key={s}>
          <button
            onClick={() => idx < step && setStep(idx)}
            className={`flex-shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
              idx === step
                ? 'text-navy'
                : idx < step
                ? 'text-gold-dark cursor-pointer'
                : 'text-navy/30'
            }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
              idx < step
                ? 'bg-gold border-gold text-navy'
                : idx === step
                ? 'bg-navy border-navy text-white'
                : 'bg-transparent border-navy/20 text-navy/30'
            }`}>
              {idx < step ? <Check size={12} strokeWidth={3} /> : idx + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </button>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-px ${idx < step ? 'bg-gold' : 'bg-navy/10'} min-w-[16px]`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const stepContent = [
    // Step 0: Produto
    <div key="product" className="space-y-4">
      <h2 className="font-serif font-bold text-2xl text-navy mb-6">Escolha o produto</h2>
      <div className="grid grid-cols-2 gap-4">
        {PRODUCTS.map(p => (
          <button
            key={p}
            onClick={() => setSelectedProduct(p)}
            className={`p-6 rounded-2xl border-2 text-center font-bold transition-all ${
              selectedProduct === p
                ? 'border-navy bg-navy text-white'
                : 'border-gold/20 bg-white text-navy hover:border-gold/50 hover:bg-gold/5'
            }`}
          >
            {p === 'Terço' && <span className="text-3xl block mb-2">📿</span>}
            {p === 'Pulseira' && <span className="text-3xl block mb-2">🧶</span>}
            {p === 'Phone Charm' && <span className="text-3xl block mb-2">📱</span>}
            {p === 'Dezena' && <span className="text-3xl block mb-2">🔮</span>}
            {p}
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Devoção
    <div key="devotion" className="space-y-4">
      <h2 className="font-serif font-bold text-2xl text-navy mb-6">Escolha sua devoção</h2>
      <div className="space-y-2">
        {DEVOTIONS.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDevotion(d)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left font-medium transition-all ${
              selectedDevotion === d
                ? 'border-navy bg-navy text-white'
                : 'border-gold/15 bg-white text-navy hover:border-gold/40 hover:bg-gold/5'
            }`}
          >
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selectedDevotion === d ? 'border-white bg-white' : 'border-navy/30'
            }`}>
              {selectedDevotion === d && <Check size={12} strokeWidth={3} className="text-navy" />}
            </span>
            {d}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Cores
    <div key="colors" className="space-y-4">
      <h2 className="font-serif font-bold text-2xl text-navy mb-2">Escolha as cores</h2>
      <p className="text-navy/50 text-sm mb-6">Selecione uma ou mais cores para sua peça.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {COLORS.map(color => (
          <button
            key={color.name}
            onClick={() => toggleColor(color.name)}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              selectedColors.includes(color.name)
                ? 'border-navy bg-navy/5'
                : 'border-gold/15 bg-white hover:border-gold/40'
            }`}
          >
            <span
              className="w-8 h-8 rounded-full border border-navy/10 flex-shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-sm font-medium text-navy">{color.name}</span>
            {selectedColors.includes(color.name) && (
              <Check size={14} strokeWidth={3} className="ml-auto text-navy" />
            )}
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Personalização
    <div key="personalization" className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-navy mb-2">Personalização</h2>
      <p className="text-navy/50 text-sm mb-6">Todos os campos são opcionais. Preencha o que desejar.</p>
      {[
        { label: 'Nome', field: 'name', placeholder: 'Ex: Maria, João...' },
        { label: 'Inicial', field: 'initial', placeholder: 'Ex: M, J...' },
        { label: 'Data', field: 'date', placeholder: 'Ex: 12/10/2026' },
        { label: 'Mensagem', field: 'message', placeholder: 'Uma frase especial...' },
        { label: 'Observações', field: 'notes', placeholder: 'Algo mais que queira nos contar...' },
      ].map(f => (
        <div key={f.field}>
          <label className="label-base">{f.label}</label>
          {f.field === 'message' || f.field === 'notes' ? (
            <textarea
              value={customization[f.field as keyof typeof customization]}
              onChange={e => setCustomization(prev => ({ ...prev, [f.field]: e.target.value }))}
              placeholder={f.placeholder}
              rows={3}
              className="input-base resize-none"
            />
          ) : (
            <input
              type="text"
              value={customization[f.field as keyof typeof customization]}
              onChange={e => setCustomization(prev => ({ ...prev, [f.field]: e.target.value }))}
              placeholder={f.placeholder}
              className="input-base"
            />
          )}
        </div>
      ))}
    </div>,

    // Step 4: Resumo
    <div key="summary" className="space-y-5">
      <h2 className="font-serif font-bold text-2xl text-navy mb-6">Resumo do pedido</h2>
      <div className="bg-cream/60 border border-gold/20 rounded-2xl p-6 space-y-4">
        {[
          { label: 'Produto', value: selectedProduct },
          { label: 'Devoção', value: selectedDevotion },
          { label: 'Cores', value: selectedColors.join(', ') },
          ...(customization.name ? [{ label: 'Nome', value: customization.name }] : []),
          ...(customization.initial ? [{ label: 'Inicial', value: customization.initial }] : []),
          ...(customization.date ? [{ label: 'Data', value: customization.date }] : []),
          ...(customization.message ? [{ label: 'Mensagem', value: customization.message }] : []),
          ...(customization.notes ? [{ label: 'Observações', value: customization.notes }] : []),
        ].map(item => (
          <div key={item.label} className="flex justify-between gap-4 text-sm border-b border-gold/10 pb-3 last:border-0 last:pb-0">
            <span className="text-navy/50 font-medium flex-shrink-0">{item.label}:</span>
            <span className="font-bold text-navy text-right">{item.value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-navy/40 leading-relaxed">
        Ao clicar em "Enviar pelo WhatsApp", você será redirecionado para o WhatsApp do Ateliê com todos os detalhes preenchidos automaticamente. O prazo e valor serão combinados no atendimento.
      </p>
    </div>,
  ];

  return (
    <div className="pt-[4.5rem] min-h-screen">
      {/* Header */}
      <div className="bg-cream border-b border-gold/10 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-navy mb-3">Crie uma peça só sua.</h1>
          <p className="text-navy/60 text-sm leading-relaxed">
            Escolha o produto, a devoção, as cores e adicione um toque pessoal. Sua peça será criada com cuidado e amor.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <StepIndicator />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-gold/10">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-navy/50 hover:text-navy disabled:opacity-0 transition-all"
          >
            <ChevronLeft size={16} /> Voltar
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!settings.whatsapp}
              className="btn-whatsapp"
            >
              <MessageCircle size={16} />
              Enviar pelo WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personalize;

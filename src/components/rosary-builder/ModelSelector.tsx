import React from 'react';
import type { RosaryModel } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { motion } from 'framer-motion';
import { 
  TradicionalModelIcon,
  DelicadoModelIcon,
  PremiumModelIcon,
  NoivaModelIcon,
  InfantilModelIcon,
  DezenaVectorIcon
} from '../icons/ProductIcons';

interface ModelSelectorProps {
  models: RosaryModel[];
  selectedModel?: RosaryModel;
  onSelectModel: (model: RosaryModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel
}) => {
  const activeModels = models
    .filter(m => m.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const getModelBadge = (slug: string): string => {
    switch (slug) {
      case 'tradicional': return '5 Dezenas Clássicas';
      case 'delicado': return 'Contas Finas 6mm';
      case 'premium': return 'Tulipas & Resplendor';
      case 'noiva': return 'Nupcial & Zircônias';
      case 'infantil': return 'Acabamento Suave';
      case 'dezena': return '1 Dezena Compacta';
      default: return 'Exclusivo';
    }
  };

  const getModelIcon = (slug: string): React.ReactNode => {
    switch (slug) {
      case 'dezena':
        return <DezenaVectorIcon size={30} className="text-gold-dark" />;
      case 'delicado':
        return <DelicadoModelIcon size={30} className="text-gold-dark" />;
      case 'premium':
        return <PremiumModelIcon size={30} className="text-gold-dark" />;
      case 'noiva':
        return <NoivaModelIcon size={30} className="text-gold-dark" />;
      case 'infantil':
        return <InfantilModelIcon size={30} className="text-rose-500" />;
      case 'tradicional':
      default:
        return <TradicionalModelIcon size={30} className="text-gold-dark" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 1 de 5
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          Escolha o Modelo do seu Terço
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          Selecione o formato da sua peça. O simulador 2D ao lado se adapta em tempo real à estrutura escolhida.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 pt-2"
      >
        {activeModels.map((model) => (
          <RosaryOptionCard
            key={model.id}
            id={model.id}
            name={model.name}
            description={model.description}
            image={model.image}
            badge={getModelBadge(model.slug)}
            icon={getModelIcon(model.slug)}
            basePrice={model.base_price}
            isSelected={selectedModel?.id === model.id}
            onClick={() => onSelectModel(model)}
          />
        ))}
      </motion.div>
    </div>
  );
};

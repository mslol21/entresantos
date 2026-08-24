import React from 'react';
import type { RosaryModel } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { motion } from 'framer-motion';

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

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 1 de 7
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          Escolha o Modelo do seu Terço
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          Cada modelo define o estilo de montagem, a quantidade de mistérios e a base inicial da sua peça.
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
            basePrice={model.base_price}
            isSelected={selectedModel?.id === model.id}
            onClick={() => onSelectModel(model)}
          />
        ))}
      </motion.div>
    </div>
  );
};

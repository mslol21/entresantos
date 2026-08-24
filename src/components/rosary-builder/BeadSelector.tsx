import React from 'react';
import type { CustomizationComponent } from '../../types';
import { RosaryOptionCard } from './RosaryOptionCard';
import { motion } from 'framer-motion';

interface BeadSelectorProps {
  beads: CustomizationComponent[];
  selectedBead?: CustomizationComponent;
  onSelectBead: (bead: CustomizationComponent) => void;
}

export const BeadSelector: React.FC<BeadSelectorProps> = ({
  beads,
  selectedBead,
  onSelectBead
}) => {
  const activeBeads = beads
    .filter(b => b.component_type === 'bead' && b.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.2em] block mb-1">
          Etapa 2 de 7
        </span>
        <h3 className="font-serif font-bold text-2xl text-navy">
          Escolha as Contas das Ave-Marias
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed mt-1">
          As contas principais representam as 53 Ave-Marias do seu terço. Veja a cor e o acabamento mudarem no preview instantaneamente.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 pt-2"
      >
        {activeBeads.map((bead) => (
          <RosaryOptionCard
            key={bead.id}
            id={bead.id}
            name={bead.name}
            description={bead.description}
            image={bead.image}
            color={bead.color}
            material={bead.material}
            size={bead.size}
            additionalPrice={bead.additional_price}
            isSelected={selectedBead?.id === bead.id}
            isDisabled={bead.stock !== undefined && bead.stock <= 0}
            disabledReason={bead.stock !== undefined && bead.stock <= 0 ? 'Opção esgotada no momento' : undefined}
            onClick={() => onSelectBead(bead)}
          />
        ))}
      </motion.div>
    </div>
  );
};

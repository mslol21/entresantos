import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import type { 
  RosaryModel, 
  CustomizationComponent, 
  RosaryConfiguration, 
  Product 
} from '../../types';
import { RosaryPreview } from './RosaryPreview';
import { RosaryStepper } from './RosaryStepper';
import { RosaryPrice } from './RosaryPrice';
import { ModelSelector } from './ModelSelector';
import { BeadSelector } from './BeadSelector';
import { OurFatherSelector } from './OurFatherSelector';
import { CenterpieceSelector } from './CenterpieceSelector';
import { CrucifixSelector } from './CrucifixSelector';
import { RosarySummary } from './RosarySummary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const RosaryBuilder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { rosaryModels, customizationComponents, saveCustomBuild, products } = useData();
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Configuration State
  const [selectedModel, setSelectedModel] = useState<RosaryModel | undefined>(undefined);
  const [selectedBead, setSelectedBead] = useState<CustomizationComponent | undefined>(undefined);
  const [selectedOurFather, setSelectedOurFather] = useState<CustomizationComponent | undefined>(undefined);
  const [selectedCenterpiece, setSelectedCenterpiece] = useState<CustomizationComponent | undefined>(undefined);
  const [selectedCrucifix, setSelectedCrucifix] = useState<CustomizationComponent | undefined>(undefined);
  const selectedExtras: CustomizationComponent[] = [];
  const customName = '';
  const customMessage = '';
  const notes = '';
  const [publicCode, setPublicCode] = useState(() => `ES-${Math.floor(10000 + Math.random() * 90000)}`);

  // Default selections on load with URL query param support
  useEffect(() => {
    if (!selectedModel && rosaryModels.length > 0) {
      const modelParam = searchParams.get('modelo') || searchParams.get('produto');
      if (modelParam) {
        const found = rosaryModels.find(m => 
          m.slug.toLowerCase() === modelParam.toLowerCase() ||
          m.name.toLowerCase().includes(modelParam.toLowerCase())
        );
        if (found) {
          setSelectedModel(found);
          return;
        }
      }
      setSelectedModel(rosaryModels[0]);
    }
  }, [rosaryModels, selectedModel, searchParams]);

  useEffect(() => {
    if (!selectedBead && customizationComponents.length > 0) {
      const defaultBead = customizationComponents.find(c => c.component_type === 'bead' && c.is_active);
      if (defaultBead) setSelectedBead(defaultBead);
    }
  }, [customizationComponents, selectedBead]);

  useEffect(() => {
    if (!selectedCenterpiece && customizationComponents.length > 0) {
      const defaultCp = customizationComponents.find(c => c.component_type === 'centerpiece' && c.is_active);
      if (defaultCp) setSelectedCenterpiece(defaultCp);
    }
  }, [customizationComponents, selectedCenterpiece]);

  useEffect(() => {
    if (!selectedCrucifix && customizationComponents.length > 0) {
      const defaultCr = customizationComponents.find(c => c.component_type === 'crucifix' && c.is_active);
      if (defaultCr) setSelectedCrucifix(defaultCr);
    }
  }, [customizationComponents, selectedCrucifix]);

  // Price calculations
  const basePrice = selectedModel?.base_price ?? 59.90;

  const additionalPrice = useMemo(() => {
    let total = 0;
    if (selectedBead?.additional_price) total += selectedBead.additional_price;
    if (selectedOurFather?.additional_price) total += selectedOurFather.additional_price;
    if (selectedCenterpiece?.additional_price) total += selectedCenterpiece.additional_price;
    if (selectedCrucifix?.additional_price) total += selectedCrucifix.additional_price;
    return total;
  }, [selectedBead, selectedOurFather, selectedCenterpiece, selectedCrucifix]);

  const totalPrice = basePrice + additionalPrice;

  // Build Configuration Object
  const configuration: RosaryConfiguration = useMemo(() => ({
    model: selectedModel,
    bead: selectedBead,
    ourFather: selectedOurFather,
    centerpiece: selectedCenterpiece,
    crucifix: selectedCrucifix,
    extras: selectedExtras,
    customName,
    customMessage,
    notes,
  }), [selectedModel, selectedBead, selectedOurFather, selectedCenterpiece, selectedCrucifix, selectedExtras, customName, customMessage, notes]);

  // Step Navigation Validation
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1: return !!selectedModel;
      case 2: return !!selectedBead;
      case 3: return true; // Optional (falls back to selectedBead)
      case 4: return !!selectedCenterpiece;
      case 5: return !!selectedCrucifix;
      case 6: return true;
      default: return false;
    }
  }, [currentStep, selectedModel, selectedBead, selectedCenterpiece, selectedCrucifix]);

  const handleNextStep = () => {
    if (!canProceed) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    setMaxReachedStep(prev => Math.max(prev, next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Add to Cart handler
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      // 1. Save build to Supabase or get unique reference
      const saved = await saveCustomBuild({
        product_type: 'rosary',
        model_id: selectedModel?.id,
        configuration,
        base_price: basePrice,
        additional_price: additionalPrice,
        total_price: totalPrice
      });

      const finalCode = saved.public_code || publicCode;
      setPublicCode(finalCode);

      // 2. Find base catalog product or create custom representation
      const baseCatalogProduct = products.find(p => p.category === 'tercos' || p.category === 'monte-seu-terco') || products[0];

      const customRosaryProduct: Product = {
        id: baseCatalogProduct ? baseCatalogProduct.id : 'custom-rosary-item',
        name: `Terço Personalizado — ${finalCode}`,
        description: `Modelo ${selectedModel?.name || 'Tradicional'} com Contas ${selectedBead?.name || 'Clássicas'}, Entremeio ${selectedCenterpiece?.name || 'N. Sra. Aparecida'} e Crucifixo ${selectedCrucifix?.name || 'Barroco'}.`,
        price: totalPrice,
        image: selectedBead?.image || baseCatalogProduct?.image || '/logo.png',
        category: 'tercos',
        line: 'personalizados',
        availability: 'made_to_order',
        production_days: 5,
        isCustomizable: true,
      };

      // 3. Add to Cart with structured customization details
      addToCart({
        ...customRosaryProduct,
        customization: {
          buildId: saved.id,
          code: finalCode,
          model: selectedModel?.name || 'Tradicional',
          selections: {
            model: selectedModel,
            bead: selectedBead,
            ourFather: selectedOurFather || selectedBead,
            centerpiece: selectedCenterpiece,
            crucifix: selectedCrucifix,
            extras: selectedExtras,
            customName: customName || undefined,
            customMessage: customMessage || undefined,
            notes: notes || undefined
          }
        }
      } as any, 1);

      showToast(`Terço ${finalCode} adicionado ao carrinho!`, 'success');
      setIsCartOpen(true);
    } catch (err: any) {
      console.error('Erro ao adicionar ao carrinho:', err);
      showToast('Erro ao salvar sua criação. Tente novamente.', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Top Stepper */}
      <div className="mb-8">
        <RosaryStepper
          currentStep={currentStep}
          onStepClick={(stepId) => setCurrentStep(stepId)}
          maxReachedStep={maxReachedStep}
        />
      </div>

      {/* Main 2-Column Split Layout (55% Desktop Preview / 45% Configurator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (55% on Desktop): 2D Rosary Reactive Preview */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <RosaryPreview configuration={configuration} />
          
          {/* Desktop Real-time Price Breakdown Card */}
          <div className="hidden lg:block">
            <RosaryPrice
              basePrice={basePrice}
              additionalPrice={additionalPrice}
              totalPrice={totalPrice}
            />
          </div>
        </div>

        {/* Right Column (45% on Desktop): Step Configurator & Form */}
        <div className="lg:col-span-5 flex flex-col justify-between min-h-[500px] space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep === 1 && (
                <ModelSelector
                  models={rosaryModels}
                  selectedModel={selectedModel}
                  onSelectModel={(model) => {
                    setSelectedModel(model);
                    showToast(`Modelo ${model.name} selecionado.`, 'info');
                  }}
                />
              )}

              {currentStep === 2 && (
                <BeadSelector
                  beads={customizationComponents}
                  selectedBead={selectedBead}
                  onSelectBead={(bead) => {
                    setSelectedBead(bead);
                    showToast(`Contas ${bead.name} adicionadas à criação.`, 'info');
                  }}
                />
              )}

              {currentStep === 3 && (
                <OurFatherSelector
                  ourFatherBeads={customizationComponents}
                  selectedOurFather={selectedOurFather}
                  onSelectOurFather={(item) => {
                    setSelectedOurFather(item);
                    showToast(`Pai-Nossos ${item.name} selecionados.`, 'info');
                  }}
                />
              )}

              {currentStep === 4 && (
                <CenterpieceSelector
                  centerpieces={customizationComponents}
                  selectedCenterpiece={selectedCenterpiece}
                  onSelectCenterpiece={(item) => {
                    setSelectedCenterpiece(item);
                    showToast(`Entremeio ${item.name} adicionado.`, 'info');
                  }}
                />
              )}

              {currentStep === 5 && (
                <CrucifixSelector
                  crucifixes={customizationComponents}
                  selectedCrucifix={selectedCrucifix}
                  onSelectCrucifix={(item) => {
                    setSelectedCrucifix(item);
                    showToast(`Crucifixo ${item.name} adicionado.`, 'info');
                  }}
                />
              )}

              {currentStep === 6 && (
                <RosarySummary
                  configuration={configuration}
                  basePrice={basePrice}
                  additionalPrice={additionalPrice}
                  totalPrice={totalPrice}
                  publicCode={publicCode}
                  isAddingToCart={isAddingToCart}
                  onAddToCart={handleAddToCart}
                  onEditStep={(stepId) => setCurrentStep(stepId)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Mobile Price Summary Pill */}
          <div className="lg:hidden">
            <RosaryPrice
              basePrice={basePrice}
              additionalPrice={additionalPrice}
              totalPrice={totalPrice}
            />
          </div>

          {/* Navigation Controls (Voltar / Continuar) */}
          {currentStep < 6 && (
            <div className="flex items-center justify-between pt-6 border-t border-gold/15 sticky bottom-0 bg-cream/95 backdrop-blur-md py-4 z-10">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-navy/50 hover:text-navy disabled:opacity-0 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} /> Voltar
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={!canProceed}
                className="btn-primary py-3.5 px-8 text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-navy/10 cursor-pointer"
              >
                <span>Continuar</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

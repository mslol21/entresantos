import React, { useMemo, useState } from 'react';
import type { RosaryConfiguration } from '../../types';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';

interface RosaryPreviewProps {
  configuration: RosaryConfiguration;
}

export const RosaryPreview: React.FC<RosaryPreviewProps> = ({ configuration }) => {
  const { model, bead, ourFather, centerpiece, crucifix, extras, customName } = configuration;
  const [zoomLevel, setZoomLevel] = useState(1);

  // Compute colors & finishes
  const beadColor = bead?.color || '#F8F8F6';
  const ourFatherColor = ourFather?.color || beadColor;
  
  const getMetalFinish = (compColor?: string, compName?: string): { base: string; highlight: string; shadow: string } => {
    const str = `${compColor || ''} ${compName || ''}`.toLowerCase();
    if (str.includes('prata') || str.includes('prateado') || str.includes('silver') || str.includes('#cf') || str.includes('#fff')) {
      return { base: '#C0C0C0', highlight: '#FFFFFF', shadow: '#787878' };
    }
    if (str.includes('ouro velho') || str.includes('envelhecido') || str.includes('vintage') || str.includes('#a68')) {
      return { base: '#A68A56', highlight: '#D1B880', shadow: '#5C4824' };
    }
    if (str.includes('madeira') || str.includes('#664') || str.includes('#8c6')) {
      return { base: '#7A4A28', highlight: '#A66B3E', shadow: '#4A2A12' };
    }
    // Default Gold
    return { base: '#D4AF37', highlight: '#FFE680', shadow: '#8C701E' };
  };

  const centerpieceFinish = getMetalFinish(centerpiece?.color, centerpiece?.name);
  const crucifixFinish = getMetalFinish(crucifix?.color, crucifix?.name);

  // Generate coordinates for 5 decades (50 Ave-Marias + 4 Our-Fathers) around the loop
  // The loop starts from centerpiece top-left, goes up, curves over top, and comes down to centerpiece top-right.
  const loopBeads = useMemo(() => {
    const points: Array<{ x: number; y: number; type: 'ave_maria' | 'our_father'; decade: number; index: number }> = [];
    const centerX = 250;
    const centerY = 195;
    const radiusX = 145;
    const radiusY = 125;

    // We have 5 decades of 10 beads + 4 Our Father beads separating them = 54 points in loop
    // Total steps: 5 * 10 (ave-marias) + 4 (our-fathers) = 54 points along ellipse from angle 75° to 465° (counter-clockwise)
    let pointIndex = 0;

    for (let decade = 1; decade <= 5; decade++) {
      // 10 Ave-Maria beads
      for (let b = 1; b <= 10; b++) {
        // Map pointIndex to parametric angle on ellipse
        // Leave an opening at bottom (between 80° and 100°) for centerpiece
        const progress = pointIndex / 54;
        const angle = Math.PI * 0.58 + progress * Math.PI * 1.84; // 105 deg to 435 deg
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);

        points.push({ x, y, type: 'ave_maria', decade, index: b });
        pointIndex++;
      }

      // 1 Our Father bead after decades 1, 2, 3, 4
      if (decade < 5) {
        const progress = pointIndex / 54;
        const angle = Math.PI * 0.58 + progress * Math.PI * 1.84;
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);

        points.push({ x, y, type: 'our_father', decade, index: 1 });
        pointIndex++;
      }
    }

    return points;
  }, []);

  // Drop pendant beads below centerpiece
  // Centerpiece at (250, 325)
  // 1 Our Father at (250, 360)
  // 3 Ave-Marias at (250, 385), (250, 405), (250, 425)
  // 1 Our Father at (250, 455)
  // Crucifix at (250, 500)
  const dropBeads = [
    { x: 250, y: 360, type: 'our_father' as const, label: 'Pai-Nosso' },
    { x: 250, y: 388, type: 'ave_maria' as const, label: 'Ave-Maria 1' },
    { x: 250, y: 408, type: 'ave_maria' as const, label: 'Ave-Maria 2' },
    { x: 250, y: 428, type: 'ave_maria' as const, label: 'Ave-Maria 3' },
    { x: 250, y: 456, type: 'our_father' as const, label: 'Pai-Nosso' },
  ];

  return (
    <div className="relative w-full h-full min-h-[440px] md:min-h-[600px] flex flex-col items-center justify-center bg-gradient-to-b from-cream-light via-white to-amber-50/40 rounded-3xl border border-gold/20 shadow-premium p-4 select-none overflow-hidden group">
      
      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
        <span className="bg-navy/85 backdrop-blur-xs text-gold border border-gold/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">
          <Sparkles size={12} />
          {model?.name || 'Terço Personalizado'}
        </span>
        {customName && (
          <span className="bg-white/90 backdrop-blur-xs text-navy border border-gold/30 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
            Nome: {customName}
          </span>
        )}
      </div>

      {/* Zoom / Reset Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-gold/20 rounded-full p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
          className="p-1.5 hover:bg-navy/5 text-navy/60 hover:text-navy rounded-full transition-colors"
          title="Aproximar"
          aria-label="Aproximar visualização"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.15))}
          className="p-1.5 hover:bg-navy/5 text-navy/60 hover:text-navy rounded-full transition-colors"
          title="Afastar"
          aria-label="Afastar visualização"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(1)}
          className="p-1.5 hover:bg-navy/5 text-navy/60 hover:text-navy rounded-full transition-colors"
          title="Restaurar tamanho"
          aria-label="Restaurar tamanho padrão"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Reactive 2D SVG Rosary Canvas */}
      <motion.div
        animate={{ scale: zoomLevel }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="w-full max-w-[480px] aspect-[5/6] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      >
        <svg
          viewBox="0 0 500 560"
          className="w-full h-full filter drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Shaders & Filters */}
            <filter id="bead-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#0A1128" floodOpacity="0.25" />
            </filter>
            <filter id="metal-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodColor="#0A1128" floodOpacity="0.35" />
            </filter>

            {/* Ave-Maria Bead Radial Gradient */}
            <radialGradient id="bead-grad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="45%" stopColor={beadColor} />
              <stop offset="90%" stopColor={beadColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#2A2A2A" stopOpacity="0.35" />
            </radialGradient>

            {/* Our Father Bead Radial Gradient */}
            <radialGradient id="of-bead-grad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor={ourFatherColor} />
              <stop offset="85%" stopColor={ourFatherColor} />
              <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.45" />
            </radialGradient>

            {/* Centerpiece Metallic Linear Gradient */}
            <linearGradient id="centerpiece-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={centerpieceFinish.highlight} />
              <stop offset="45%" stopColor={centerpieceFinish.base} />
              <stop offset="100%" stopColor={centerpieceFinish.shadow} />
            </linearGradient>

            {/* Crucifix Metallic Linear Gradient */}
            <linearGradient id="crucifix-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={crucifixFinish.highlight} />
              <stop offset="35%" stopColor={crucifixFinish.base} />
              <stop offset="100%" stopColor={crucifixFinish.shadow} />
            </linearGradient>

            {/* Cord / Chain Gradient */}
            <linearGradient id="cord-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2DBD0" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C701E" />
            </linearGradient>
          </defs>

          {/* Background Cord / Chain Line */}
          {/* Main Loop Path */}
          <path
            d="M 235 320 C 100 290 80 120 250 80 C 420 120 400 290 265 320"
            fill="none"
            stroke="url(#cord-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Drop Cord Path */}
          <line
            x1="250"
            y1="325"
            x2="250"
            y2="485"
            stroke="url(#cord-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Loop Beads (Ave-Marias & Our-Fathers) */}
          {loopBeads.map((pt, i) => {
            const isOurFather = pt.type === 'our_father';
            const radius = isOurFather ? 7.5 : 5.5;

            return (
              <g key={`loop-${i}`} className="transition-all duration-300">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={radius}
                  fill={isOurFather ? 'url(#of-bead-grad)' : 'url(#bead-grad)'}
                  stroke={isOurFather ? centerpieceFinish.base : '#E2DBD0'}
                  strokeWidth={isOurFather ? 1.2 : 0.6}
                  filter="url(#bead-shadow)"
                />
                {/* Specular Highlight dot */}
                <circle
                  cx={pt.x - radius * 0.35}
                  cy={pt.y - radius * 0.35}
                  r={radius * 0.28}
                  fill="#FFFFFF"
                  opacity="0.75"
                />
              </g>
            );
          })}

          {/* Drop Pendant Beads */}
          {dropBeads.map((pt, i) => {
            const isOurFather = pt.type === 'our_father';
            const radius = isOurFather ? 8 : 5.8;

            return (
              <g key={`drop-${i}`} className="transition-all duration-300">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={radius}
                  fill={isOurFather ? 'url(#of-bead-grad)' : 'url(#bead-grad)'}
                  stroke={isOurFather ? centerpieceFinish.base : '#E2DBD0'}
                  strokeWidth={isOurFather ? 1.2 : 0.6}
                  filter="url(#bead-shadow)"
                />
                <circle
                  cx={pt.x - radius * 0.35}
                  cy={pt.y - radius * 0.35}
                  r={radius * 0.28}
                  fill="#FFFFFF"
                  opacity="0.75"
                />
              </g>
            );
          })}

          {/* Centerpiece (Entremeio Medal) at (250, 325) */}
          <g filter="url(#metal-shadow)" className="transition-transform duration-500 hover:scale-105 origin-[250px_325px]">
            {/* Outer Ring & Loops */}
            <circle cx="250" cy="325" r="16" fill="url(#centerpiece-grad)" stroke={centerpieceFinish.highlight} strokeWidth="1.5" />
            <circle cx="250" cy="325" r="13" fill="none" stroke={centerpieceFinish.shadow} strokeWidth="0.8" strokeDasharray="1 2" />
            
            {/* Centerpiece Image / Icon Content */}
            {centerpiece?.image ? (
              <clipPath id="centerpiece-clip">
                <circle cx="250" cy="325" r="12" />
              </clipPath>
            ) : null}

            {centerpiece?.image ? (
              <image
                href={centerpiece.image}
                x="238"
                y="313"
                width="24"
                height="24"
                clipPath="url(#centerpiece-clip)"
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              // Holy Cross / Saint silhouette vector
              <path
                d="M 250 317 L 250 333 M 244 322 L 256 322"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.9"
              />
            )}

            {/* Top connection loops */}
            <circle cx="237" cy="316" r="2.5" fill="none" stroke={centerpieceFinish.base} strokeWidth="1" />
            <circle cx="263" cy="316" r="2.5" fill="none" stroke={centerpieceFinish.base} strokeWidth="1" />
            <circle cx="250" cy="339" r="2.5" fill="none" stroke={centerpieceFinish.base} strokeWidth="1" />
          </g>

          {/* Extra Medals attached to Centerpiece (if selected) */}
          {extras.some(e => e.component_type === 'medal') && (
            <g filter="url(#metal-shadow)" className="animate-pulse">
              <line x1="262" y1="328" x2="276" y2="340" stroke="url(#cord-grad)" strokeWidth="1.2" />
              <circle cx="280" cy="344" r="9" fill="url(#centerpiece-grad)" stroke={centerpieceFinish.highlight} strokeWidth="1" />
              <text x="280" y="347" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="bold">✝</text>
            </g>
          )}

          {/* Crucifix at bottom (250, 500) */}
          <g filter="url(#metal-shadow)" className="transition-transform duration-500 hover:scale-105 origin-[250px_500px]">
            {/* Cross Shape (Barroca/Tradicional) */}
            <path
              d="M 243 472 H 257 V 485 H 272 V 497 H 257 V 535 H 243 V 497 H 228 V 485 H 243 Z"
              fill="url(#crucifix-grad)"
              stroke={crucifixFinish.highlight}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Inner Cross Inset */}
            <path
              d="M 245 475 H 255 V 487 H 269 V 495 H 255 V 532 H 245 V 495 H 231 V 487 H 245 Z"
              fill="none"
              stroke={crucifixFinish.shadow}
              strokeWidth="0.8"
            />
            {/* Corpus Christi Silhouette */}
            <path
              d="M 250 484 L 250 514 M 242 490 L 258 490 M 248 514 L 252 514"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* INRI Banner */}
            <rect x="246" y="474" width="8" height="4" rx="1" fill={crucifixFinish.highlight} opacity="0.9" />
            {/* Ring at top */}
            <circle cx="250" cy="470" r="3" fill="none" stroke={crucifixFinish.base} strokeWidth="1.2" />
          </g>

          {/* Subtle Devotional Rays behind Centerpiece */}
          <circle cx="250" cy="325" r="32" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Helper text */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-navy/40 font-medium">
          Preview 2D interativo em escala • Toque nos controles para ampliar detalhes
        </p>
      </div>
    </div>
  );
};

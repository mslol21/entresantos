import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// -------------------------------------------------------------------
// PRODUTOS PRINCIPAIS (TERÇO, PULSEIRA, DEZENA, PHONE CHARM)
// -------------------------------------------------------------------

// Terço (Rosary) Luxury Vector Icon
export const RosaryVectorIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad-rosary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C701E" />
      </linearGradient>
      <radialGradient id="bead-gloss-r" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7A5F12" />
      </radialGradient>
      <filter id="shadow-r" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#0B284C" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Rosary Elliptical Loop Cord */}
    <ellipse cx="24" cy="18" rx="14" ry="11" stroke="url(#gold-grad-rosary)" strokeWidth="1.2" strokeDasharray="1 1.8" opacity="0.6" />

    {/* Render individual shiny beads along the top loop */}
    {[
      { cx: 10, cy: 18 },
      { cx: 12, cy: 12 },
      { cx: 17, cy: 8 },
      { cx: 24, cy: 7 },
      { cx: 31, cy: 8 },
      { cx: 36, cy: 12 },
      { cx: 38, cy: 18 },
      { cx: 35, cy: 23 },
      { cx: 30, cy: 26 },
      { cx: 18, cy: 26 },
      { cx: 13, cy: 23 },
    ].map((b, i) => (
      <circle key={i} cx={b.cx} cy={b.cy} r="2.2" fill="url(#bead-gloss-r)" filter="url(#shadow-r)" />
    ))}

    {/* Centerpiece Medal */}
    <g filter="url(#shadow-r)">
      <circle cx="24" cy="28" r="4" fill="url(#gold-grad-rosary)" stroke="#FFF2B2" strokeWidth="0.8" />
      <circle cx="24" cy="28" r="2.8" fill="none" stroke="#7A5F12" strokeWidth="0.4" strokeDasharray="0.8 0.8" />
      <path d="M24 26.5V29.5M22.5 28H25.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
    </g>

    {/* Drop Beads */}
    <circle cx="24" cy="34" r="1.8" fill="url(#bead-gloss-r)" />
    <circle cx="24" cy="37" r="1.8" fill="url(#bead-gloss-r)" />

    {/* Baroque Cross at bottom */}
    <g filter="url(#shadow-r)">
      <path
        d="M22.5 40H25.5V42H27.5V44H25.5V48H22.5V44H20.5V42H22.5Z"
        fill="url(#gold-grad-rosary)"
        stroke="#FFF2B2"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="43" r="0.8" fill="#FFFFFF" />
    </g>
  </svg>
);

// Pulseira (Bracelet) Luxury Vector Icon
export const BraceletVectorIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad-brac" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C701E" />
      </linearGradient>
      <radialGradient id="pearl-gloss" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E8DDD0" />
        <stop offset="100%" stopColor="#B39B82" />
      </radialGradient>
      <radialGradient id="gold-bead" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFF4C2" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7A5F12" />
      </radialGradient>
      <filter id="shadow-b" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#0B284C" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Open Bangle / Torque Ring with Beads */}
    <ellipse cx="24" cy="22" rx="16" ry="12" stroke="url(#gold-grad-brac)" strokeWidth="1.6" strokeDasharray="1 3" opacity="0.4" />

    {/* Alternating Pearl & Gold Beads */}
    {[
      { cx: 8, cy: 22, type: 'pearl' },
      { cx: 10, cy: 16, type: 'gold' },
      { cx: 14, cy: 12, type: 'pearl' },
      { cx: 20, cy: 10, type: 'gold' },
      { cx: 28, cy: 10, type: 'pearl' },
      { cx: 34, cy: 12, type: 'gold' },
      { cx: 38, cy: 16, type: 'pearl' },
      { cx: 40, cy: 22, type: 'gold' },
      { cx: 37, cy: 28, type: 'pearl' },
      { cx: 31, cy: 32, type: 'gold' },
      { cx: 17, cy: 32, type: 'gold' },
      { cx: 11, cy: 28, type: 'pearl' },
    ].map((b, i) => (
      <circle
        key={i}
        cx={b.cx}
        cy={b.cy}
        r={b.type === 'pearl' ? 2.8 : 2.2}
        fill={b.type === 'pearl' ? 'url(#pearl-gloss)' : 'url(#gold-bead)'}
        filter="url(#shadow-b)"
      />
    ))}

    {/* Hanging Holy Medal Charm */}
    <g filter="url(#shadow-b)">
      <line x1="24" y1="34" x2="24" y2="37" stroke="url(#gold-grad-brac)" strokeWidth="1.2" />
      <circle cx="24" cy="41" r="4.5" fill="url(#gold-grad-brac)" stroke="#FFF2B2" strokeWidth="0.8" />
      <circle cx="24" cy="41" r="3.2" fill="none" stroke="#7A5F12" strokeWidth="0.4" strokeDasharray="0.6 0.6" />
      <path d="M24 39V43M22 41H26" stroke="#FFFFFF" strokeWidth="1.0" strokeLinecap="round" />
    </g>
  </svg>
);

// Dezena (Single Decade Rosary) Luxury Vector Icon
export const DezenaVectorIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad-dez" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C701E" />
      </linearGradient>
      <radialGradient id="bead-gloss-d" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7A5F12" />
      </radialGradient>
      <filter id="shadow-d" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#0B284C" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Top Car Hanger / Keyring Clasp */}
    <circle cx="24" cy="7" r="4" fill="none" stroke="url(#gold-grad-dez)" strokeWidth="1.4" />
    <path d="M22 5L26 9" stroke="#FFF2B2" strokeWidth="1.0" />

    {/* 10 Ave-Maria Beads in a harmonious Horseshoe Arc */}
    {[
      { cx: 12, cy: 22 },
      { cx: 13, cy: 16 },
      { cx: 16, cy: 11 },
      { cx: 21, cy: 9 },
      { cx: 27, cy: 9 },
      { cx: 32, cy: 11 },
      { cx: 35, cy: 16 },
      { cx: 36, cy: 22 },
      { cx: 32, cy: 26 },
      { cx: 16, cy: 26 },
    ].map((b, i) => (
      <circle key={i} cx={b.cx} cy={b.cy} r="2.5" fill="url(#bead-gloss-d)" filter="url(#shadow-d)" />
    ))}

    {/* Centerpiece Medal */}
    <g filter="url(#shadow-d)">
      <circle cx="24" cy="28" r="4.2" fill="url(#gold-grad-dez)" stroke="#FFF2B2" strokeWidth="0.8" />
      <path d="M24 26.2V29.8M22.2 28H25.8" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
    </g>

    {/* 1 Our-Father bead */}
    <circle cx="24" cy="35" r="2.6" fill="url(#bead-gloss-d)" />

    {/* Crucifix */}
    <g filter="url(#shadow-d)">
      <path
        d="M22.5 39H25.5V41H27.5V43H25.5V47H22.5V43H20.5V41H22.5Z"
        fill="url(#gold-grad-dez)"
        stroke="#FFF2B2"
        strokeWidth="0.6"
      />
      <circle cx="24" cy="42" r="0.8" fill="#FFFFFF" />
    </g>
  </svg>
);

// Phone Charm (Strap Phone) Luxury Vector Icon
export const PhoneCharmVectorIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad-pc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C701E" />
      </linearGradient>
      <radialGradient id="crystal-pink" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E5B8BC" />
        <stop offset="100%" stopColor="#9C5A62" />
      </radialGradient>
      <radialGradient id="gold-mini" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="60%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7A5F12" />
      </radialGradient>
      <filter id="shadow-pc" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#0B284C" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Top Lanyard Loop Cord */}
    <path d="M24 4C19 4 19 12 24 16C29 12 29 4 24 4Z" stroke="url(#gold-grad-pc)" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="24" cy="16" r="2.2" fill="url(#gold-mini)" />

    {/* Hanging Beaded Charm Chain */}
    {[
      { y: 21, r: 2.4, type: 'pink' },
      { y: 26, r: 2.0, type: 'gold' },
      { y: 30, r: 2.6, type: 'pink' },
      { y: 35, r: 2.2, type: 'gold' },
    ].map((b, i) => (
      <circle
        key={i}
        cx="24"
        cy={b.y}
        r={b.r}
        fill={b.type === 'pink' ? 'url(#crystal-pink)' : 'url(#gold-mini)'}
        filter="url(#shadow-pc)"
      />
    ))}

    {/* Star / Cross Dangle Charm */}
    <g filter="url(#shadow-pc)">
      <path
        d="M24 38L25.2 41.2L28.5 41.5L26 43.6L26.8 46.8L24 45L21.2 46.8L22 43.6L19.5 41.5L22.8 41.2L24 38Z"
        fill="url(#gold-grad-pc)"
        stroke="#FFF2B2"
        strokeWidth="0.5"
      />
      <circle cx="24" cy="43" r="0.9" fill="#FFFFFF" />
    </g>
  </svg>
);

// -------------------------------------------------------------------
// ÍCONES EXCLUSIVOS DOS MODELOS DE TERÇO (MODEL SELECTOR)
// -------------------------------------------------------------------

// Modelo 1: Tradicional
export const TradicionalModelIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 28 }) => (
  <RosaryVectorIcon className={className} size={size} />
);

// Modelo 2: Delicado (Fino, 6mm, Ponto de Luz)
export const DelicadoModelIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="18" cy="14" rx="10" ry="8" stroke="currentColor" strokeWidth="1.0" strokeDasharray="1.5 2" />
    <circle cx="18" cy="22" r="2.2" fill="currentColor" />
    <line x1="18" y1="24" x2="18" y2="28" stroke="currentColor" strokeWidth="1.0" />
    {/* Delicate Cross with Shining Star */}
    <line x1="18" y1="28" x2="18" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="15" y1="30" x2="21" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="30" r="1.2" fill="#FFFFFF" />
  </svg>
);

// Modelo 3: Premium & Colecionador (Tulipas & Resplendor)
export const PremiumModelIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sunburst Rays around centerpiece */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 18 + 4 * Math.cos(angle);
      const y1 = 20 + 4 * Math.sin(angle);
      const x2 = 18 + 7 * Math.cos(angle);
      const y2 = 20 + 7 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.8" />;
    })}
    <ellipse cx="18" cy="12" rx="11" ry="8" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 3" />
    <circle cx="18" cy="20" r="3.5" fill="currentColor" />
    {/* Baroque Cross with Fleur-de-lis points */}
    <path
      d="M16.5 26H19.5V28H21.5V30H19.5V34H16.5V30H14.5V28H16.5Z"
      fill="currentColor"
      stroke="#FFFFFF"
      strokeWidth="0.5"
    />
  </svg>
);

// Modelo 4: Noiva Especial (Zircônias & Cristais)
export const NoivaModelIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Elegant Teardrop loop */}
    <path d="M18 4C10 12 10 18 18 22C26 18 26 12 18 4Z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 2" />
    {/* Pavé stone ring */}
    <circle cx="18" cy="22" r="3.2" fill="currentColor" />
    {/* Diamond Star Cross */}
    <line x1="18" y1="25" x2="18" y2="34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="14" y1="28" x2="22" y2="28" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="18" cy="28" r="1.4" fill="#FFFFFF" />
    <circle cx="18" cy="34" r="1.0" fill="#FFFFFF" />
    <circle cx="14" cy="28" r="1.0" fill="#FFFFFF" />
    <circle cx="22" cy="28" r="1.0" fill="#FFFFFF" />
  </svg>
);

// Modelo 5: Infantil / Lembrança
export const InfantilModelIcon: React.FC<IconProps> = ({ className = 'text-rose-500', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="18" cy="14" rx="10" ry="8" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 3" />
    <circle cx="18" cy="22" r="3.5" fill="currentColor" opacity="0.8" />
    {/* Rounded Soft Cross */}
    <rect x="16.5" y="25" width="3" height="10" rx="1.5" fill="currentColor" />
    <rect x="13.5" y="27" width="9" height="3" rx="1.5" fill="currentColor" />
  </svg>
);

// -------------------------------------------------------------------
// SACRAMENTOS & MOMENTOS DE FÉ (BATISMO, COMUNHÃO, CRISMA, ETC)
// -------------------------------------------------------------------

// Batismo (Baptism Water Shell & Cross)
export const BaptismVectorIcon: React.FC<IconProps> = ({ className = 'text-blue-600', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="blue-grad-bap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    {/* Sacrament Water Drop with Ripple */}
    <path
      d="M18 4C18 4 8 16 8 23C8 28.5228 12.4772 33 18 33C23.5228 33 28 28.5228 28 23C28 16 18 4 18 4Z"
      fill="url(#blue-grad-bap)"
      opacity="0.15"
    />
    <path
      d="M18 4C18 4 8 16 8 23C8 28.5228 12.4772 33 18 33C23.5228 33 28 28.5228 28 23C28 16 18 4 18 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Inner Holy Cross */}
    <path d="M18 12V26M13 17H23" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="18" cy="17" r="1.5" fill="#FFFFFF" />
  </svg>
);

// Primeira Comunhão (Chalice & Host with Radiance)
export const CommunionVectorIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sacred Host with rays */}
    <circle cx="18" cy="9" r="5" fill="#FFFDF0" stroke="currentColor" strokeWidth="1.8" />
    <path d="M18 6.5V11.5M15.5 9H20.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Chalice Cup */}
    <path
      d="M11 16C11 23 15 25 18 25C21 25 25 23 25 16H11Z"
      fill="currentColor"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Stem and Base */}
    <path d="M18 25V31M12 31H24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// Crisma (Holy Spirit Flame)
export const CrismaVectorIcon: React.FC<IconProps> = ({ className = 'text-amber-600', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Holy Spirit Flame */}
    <path
      d="M13 22C13 27 15 31 18 31C21 31 23 27 23 22C23 16 18 10 18 5C18 10 13 16 13 22Z"
      fill="currentColor"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M16 23C16 26 17 28 18 28C19 28 20 26 20 23C20 19 18 15 18 12C18 15 16 19 16 23Z"
      fill="currentColor"
    />
    <path d="M18 13V24M14 18H22" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Casamento (Wedding Rings & Blessed Cross)
export const WeddingVectorIcon: React.FC<IconProps> = ({ className = 'text-gold-dark', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Intertwined Gold Rings */}
    <circle cx="13" cy="21" r="7" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="23" cy="21" r="7" stroke="currentColor" strokeWidth="2.2" />
    {/* Blessing Cross on top */}
    <path d="M18 4V12M14 7H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="7" r="1.2" fill="#FFFFFF" />
  </svg>
);

// Retiro / Encontros de Fé (Peace Dove with Olive Branch)
export const RetiroVectorIcon: React.FC<IconProps> = ({ className = 'text-emerald-700', size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M28 7C23 10 18 14 12 14C9 14 5 17 5 21C5 25.5 9.5 28 15 28C22 28 28 22 31 15C31 12 30 8 28 7Z"
      fill="currentColor"
      fillOpacity="0.18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 14C18 10 22 6 26 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="9" cy="20" r="1.2" fill="currentColor" />
  </svg>
);

// WhatsApp Authentic Vector Icon
export const WhatsAppVectorIcon: React.FC<IconProps> = ({ className = 'text-emerald-500', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20.52 3.48C18.26 1.22 15.24 0 12.04 0C5.46 0 0.1 5.36 0.1 11.94C0.1 14.04 0.65 16.08 1.69 17.89L0 24.08L6.34 22.42C8.08 23.37 10.04 23.88 12.04 23.88C18.62 23.88 23.98 18.52 23.98 11.94C23.98 8.74 22.78 5.74 20.52 3.48Z"
      fill="currentColor"
    />
    <path
      d="M17.84 14.39C17.52 14.23 15.96 13.46 15.67 13.35C15.38 13.25 15.17 13.2 14.96 13.51C14.75 13.82 14.15 14.53 13.97 14.73C13.79 14.94 13.61 14.96 13.29 14.81C12.98 14.65 11.97 14.32 10.77 13.25C9.84 12.42 9.21 11.39 9.03 11.08C8.85 10.77 9.01 10.6 9.17 10.45C9.31 10.31 9.48 10.09 9.64 9.91C9.8 9.73 9.85 9.6 9.95 9.39C10.06 9.19 10 9.01 9.92 8.85C9.85 8.7 9.22 7.15 8.96 6.53C8.71 5.92 8.45 6.01 8.26 6C8.08 6 7.87 6 7.66 6C7.45 6 7.11 6.08 6.83 6.39C6.54 6.7 5.73 7.47 5.73 9.03C5.73 10.59 6.86 12.1 7.02 12.31C7.18 12.52 9.25 15.7 12.42 17.07C13.18 17.4 13.76 17.59 14.22 17.74C14.98 17.98 15.67 17.95 16.22 17.86C16.83 17.77 18.1 17.09 18.36 16.35C18.62 15.61 18.62 14.99 18.54 14.86C18.46 14.73 18.25 14.65 17.84 14.39Z"
      fill="#FFFFFF"
    />
  </svg>
);

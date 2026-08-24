import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Terço (Rosary) Vector Icon
export const RosaryVectorIcon: React.FC<IconProps> = ({ className = 'w-8 h-8 text-gold-dark', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer Bead Loop */}
    <circle cx="18" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.5 2.5" strokeLinecap="round" />
    {/* Centerpiece Medal */}
    <circle cx="18" cy="24" r="2" fill="currentColor" />
    {/* Tail cord */}
    <line x1="18" y1="26" x2="18" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Terminal Cross */}
    <path d="M18 30V35M16 32H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Pulseira (Bracelet) Vector Icon
export const BraceletVectorIcon: React.FC<IconProps> = ({ className = 'w-8 h-8 text-gold-dark', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Oval Bracelet Loop */}
    <ellipse cx="18" cy="18" rx="12" ry="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" strokeLinecap="round" />
    {/* Dangling Medal Charm */}
    <circle cx="18" cy="28" r="2.5" fill="currentColor" opacity="0.9" />
    <path d="M18 26.5V29.5M16.5 28H19.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

// Dezena (Single Decade Rosary) Vector Icon
export const DezenaVectorIcon: React.FC<IconProps> = ({ className = 'w-8 h-8 text-gold-dark', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* 10-bead Arc */}
    <path d="M8 20C8 13.3726 12.4772 8 18 8C23.5228 8 28 13.3726 28 20" stroke="currentColor" strokeWidth="2" strokeDasharray="2 3.5" strokeLinecap="round" />
    {/* Centerpiece */}
    <circle cx="18" cy="22" r="2.5" fill="currentColor" />
    {/* Pendant Cross */}
    <path d="M18 24.5V32M15 27.5H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// Phone Charm (Strap Phone) Vector Icon
export const PhoneCharmVectorIcon: React.FC<IconProps> = ({ className = 'w-8 h-8 text-gold-dark', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Top cord loop */}
    <path d="M18 4C14 4 14 10 18 13C22 10 22 4 18 4Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Hanging Beaded Strap */}
    <line x1="18" y1="13" x2="18" y2="28" stroke="currentColor" strokeWidth="1.8" strokeDasharray="1.5 2.5" strokeLinecap="round" />
    {/* Bottom Cross Charm */}
    <path d="M18 28V34M15.5 30.5H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Batismo (Baptism Shell / Drop)
export const BaptismVectorIcon: React.FC<IconProps> = ({ className = 'w-6 h-6 text-blue-600', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2.5C12 2.5 5 11 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 11 12 2.5 12 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 7V17M8.5 11.5H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// Primeira Comunhão (Chalice & Host)
export const CommunionVectorIcon: React.FC<IconProps> = ({ className = 'w-6 h-6 text-gold-dark', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Host */}
    <circle cx="12" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="#FFF8E7" />
    <path d="M12 3.5V6.5M10.5 5H13.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    {/* Chalice Cup */}
    <path d="M7 10C7 14.5 10 16 12 16C14 16 17 14.5 17 10H7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Stem and Base */}
    <path d="M12 16V21M8 21H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// Crisma (Holy Spirit Flame / Dove)
export const CrismaVectorIcon: React.FC<IconProps> = ({ className = 'w-6 h-6 text-amber-600', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8.5 14.5C8.5 18 10 21 12 21C14 21 15.5 18 15.5 14.5C15.5 10.5 12 6.5 12 3C12 6.5 8.5 10.5 8.5 14.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 8V18M9.5 13H14.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// Casamento (Wedding Rings & Cross)
export const WeddingVectorIcon: React.FC<IconProps> = ({ className = 'w-6 h-6 text-gold-dark', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="9" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="15" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" />
    {/* Small cross blessing */}
    <path d="M12 2V7M9.5 4.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Retiro / Encontros de Fé (Dove of Peace)
export const RetiroVectorIcon: React.FC<IconProps> = ({ className = 'w-6 h-6 text-emerald-700', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 4C15 6 12 9 8 9C6 9 3 11 3 14C3 17 6 19 10 19C15 19 19 15 21 10C21 8 20 5 18 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9C12 6 15 3 18 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="6" cy="13" r="0.8" fill="currentColor" />
  </svg>
);

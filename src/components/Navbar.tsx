import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

import { WhatsAppVectorIcon } from './icons/ProductIcons';

const WHATSAPP_ICON = () => <WhatsAppVectorIcon size={18} className="text-emerald-500" />;

export const Navbar: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const { settings } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLojaOpen, setIsLojaOpen] = useState(false);
  const [isColOpen, setIsColOpen] = useState(false);
  const location = useLocation();

  const handleNavClose = () => {
    setIsMenuOpen(false);
    setIsLojaOpen(false);
    setIsColOpen(false);
  };

  const lojaLinks = [
    { label: 'Todos os Produtos', to: '/loja' },
    { label: 'Terços', to: '/loja?linha=devocionais' },
    { label: 'Pulseiras & Dezenas', to: '/loja?linha=leve-sua-fe' },
    { label: 'Lembranças & Momentos', to: '/loja?linha=momentos' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-navy/95 backdrop-blur-md border-b border-gold/30 shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-[4.75rem] md:h-[5.25rem] flex items-center justify-between gap-4">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gold hover:text-white transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" onClick={handleNavClose} className="flex items-center gap-3.5 flex-shrink-0 group py-1">
            <img 
              src="/logo.png" 
              alt={settings.name || 'Ateliê Entre Santos'} 
              className="h-14 sm:h-16 md:h-20 w-auto max-w-[180px] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-bold text-base md:text-xl leading-none text-gold uppercase tracking-wider group-hover:text-gold-light transition-colors">
                {settings.name || 'Ateliê Entre Santos'}
              </span>
              {settings.slogan && (
                <span className="text-[9px] md:text-[10px] text-white/70 uppercase tracking-[0.22em] font-medium leading-tight mt-1">
                  {settings.slogan}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}>
              Início
            </Link>

            {/* Loja dropdown */}
            <div className="relative" onMouseEnter={() => setIsLojaOpen(true)} onMouseLeave={() => setIsLojaOpen(false)}>
              <Link to="/loja" className={`nav-link flex items-center gap-1 ${location.pathname.startsWith('/loja') ? 'nav-link-active' : ''}`}>
                Loja <ChevronDown size={13} className={`transition-transform text-gold ${isLojaOpen ? 'rotate-180' : ''}`} />
              </Link>
              <AnimatePresence>
                {isLojaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-navy border border-gold/30 rounded-2xl shadow-2xl py-2 z-50 text-white"
                  >
                    {lojaLinks.map(l => (
                      <Link key={l.label} to={l.to} onClick={handleNavClose}
                        className="block px-4 py-2.5 text-xs font-semibold text-white/80 hover:text-gold hover:bg-white/10 transition-colors uppercase tracking-wider">
                        {l.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Coleções dropdown */}
            <div className="relative" onMouseEnter={() => setIsColOpen(true)} onMouseLeave={() => setIsColOpen(false)}>
              <Link to="/colecoes" className={`nav-link flex items-center gap-1 ${location.pathname.startsWith('/colecoes') ? 'nav-link-active' : ''}`}>
                Coleções <ChevronDown size={13} className={`transition-transform text-gold ${isColOpen ? 'rotate-180' : ''}`} />
              </Link>
              <AnimatePresence>
                {isColOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-navy border border-gold/30 rounded-2xl shadow-2xl py-2 z-50 text-white"
                  >
                    <Link to="/colecoes" onClick={handleNavClose}
                      className="block px-4 py-2.5 text-xs font-semibold text-white/80 hover:text-gold hover:bg-white/10 transition-colors uppercase tracking-wider">
                      Todas as coleções
                    </Link>
                    <Link to="/colecoes/guardioes-da-fe" onClick={handleNavClose}
                      className="block px-4 py-2.5 text-xs font-semibold text-white/80 hover:text-gold hover:bg-white/10 transition-colors uppercase tracking-wider">
                      Guardiões da Fé
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Monte seu Terço — Featured Nav Button */}
            <Link
              to="/monte-seu-terco"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all bg-gradient-to-r from-gold via-gold-light to-gold text-navy shadow-sm border border-gold-light/40 hover:brightness-110 active:scale-95"
            >
              <Sparkles size={13} className="text-navy" />
              <span>Monte seu Terço</span>
            </Link>

            <Link to="/personalize" className={`nav-link ${location.pathname === '/personalize' ? 'nav-link-active' : ''}`}>
              Personalize
            </Link>
            <Link to="/momentos-de-fe" className={`nav-link ${location.pathname === '/momentos-de-fe' ? 'nav-link-active' : ''}`}>
              Momentos de Fé
            </Link>
            <Link to="/nossa-historia" className={`nav-link ${location.pathname === '/nossa-historia' ? 'nav-link-active' : ''}`}>
              Nossa História
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-emerald-400 hover:bg-white/10 rounded-full transition-all text-xs font-bold uppercase tracking-wider"
                aria-label="WhatsApp"
              >
                <WHATSAPP_ICON />
                <span className="hidden lg:inline text-white/90">Falar conosco</span>
              </a>
            )}

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 text-gold hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90 group cursor-pointer"
              aria-label="Carrinho"
            >
              <ShoppingCart size={22} className="group-hover:rotate-12 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-gold text-navy text-[9px] font-black flex items-center justify-center rounded-full border border-navy min-w-[18px] min-h-[18px] px-1 shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleNavClose}
              className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-[45] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-[82%] max-w-[320px] bg-navy text-white z-[50] md:hidden flex flex-col overflow-y-auto border-r border-gold/25 shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/20">
                <Link to="/" onClick={handleNavClose} className="flex items-center gap-3.5">
                  <img src="/logo.png" alt={settings.name || 'Ateliê Entre Santos'} className="h-14 w-auto object-contain drop-shadow-xs" />
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-base text-gold uppercase tracking-wider leading-none">
                      {settings.name || 'Ateliê Entre Santos'}
                    </span>
                    <span className="text-[9px] text-white/70 uppercase tracking-[0.2em] font-medium mt-1">
                      {settings.slogan}
                    </span>
                  </div>
                </Link>
                <button onClick={handleNavClose} className="p-2 text-gold/70 hover:text-white rounded-full hover:bg-white/10 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Featured CTA */}
              <div className="p-4 pb-2">
                <Link
                  to="/monte-seu-terco"
                  onClick={handleNavClose}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gold via-gold-light to-gold text-navy rounded-2xl font-black text-xs uppercase tracking-widest border border-gold-light/40 shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-navy" />
                    <span>Monte seu Terço</span>
                  </div>
                  <span className="text-[10px] bg-navy text-gold px-2 py-0.5 rounded-full font-bold">2D</span>
                </Link>
              </div>

              {/* Mobile Links */}
              <nav className="flex-1 p-4 space-y-1">
                {[
                  { label: 'Início', to: '/' },
                  { label: 'Loja', to: '/loja' },
                  { label: 'Coleções', to: '/colecoes' },
                  { label: 'Personalize', to: '/personalize' },
                  { label: 'Momentos de Fé', to: '/momentos-de-fe' },
                  { label: 'Nossa História', to: '/nossa-historia' },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClose}
                    className={`flex items-center p-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                      location.pathname === item.to
                        ? 'bg-white/15 text-gold border border-gold/30 font-black'
                        : 'text-white/80 hover:text-gold hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-6 border-t border-gold/10 space-y-3">
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavClose}
                    className="flex items-center gap-3 p-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-bold text-sm"
                  >
                    <WHATSAPP_ICON />
                    <span>Falar pelo WhatsApp</span>
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={`https://instagram.com/${settings.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavClose}
                    className="flex items-center gap-3 p-4 text-navy/50 hover:text-navy rounded-2xl hover:bg-navy/5 transition-all font-medium text-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                    <span>Siga no Instagram</span>
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

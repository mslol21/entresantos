import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Home, ShoppingBag, Compass, Camera } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const { settings } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Início', icon: <Home size={20} />, href: '/#inicio' },
    { label: 'Como Rezar', icon: <Compass size={20} />, href: '/#como-rezar' },
    { label: 'Produtos', icon: <ShoppingBag size={20} />, href: '/#produtos' },
  ];

  const handleMenuClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const hash = href.replace('/', '');
    const id = hash.replace('#', '');

    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/' + hash);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 glass-morphism z-40 border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-navy hover:bg-navy/5 rounded-full transition-all active:scale-90"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-full border border-gold-dark/20 bg-white" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-none text-navy uppercase tracking-wider">
                  {settings.name}
                </span>
                <span className="text-[8px] text-navy/60 uppercase tracking-[0.2em] font-medium">
                  {settings.slogan}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a 
                key={item.label}
                href={item.href}
                onClick={(e) => handleMenuClick(e, item.href)}
                className="text-navy/60 hover:text-navy text-xs uppercase tracking-[0.2em] font-bold transition-all hover:translate-y-[-2px]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={onCartClick}
            className="relative p-3 text-navy hover:bg-navy/5 rounded-full transition-all active:scale-90 group"
          >
            <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-navy text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-cream-light">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-navy/90 backdrop-blur-sm z-[45] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] max-w-sm bg-cream-light z-[50] md:hidden border-r border-gold/15 p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-12">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain rounded-full border border-gold-dark/20 bg-white" />
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl text-navy uppercase tracking-wider">
                    {settings.name}
                  </span>
                  <span className="text-[10px] text-navy/60 uppercase tracking-[0.2em] font-medium">
                    {settings.slogan}
                  </span>
                </div>
              </div>

              <div className="flex-grow space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleMenuClick(e, item.href)}
                    className="flex items-center gap-4 p-4 rounded-full text-navy/70 hover:text-navy hover:bg-gold/5 transition-all group"
                  >
                    <div className="p-2 bg-white rounded-full border border-gold/15 group-hover:border-gold/45 text-gold-dark group-hover:text-gold transition-all">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.2em]">{item.label}</span>
                  </a>
                ))}
              </div>

              <div className="pt-8 border-t border-gold/15 space-y-4">
                <a 
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-full text-navy/55 hover:text-navy transition-all"
                >
                  <Camera size={20} className="text-gold-dark" />
                  <span className="text-xs font-bold uppercase tracking-widest">Siga no Instagram</span>
                </a>
                <p className="text-[10px] text-navy/30 text-center uppercase tracking-[0.3em] font-medium">
                  Juntos a caminho da santidade
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

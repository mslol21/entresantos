import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Home, ShoppingBag, MessageSquare, Camera } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const { settings } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Início', icon: <Home size={20} />, href: '#inicio' },
    { label: 'Produtos', icon: <ShoppingBag size={20} />, href: '#produtos' },
    { label: 'Depoimentos', icon: <MessageSquare size={20} />, href: '#depoimentos' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 glass-morphism z-40 border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-gold hover:bg-gold/10 rounded-xl transition-all active:scale-90"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center text-gold font-serif text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                {settings.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-none text-gold uppercase tracking-wider">
                  {settings.name}
                </span>
                <span className="text-[8px] text-gold/60 uppercase tracking-[0.2em] font-medium">
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
                className="text-gold/60 hover:text-gold text-xs uppercase tracking-[0.2em] font-bold transition-all hover:translate-y-[-2px]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={onCartClick}
            className="relative p-3 text-gold hover:bg-gold/10 rounded-2xl transition-all active:scale-90 group"
          >
            <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-navy text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-navy shadow-[0_0_10px_rgba(212,175,55,0.4)]">
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
              className="fixed left-0 top-0 bottom-0 w-[80%] max-w-sm bg-navy-light z-[50] md:hidden border-r border-gold/10 p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 border-2 border-gold rounded-full flex items-center justify-center text-gold font-serif text-lg">
                  {settings.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl text-gold uppercase tracking-wider">
                    {settings.name}
                  </span>
                  <span className="text-[10px] text-gold/60 uppercase tracking-[0.2em] font-medium">
                    {settings.slogan}
                  </span>
                </div>
              </div>

              <div className="flex-grow space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={toggleMenu}
                    className="flex items-center gap-4 p-4 rounded-2xl text-gold/60 hover:text-gold hover:bg-gold/5 transition-all group"
                  >
                    <div className="p-2 bg-navy rounded-xl border border-gold/5 group-hover:border-gold/20 group-hover:text-gold transition-all">
                      {item.icon}
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.2em]">{item.label}</span>
                  </a>
                ))}
              </div>

              <div className="pt-8 border-t border-gold/10 space-y-4">
                <a 
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl text-gold/40 hover:text-gold transition-all"
                >
                  <Camera size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Siga no Instagram</span>
                </a>
                <p className="text-[10px] text-gold/20 text-center uppercase tracking-[0.3em] font-medium">
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

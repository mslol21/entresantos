import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { FixedFooter } from './components/FixedFooter';
import { Admin } from './pages/Admin';
import { useData } from './context/DataContext';
import { MapPin, Phone, Lock } from 'lucide-react';

function Store() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { settings, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-gold font-serif animate-pulse">Invocando a fé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy selection:bg-gold selection:text-navy">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main>
        <Hero />
        <SocialProof />
        <ProductGrid />
      </main>

      <footer className="bg-navy-light text-gold py-16 px-4 border-t border-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center text-gold font-serif text-sm">
                  {settings.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg leading-none uppercase tracking-wider">
                    {settings.name}
                  </span>
                  <span className="text-[8px] text-gold/60 uppercase tracking-[0.2em] font-medium">
                    {settings.slogan}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 mb-8 max-w-md">
                {settings.niche}. Peças exclusivas feitas com amor e fé.
              </p>
              <div className="flex gap-4">
                <a 
                  href={`https://instagram.com/${settings.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-navy rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all border border-gold/20"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <Link to="/admin" className="w-10 h-10 bg-navy rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all border border-gold/20" title="Área do Administrador">
                  <Lock size={18} />
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-serif font-bold mb-6 uppercase text-xs tracking-widest text-gold/40">Contato</h4>
              <ul className="space-y-4 text-gold/60">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-gold" />
                  <span>{settings.whatsapp}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold flex-shrink-0" />
                  <span>Enviamos para todo o Brasil com amor</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-serif font-bold mb-6 uppercase text-xs tracking-widest text-gold/40">Horários</h4>
              <ul className="space-y-4 text-gold/60 text-sm">
                <li className="flex justify-between">
                  <span>Seg - Sex:</span>
                  <span className="text-gold font-medium">09h às 18h</span>
                </li>
                <li className="flex justify-between text-gold/30">
                  <span>Sábado:</span>
                  <span>Fechado</span>
                </li>
                <li className="flex justify-between text-gold/30">
                  <span>Domingo:</span>
                  <span>Fechado</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gold/30 text-sm">
              © {new Date().getFullYear()} Ateliê Entre Santos.
            </p>
            <div className="flex gap-6 text-sm text-gold/30">
              <a href="#" className="hover:text-gold transition-colors">Privacidade</a>
              <a href="#" className="hover:text-gold transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FixedFooter onClick={() => setIsCartOpen(true)} />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Store />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;

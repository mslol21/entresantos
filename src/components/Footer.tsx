import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Lock } from 'lucide-react';

const WHATSAPP_ICON = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.099 1.51 5.828L.057 23.805a.5.5 0 0 0 .609.637l6.183-1.621A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 0 1-5.002-1.368l-.358-.214-3.713.974.99-3.617-.234-.372A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const { settings } = useData();

  return (
    <footer className="bg-navy text-gold py-16 px-4 border-t border-gold/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-full border border-gold/20 bg-white" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base leading-none uppercase tracking-wider text-gold">
                  {settings.name || 'Ateliê Entre Santos'}
                </span>
                <span className="text-[8px] text-gold/50 uppercase tracking-[0.2em] font-medium mt-0.5">
                  {settings.slogan}
                </span>
              </div>
            </Link>
            <p className="text-gold/50 text-sm leading-relaxed mb-6 max-w-xs">
              Fé feita à mão para carregar, presentear e colecionar.
            </p>
            <div className="flex gap-3">
              {settings.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all border border-gold/10 text-gold/70"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all border border-gold/10 text-gold/70"
                  aria-label="WhatsApp"
                >
                  <WHATSAPP_ICON />
                </a>
              )}
              <Link
                to="/admin"
                className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-all border border-gold/10 text-gold/40"
                title="Área Administrativa"
                aria-label="Admin"
              >
                <Lock size={14} />
              </Link>
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h4 className="font-serif font-bold mb-5 text-[10px] uppercase tracking-[0.25em] text-gold/40">Comprar</h4>
            <ul className="space-y-3">
              {[
                { label: 'Loja', to: '/loja' },
                { label: 'Terços', to: '/loja?categoria=tercos' },
                { label: 'Pulseiras', to: '/loja?categoria=pulseiras' },
                { label: 'Coleções', to: '/colecoes' },
                { label: 'Presentes', to: '/loja?linha=presentes' },
                { label: 'Personalizados', to: '/personalize' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gold/55 hover:text-gold text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-serif font-bold mb-5 text-[10px] uppercase tracking-[0.25em] text-gold/40">Atendimento</h4>
            <ul className="space-y-3">
              {settings.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold/55 hover:text-gold text-sm transition-colors flex items-center gap-2"
                  >
                    <WHATSAPP_ICON />
                    WhatsApp
                  </a>
                </li>
              )}
              {[
                { label: 'Momentos de Fé', to: '/momentos-de-fe' },
                { label: 'Personalize sua peça', to: '/personalize' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gold/55 hover:text-gold text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h4 className="font-serif font-bold mb-5 text-[10px] uppercase tracking-[0.25em] text-gold/40">Sobre</h4>
            <ul className="space-y-3">
              {[
                { label: 'Nossa História', to: '/nossa-historia' },
                { label: 'Coleções', to: '/colecoes' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gold/55 hover:text-gold text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gold/25 text-xs">
            © {new Date().getFullYear()} {settings.name || 'Ateliê Entre Santos'}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gold/25">
            <a href="#" className="hover:text-gold/60 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-gold/60 transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

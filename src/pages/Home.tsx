import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, X, Sparkles, ArrowRight, Star, 
  Package, Heart, ShieldCheck, Truck, ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryCards } from '../components/CategoryCards';
import { CollectionSection } from '../components/CollectionSection';
import { TrustSection } from '../components/TrustSection';
import { 
  RosaryVectorIcon, 
  BraceletVectorIcon, 
  DezenaVectorIcon, 
  PhoneCharmVectorIcon,
  BaptismVectorIcon, 
  CommunionVectorIcon, 
  CrismaVectorIcon, 
  WeddingVectorIcon, 
  RetiroVectorIcon 
} from '../components/icons/ProductIcons';

// -------------------------------------------------------------------
// SEÇÃO: DESCOBERTA RÁPIDA & VITRINE DINÂMICA (SUBSTITUI O HERO)
// -------------------------------------------------------------------
const StorefrontExplorer: React.FC = () => {
  const { products, categories } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('featured'); // 'featured', 'ready', or category id

  // Busca rápida e filtragem em tempo real
  const displayedProducts = useMemo(() => {
    let list = products.filter(p => p.isActive !== false);

    // Filtro por texto de busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    }

    // Filtro por aba
    if (activeTab === 'featured') {
      const featured = list.filter(p => p.isFeatured);
      return featured.length > 0 ? featured.slice(0, 8) : list.slice(0, 8);
    }

    if (activeTab === 'ready') {
      return list.filter(p => p.availability === 'ready').slice(0, 8);
    }

    if (activeTab === 'customizable') {
      return list.filter(p => p.isCustomizable).slice(0, 8);
    }

    // Filtro por categoria específica
    return list.filter(p => 
      p.category === activeTab || (p.categories || []).includes(activeTab)
    ).slice(0, 8);
  }, [products, searchQuery, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/loja?busca=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="bg-gradient-to-b from-cream via-[#FAF8F3] to-cream border-b border-gold/15 py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Barra de Proposta de Valor / Benefícios rápidos */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-wider text-navy/70 border-b border-gold/15 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold-dark" />
            <span className="font-semibold">Fé feita à mão • Peças exclusivas e personalizadas</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck size={13} className="text-gold-dark" />
              Envio para todo o Brasil
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={13} className="text-gold-dark" />
              Compra 100% segura
            </span>
          </div>
        </div>

        {/* Cabeçalho de Busca e Ação Imediata */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-navy leading-tight">
              Encontre sua peça de fé
            </h1>
            <p className="text-xs sm:text-sm text-navy/60 mt-1">
              Explore terços, pulseiras, dezenas ou monte uma peça exclusiva feita especialmente para você.
            </p>
          </div>

          {/* Campo de Busca Rápida */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 flex-shrink-0">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="text"
              placeholder="Buscar terço, pulseira, santo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-gold/30 rounded-2xl text-xs sm:text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Barra Rápida de Categorias com Ícones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {/* Construtor 2D em Destaque */}
          <Link
            to="/monte-seu-terco"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-navy via-navy to-navy-light text-gold border border-gold/40 shadow-sm hover:scale-105 transition-all flex-shrink-0"
          >
            <div className="w-6 h-6 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
              <Sparkles size={14} />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-none">Monte seu Terço</span>
              <span className="text-[9px] text-gold/70 font-semibold uppercase tracking-wider">Simulador 2D</span>
            </div>
            <ChevronRight size={14} className="text-gold/60 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Terços */}
          <button
            type="button"
            onClick={() => { setActiveTab('tercos'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'tercos' && !searchQuery
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-white border-gold/25 text-navy/80 hover:border-gold/60 hover:bg-gold/5'
            }`}
          >
            <RosaryVectorIcon size={18} className={activeTab === 'tercos' && !searchQuery ? 'text-gold' : 'text-gold-dark'} />
            <span className="text-xs font-bold">Terços</span>
          </button>

          {/* Pulseiras */}
          <button
            type="button"
            onClick={() => { setActiveTab('pulseiras'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'pulseiras' && !searchQuery
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-white border-gold/25 text-navy/80 hover:border-gold/60 hover:bg-gold/5'
            }`}
          >
            <BraceletVectorIcon size={18} className={activeTab === 'pulseiras' && !searchQuery ? 'text-gold' : 'text-gold-dark'} />
            <span className="text-xs font-bold">Pulseiras</span>
          </button>

          {/* Dezenas */}
          <button
            type="button"
            onClick={() => { setActiveTab('chaveiros'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'chaveiros' && !searchQuery
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-white border-gold/25 text-navy/80 hover:border-gold/60 hover:bg-gold/5'
            }`}
          >
            <DezenaVectorIcon size={18} className={activeTab === 'chaveiros' && !searchQuery ? 'text-gold' : 'text-gold-dark'} />
            <span className="text-xs font-bold">Dezenas & Carro</span>
          </button>

          {/* Strap Phone */}
          <button
            type="button"
            onClick={() => { setActiveTab('strap-phone'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'strap-phone' && !searchQuery
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-white border-gold/25 text-navy/80 hover:border-gold/60 hover:bg-gold/5'
            }`}
          >
            <PhoneCharmVectorIcon size={18} className={activeTab === 'strap-phone' && !searchQuery ? 'text-gold' : 'text-gold-dark'} />
            <span className="text-xs font-bold">Strap Phone</span>
          </button>

          {/* Pronta Entrega */}
          <button
            type="button"
            onClick={() => { setActiveTab('ready'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'ready' && !searchQuery
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                : 'bg-emerald-50/70 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Package size={15} />
            <span className="text-xs font-bold">Pronta Entrega</span>
          </button>

          {/* Coleções */}
          <Link
            to="/colecoes"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gold/25 text-navy/80 hover:border-gold/60 hover:bg-gold/5 transition-all flex-shrink-0"
          >
            <Heart size={15} className="text-rose-500" />
            <span className="text-xs font-bold">Coleções dos Santos</span>
          </Link>
        </div>

        {/* 3 Banners de Ação Rápida e Destaques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Construtor 2D */}
          <Link
            to="/monte-seu-terco"
            className="group p-5 rounded-3xl bg-gradient-to-br from-navy via-navy to-navy-light text-white border border-gold/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-black uppercase tracking-widest border border-gold/30">
                  Simulador 2D
                </span>
                <Sparkles size={16} className="text-gold group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="font-serif font-bold text-xl text-gold mb-1.5 leading-snug">
                Monte seu Terço Exclusivo
              </h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Escolha contas, entremeios sagrados e crucifixos com visualização da peça montada em tempo real.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gold">
              <span>Criar Agora</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Pronta Entrega */}
          <Link
            to="/loja?disponibilidade=ready"
            className="group p-5 rounded-3xl bg-white border border-gold/25 shadow-xs hover:border-gold/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
                  Envio Imediato
                </span>
                <Package size={16} className="text-emerald-700" />
              </div>
              <h3 className="font-serif font-bold text-xl text-navy mb-1.5 leading-snug">
                Peças a Pronta Entrega
              </h3>
              <p className="text-navy/60 text-xs leading-relaxed">
                Artigos e terços já finalizados na bancada do ateliê para envio rápido para todo o Brasil.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-navy group-hover:text-gold-dark">
              <span>Ver Disponíveis</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Momentos Especiais & Batismo */}
          <Link
            to="/momentos-de-fe"
            className="group p-5 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-amber-100/30 border border-gold/30 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-gold/20 text-gold-dark text-[10px] font-black uppercase tracking-widest border border-gold/25">
                  Lembranças & Fé
                </span>
                <Heart size={16} className="text-rose-500" />
              </div>
              <h3 className="font-serif font-bold text-xl text-navy mb-1.5 leading-snug">
                Batismos, Crisma & Casamentos
              </h3>
              <p className="text-navy/60 text-xs leading-relaxed">
                Lembrancinhas católicas e terços sob encomenda com descontos especiais para celebrações.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between text-xs font-bold text-gold-dark">
              <span>Ver Ocasiões</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Vitrine Interativa de Produtos */}
        <div className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Star size={14} className="text-gold fill-gold" />
                <span className="text-[10px] text-gold-dark font-black uppercase tracking-[0.25em]">
                  {searchQuery ? 'Resultados da Busca' : 'Vitrine do Ateliê'}
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-navy">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Peças em Destaque'}
              </h2>
            </div>

            {/* Abas Rápidas de Filtragem */}
            {!searchQuery && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'featured', label: 'Mais Amados' },
                  ...(categories.length > 0 
                    ? categories.slice(0, 4).map(c => ({ id: c.id, label: c.name }))
                    : [{ id: 'tercos', label: 'Terços' }, { id: 'pulseiras', label: 'Pulseiras' }]
                  ),
                  { id: 'ready', label: 'Pronta Entrega' },
                  { id: 'customizable', label: 'Personalizáveis' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-navy text-gold shadow-xs'
                        : 'bg-white border border-gold/20 text-navy/60 hover:text-navy hover:border-gold/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grade de Produtos */}
          {displayedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gold/20 p-12 text-center shadow-xs">
              <p className="text-3xl mb-3">🔍</p>
              <h3 className="font-serif font-bold text-lg text-navy mb-1">Nenhum produto encontrado</h3>
              <p className="text-xs text-navy/55 max-w-sm mx-auto mb-4">
                Não localizamos peças para esta pesquisa. Tente outros termos ou veja nosso catálogo completo.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveTab('featured'); }}
                className="btn-primary text-xs py-2 px-5"
              >
                Ver Todas as Peças
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Botão para ver todo o catálogo */}
          <div className="mt-8 text-center">
            <Link
              to="/loja"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white border border-gold/30 rounded-2xl text-xs font-bold text-navy hover:bg-navy hover:text-gold hover:border-navy transition-all shadow-sm group uppercase tracking-wider"
            >
              <span>Ver catálogo completo na Loja ({products.length} peças)</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

// -------------------------------------------------------------------
// TEASER: CENTRAL DE PERSONALIZAÇÃO
// -------------------------------------------------------------------
const PersonalizeTeaser: React.FC = () => (
  <section className="py-20 px-4 bg-cream/60">
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-white via-amber-50/50 to-cream border border-gold/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="md:flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/25 text-gold-dark text-[10px] font-black uppercase tracking-wider mb-3">
            <Sparkles size={12} />
            <span>Ateliê Sob Medida</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy mb-4">
            Monte seu Terço ou<br />Personalize sua Peça
          </h2>
          <p className="text-navy/60 text-sm leading-relaxed mb-6 max-w-md">
            Experimente nosso construtor visual 2D para montar seu terço com contas, medalhas e crucifixos exclusivos, ou personalize pulseiras e lembranças de fé.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link to="/monte-seu-terco" className="btn-primary inline-flex">
              Monte seu Terço (2D)
              <ArrowRight size={15} />
            </Link>
            <Link to="/personalize" className="px-6 py-3.5 border-2 border-navy/20 text-navy font-bold text-xs uppercase tracking-wider rounded-full hover:border-navy hover:bg-navy/5 transition-all">
              Outras Peças
            </Link>
          </div>
        </div>
        <div className="md:flex-1 flex flex-wrap gap-3 justify-center">
          <Link
            to="/monte-seu-terco"
            className="px-6 py-4 bg-gradient-to-r from-navy to-navy-light text-gold border border-gold/30 rounded-2xl text-sm font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>Monte seu Terço</span>
          </Link>
          {['Pulseira', 'Phone Charm', 'Dezena'].map(p => (
            <Link
              key={p}
              to={`/personalize?produto=${encodeURIComponent(p)}`}
              className="px-5 py-3.5 bg-white border border-gold/25 rounded-2xl text-sm font-bold text-navy hover:bg-gold/10 hover:border-gold/50 transition-all shadow-sm"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// -------------------------------------------------------------------
// TEASER: MOMENTOS DE FÉ
// -------------------------------------------------------------------
const MomentosTeaser: React.FC = () => {
  const moments = [
    { iconComponent: <BaptismVectorIcon size={28} className="text-blue-600" />, label: 'Batismo' },
    { iconComponent: <CommunionVectorIcon size={28} className="text-gold-dark" />, label: 'Primeira Comunhão' },
    { iconComponent: <CrismaVectorIcon size={28} className="text-amber-600" />, label: 'Crisma' },
    { iconComponent: <WeddingVectorIcon size={28} className="text-gold-dark" />, label: 'Casamento' },
    { iconComponent: <RetiroVectorIcon size={28} className="text-emerald-700" />, label: 'Encontros e retiros' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">Especial</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy">Momentos de Fé</h2>
          </div>
          <Link
            to="/momentos-de-fe"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-navy hover:text-gold-dark transition-colors"
          >
            Ver todas as ocasiões
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {moments.map(m => (
            <Link
              key={m.label}
              to={`/momentos-de-fe#${encodeURIComponent(m.label.toLowerCase())}`}
              className="p-6 bg-white border border-gold/15 rounded-3xl text-center hover:border-gold/40 hover:bg-gold/5 transition-all shadow-sm group flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-gold/20 shadow-xs">
                {m.iconComponent}
              </div>
              <span className="font-serif font-bold text-sm text-navy block leading-tight">{m.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------------
// PÁGINA PRINCIPAL (HOME)
// -------------------------------------------------------------------
const Home: React.FC = () => {
  return (
    <div className="pt-[4.75rem] md:pt-[5.25rem] min-h-screen space-y-0">
      {/* 1. Descoberta Rápida & Vitrine Dinâmica (substitui o Hero antigo) */}
      <StorefrontExplorer />

      {/* 2. Banners das Linhas do Ateliê */}
      <CategoryCards />

      {/* 3. Coleções dos Santos & QR Code */}
      <CollectionSection />

      {/* 4. Construtor Visual 2D Teaser */}
      <PersonalizeTeaser />

      {/* 5. Ocasiões & Momentos de Fé */}
      <MomentosTeaser />

      {/* 6. Garantia e Confiança */}
      <TrustSection />
    </div>
  );
};

export default Home;

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const LINE_LABELS: Record<string, string> = {
  'devocionais': 'Devocionais',
  'leve-sua-fe': 'Leve Sua Fé',
  'colecoes': 'Coleções',
  'personalizados': 'Personalizados',
  'momentos': 'Momentos de Fé',
  'presentes': 'Presentes',
};

const AVAILABILITY_LABELS: Record<string, string> = {
  'ready': 'Pronta entrega',
  'made_to_order': 'Sob encomenda',
  'limited_edition': 'Edição limitada',
};

const Store: React.FC = () => {
  const { products, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('categoria') || '';
  const activeLine = searchParams.get('linha') || '';
  const activeAvailability = searchParams.get('disponibilidade') || '';

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearch('');
  };

  const filtered = useMemo(() => {
    return products
      .filter(p => p.isActive !== false)
      .filter(p => {
        if (activeCategory) {
          return (p.categories || []).includes(activeCategory) || p.category === activeCategory;
        }
        return true;
      })
      .filter(p => activeLine ? p.line === activeLine : true)
      .filter(p => activeAvailability ? p.availability === activeAvailability : true)
      .filter(p => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [products, activeCategory, activeLine, activeAvailability, search]);

  const hasFilters = activeCategory || activeLine || activeAvailability || search;

  return (
    <div className="pt-[4.5rem] min-h-screen">
      {/* Header */}
      <div className="bg-cream border-b border-gold/10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif font-bold text-4xl text-navy mb-2">Loja</h1>
          <p className="text-navy/60 text-sm">Peças artesanais de fé para o seu dia a dia.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/35" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base pl-10"
              id="store-search"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gold/25 rounded-xl text-navy/70 text-sm font-medium hover:border-gold/50 hover:text-navy transition-all"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {hasFilters && <span className="w-2 h-2 bg-gold rounded-full" />}
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy px-3 transition-colors">
              <X size={14} /> Limpar
            </button>
          )}
        </div>

        {/* Filter chips — quick category navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter('linha', '')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              !activeLine && !activeCategory ? 'bg-navy text-white' : 'bg-white border border-gold/20 text-navy/60 hover:border-gold/40 hover:text-navy'
            }`}
          >
            Todos
          </button>
          {Object.entries(LINE_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setFilter('linha', activeLine === key ? '' : key); setFilter('categoria', ''); }}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeLine === key ? 'bg-navy text-white' : 'bg-white border border-gold/20 text-navy/60 hover:border-gold/40 hover:text-navy'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-white border border-gold/15 rounded-2xl">
                {/* Category */}
                <div>
                  <label className="label-base">Categoria</label>
                  <select
                    value={activeCategory}
                    onChange={e => setFilter('categoria', e.target.value)}
                    className="input-base"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="label-base">Disponibilidade</label>
                  <select
                    value={activeAvailability}
                    onChange={e => setFilter('disponibilidade', e.target.value)}
                    className="input-base"
                  >
                    <option value="">Todas</option>
                    {Object.entries(AVAILABILITY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Personalizável */}
                <div>
                  <label className="label-base">Tipo</label>
                  <select
                    value={searchParams.get('personalizavel') || ''}
                    onChange={e => setFilter('personalizavel', e.target.value)}
                    className="input-base"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="sim">Personalizáveis</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="text-xs text-navy/40 mb-6 font-medium uppercase tracking-wider">
          {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="font-serif font-bold text-xl text-navy mb-2">Nenhum produto encontrado</h3>
            <p className="text-navy/50 text-sm mb-6">Tente outros filtros ou fale conosco pelo WhatsApp.</p>
            <button onClick={clearFilters} className="btn-primary">
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;

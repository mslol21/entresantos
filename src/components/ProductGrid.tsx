import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products } = useData();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedSubcategory, setSelectedSubcategory] = useState('Todos');

  const categoriesWithSub = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchStatus = product.isActive !== false;
      const matchCategory = product.category === selectedCategory;
      const matchSubcategory = selectedSubcategory === 'Todos' || 
                             selectedSubcategory === 'Personalize Agora' ||
                             product.subcategory === selectedSubcategory;
      return matchStatus && matchCategory && matchSubcategory;
    });
  }, [products, selectedCategory, selectedSubcategory]);

  return (
    <section id="catalog" className="py-20 px-4 bg-navy">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-12">
          <h2 className="text-4xl font-serif font-bold text-gold mb-2">Nossas Peças</h2>
          <p className="text-gold/60 mb-8">Artesanato feito à mão, com oração e dedicação.</p>
          
          {/* Categorias Principais */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubcategory('Todos');
                }}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-gold text-navy border-gold shadow-lg shadow-gold/20'
                    : 'bg-navy-light text-gold/60 border-gold/10 hover:border-gold/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategorias */}
          {categoriesWithSub && categoriesWithSub.subcategories.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap gap-2 p-4 bg-navy-light/50 rounded-2xl border border-gold/5"
            >
              <div className="flex items-center gap-2 mr-2 text-gold/40 text-xs uppercase font-bold tracking-widest">
                <Filter size={14} />
                Filtro:
              </div>
              {categoriesWithSub.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedSubcategory === sub
                      ? 'bg-gold/20 text-gold border border-gold/30'
                      : 'text-gold/40 hover:text-gold/70'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gold/40 italic">Nenhum produto encontrado nesta categoria no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

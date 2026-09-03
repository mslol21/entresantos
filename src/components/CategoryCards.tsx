import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'devocionais',
    title: 'Devocionais',
    description: 'Terços e peças para acompanhar sua vida de oração.',
    image: '/cat-devocionais.jpg',
    to: '/loja?linha=devocionais',
    cta: 'Explorar',
    accent: 'from-navy/60 to-navy/20',
  },
  {
    id: 'leve-sua-fe',
    title: 'Leve Sua Fé',
    description: 'Pulseiras e acessórios para carregar sua devoção todos os dias.',
    image: '/cat-acessorios.jpg',
    to: '/loja?linha=leve-sua-fe',
    cta: 'Ver acessórios',
    accent: 'from-gold-dark/50 to-amber-800/10',
  },
  {
    id: 'personalizados',
    title: 'Personalizados',
    description: 'Escolha detalhes e tenha uma peça criada especialmente para você.',
    image: '/cat-personalizados.jpg',
    to: '/personalize',
    cta: 'Criar a minha',
    accent: 'from-gold-dark/50 to-amber-800/10',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const CategoryCards: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-bold mb-3">O Ateliê</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy">Descubra o Ateliê</h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link
                to={cat.to}
                className="group block relative rounded-3xl overflow-hidden aspect-[3/4] sm:aspect-auto sm:h-[420px] border border-gold/15 shadow-premium hover:shadow-gold transition-all duration-500 hover:-translate-y-1"
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} opacity-80`} />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif font-bold text-xl mb-2 leading-tight">{cat.title}</h3>
                  <p className="text-white/80 text-xs leading-relaxed mb-4 font-medium">{cat.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90 group-hover:gap-3 transition-all">
                    {cat.cta}
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

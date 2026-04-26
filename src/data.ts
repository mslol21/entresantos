export const COMPANY_DATA = {
  name: "Ateliê Entre Santos",
  whatsapp: "5511999999999", 
  niche: "Artesanato Católico & Presentes de Fé",
  instagram: "atelie.entresantos",
  tiktok: "@atelie.entresantos",
  slogan: "Juntos a caminho da santidade"
};

export const CATEGORIES = [
  { id: 'tercos', name: 'Terços', subcategories: ['Todos', 'Rosários reduzidos', 'Terço de casal', 'Terço de Noiva, debutante e profissões', 'Dezena'] },
  { id: 'pulseiras', name: 'Pulseiras', subcategories: ['Terço', 'Dezena'] },
  { id: 'strap-phone', name: 'Strap phone', subcategories: ['Todos'] },
  { id: 'chaveiros', name: 'Chaveiros', subcategories: ['Todos'] },
  { id: 'infantil', name: 'Infantil', subcategories: ['Todos'] },
  { id: 'monte-seu-terco', name: 'Monte seu terço', subcategories: ['Personalize Agora'] },
];

export const INITIAL_PRODUCTS = [
  // Terços
  {
    id: "t1",
    name: "Terço Clássico de Madeira",
    description: "Contas de madeira 8mm, cordão resistente.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800",
    category: 'tercos',
    subcategory: 'Todos'
  },
  {
    id: "t2",
    name: "Rosário Reduzido (7 Mistérios)",
    description: "Compacto e ideal para oração diária.",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800",
    category: 'tercos',
    subcategory: 'Rosários reduzidos'
  },
  {
    id: "t3",
    name: "Terço de Noiva Luxo",
    description: "Cristais e acabamento em banho de prata.",
    price: 250.00,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800",
    category: 'tercos',
    subcategory: 'Terço de Noiva, debutante e profissões'
  },
  {
    id: "t4",
    name: "Dezena de Retrovisor",
    description: "Proteção para o seu caminho.",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800",
    category: 'tercos',
    subcategory: 'Dezena'
  },
  
  // Pulseiras
  {
    id: "p1",
    name: "Pulseira Terço Hematita",
    description: "Estilo e fé em uma peça única.",
    price: 32.00,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800",
    category: 'pulseiras',
    subcategory: 'Terço'
  },
  {
    id: "p2",
    name: "Pulseira Dezena em Silicone",
    description: "Confortável para o dia a dia.",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800",
    category: 'pulseiras',
    subcategory: 'Dezena'
  },

  // Strap Phone
  {
    id: "s1",
    name: "Strap Phone Fé",
    description: "Salva celular com contas coloridas e medalha.",
    price: 28.00,
    image: "https://images.unsplash.com/photo-1610444654921-65487f54c9c0?q=80&w=800",
    category: 'strap-phone',
    subcategory: 'Todos'
  },

  // Chaveiros
  {
    id: "c1",
    name: "Chaveiro Anjo da Guarda",
    description: "Em metal com detalhes em resina.",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1610444654921-65487f54c9c0?q=80&w=800",
    category: 'chaveiros',
    subcategory: 'Todos'
  },

  // Infantil
  {
    id: "i1",
    name: "Terço Infantil Colorido",
    description: "Contas emborrachadas, seguro para crianças.",
    price: 30.00,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800",
    category: 'infantil',
    subcategory: 'Todos'
  },

  // Monte seu Terço (Special item)
  {
    id: "m1",
    name: "Monte seu Terço",
    description: "Escolha entremeio, crucifixo e cores.",
    price: 60.00, // Preço base
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800",
    category: 'monte-seu-terco',
    subcategory: 'Personalize Agora',
    isCustomizable: true
  }
];

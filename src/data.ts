import type { RosaryModel, CustomizationComponent } from './types';

export const COMPANY_DATA = {
  name: "Ateliê Entre Santos",
  whatsapp: "5511999999999", 
  niche: "Artesanato Católico & Presentes de Fé",
  instagram: "atelie.entresantos",
  tiktok: "@atelie.entresantos",
  slogan: "Fé feita à mão"
};

export const CATEGORIES = [
  { id: 'tercos', name: 'Terços', subcategories: ['Todos', 'Rosários reduzidos', 'Terço de casal', 'Terço de Noiva, debutante e profissões', 'Dezena'] },
  { id: 'pulseiras', name: 'Pulseiras', subcategories: ['Terço', 'Dezena'] },
  { id: 'strap-phone', name: 'Strap phone', subcategories: ['Todos'] },
  { id: 'chaveiros', name: 'Chaveiros', subcategories: ['Todos'] },
  { id: 'infantil', name: 'Infantil', subcategories: ['Todos'] },
  { id: 'monte-seu-terco', name: 'Monte seu terço', subcategories: ['Personalize Agora'] },
];

export const DEFAULT_ROSARY_MODELS: RosaryModel[] = [
  {
    id: "model-tradicional",
    name: "Tradicional",
    slug: "tradicional",
    description: "Design clássico e harmonioso com 5 dezenas completas, perfeito para o dia a dia de oração.",
    base_price: 59.90,
    is_active: true,
    display_order: 1
  },
  {
    id: "model-delicado",
    name: "Delicado",
    slug: "delicado",
    description: "Contas menores e acabamento sutil, leve para carregar consigo ou na bolsa.",
    base_price: 49.90,
    is_active: true,
    display_order: 2
  },
  {
    id: "model-premium",
    name: "Premium & Colecionador",
    slug: "premium",
    description: "Acabamentos nobres, entremeio trabalhado e cristais selecionados.",
    base_price: 79.90,
    is_active: true,
    display_order: 3
  },
  {
    id: "model-noiva",
    name: "Noiva Especial",
    slug: "noiva",
    description: "Montagem refinada com cristais e pérolas translúcidas para o grande dia.",
    base_price: 119.90,
    is_active: true,
    display_order: 4
  },
  {
    id: "model-infantil",
    name: "Infantil / Lembrança",
    slug: "infantil",
    description: "Cores suaves e contas resistentes, ideal para batizados e primeira comunhão.",
    base_price: 44.90,
    is_active: true,
    display_order: 5
  },
  {
    id: "model-dezena",
    name: "Dezena de Bolso / Carro",
    slug: "dezena",
    description: "1 dezena compacta em arco com fecho superior para retrovisor, bolsa ou oração rápida.",
    base_price: 29.90,
    is_active: true,
    display_order: 6
  }
];

export const DEFAULT_CUSTOMIZATION_COMPONENTS: CustomizationComponent[] = [
  // Contas Ave-Marias
  // Contas Ave-Marias (6mm e 8mm)
  {
    id: "comp-bead-1",
    component_type: "bead",
    name: "Pérola Branca Clássica (8mm)",
    slug: "bead-perola-branca-8mm",
    description: "Pérola sintética com brilho suave e acabamento acetinado clássico.",
    color: "#F8F8F6",
    material: "Pérola",
    size: "8mm",
    additional_price: 0,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-bead-1-6mm",
    component_type: "bead",
    name: "Pérola Branca Delicada (6mm)",
    slug: "bead-perola-branca-6mm",
    description: "Pérola em tamanho 6mm mais leve, perfeita para terços sutis de bolso e bolsa.",
    color: "#F8F8F6",
    material: "Pérola",
    size: "6mm",
    additional_price: 0,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-bead-2",
    component_type: "bead",
    name: "Pérola Champagne Nude (8mm)",
    slug: "bead-perola-champagne-8mm",
    description: "Tons quentes de nude e areia com toque nobre e toque aveludado.",
    color: "#E8DDD0",
    material: "Pérola",
    size: "8mm",
    additional_price: 0,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-bead-2-6mm",
    component_type: "bead",
    name: "Pérola Champagne Delicada (6mm)",
    slug: "bead-perola-champagne-6mm",
    description: "Tons quentes e elegantes em proporção delicada de 6mm.",
    color: "#E8DDD0",
    material: "Pérola",
    size: "6mm",
    additional_price: 0,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-bead-3",
    component_type: "bead",
    name: "Cristal Azul Safira (8mm)",
    slug: "bead-cristal-azul-8mm",
    description: "Cristal de vidro facetado com reflexos brilhantes marianos marcantes.",
    color: "#3B6082",
    material: "Cristal",
    size: "8mm",
    additional_price: 8.00,
    display_order: 5,
    is_active: true
  },
  {
    id: "comp-bead-3-6mm",
    component_type: "bead",
    name: "Cristal Azul Celeste (6mm)",
    slug: "bead-cristal-azul-6mm",
    description: "Cristal facetado em azul celeste sutil e translúcido de 6mm.",
    color: "#5B82A6",
    material: "Cristal",
    size: "6mm",
    additional_price: 7.00,
    display_order: 6,
    is_active: true
  },
  {
    id: "comp-bead-4",
    component_type: "bead",
    name: "Cristal Bisotado Transparente (8mm)",
    slug: "bead-cristal-transparente-8mm",
    description: "Transparência pura com corte brilhante que reflete a luz com imponência.",
    color: "#FFFFFF",
    material: "Cristal",
    size: "8mm",
    additional_price: 10.00,
    display_order: 7,
    is_active: true
  },
  {
    id: "comp-bead-4-6mm",
    component_type: "bead",
    name: "Cristal Bisotado Delicado (6mm)",
    slug: "bead-cristal-transparente-6mm",
    description: "Transparência límpida com lapidação fina em escala de 6mm.",
    color: "#FFFFFF",
    material: "Cristal",
    size: "6mm",
    additional_price: 9.00,
    display_order: 8,
    is_active: true
  },
  {
    id: "comp-bead-5",
    component_type: "bead",
    name: "Ágata Verde Esmeralda (8mm)",
    slug: "bead-agata-verde-8mm",
    description: "Pedra natural com veios únicos de esperança e serenidade.",
    color: "#4A6B53",
    material: "Pedra Natural",
    size: "8mm",
    additional_price: 12.00,
    display_order: 9,
    is_active: true
  },
  {
    id: "comp-bead-6",
    component_type: "bead",
    name: "Madeira Nobre Natural (8mm)",
    slug: "bead-madeira-nobre-8mm",
    description: "Contas de madeira nobre encerada, toque rústico e acolhedor.",
    color: "#8C6239",
    material: "Madeira",
    size: "8mm",
    additional_price: 5.00,
    display_order: 10,
    is_active: true
  },
  {
    id: "comp-bead-6-6mm",
    component_type: "bead",
    name: "Madeira Nobre Suave (6mm)",
    slug: "bead-madeira-nobre-6mm",
    description: "Madeira torneada encerada em escala compacta de 6mm.",
    color: "#8C6239",
    material: "Madeira",
    size: "6mm",
    additional_price: 5.00,
    display_order: 11,
    is_active: true
  },
  {
    id: "comp-bead-7",
    component_type: "bead",
    name: "Quartzo Rosa Suave (8mm)",
    slug: "bead-quartzo-rosa-8mm",
    description: "Tom rosa suave em pedra natural, simbolizando amor e intercessão.",
    color: "#E5B8BC",
    material: "Pedra Natural",
    size: "8mm",
    additional_price: 14.00,
    display_order: 12,
    is_active: true
  },
  {
    id: "comp-bead-7-6mm",
    component_type: "bead",
    name: "Quartzo Rosa Delicado (6mm)",
    slug: "bead-quartzo-rosa-6mm",
    description: "Pedra natural quartzo rosa em formato leve e gracioso de 6mm.",
    color: "#E5B8BC",
    material: "Pedra Natural",
    size: "6mm",
    additional_price: 12.00,
    display_order: 13,
    is_active: true
  },
  {
    id: "comp-bead-8",
    component_type: "bead",
    name: "Hematita Grafite Metálica (8mm)",
    slug: "bead-hematita-grafite-8mm",
    description: "Brilho metálico cinza chumbo com presença e peso oracional marcante.",
    color: "#4A4E54",
    material: "Pedra Natural",
    size: "8mm",
    additional_price: 10.00,
    display_order: 14,
    is_active: true
  },
  {
    id: "comp-bead-8-6mm",
    component_type: "bead",
    name: "Hematita Grafite Slim (6mm)",
    slug: "bead-hematita-grafite-6mm",
    description: "Hematita torneada compacta de 6mm com acabamento espelhado nobre.",
    color: "#4A4E54",
    material: "Pedra Natural",
    size: "6mm",
    additional_price: 9.00,
    display_order: 15,
    is_active: true
  },

  // Contas Pai-Nossos (com tamanhos 8mm e 10mm destacados)
  {
    id: "comp-of-1",
    component_type: "our_father_bead",
    name: "Pérola Barroca (10mm)",
    slug: "of-perola-barroca",
    description: "Conta em tamanho destaque com textura levemente irregular.",
    color: "#FAF7F0",
    material: "Pérola",
    size: "10mm",
    additional_price: 6.00,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-of-2",
    component_type: "our_father_bead",
    name: "Cristal Dourado Metalizado (8mm)",
    slug: "of-cristal-dourado",
    description: "Brilho ouro radiante para marcar os mistérios da oração em 8mm clássico.",
    color: "#D4AF37",
    material: "Cristal",
    size: "8mm",
    additional_price: 8.00,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-of-3",
    component_type: "our_father_bead",
    name: "Rosa Branca em Resina (8mm)",
    slug: "of-rosa-resina",
    description: "Miniatura delicada de rosa talhada em relevo em tamanho 8mm harmonioso.",
    color: "#FFFFFF",
    material: "Resina",
    size: "8mm",
    additional_price: 10.00,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-of-4",
    component_type: "our_father_bead",
    name: "Murano Decorado (10mm)",
    slug: "of-murano-decorado",
    description: "Murano artesanal com detalhes dourados em espiral e presença nobre.",
    color: "#E6C687",
    material: "Murano",
    size: "10mm",
    additional_price: 12.00,
    display_order: 4,
    is_active: true
  },

  // Entremeios
  {
    id: "comp-cp-1",
    component_type: "centerpiece",
    name: "Nossa Senhora Aparecida (Dourado)",
    slug: "centerpiece-aparecida-ouro",
    description: "Medalha com imagem de N. Sra. Aparecida e manto estilizado.",
    color: "#D4AF37",
    material: "Metal Dourado",
    size: "25mm",
    additional_price: 0,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-cp-2",
    component_type: "centerpiece",
    name: "Medalha de São Bento (Dourado)",
    slug: "centerpiece-sao-bento-ouro",
    description: "Cruz e medalha oficial de São Bento com oração de proteção no verso.",
    color: "#D4AF37",
    material: "Metal Dourado",
    size: "22mm",
    additional_price: 0,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-cp-3",
    component_type: "centerpiece",
    name: "Medalha de São Bento (Ouro Velho)",
    slug: "centerpiece-sao-bento-ouro-velho",
    description: "Acabamento vintage envelhecido com alta definição.",
    color: "#A68A56",
    material: "Metal Envelhecido",
    size: "22mm",
    additional_price: 0,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-cp-4",
    component_type: "centerpiece",
    name: "São Miguel Arcanjo (Dourado)",
    slug: "centerpiece-sao-miguel-ouro",
    description: "Representação de São Miguel com espada e escudo protetor.",
    color: "#D4AF37",
    material: "Metal Dourado",
    size: "24mm",
    additional_price: 4.00,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-cp-5",
    component_type: "centerpiece",
    name: "Nossa Senhora das Graças / Milagrosa",
    slug: "centerpiece-gracas",
    description: "Medalha Milagrosa tradicional com raios de graças.",
    color: "#CFCAC4",
    material: "Metal Prata",
    size: "22mm",
    additional_price: 0,
    display_order: 5,
    is_active: true
  },
  {
    id: "comp-cp-6",
    component_type: "centerpiece",
    name: "Sagrada Família",
    slug: "centerpiece-sagrada-familia",
    description: "Jesus, Maria e José, símbolo de união e bênção do lar.",
    color: "#D4AF37",
    material: "Metal Dourado",
    size: "24mm",
    additional_price: 5.00,
    display_order: 6,
    is_active: true
  },

  // Crucifixos
  {
    id: "comp-cr-1",
    component_type: "crucifix",
    name: "Crucifixo Barroco Dourado",
    slug: "crucifix-barroco-ouro",
    description: "Cruz barroca clássica com pontas trabalhadas e Cristo em relevo.",
    color: "#D4AF37",
    material: "Metal Dourado",
    size: "45mm",
    additional_price: 0,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-cr-2",
    component_type: "crucifix",
    name: "Crucifixo São Bento Vazado (Dourado)",
    slug: "crucifix-sao-bento-ouro",
    description: "Cruz com medalha embutida de São Bento.",
    color: "#D4AF37",
    material: "Metal Dourado",
    size: "45mm",
    additional_price: 6.00,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-cr-3",
    component_type: "crucifix",
    name: "Crucifixo São Bento (Ouro Velho)",
    slug: "crucifix-sao-bento-velho",
    description: "Acabamento antigo com detalhes refinados de oração.",
    color: "#A68A56",
    material: "Metal Envelhecido",
    size: "45mm",
    additional_price: 6.00,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-cr-4",
    component_type: "crucifix",
    name: "Crucifixo Delicado com Ponto de Luz",
    slug: "crucifix-delicado-luz",
    description: "Design fino e moderno com zircônia no centro.",
    color: "#E8D59E",
    material: "Metal Dourado",
    size: "38mm",
    additional_price: 12.00,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-cr-5",
    component_type: "crucifix",
    name: "Crucifixo Clássico Prateado",
    slug: "crucifix-classico-prata",
    description: "Acabamento em prata polida com detalhes tradicionais.",
    color: "#CFCAC4",
    material: "Metal Prata",
    size: "42mm",
    additional_price: 0,
    display_order: 5,
    is_active: true
  },

  // Extras
  {
    id: "comp-ex-1",
    component_type: "medal",
    name: "Medalha Adicional de São Bento",
    slug: "extra-medalha-sao-bento",
    description: "Mini medalha de proteção pendurada junto ao entremeio.",
    color: "#D4AF37",
    material: "Metal Dourado",
    additional_price: 7.00,
    display_order: 1,
    is_active: true
  },
  {
    id: "comp-ex-2",
    component_type: "medal",
    name: "Medalha Adicional N. Sra. Aparecida",
    slug: "extra-medalha-aparecida",
    description: "Mini medalha de Nossa Senhora com acabamento fino.",
    color: "#D4AF37",
    material: "Metal Dourado",
    additional_price: 7.00,
    display_order: 2,
    is_active: true
  },
  {
    id: "comp-ex-3",
    component_type: "letter",
    name: "Nome Personalizado em Contas Douradas",
    slug: "extra-nome-personalizado",
    description: "Adição de letrinhas metálicas com nome ou iniciais.",
    color: "#D4AF37",
    material: "Metal",
    additional_price: 10.00,
    display_order: 3,
    is_active: true
  },
  {
    id: "comp-ex-4",
    component_type: "packaging",
    name: "Caixa Especial de Veludo para Presente",
    slug: "extra-caixa-veludo",
    description: "Estojo rígido revestido em veludo nobre com laço dourado.",
    color: "#141E30",
    material: "Veludo",
    additional_price: 18.00,
    display_order: 4,
    is_active: true
  },
  {
    id: "comp-ex-5",
    component_type: "packaging",
    name: "Cartão Dedicatória Caligrafado à Mão",
    slug: "extra-cartao-caligrafado",
    description: "Cartão especial de bênção com mensagem personalizada.",
    color: "#F5F2EB",
    material: "Papel Especial",
    additional_price: 5.00,
    display_order: 5,
    is_active: true
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "t1",
    name: "Terço Clássico de Madeira",
    description: "Contas de madeira 8mm, cordão resistente.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4b1c2?q=80&w=800",
    category: 'tercos',
    subcategory: 'Todos'
  }
];

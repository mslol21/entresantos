import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { Product, GlobalOption, Category } from '../types';
import { Plus, Edit2, Trash2, Save, X, ShoppingBag, Settings, ArrowLeft, Lock, Palette, Grid, Wrench, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FinancePanel } from '../components/FinancePanel';

const getColorHex = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('areia')) return '#E2DBD0';
  if (lower.includes('bege')) return '#D4C4B5';
  if (lower.includes('off-white') || lower.includes('off white')) return '#F5F2EB';
  if (lower.includes('nude')) return '#E3C8B7';
  if (lower.includes('terracota')) return '#C06C53';
  if (lower.includes('cinza quente')) return '#9E948B';
  if (lower.includes('marrom claro')) return '#92765A';
  if (lower.includes('branco')) return '#FFFFFF';
  if (lower.includes('preto')) return '#1A1A1A';
  if (lower.includes('azul')) return '#6A8CA6';
  if (lower.includes('rosa')) return '#E0A899';
  if (lower.includes('verde')) return '#7B8E78';
  if (lower.includes('dourado') || lower.includes('ouro')) return '#D4AF37';
  return '#666666';
};

export const Admin: React.FC = () => {
  const { 
    products, settings, loading, categories, globalOptions,
    addProduct, updateProduct, deleteProduct, updateSettings, uploadFile,
    addCategory, updateCategory, deleteCategory,
    addGlobalOption, updateGlobalOption, deleteGlobalOption 
  } = useData();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'colors' | 'options' | 'settings' | 'finance'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingOption, setEditingOption] = useState<GlobalOption | null>(null);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [subTab, setSubTab] = useState<'colors' | 'entremeio' | 'crucifixo' | 'outros'>('colors');
  
  // Security state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = "atelieentresantos"; // Simple security measure

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Form states
  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    subcategory: 'Todos',
    isCustomizable: false,
    isActive: true,
    availableColors: '',
    hasNameOption: true,
    hasColorOption: false,
    variations: [],
    customizationLists: []
  });

  const [formSettings, setFormSettings] = useState(settings);
  const [formOption, setFormOption] = useState<Partial<GlobalOption>>({
    name: '',
    price: 0,
    image: '',
    categoryIds: [],
    group: 'Entremeio'
  });
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !formProduct.category) {
      setFormProduct(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories]);

  useEffect(() => {
    if (settings) {
      setFormSettings(settings);
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-gold font-serif animate-pulse">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-navy-light border border-gold/20 p-8 rounded-3xl w-full max-w-md shadow-2xl"
        >
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gold">Acesso Restrito</h1>
            <p className="text-gold/40 text-sm text-center">Digite a senha administrativa para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input 
                type="password" 
                placeholder="Senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy border border-gold/20 rounded-xl p-4 text-gold text-center outline-none focus:border-gold transition-all"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full gold-bg-gradient text-navy py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gold/20"
            >
              Entrar no Painel
            </button>
            <Link to="/" className="block text-center text-gold/40 text-xs hover:text-gold transition-colors mt-4">
              Voltar para a loja
            </Link>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...formProduct } as Product);
      } else {
        await addProduct(formProduct as Product);
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
      setFormProduct({ name: '', description: '', price: 0, image: '', category: categories[0]?.id || '', subcategory: 'Todos', isCustomizable: false, isActive: true, availableColors: '', hasNameOption: true, hasColorOption: false, variations: [], customizationLists: [] });
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      alert('Erro ao salvar o produto. Verifique sua conexão ou tente novamente.');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return;
    try {
      if (editingCategory) {
        await updateCategory({ ...editingCategory, name: categoryName });
      } else {
        await addCategory(categoryName);
      }
      setEditingCategory(null);
      setIsAddingCategory(false);
      setCategoryName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOption.name) return;
    try {
      if (editingOption) {
        await updateGlobalOption({
          ...editingOption,
          ...formOption,
          type: activeTab === 'colors' ? 'color' : 'assembly'
        });
      } else {
        await addGlobalOption({ 
          ...formOption,
          id: Math.random().toString(36).substr(2, 9),
          type: activeTab === 'colors' ? 'color' : 'assembly' 
        });
      }
      setEditingOption(null);
      setIsAddingOption(false);
      setFormOption({ name: '', price: 0, image: '', categoryIds: [], group: 'Entremeio' });
    } catch (err) {
      console.error(err);
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormProduct(product);
    setIsAddingProduct(true);
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsAddingCategory(true);
  };

  const startEditOption = (option: GlobalOption) => {
    setEditingOption(option);
    setFormOption({
      name: option.name,
      price: option.price || 0,
      image: option.image || '',
      categoryIds: option.categoryIds || [],
      group: option.group
    });
    setIsAddingOption(true);
  };

  return (
    <div className="min-h-screen bg-navy text-gold">
      {/* Admin Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 bg-navy-light border-r border-gold/10 p-6 hidden md:flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-gold rounded-full flex items-center justify-center text-xs">ES</div>
              <span className="font-serif font-bold text-sm tracking-widest uppercase">Admin</span>
            </div>
          </div>

          <nav className="space-y-2 flex-grow">
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 p-3 rounded-full transition-all ${activeTab === 'products' ? 'bg-gold text-navy font-bold' : 'hover:bg-gold/5 text-gold/60 hover:text-gold'}`}
            >
              <ShoppingBag size={20} />
              <span className="text-sm">Produtos</span>
            </button>
            <button 
              onClick={() => { setActiveTab('colors'); setSubTab('colors'); }}
              className={`w-full flex items-center gap-3 p-3 rounded-full transition-all ${activeTab === 'colors' ? 'bg-gold text-navy font-bold' : 'hover:bg-gold/5 text-gold/60 hover:text-gold'}`}
            >
              <Settings size={20} />
              <span className="text-sm">Opções Globais</span>
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 p-3 rounded-full transition-all ${activeTab === 'categories' ? 'bg-gold text-navy font-bold' : 'hover:bg-gold/5 text-gold/60 hover:text-gold'}`}
            >
              <Grid size={20} />
              <span className="text-sm">Categorias</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 p-3 rounded-full transition-all ${activeTab === 'settings' ? 'bg-gold text-navy font-bold' : 'hover:bg-gold/5 text-gold/60 hover:text-gold'}`}
            >
              <Settings size={20} />
              <span className="text-sm">Configurações</span>
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center gap-3 p-3 rounded-full transition-all ${activeTab === 'finance' ? 'bg-gold text-navy font-bold' : 'hover:bg-gold/5 text-gold/60 hover:text-gold'}`}
            >
              <LineChart size={20} />
              <span className="text-sm">Financeiro</span>
            </button>
          </nav>

          <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 mt-auto transition-all">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Voltar à Loja</span>
          </Link>
        </aside>

        {/* Mobile Header Navigation */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-light border-b border-gold/10 z-40 p-4 flex items-center justify-between">
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 pr-4">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === 'products' ? 'bg-gold text-navy' : 'text-gold/60'}`}
            >
              Produtos
            </button>
            <button 
              onClick={() => { setActiveTab('colors'); setSubTab('colors'); }}
              className={`px-3.5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === 'colors' ? 'bg-gold text-navy' : 'text-gold/60'}`}
            >
              Opções Globais
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === 'categories' ? 'bg-gold text-navy' : 'text-gold/60'}`}
            >
              Categorias
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === 'settings' ? 'bg-gold text-navy' : 'text-gold/60'}`}
            >
              Ajustes
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-3.5 py-2 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === 'finance' ? 'bg-gold text-navy' : 'text-gold/60'}`}
            >
              Financeiro
            </button>
          </div>
          <Link to="/" className="text-red-500 p-2">
            <ArrowLeft size={20} />
          </Link>
        </div>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'products' ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-1 text-gold">Gerenciar Produtos</h1>
                    <p className="text-gold/40 text-sm">Adicione, edite ou remova peças do seu catálogo.</p>
                  </div>
                  <button 
                    onClick={() => { setIsAddingProduct(true); setEditingProduct(null); setFormProduct({ name: '', description: '', price: 0, image: '', category: categories[0]?.id || '', subcategory: 'Todos', isCustomizable: false, isActive: true, availableColors: '', hasNameOption: true, hasColorOption: false, variations: [], customizationLists: [] }); }}
                    className="gold-bg-gradient text-navy px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/20 hover:scale-105 transition-all"
                  >
                    <Plus size={20} />
                    Novo Produto
                  </button>
                </div>

                {/* Product List - Desktop Table */}
                <div className="hidden md:block bg-navy-light rounded-3xl border border-gold/10 overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-gold/5 text-gold/40 text-[10px] uppercase font-bold tracking-widest">
                      <tr>
                        <th className="p-4">Produto</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gold/5 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-gold/10" />
                              <div>
                                <div className="font-bold text-sm text-gold/90">{p.name}</div>
                                <div className="text-[10px] text-gold/40">{p.subcategory}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gold/60">{p.category}</td>
                          <td className="p-4 font-bold text-sm">R$ {p.price.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.isActive !== false ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {p.isActive !== false ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => startEditProduct(p)} className="p-2 hover:bg-gold/10 rounded-lg text-gold/60 hover:text-gold transition-all">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/60 hover:text-red-500 transition-all">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Product List - Mobile Cards */}
                <div className="md:hidden space-y-4 pb-10 pt-16">
                  {products.map((p) => (
                    <div key={p.id} className="bg-navy-light rounded-2xl border border-gold/10 p-4 flex gap-4 items-center">
                      <img src={p.image} className="w-16 h-16 rounded-xl object-cover border border-gold/10" />
                      <div className="flex-grow">
                        <div className="font-bold text-gold text-sm">{p.name}</div>
                        <div className="text-xs text-gold/40 mb-1">R$ {p.price.toFixed(2)}</div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.isActive !== false ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {p.isActive !== false ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => startEditProduct(p)} className="p-3 bg-gold/10 rounded-xl text-gold">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'categories' ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-1 text-gold">Gerenciar Categorias</h1>
                    <p className="text-gold/40 text-sm">Organize seu catálogo em seções.</p>
                  </div>
                  <button 
                    onClick={() => { setIsAddingCategory(true); setEditingCategory(null); setCategoryName(''); }}
                    className="gold-bg-gradient text-navy px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/20 hover:scale-105 transition-all"
                  >
                    <Plus size={20} />
                    Nova Categoria
                  </button>
                </div>

                <div className="bg-navy-light rounded-3xl border border-gold/10 p-8 max-w-xl shadow-2xl">
                  <div className="space-y-4">
                    <div className="divide-y divide-gold/5">
                      {categories.map(c => (
                        <div key={c.id} className="py-4 flex justify-between items-center group">
                          <span className="text-gold/80 font-bold">{c.name}</span>
                          <div className="flex gap-2">
                            <button onClick={() => startEditCategory(c)} className="p-2 text-gold/40 hover:text-gold transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteCategory(c.id)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'colors' ? (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-1 text-gold">Opções Globais</h1>
                    <p className="text-gold/40 text-sm">Biblioteca de cores, tecidos, acabamentos e tamanhos.</p>
                  </div>
                  <button 
                    onClick={() => { 
                      setIsAddingOption(true); 
                      setEditingOption(null); 
                      setFormOption({ 
                        name: '', 
                        price: 0, 
                        image: '', 
                        categoryIds: [], 
                        group: subTab === 'colors' ? 'Cores' : (subTab === 'entremeio' ? 'Entremeio' : (subTab === 'crucifixo' ? 'Crucifixo' : 'Outros'))
                      }); 
                    }}
                    className="gold-bg-gradient text-navy px-6 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/20 hover:scale-105 transition-all"
                  >
                    <Plus size={20} />
                    Nova Opção
                  </button>
                </div>

                {/* Pills Tab Menu */}
                <div className="flex flex-wrap gap-2.5 bg-navy-light/45 p-2 rounded-full w-fit border border-gold/10">
                  <button
                    onClick={() => setSubTab('colors')}
                    className={`px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all ${subTab === 'colors' ? 'bg-gold text-navy shadow-lg' : 'text-gold/50 hover:text-gold'}`}
                  >
                    <Palette size={14} />
                    Cores
                  </button>
                  <button
                    onClick={() => setSubTab('entremeio')}
                    className={`px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all ${subTab === 'entremeio' ? 'bg-gold text-navy shadow-lg' : 'text-gold/50 hover:text-gold'}`}
                  >
                    <Grid size={14} />
                    Entremeios
                  </button>
                  <button
                    onClick={() => setSubTab('crucifixo')}
                    className={`px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all ${subTab === 'crucifixo' ? 'bg-gold text-navy shadow-lg' : 'text-gold/50 hover:text-gold'}`}
                  >
                    <Wrench size={14} />
                    Crucifixos
                  </button>
                  <button
                    onClick={() => setSubTab('outros')}
                    className={`px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all ${subTab === 'outros' ? 'bg-gold text-navy shadow-lg' : 'text-gold/50 hover:text-gold'}`}
                  >
                    <Settings size={14} />
                    Outras Opções
                  </button>
                </div>

                <div className="bg-navy-light rounded-[32px] border border-gold/10 p-8 shadow-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {globalOptions.filter(o => {
                      if (subTab === 'colors') return o.type === 'color';
                      if (subTab === 'entremeio') return o.type === 'assembly' && o.group === 'Entremeio';
                      if (subTab === 'crucifixo') return o.type === 'assembly' && o.group === 'Crucifixo';
                      return o.type === 'assembly' && o.group === 'Outros';
                    }).map(o => (
                      <div key={o.id} className="bg-navy p-4.5 rounded-[24px] border border-gold/10 flex flex-col gap-3 group hover:border-gold/30 transition-all shadow-lg text-left">
                        <div className="w-full aspect-square bg-navy-light rounded-2xl overflow-hidden border border-gold/10 flex items-center justify-center">
                          {o.image ? (
                            o.image.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={o.image} className="w-full h-full object-cover" />
                            ) : (
                              <img src={o.image} className="w-full h-full object-cover" />
                            )
                          ) : (
                            subTab === 'colors' ? (
                              <div className="w-12 h-12 rounded-full border border-gold/25 shadow-lg shadow-gold/10" style={{ backgroundColor: getColorHex(o.name) }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gold/10"><Palette size={24} /></div>
                            )
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full font-bold">Ativo</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => startEditOption(o)}
                                className="text-gold/40 hover:text-gold p-1 transition-all"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => deleteGlobalOption(o.id)} 
                                className="text-red-500/40 hover:text-red-500 p-1 transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <div className="flex-grow text-left">
                            <div className="text-gold font-bold text-sm line-clamp-1">{o.name}</div>
                            <div className="text-[10px] text-gold/40 mt-0.5">
                              {o.price && o.price > 0 ? `+ R$ ${o.price.toFixed(2)}` : 'Preço padrão'}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {o.categoryIds?.map(cid => (
                                <span key={cid} className="text-[8px] bg-gold/10 px-1.5 py-0.5 rounded text-gold/45 font-medium">{categories.find(c => c.id === cid)?.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === 'finance' ? (
              <FinancePanel />
            ) : (
              <div className="space-y-8">
                <div className="pt-16 md:pt-0">
                  <h1 className="text-3xl font-serif font-bold mb-1 text-gold">Configurações da Loja</h1>
                  <p className="text-gold/40 text-sm">Personalize os dados e links do seu Ateliê.</p>
                </div>

                <div className="bg-navy-light rounded-3xl border border-gold/10 p-8 max-w-2xl shadow-2xl">
                  <form onSubmit={(e) => { e.preventDefault(); updateSettings(formSettings); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gold/40">Nome da Loja</label>
                        <input 
                          type="text" 
                          value={formSettings.name}
                          onChange={(e) => setFormSettings({...formSettings, name: e.target.value})}
                          className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm focus:border-gold outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gold/40">WhatsApp (DDD + Número)</label>
                        <input 
                          type="text" 
                          value={formSettings.whatsapp}
                          onChange={(e) => setFormSettings({...formSettings, whatsapp: e.target.value})}
                          className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm focus:border-gold outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gold/40">Slogan</label>
                        <input 
                          type="text" 
                          value={formSettings.slogan}
                          onChange={(e) => setFormSettings({...formSettings, slogan: e.target.value})}
                          className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm focus:border-gold outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gold/40">Instagram Handle</label>
                        <input 
                          type="text" 
                          value={formSettings.instagram}
                          onChange={(e) => setFormSettings({...formSettings, instagram: e.target.value})}
                          className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm focus:border-gold outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gold/40">Nicho / Descrição Curta</label>
                        <input 
                          type="text" 
                          value={formSettings.niche}
                          onChange={(e) => setFormSettings({...formSettings, niche: e.target.value})}
                          className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm focus:border-gold outline-none"
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="gold-bg-gradient text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-gold/20">
                      <Save size={20} />
                      Salvar Alterações
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-light border border-gold/20 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar"
            >
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-navy-light z-10 py-2">
                <h2 className="text-2xl font-serif font-bold text-gold">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <button onClick={() => setIsAddingProduct(false)} className="text-gold/40 hover:text-gold p-2"><X size={24} /></button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gold/40">Nome</label>
                    <input 
                      type="text" required
                      value={formProduct.name}
                      onChange={(e) => setFormProduct({...formProduct, name: e.target.value})}
                      className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gold/40">Preço (R$)</label>
                    <input 
                      type="number" step="0.01" required
                      value={formProduct.price}
                      onChange={(e) => setFormProduct({...formProduct, price: parseFloat(e.target.value)})}
                      className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gold/40">Descrição</label>
                    <textarea 
                      value={formProduct.description}
                      onChange={(e) => setFormProduct({...formProduct, description: e.target.value})}
                      className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold h-24"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gold/40">Categoria</label>
                    <select 
                      value={formProduct.category}
                      onChange={(e) => setFormProduct({...formProduct, category: e.target.value})}
                      className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase font-black text-gold/40 block tracking-widest">Mídia do Produto (Imagem ou Vídeo)</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {/* Preview Area */}
                      <div className="w-full md:w-40 h-40 bg-navy border-2 border-dashed border-gold/10 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                        {formProduct.image ? (
                          <>
                            {formProduct.image.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={formProduct.image} className="w-full h-full object-cover" />
                            ) : (
                              <img src={formProduct.image} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => setFormProduct({...formProduct, image: ''})}
                                className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gold/20">
                            <ShoppingBag size={32} strokeWidth={1} />
                            <span className="text-[10px] font-bold uppercase">Sem Mídia</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="flex-grow space-y-4 w-full">
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <input 
                              id="file-upload"
                              type="file" 
                              className="hidden" 
                              accept="image/*,video/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    setIsUploading(true);
                                    const url = await uploadFile(file);
                                    setFormProduct({...formProduct, image: url});
                                  } catch (err) {
                                    alert('Erro ao fazer upload. Verifique se o bucket "products" foi criado na Supabase.');
                                    console.error(err);
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => document.getElementById('file-upload')?.click()}
                              disabled={isUploading}
                              className={`w-full gold-bg-gradient text-navy py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-gold/20 hover:scale-[1.02] transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isUploading ? (
                                <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Plus size={18} strokeWidth={2.5} />
                              )}
                              {isUploading ? 'Enviando...' : 'Carregar do Dispositivo'}
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-bold text-gold/20 block">Ou insira um link manual:</label>
                          <input 
                            type="text" 
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={formProduct.image}
                            onChange={(e) => setFormProduct({...formProduct, image: e.target.value})}
                            className="w-full bg-navy border border-gold/10 rounded-xl p-3 text-gold text-[10px] outline-none focus:border-gold/40 transition-all font-mono"
                          />
                        </div>
                        <p className="text-[9px] text-gold/30 italic leading-relaxed">
                          Dica: Use vídeos curtos para dar mais vida ao catálogo. O sistema aceita links diretos ou arquivos locais.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gold/10">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!formProduct.hasNameOption}
                        onChange={(e) => setFormProduct({...formProduct, hasNameOption: e.target.checked})}
                        className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                      />
                      <span className="text-sm font-medium">Personalizar Nome</span>
                    </label>
                    {formProduct.hasNameOption && (
                      <div className="flex items-center gap-2">
                        <label className="text-[9px] uppercase font-bold text-gold/40">Custo:</label>
                        <input 
                          type="number" step="0.01"
                          placeholder="0.00"
                          value={formProduct.namePrice}
                          onChange={(e) => setFormProduct({...formProduct, namePrice: parseFloat(e.target.value)})}
                          className="w-20 bg-navy border border-gold/20 rounded-lg p-1.5 text-gold text-xs outline-none"
                        />
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!formProduct.hasColorOption}
                      onChange={(e) => setFormProduct({...formProduct, hasColorOption: e.target.checked})}
                      className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                    />
                    <span className="text-sm font-medium">Personalizar Cor</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!formProduct.isCustomizable}
                      onChange={(e) => setFormProduct({...formProduct, isCustomizable: e.target.checked})}
                      className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                    />
                    <span className="text-sm font-medium">Personalizar Montagem Terço</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!formProduct.isActive}
                      onChange={(e) => setFormProduct({...formProduct, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                    />
                    <span className="text-sm font-medium">Ativo na Loja</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="w-1/2 bg-navy border border-gold/20 hover:border-gold/50 text-gold py-4 rounded-full font-bold transition-all text-center text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isUploading}
                    className={`w-1/2 gold-bg-gradient text-navy py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-xl shadow-gold/20 hover:scale-[1.02] transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Save size={18} />
                    {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Form Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-light border border-gold/20 rounded-3xl w-full max-w-md p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gold">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <button onClick={() => setIsAddingCategory(false)} className="text-gold/40 hover:text-gold p-2"><X size={24} /></button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gold/40">Nome da Categoria</label>
                  <input 
                    type="text" required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full bg-navy border border-gold/20 rounded-xl p-4 text-gold text-sm outline-none focus:border-gold"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full gold-bg-gradient text-navy py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-gold/20"
                >
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Option Form Modal */}
      <AnimatePresence>
        {isAddingOption && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-light border border-gold/20 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar"
            >
              <div className="flex justify-between items-center mb-8 sticky top-0 bg-navy-light z-10 py-2">
                <h2 className="text-2xl font-serif font-bold text-gold">
                  {editingOption ? 'Editar Opção' : 'Nova Opção'}
                </h2>
                <button onClick={() => setIsAddingOption(false)} className="text-gold/40 hover:text-gold p-2"><X size={24} /></button>
              </div>

              <form onSubmit={handleOptionSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Media Upload Area */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black text-gold/40 block tracking-widest">Mídia da Opção (Imagem ou Vídeo)</label>
                    <div className="flex flex-col gap-4 items-center">
                      <div className="w-48 h-48 bg-navy border-2 border-dashed border-gold/10 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                        {formOption.image ? (
                          <>
                            {formOption.image.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={formOption.image} className="w-full h-full object-cover" />
                            ) : (
                              <img src={formOption.image} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                onClick={() => setFormOption({...formOption, image: ''})}
                                className="bg-red-500 text-white p-2 rounded-full"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <Palette size={48} className="text-gold/10" />
                        )}
                      </div>
                      <div className="w-full space-y-2">
                        <input 
                          id="opt-file-upload-modal" type="file" className="hidden" accept="image/*,video/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setIsUploading(true);
                                const url = await uploadFile(file);
                                setFormOption({...formOption, image: url});
                              } catch (err) {
                                console.error(err);
                                alert('Erro ao fazer upload da mídia.');
                              } finally {
                                setIsUploading(false);
                              }
                            }
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => document.getElementById('opt-file-upload-modal')?.click()}
                          disabled={isUploading}
                          className={`w-full gold-bg-gradient text-navy py-3 rounded-xl font-black uppercase text-[10px] tracking-widest ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isUploading ? 'Enviando...' : 'Anexar Arquivo'}
                        </button>
                        <input 
                          type="text" 
                          placeholder="Link manual (opcional)"
                          value={formOption.image}
                          onChange={(e) => setFormOption({...formOption, image: e.target.value})}
                          className="w-full bg-navy border border-gold/10 rounded-xl p-3 text-gold text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Data Fields Area */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gold/40">Nome da Opção</label>
                      <input 
                        type="text" required
                        placeholder="Ex: Cristal Azul"
                        value={formOption.name}
                        onChange={(e) => setFormOption({...formOption, name: e.target.value})}
                        className="w-full bg-navy border border-gold/20 rounded-xl p-4 text-gold text-sm outline-none focus:border-gold"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gold/40">Preço Adicional (R$)</label>
                      <input 
                        type="number" step="0.01"
                        value={formOption.price}
                        onChange={(e) => setFormOption({...formOption, price: parseFloat(e.target.value)})}
                        className="w-full bg-navy border border-gold/20 rounded-xl p-4 text-gold text-sm outline-none focus:border-gold"
                      />
                    </div>

                    {activeTab === 'options' && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gold/40">Grupo / Tipo de Peça</label>
                        <select 
                          value={formOption.group}
                          onChange={(e) => setFormOption({...formOption, group: e.target.value})}
                          className="w-full bg-navy border border-gold/20 rounded-xl p-4 text-gold text-sm outline-none focus:border-gold"
                        >
                          <option value="Entremeio">Entremeio</option>
                          <option value="Crucifixo">Crucifixo</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-[10px] uppercase font-bold text-gold/40 block">Vincular às Categorias:</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <label key={cat.id} className="flex items-center gap-2 bg-navy border border-gold/10 px-3 py-2 rounded-lg cursor-pointer hover:border-gold/30 transition-all">
                            <input 
                              type="checkbox"
                              checked={formOption.categoryIds?.includes(cat.id)}
                              onChange={(e) => {
                                const ids = [...(formOption.categoryIds || [])];
                                if (e.target.checked) ids.push(cat.id);
                                else {
                                  const idx = ids.indexOf(cat.id);
                                  if (idx > -1) ids.splice(idx, 1);
                                }
                                setFormOption({...formOption, categoryIds: ids});
                              }}
                              className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                            />
                            <span className="text-[10px] font-bold text-gold/60">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddingOption(false)}
                    className="w-1/2 bg-navy border border-gold/20 hover:border-gold/50 text-gold py-4 rounded-full font-bold transition-all text-center text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 gold-bg-gradient text-navy py-4 rounded-full font-bold hover:scale-[1.02] transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={18} />
                    {editingOption ? 'Salvar Alterações' : 'Criar Opção'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

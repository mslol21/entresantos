import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { Product } from '../types';
import { CATEGORIES } from '../data';
import { Plus, Edit2, Trash2, Save, X, ShoppingBag, Settings, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Admin: React.FC = () => {
  const { products, settings, loading, addProduct, updateProduct, deleteProduct, updateSettings, uploadFile } = useData();
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
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
    category: CATEGORIES[0].id,
    subcategory: 'Todos',
    isCustomizable: false,
    isActive: true,
    availableColors: '',
    hasNameOption: true
  });

  const [formSettings, setFormSettings] = useState(settings);

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

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formProduct } as Product);
      setEditingProduct(null);
    } else {
      addProduct(formProduct as Product);
      setIsAdding(false);
    }
    setFormProduct({ name: '', description: '', price: 0, image: '', category: CATEGORIES[0].id, subcategory: 'Todos', isCustomizable: false, isActive: true, availableColors: '', hasNameOption: true });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormProduct(product);
    setIsAdding(true);
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
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-gold text-navy' : 'hover:bg-gold/5'}`}
            >
              <ShoppingBag size={20} />
              <span className="font-bold text-sm">Produtos</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-gold text-navy' : 'hover:bg-gold/5'}`}
            >
              <Settings size={20} />
              <span className="font-bold text-sm">Configurações</span>
            </button>
          </nav>

          <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 mt-auto transition-all">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Voltar à Loja</span>
          </Link>
        </aside>

        {/* Mobile Header Navigation */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-light border-b border-gold/10 z-40 p-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'products' ? 'bg-gold text-navy' : 'text-gold/60'}`}
            >
              Produtos
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-gold text-navy' : 'text-gold/60'}`}
            >
              Ajustes
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
                    onClick={() => { setIsAdding(true); setEditingProduct(null); }}
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
                              <button onClick={() => startEdit(p)} className="p-2 hover:bg-gold/10 rounded-lg text-gold/60 hover:text-gold transition-all">
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
                        <button onClick={() => startEdit(p)} className="p-3 bg-gold/10 rounded-xl text-gold">
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
        {isAdding && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-light border border-gold/20 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gold">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-gold/40 hover:text-gold"><X size={24} /></button>
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
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                                    const url = await uploadFile(file);
                                    setFormProduct({...formProduct, image: url});
                                  } catch (err) {
                                    alert('Erro ao fazer upload. Verifique se o bucket "products" foi criado na Supabase.');
                                    console.error(err);
                                  }
                                }
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => document.getElementById('file-upload')?.click()}
                              className="w-full gold-bg-gradient text-navy py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-gold/20 hover:scale-[1.02] transition-all"
                            >
                              <Plus size={18} strokeWidth={2.5} />
                              Carregar do Dispositivo
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
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gold/40">Cores para Seleção (separadas por vírgula)</label>
                    <input 
                      type="text"
                      placeholder="Ex: Azul, Rosa, Branco (Se vazio, o cliente digita a cor)"
                      value={formProduct.availableColors}
                      onChange={(e) => setFormProduct({...formProduct, availableColors: e.target.value})}
                      className="w-full bg-navy border border-gold/20 rounded-xl p-3 text-gold text-sm outline-none focus:border-gold"
                    />
                    <p className="text-[9px] text-gold/30 italic">A escolha da cor será sempre OBRIGATÓRIA para o cliente.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gold/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formProduct.hasNameOption}
                      onChange={(e) => setFormProduct({...formProduct, hasNameOption: e.target.checked})}
                      className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                    />
                    <span className="text-sm font-medium">Permitir Nome Personalizado</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formProduct.isCustomizable}
                      onChange={(e) => setFormProduct({...formProduct, isCustomizable: e.target.checked})}
                      className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                    />
                    <span className="text-sm font-medium">Produto Especial (Monte seu Terço)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formProduct.isActive}
                      onChange={(e) => setFormProduct({...formProduct, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-gold/20 bg-navy text-gold"
                    />
                    <span className="text-sm font-medium">Ativo na Loja</span>
                  </label>
                </div>

                <button type="submit" className="w-full gold-bg-gradient text-navy py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-gold/20 hover:scale-[1.02] transition-all">
                  <Save size={20} />
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

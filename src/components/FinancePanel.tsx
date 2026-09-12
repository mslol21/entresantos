import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Calendar, 
  PieChart, Calculator, ShoppingBag, FileText
} from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Product } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface FinancePanelProps {
  onOpenQuickCalc?: (product: Product) => void;
}

export const FinancePanel: React.FC<FinancePanelProps> = ({ onOpenQuickCalc }) => {
  const { transactions, addTransaction, deleteTransaction, products, orders } = useData();
  
  const [activeFinanceTab, setActiveFinanceTab] = useState<'flow' | 'products' | 'dre'>('flow');
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'income' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    category: 'Vendas'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    try {
      await addTransaction({
        description: form.description,
        amount: parseFloat(form.amount),
        type: form.type,
        date: form.date,
        category: form.category || 'Geral'
      });
      setIsAdding(false);
      setForm({
        description: '',
        amount: '',
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        category: 'Vendas'
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar transação.');
    }
  };

  // Métricas de Pedidos e Vendas da Loja
  const approvedOrders = useMemo(() => orders.filter(o => o.status === 'approved'), [orders]);
  
  const ordersRevenue = useMemo(() => {
    return approvedOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  }, [approvedOrders]);

  // Custo das Mercadorias Vendidas (CMV)
  const ordersCost = useMemo(() => {
    return approvedOrders.reduce((sum, o) => {
      let orderCost = 0;
      (o.items || []).forEach(it => {
        const prod = products.find(p => p.id === it.id || p.name === it.name);
        const unitCost = prod?.cost !== undefined && prod.cost > 0 
          ? prod.cost 
          : ((prod?.price || it.price || 0) * 0.4);
        orderCost += unitCost * (it.quantity || 1);
      });
      return sum + orderCost;
    }, 0);
  }, [approvedOrders, products]);

  // Transações Manuais
  const manualIncomes = useMemo(() => {
    return transactions.filter(t => t.type === 'income' && !t.description?.startsWith('Pedido de ')).reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const manualExpenses = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  // Métricas Consolidadas
  const totalGrossRevenue = ordersRevenue + manualIncomes;
  const totalExpenses = manualExpenses + ordersCost;
  const netProfit = totalGrossRevenue - totalExpenses;
  const netMarginPct = totalGrossRevenue > 0 ? (netProfit / totalGrossRevenue) * 100 : 0;

  // Métricas de Estoque
  const stockMetrics = useMemo(() => {
    let totalItems = 0;
    let totalCostVal = 0;
    let totalSaleVal = 0;

    products.forEach(p => {
      const stock = p.stock || 0;
      const price = p.price || 0;
      const cost = p.cost !== undefined && p.cost > 0 ? p.cost : (price * 0.4);
      totalItems += stock;
      totalCostVal += cost * stock;
      totalSaleVal += price * stock;
    });

    return {
      totalItems,
      totalCostVal,
      totalSaleVal,
      potentialProfit: totalSaleVal - totalCostVal
    };
  }, [products]);

  // Gráfico mensal
  const chartData = useMemo(() => {
    const grouped: Record<string, { name: string; receitas: number; despesas: number }> = {};
    
    // Processar transações
    transactions.forEach(t => {
      const date = new Date(t.date || t.created_at || Date.now());
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[monthStr]) {
        grouped[monthStr] = { name: monthStr, receitas: 0, despesas: 0 };
      }
      if (t.type === 'income') grouped[monthStr].receitas += t.amount;
      else grouped[monthStr].despesas += t.amount;
    });

    // Se não houver dados no gráfico, inicializar mês atual
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (!grouped[currentMonth]) {
      grouped[currentMonth] = { name: currentMonth, receitas: totalGrossRevenue, despesas: totalExpenses };
    }

    return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name)).slice(-6);
  }, [transactions, totalGrossRevenue, totalExpenses]);

  return (
    <div className="space-y-6">
      {/* Header & Main Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-1 text-navy">Gestão Financeira & Rentabilidade</h1>
          <p className="text-navy/55 text-sm">Controle de receitas, despesas, margens de lucro dos produtos e DRE.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="btn-primary text-xs py-2.5 px-4 shadow-sm cursor-pointer"
          >
            {isAdding ? 'Cancelar' : <><Plus size={16} /> Nova Transação</>}
          </button>
        </div>
      </div>

      {/* Navegação por Sub-Abas */}
      <div className="flex items-center gap-2 border-b border-gold/20 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveFinanceTab('flow')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeFinanceTab === 'flow'
              ? 'bg-[#1C4F8C] text-white shadow-xs'
              : 'bg-cream text-navy/70 hover:bg-gold/10'
          }`}
        >
          <TrendingUp size={14} />
          <span>Fluxo de Caixa & Transações</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFinanceTab('products')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeFinanceTab === 'products'
              ? 'bg-[#1C4F8C] text-white shadow-xs'
              : 'bg-cream text-navy/70 hover:bg-gold/10'
          }`}
        >
          <Calculator size={14} />
          <span>Rentabilidade por Produto ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFinanceTab('dre')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeFinanceTab === 'dre'
              ? 'bg-[#1C4F8C] text-white shadow-xs'
              : 'bg-cream text-navy/70 hover:bg-gold/10'
          }`}
        >
          <FileText size={14} />
          <span>Demonstrativo DRE</span>
        </button>
      </div>

      {/* Cards de Métricas Consolidadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Entradas */}
        <div className="bg-white rounded-3xl border border-gold/15 p-5 shadow-premium">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-navy/40 font-black uppercase tracking-widest">Faturamento Total</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-navy">
            {totalGrossRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            {approvedOrders.length} pedidos aprovados
          </span>
        </div>

        {/* Custos & Despesas */}
        <div className="bg-white rounded-3xl border border-gold/15 p-5 shadow-premium">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-navy/40 font-black uppercase tracking-widest">Custos & Despesas</span>
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-red-600">
            {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[10px] text-navy/50 font-bold mt-1 block">
            CMV: {ordersCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        {/* Lucro Líquido Real */}
        <div className="bg-white rounded-3xl border border-gold/15 p-5 shadow-premium">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-navy/40 font-black uppercase tracking-widest">Lucro Líquido Real</span>
            <div className="w-8 h-8 rounded-full bg-[#1C4F8C]/15 text-[#1C4F8C] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className={`text-2xl font-serif font-bold ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            {netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[10px] text-[#1C4F8C] font-black mt-1 block">
            Margem Líquida: {netMarginPct.toFixed(1)}%
          </span>
        </div>

        {/* Valor em Estoque */}
        <div className="bg-white rounded-3xl border border-gold/15 p-5 shadow-premium">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-navy/40 font-black uppercase tracking-widest">Estoque & Lucro Projetado</span>
            <div className="w-8 h-8 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-navy">
            {stockMetrics.potentialProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <span className="text-[10px] text-gold-dark font-bold mt-1 block">
            {stockMetrics.totalItems} peças avaliadas em {stockMetrics.totalSaleVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>

      {/* ==================== TAB 1: FLUXO DE CAIXA ==================== */}
      {activeFinanceTab === 'flow' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gold/15 p-6 shadow-premium flex flex-col">
            <h2 className="font-serif font-bold text-lg text-navy mb-6 flex items-center gap-2">
              <PieChart size={18} className="text-[#1C4F8C]" /> 
              Fluxo de Caixa Mensal (Receitas vs Despesas)
            </h2>
            <div className="flex-grow min-h-[280px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" opacity={0.15} vertical={false} />
                    <XAxis dataKey="name" stroke="#050B18" opacity={0.5} tick={{ fill: '#050B18', fontSize: 11 }} />
                    <YAxis stroke="#050B18" opacity={0.5} tick={{ fill: '#050B18', fontSize: 11 }} />
                    <Tooltip 
                      cursor={{ fill: '#1C4F8C', opacity: 0.05 }}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D4AF3740', borderRadius: '16px', color: '#050B18', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      formatter={(val: any) => [`R$ ${Number(val).toFixed(2)}`, '']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px' }} />
                    <Bar dataKey="receitas" name="Receitas (Vendas)" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="despesas" name="Despesas / Custos" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-navy/30 flex-col gap-2">
                  <PieChart size={36} />
                  <span className="text-xs">Aguardando mais movimentações.</span>
                </div>
              )}
            </div>
          </div>

          {/* Painel Lateral: Nova Transação / Histórico */}
          <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-premium flex flex-col">
            {isAdding ? (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-4 flex-grow flex flex-col"
              >
                <h2 className="font-serif font-bold text-lg text-navy mb-1">Novo Lançamento</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${form.type === 'income' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' : 'border-gold/15 text-navy/50 hover:border-gold/30'}`}>
                    <input type="radio" name="type" value="income" className="hidden" checked={form.type === 'income'} onChange={() => setForm({...form, type: 'income'})} />
                    <TrendingUp size={18} />
                    <span className="text-[11px] uppercase tracking-wider">Receita</span>
                  </label>
                  <label className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${form.type === 'expense' ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-gold/15 text-navy/50 hover:border-gold/30'}`}>
                    <input type="radio" name="type" value="expense" className="hidden" checked={form.type === 'expense'} onChange={() => setForm({...form, type: 'expense'})} />
                    <TrendingDown size={18} />
                    <span className="text-[11px] uppercase tracking-wider">Despesa</span>
                  </label>
                </div>

                <div>
                  <label className="label-base mb-1">Descrição</label>
                  <input 
                    type="text" required
                    placeholder="Ex: Compra de Pérolas 8mm"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="input-base text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-base mb-1">Valor (R$)</label>
                    <input 
                      type="number" step="0.01" required
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => setForm({...form, amount: e.target.value})}
                      className="input-base text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="label-base mb-1">Data</label>
                    <input 
                      type="date" required
                      value={form.date}
                      onChange={(e) => setForm({...form, date: e.target.value})}
                      className="input-base text-xs"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary w-full justify-center text-xs py-3 mt-auto cursor-pointer"
                >
                  Salvar Transação
                </button>
              </motion.form>
            ) : (
              <div className="flex flex-col flex-grow">
                <h2 className="font-serif font-bold text-lg text-navy mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[#1C4F8C]" /> 
                  Últimas Transações
                </h2>
                
                <div className="flex-grow overflow-y-auto pr-1 space-y-2.5 max-h-[350px]">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 8).map((t) => (
                      <div key={t.id} className="bg-cream/50 rounded-2xl border border-gold/15 p-3 flex justify-between items-center group hover:border-gold/30 transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {t.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-navy truncate max-w-[130px]">{t.description}</div>
                            <div className="text-[10px] text-navy/40">{new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs ${t.type === 'income' ? 'text-emerald-700' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                          </span>
                          <button 
                            onClick={() => {
                              if (confirm('Deseja excluir esta transação?')) deleteTransaction(t.id);
                            }}
                            className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-navy/40 py-8 text-xs">
                      Nenhuma transação lançada manualmente.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: RENTABILIDADE POR PRODUTO ==================== */}
      {activeFinanceTab === 'products' && (
        <div className="bg-white rounded-3xl border border-gold/15 shadow-premium overflow-hidden">
          <div className="p-6 border-b border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-navy">Rentabilidade e Margens por Produto</h2>
              <p className="text-xs text-navy/55">
                Valores de custo unitário, margem praticada e lucro estimado por peça. Clique no atalho da calculadora para reajustar.
              </p>
            </div>
            <span className="text-xs font-bold bg-[#1C4F8C]/10 text-[#1C4F8C] px-3.5 py-1.5 rounded-full border border-[#1C4F8C]/20">
              {products.length} Produtos Cadastrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-cream/80 border-b border-gold/15 text-navy/50 font-black uppercase tracking-wider text-[10px]">
                  <th className="p-4">Produto</th>
                  <th className="p-4">Custo Base (R$)</th>
                  <th className="p-4">Preço de Venda (R$)</th>
                  <th className="p-4">Lucro Unitário (R$)</th>
                  <th className="p-4">Margem (%)</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4">Lucro Projetado</th>
                  <th className="p-4 text-right">Precificação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {products.map(p => {
                  const salePrice = p.price || 0;
                  const unitCost = p.cost !== undefined && p.cost > 0 ? p.cost : Number((salePrice * 0.4).toFixed(2));
                  const unitProfit = Math.max(0, salePrice - unitCost);
                  const marginPct = unitCost > 0 ? Number(((unitProfit / unitCost) * 100).toFixed(0)) : 0;
                  const stock = p.stock || 0;
                  const stockProfit = unitProfit * stock;

                  return (
                    <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream border border-gold/20 flex-shrink-0">
                          <img src={p.image || '/logo.png'} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-navy text-sm line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-navy/40 uppercase tracking-widest">{p.category || 'Geral'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-navy/70">
                        {unitCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        {p.cost === undefined && (
                          <span className="text-[9px] block text-navy/35 font-normal">(est. 40%)</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-navy">
                        {salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-700">
                        +{unitProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          marginPct >= 100 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : marginPct >= 50 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          +{marginPct}%
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-navy/80">
                        {stock} un.
                      </td>
                      <td className="p-4 font-mono font-bold text-navy">
                        {stockProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-4 text-right">
                        {onOpenQuickCalc && (
                          <button
                            type="button"
                            onClick={() => onOpenQuickCalc(p)}
                            className="px-3 py-1.5 bg-[#1C4F8C]/10 hover:bg-[#1C4F8C] hover:text-white text-[#1C4F8C] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                            title="Editar Precificação e Custos"
                          >
                            <Calculator size={13} />
                            <span>Precificar</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: DRE ==================== */}
      {activeFinanceTab === 'dre' && (
        <div className="bg-white rounded-3xl border border-gold/15 p-6 sm:p-8 shadow-premium space-y-6 max-w-4xl mx-auto">
          <div>
            <h2 className="font-serif font-bold text-2xl text-navy">Demonstrativo do Resultado (DRE Gerencial)</h2>
            <p className="text-xs text-navy/55 mt-1">
              Visão consolidada das receitas brutas, custos operacionais e margem líquida do Ateliê Entre Santos.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* (+) Receita Bruta */}
            <div className="flex justify-between items-center p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/60">
              <div>
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">(+) Receita Bruta de Vendas</span>
                <span className="text-[11px] text-emerald-700/80">Pedidos da Loja Online + Outras Vendas</span>
              </div>
              <span className="font-mono font-bold text-lg text-emerald-800">
                {totalGrossRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* (-) CMV */}
            <div className="flex justify-between items-center p-4 bg-red-50/70 rounded-2xl border border-red-200/60">
              <div>
                <span className="text-xs font-black text-red-800 uppercase tracking-wider block">(-) Custo das Mercadorias Vendidas (CMV)</span>
                <span className="text-[11px] text-red-700/80">Materiais, Contas, Cruzes e Entremeios das Peças Vendidas</span>
              </div>
              <span className="font-mono font-bold text-base text-red-700">
                - {ordersCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* (=) Lucro Bruto */}
            <div className="flex justify-between items-center p-4 bg-cream rounded-2xl border border-gold/25 font-bold">
              <div>
                <span className="text-xs text-navy uppercase tracking-wider block">(=) Lucro Bruto da Operação</span>
                <span className="text-[11px] text-navy/50 font-normal">Receita menos custos diretos de fabricação</span>
              </div>
              <span className="font-mono text-lg text-navy">
                {(totalGrossRevenue - ordersCost).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* (-) Despesas Operacionais */}
            <div className="flex justify-between items-center p-4 bg-red-50/50 rounded-2xl border border-red-200/40">
              <div>
                <span className="text-xs font-black text-red-700 uppercase tracking-wider block">(-) Despesas Operacionais & Embalagem</span>
                <span className="text-[11px] text-red-600/70">Saquinhos, caixas, fretes, ferramentas e taxas</span>
              </div>
              <span className="font-mono font-bold text-base text-red-600">
                - {manualExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* (=) Lucro Líquido */}
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-navy via-navy-light to-navy text-white rounded-2xl border border-gold/30 shadow-lg mt-4">
              <div>
                <span className="text-xs font-black text-gold uppercase tracking-widest block">(=) RESULTADO / LUCRO LÍQUIDO</span>
                <span className="text-[11px] text-white/70">Lucro final apurado com margem de {netMarginPct.toFixed(1)}%</span>
              </div>
              <span className="font-mono font-black text-2xl text-gold">
                {netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

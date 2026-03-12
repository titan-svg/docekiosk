'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  FinanceIcon,
  ChevronRightIcon,
  CalendarIcon,
  DownloadIcon,
  KioskIcon,
  IncomeIcon,
  ExpenseIcon,
  TrendIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@/components/Icons';
import { mockTransactions, mockKiosks, getExpenseCategoryLabel, formatCurrency } from '@/lib/data';

export default function RelatorioFinanceiroPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '2026-03-01', end: '2026-03-12' });
  const [kioskFilter, setKioskFilter] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesKiosk = !kioskFilter || t.kioskId === kioskFilter;
    return matchesKiosk;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  // Expense breakdown by category
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'saida')
    .reduce((acc, t) => {
      const category = t.category === 'venda' ? 'venda' : t.category;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const maxExpense = Math.max(...Object.values(expensesByCategory));

  const handleExportPDF = () => {
    alert('Exportando relatorio em PDF... (simulacao)');
  };

  const handleExportExcel = () => {
    alert('Exportando relatorio em Excel... (simulacao)');
  };

  // P&L Summary data
  const plSummary = [
    { label: 'Receita Bruta (Vendas)', value: totalIncome, type: 'income' },
    { label: '(-) Custo dos Produtos', value: expensesByCategory.fornecedor || 0, type: 'expense' },
    { label: '(=) Lucro Bruto', value: totalIncome - (expensesByCategory.fornecedor || 0), type: 'subtotal' },
    { label: '(-) Despesas Operacionais', value: 0, type: 'header' },
    { label: '    Aluguel', value: expensesByCategory.aluguel || 0, type: 'expense-sub' },
    { label: '    Energia', value: expensesByCategory.energia || 0, type: 'expense-sub' },
    { label: '    Funcionarios', value: expensesByCategory.funcionario || 0, type: 'expense-sub' },
    { label: '(=) Resultado Operacional', value: netProfit, type: 'total' },
  ];

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <Link href="/relatorios/vendas" className="hover:text-rose-500 transition-colors">
            Relatorios
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Financeiro</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Relatorio Financeiro</h1>
            <p className="text-slate-500 mt-1">Analise de receitas, despesas e lucratividade</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              <DownloadIcon className="w-5 h-5" />
              Excel
            </button>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">Data Inicial</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">Data Final</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">Quiosque</label>
              <div className="relative">
                <KioskIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={kioskFilter}
                  onChange={e => setKioskFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
                >
                  <option value="">Todos os Quiosques</option>
                  {mockKiosks.map(kiosk => (
                    <option key={kiosk.id} value={kiosk.id}>
                      {kiosk.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <IncomeIcon className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Receitas</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
              </div>
              <span className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                15%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExpenseIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Despesas</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
              <span className="flex items-center text-sm text-red-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                8%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${netProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <TrendIcon className={`w-5 h-5 ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Lucro Liquido</p>
                  <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FinanceIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Margem</p>
                  <p className={`text-xl font-bold ${profitMargin >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                    {profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Receitas vs Despesas</h2>
            <div className="flex items-end gap-8 justify-center h-48">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ delay: 0.5 }}
                  className="w-20 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg"
                  style={{ height: '150px' }}
                />
                <span className="text-sm font-medium text-slate-600">Receitas</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(totalExpenses / totalIncome) * 150}px` }}
                  transition={{ delay: 0.6 }}
                  className="w-20 bg-gradient-to-t from-red-500 to-rose-400 rounded-t-lg"
                />
                <span className="text-sm font-medium text-slate-600">Despesas</span>
                <span className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.abs(netProfit / totalIncome) * 150}px` }}
                  transition={{ delay: 0.7 }}
                  className={`w-20 rounded-t-lg ${netProfit >= 0 ? 'bg-gradient-to-t from-emerald-500 to-teal-400' : 'bg-gradient-to-t from-red-500 to-rose-400'}`}
                />
                <span className="text-sm font-medium text-slate-600">Lucro</span>
                <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Expense Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Despesas por Categoria</h2>
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .filter(([category]) => category !== 'venda')
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount], idx) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{getExpenseCategoryLabel(category as any)}</span>
                      <span className="font-medium text-slate-800">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(amount / maxExpense) * 100}%` }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* P&L Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Demonstrativo de Resultado (DRE Simplificado)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Descricao</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Valor</th>
                </tr>
              </thead>
              <tbody>
                {plSummary.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-50 ${
                      item.type === 'header' ? 'bg-slate-50' :
                      item.type === 'subtotal' ? 'bg-blue-50' :
                      item.type === 'total' ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 ${
                      item.type === 'header' || item.type === 'subtotal' || item.type === 'total'
                        ? 'font-semibold text-slate-800'
                        : item.type === 'expense-sub'
                        ? 'text-slate-600 pl-8'
                        : 'text-slate-800'
                    }`}>
                      {item.label}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      item.type === 'income' ? 'text-green-600 font-medium' :
                      item.type === 'expense' || item.type === 'expense-sub' ? 'text-red-600' :
                      item.type === 'subtotal' ? 'font-semibold text-blue-600' :
                      item.type === 'total' ? 'font-bold text-emerald-600 text-lg' :
                      'text-slate-600'
                    }`}>
                      {item.type === 'header' ? '' : formatCurrency(item.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

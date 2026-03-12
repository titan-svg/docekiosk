'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  DREIcon,
  CalendarIcon,
  DownloadIcon,
  PrintIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  IncomeIcon,
  ExpenseIcon,
} from '@/components/Icons';
import {
  mockTransactions,
  mockSales,
  formatCurrency,
  getExpenseCategoryLabel,
  ExpenseCategory,
} from '@/lib/data';

interface DRELine {
  label: string;
  value: number;
  type: 'revenue' | 'cost' | 'expense' | 'subtotal' | 'total';
  indent?: number;
}

export default function DREPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('2026-03');
  const [compareMode, setCompareMode] = useState(false);

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

  // Filter transactions by period
  const periodTransactions = mockTransactions.filter(t =>
    t.createdAt.startsWith(selectedPeriod)
  );

  // Calculate revenue (from sales)
  const grossRevenue = periodTransactions
    .filter(t => t.type === 'entrada' && t.category === 'venda')
    .reduce((sum, t) => sum + t.amount, 0) || 15881.70; // Mock data fallback

  // Calculate costs (supplier, insumo - direct costs)
  const costOfGoodsSold = periodTransactions
    .filter(t => t.type === 'saida' && (t.category === 'fornecedor' || t.category === 'insumo'))
    .reduce((sum, t) => sum + t.amount, 0) || 4950.00;

  // Gross profit
  const grossProfit = grossRevenue - costOfGoodsSold;
  const grossMargin = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;

  // Operating expenses by category
  const operatingExpenses = {
    funcionario: periodTransactions
      .filter(t => t.type === 'saida' && t.category === 'funcionario')
      .reduce((sum, t) => sum + t.amount, 0) || 6700.00,
    aluguel: periodTransactions
      .filter(t => t.type === 'saida' && t.category === 'aluguel')
      .reduce((sum, t) => sum + t.amount, 0) || 8500.00,
    energia: periodTransactions
      .filter(t => t.type === 'saida' && t.category === 'energia')
      .reduce((sum, t) => sum + t.amount, 0) || 850.00,
    agua: periodTransactions
      .filter(t => t.type === 'saida' && t.category === 'agua')
      .reduce((sum, t) => sum + t.amount, 0) || 180.00,
    manutencao: periodTransactions
      .filter(t => t.type === 'saida' && t.category === 'manutencao')
      .reduce((sum, t) => sum + t.amount, 0) || 350.00,
    outro: periodTransactions
      .filter(t => t.type === 'saida' && t.category === 'outro')
      .reduce((sum, t) => sum + t.amount, 0) || 120.00,
  };

  const totalOperatingExpenses = Object.values(operatingExpenses).reduce((a, b) => a + b, 0);

  // Operating profit (EBITDA)
  const operatingProfit = grossProfit - totalOperatingExpenses;
  const operatingMargin = grossRevenue > 0 ? (operatingProfit / grossRevenue) * 100 : 0;

  // Taxes
  const taxes = periodTransactions
    .filter(t => t.type === 'saida' && t.category === 'imposto')
    .reduce((sum, t) => sum + t.amount, 0) || 480.00;

  // Net profit
  const netProfit = operatingProfit - taxes;
  const netMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  // Build DRE lines
  const dreLines: DRELine[] = [
    { label: 'RECEITA BRUTA', value: grossRevenue, type: 'revenue' },
    { label: 'Vendas de Produtos', value: grossRevenue, type: 'revenue', indent: 1 },
    { label: '(-) CUSTO DAS MERCADORIAS VENDIDAS', value: -costOfGoodsSold, type: 'cost' },
    { label: 'Compras de Fornecedores', value: -(periodTransactions.filter(t => t.type === 'saida' && t.category === 'fornecedor').reduce((sum, t) => sum + t.amount, 0) || 2950.00), type: 'cost', indent: 1 },
    { label: 'Insumos', value: -(periodTransactions.filter(t => t.type === 'saida' && t.category === 'insumo').reduce((sum, t) => sum + t.amount, 0) || 2000.00), type: 'cost', indent: 1 },
    { label: '(=) LUCRO BRUTO', value: grossProfit, type: 'subtotal' },
    { label: '(-) DESPESAS OPERACIONAIS', value: -totalOperatingExpenses, type: 'expense' },
    { label: 'Pessoal (Salarios)', value: -operatingExpenses.funcionario, type: 'expense', indent: 1 },
    { label: 'Aluguel', value: -operatingExpenses.aluguel, type: 'expense', indent: 1 },
    { label: 'Energia Eletrica', value: -operatingExpenses.energia, type: 'expense', indent: 1 },
    { label: 'Agua', value: -operatingExpenses.agua, type: 'expense', indent: 1 },
    { label: 'Manutencao', value: -operatingExpenses.manutencao, type: 'expense', indent: 1 },
    { label: 'Outras Despesas', value: -operatingExpenses.outro, type: 'expense', indent: 1 },
    { label: '(=) RESULTADO OPERACIONAL (EBITDA)', value: operatingProfit, type: 'subtotal' },
    { label: '(-) IMPOSTOS', value: -taxes, type: 'expense' },
    { label: 'Impostos e Taxas', value: -taxes, type: 'expense', indent: 1 },
    { label: '(=) RESULTADO LIQUIDO', value: netProfit, type: 'total' },
  ];

  // Comparison data (previous month)
  const previousMonthData = {
    grossRevenue: 52000,
    costOfGoodsSold: 15600,
    grossProfit: 36400,
    totalOperatingExpenses: 24000,
    operatingProfit: 12400,
    taxes: 620,
    netProfit: 11780,
  };

  // Calculate pie chart data for expense distribution
  const expenseDistribution = [
    { label: 'Pessoal', value: operatingExpenses.funcionario, color: 'bg-blue-500' },
    { label: 'Aluguel', value: operatingExpenses.aluguel, color: 'bg-rose-500' },
    { label: 'Energia', value: operatingExpenses.energia, color: 'bg-yellow-500' },
    { label: 'Agua', value: operatingExpenses.agua, color: 'bg-cyan-500' },
    { label: 'Manutencao', value: operatingExpenses.manutencao, color: 'bg-orange-500' },
    { label: 'Outras', value: operatingExpenses.outro, color: 'bg-slate-500' },
    { label: 'CMV', value: costOfGoodsSold, color: 'bg-purple-500' },
    { label: 'Impostos', value: taxes, color: 'bg-red-500' },
  ];

  const totalExpenses = expenseDistribution.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <Link href="/financeiro" className="hover:text-rose-500">Financeiro</Link>
              <span>/</span>
              <span className="text-slate-800">DRE</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
              Demonstracao do Resultado do Exercicio
            </h1>
            <p className="text-slate-500 mt-1">Analise de receitas, custos e lucros</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="2026-03">Marco 2026</option>
              <option value="2026-02">Fevereiro 2026</option>
              <option value="2026-01">Janeiro 2026</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-slate-700 rounded-lg hover:bg-rose-50 transition-colors">
              <PrintIcon className="w-5 h-5" />
              Imprimir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-slate-700 rounded-lg hover:bg-rose-50 transition-colors">
              <DownloadIcon className="w-5 h-5" />
              Exportar
            </button>
          </motion.div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Receita Bruta</p>
              <IncomeIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(grossRevenue)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Lucro Bruto</p>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                grossMargin >= 30 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {grossMargin.toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(grossProfit)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">EBITDA</p>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                operatingMargin >= 10 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {operatingMargin.toFixed(1)}%
              </span>
            </div>
            <p className={`text-2xl font-bold ${operatingProfit >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
              {formatCurrency(operatingProfit)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-xl p-6 shadow-sm ${
              netProfit >= 0
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-80">Lucro Liquido</p>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/20">
                {netMargin.toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* DRE Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Demonstrativo de Resultados</h2>
              <span className="text-sm text-slate-500">
                {selectedPeriod === '2026-03' ? 'Marco' : selectedPeriod === '2026-02' ? 'Fevereiro' : 'Janeiro'} 2026
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {dreLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.02 }}
                  className={`flex items-center justify-between px-6 py-3 ${
                    line.type === 'subtotal' ? 'bg-slate-50 font-semibold' :
                    line.type === 'total' ? 'bg-rose-50 font-bold' : ''
                  }`}
                >
                  <span
                    className={`text-sm ${
                      line.type === 'total' ? 'text-rose-700' :
                      line.type === 'subtotal' ? 'text-slate-800' : 'text-slate-600'
                    }`}
                    style={{ paddingLeft: (line.indent || 0) * 20 }}
                  >
                    {line.label}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      line.type === 'total'
                        ? line.value >= 0 ? 'text-green-600' : 'text-red-600'
                        : line.value >= 0 ? 'text-slate-800' : 'text-red-600'
                    }`}
                  >
                    {line.value >= 0 ? formatCurrency(line.value) : `(${formatCurrency(Math.abs(line.value))})`}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Expense Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Distribuicao de Custos</h2>

            {/* Simple pie chart visualization */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return expenseDistribution.map((expense, idx) => {
                    const percentage = (expense.value / totalExpenses) * 100;
                    const dashArray = `${percentage} ${100 - percentage}`;
                    const currentOffset = offset;
                    offset += percentage;

                    return (
                      <motion.circle
                        key={idx}
                        initial={{ strokeDasharray: '0 100' }}
                        animate={{ strokeDasharray: dashArray }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={
                          idx === 0 ? '#3b82f6' :
                          idx === 1 ? '#f43f5e' :
                          idx === 2 ? '#eab308' :
                          idx === 3 ? '#06b6d4' :
                          idx === 4 ? '#f97316' :
                          idx === 5 ? '#64748b' :
                          idx === 6 ? '#a855f7' : '#ef4444'
                        }
                        strokeWidth="20"
                        strokeDashoffset={-currentOffset}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-sm font-bold text-slate-800">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {expenseDistribution.map((expense, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${expense.color}`} />
                    <span className="text-xs text-slate-600">{expense.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-800">
                      {formatCurrency(expense.value)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({((expense.value / totalExpenses) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Margin Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Analise de Margens</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gross Margin */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Margem Bruta</span>
                <span className={`text-sm font-bold ${grossMargin >= 30 ? 'text-green-600' : 'text-amber-600'}`}>
                  {grossMargin.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(grossMargin, 100)}%` }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className={`h-4 rounded-full ${grossMargin >= 30 ? 'bg-green-500' : 'bg-amber-500'}`}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Meta: 30%</p>
            </div>

            {/* Operating Margin */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Margem Operacional</span>
                <span className={`text-sm font-bold ${operatingMargin >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                  {operatingMargin.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max(operatingMargin, 0), 100)}%` }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className={`h-4 rounded-full ${operatingMargin >= 10 ? 'bg-green-500' : 'bg-red-500'}`}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Meta: 10%</p>
            </div>

            {/* Net Margin */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Margem Liquida</span>
                <span className={`text-sm font-bold ${netMargin >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                  {netMargin.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max(netMargin, 0), 100)}%` }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className={`h-4 rounded-full ${netMargin >= 5 ? 'bg-green-500' : 'bg-red-500'}`}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Meta: 5%</p>
            </div>
          </div>
        </motion.div>

        {/* Period Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Comparativo com Periodo Anterior</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Receita', current: grossRevenue, previous: previousMonthData.grossRevenue },
              { label: 'Lucro Bruto', current: grossProfit, previous: previousMonthData.grossProfit },
              { label: 'EBITDA', current: operatingProfit, previous: previousMonthData.operatingProfit },
              { label: 'Lucro Liquido', current: netProfit, previous: previousMonthData.netProfit },
            ].map((item, idx) => {
              const variation = item.previous > 0
                ? ((item.current - item.previous) / item.previous) * 100
                : 0;
              const isPositive = variation >= 0;

              return (
                <div key={idx} className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">{item.label}</p>
                  <p className="text-lg font-bold text-slate-800 mb-1">{formatCurrency(item.current)}</p>
                  <div className={`flex items-center justify-center gap-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {isPositive ? '+' : ''}{variation.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Anterior: {formatCurrency(item.previous)}
                  </p>
                </div>
              );
            })}
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

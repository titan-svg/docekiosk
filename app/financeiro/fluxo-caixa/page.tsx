'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  CashFlowIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  IncomeIcon,
  ExpenseIcon,
  DownloadIcon,
} from '@/components/Icons';
import {
  mockTransactions,
  formatCurrency,
  getExpenseCategoryLabel,
  ExpenseCategory,
} from '@/lib/data';

interface MonthData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export default function FluxoCaixaPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

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

  // Generate monthly data
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const monthlyData: MonthData[] = monthNames.map((month, idx) => {
    const monthNum = String(idx + 1).padStart(2, '0');
    const monthPrefix = `${selectedYear}-${monthNum}`;

    const monthTransactions = mockTransactions.filter(t => t.createdAt.startsWith(monthPrefix));
    const income = monthTransactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0);

    // Add some mock data for visualization
    const mockIncome = idx < 3 ? [45000, 52000, income || 48000][idx] : 0;
    const mockExpenses = idx < 3 ? [32000, 35000, expenses || 33000][idx] : 0;

    return {
      month,
      income: mockIncome,
      expenses: mockExpenses,
      balance: mockIncome - mockExpenses,
    };
  });

  const activeMonths = monthlyData.filter(m => m.income > 0 || m.expenses > 0);
  const totalIncome = activeMonths.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = activeMonths.reduce((sum, m) => sum + m.expenses, 0);
  const netBalance = totalIncome - totalExpenses;

  // Calculate cumulative balance
  let cumulative = 0;
  const cumulativeData = activeMonths.map(m => {
    cumulative += m.balance;
    return { ...m, cumulative };
  });

  const maxValue = Math.max(
    ...activeMonths.map(m => Math.max(m.income, m.expenses)),
    1
  );

  const maxCumulative = Math.max(
    ...cumulativeData.map(m => Math.abs(m.cumulative)),
    1
  );

  // Daily breakdown for current month
  const currentMonthTransactions = mockTransactions.filter(t =>
    t.createdAt.startsWith('2026-03')
  );

  const dailyData = currentMonthTransactions.reduce((acc, t) => {
    const date = t.createdAt.split('T')[0];
    if (!acc[date]) {
      acc[date] = { income: 0, expenses: 0 };
    }
    if (t.type === 'entrada') {
      acc[date].income += t.amount;
    } else {
      acc[date].expenses += t.amount;
    }
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <Link href="/financeiro" className="hover:text-rose-500">Financeiro</Link>
              <span>/</span>
              <span className="text-slate-800">Fluxo de Caixa</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Fluxo de Caixa</h1>
            <p className="text-slate-500 mt-1">Visualizacao das movimentacoes financeiras</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-slate-700 rounded-lg hover:bg-rose-50 transition-colors">
              <DownloadIcon className="w-5 h-5" />
              Exportar
            </button>
          </motion.div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUpIcon className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Entradas</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowDownIcon className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Saidas</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CashFlowIcon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-rose-100 mb-1">Saldo Liquido</p>
            <p className="text-2xl font-bold">{formatCurrency(netBalance)}</p>
          </motion.div>
        </div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 mb-6"
        >
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'chart'
                ? 'bg-rose-500 text-white'
                : 'bg-white text-slate-600 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            Grafico
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-rose-500 text-white'
                : 'bg-white text-slate-600 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            Tabela
          </button>
        </motion.div>

        {/* Monthly Cash Flow Chart */}
        {viewMode === 'chart' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-8"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Fluxo Mensal</h2>
            <div className="h-72 flex items-end justify-around gap-4">
              {activeMonths.map((month, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-56">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.income / maxValue) * 100}%` }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="w-6 bg-green-500 rounded-t-lg"
                      title={`Entradas: ${formatCurrency(month.income)}`}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.expenses / maxValue) * 100}%` }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="w-6 bg-red-400 rounded-t-lg"
                      title={`Saidas: ${formatCurrency(month.expenses)}`}
                    />
                  </div>
                  <span className="text-sm text-slate-500">{month.month}</span>
                  <span className={`text-xs font-medium ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {month.balance >= 0 ? '+' : ''}{formatCurrency(month.balance)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-slate-500">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-sm text-slate-500">Saidas</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Monthly Table View */}
        {viewMode === 'table' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden mb-8"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Mes</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Entradas</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Saidas</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Saldo</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Acumulado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cumulativeData.map((month, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-800">{month.month}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-green-600">{formatCurrency(month.income)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-red-600">{formatCurrency(month.expenses)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-medium ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {month.balance >= 0 ? '+' : ''}{formatCurrency(month.balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-semibold ${month.cumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(month.cumulative)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">Total</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(totalIncome)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(netBalance)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        )}

        {/* Cumulative Balance Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Saldo Acumulado</h2>
          <div className="h-40 flex items-center">
            <div className="w-full h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-b border-slate-100" />
                ))}
              </div>

              {/* Line chart points */}
              <svg className="w-full h-full" viewBox={`0 0 ${cumulativeData.length * 100} 100`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cumulativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  d={`
                    M 0 ${100 - (cumulativeData[0]?.cumulative / maxCumulative) * 50 - 25}
                    ${cumulativeData.map((m, i) =>
                      `L ${i * 100 + 50} ${100 - (m.cumulative / maxCumulative) * 50 - 25}`
                    ).join(' ')}
                    L ${(cumulativeData.length - 1) * 100 + 50} 100
                    L 0 100 Z
                  `}
                  fill="url(#cumulativeGradient)"
                />

                {/* Line */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.7, duration: 1 }}
                  d={`
                    M 0 ${100 - (cumulativeData[0]?.cumulative / maxCumulative) * 50 - 25}
                    ${cumulativeData.map((m, i) =>
                      `L ${i * 100 + 50} ${100 - (m.cumulative / maxCumulative) * 50 - 25}`
                    ).join(' ')}
                  `}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Points */}
                {cumulativeData.map((m, i) => (
                  <motion.circle
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    cx={i * 100 + 50}
                    cy={100 - (m.cumulative / maxCumulative) * 50 - 25}
                    r="4"
                    fill="white"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
          </div>
          <div className="flex justify-around mt-4">
            {cumulativeData.map((m, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-slate-500">{m.month}</p>
                <p className="text-xs font-medium text-green-600">{formatCurrency(m.cumulative)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Breakdown (Current Month) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Movimentacao Diaria - Marco 2026</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {Object.entries(dailyData)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, data]) => (
                <div key={date} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-800">
                        {new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <IncomeIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">+{formatCurrency(data.income)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ExpenseIcon className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">-{formatCurrency(data.expenses)}</span>
                      </div>
                      <span className={`text-sm font-medium ${data.income - data.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        = {formatCurrency(data.income - data.expenses)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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

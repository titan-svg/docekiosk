'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  FinanceIcon,
  IncomeIcon,
  ExpenseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BillIcon,
  CashFlowIcon,
  DREIcon,
  CalendarIcon,
} from '@/components/Icons';
import {
  mockTransactions,
  formatCurrency,
  getExpenseCategoryLabel,
  ExpenseCategory,
} from '@/lib/data';

export default function FinanceiroPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

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

  // Filter transactions by month
  const monthTransactions = mockTransactions.filter(t =>
    t.createdAt.startsWith(selectedMonth)
  );

  const totalIncome = monthTransactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const pendingBills = mockTransactions.filter(
    t => t.type === 'saida' && t.status === 'pendente'
  );
  const overdueBills = mockTransactions.filter(
    t => t.type === 'saida' && t.status === 'atrasado'
  );

  const pendingAmount = pendingBills.reduce((sum, t) => sum + t.amount, 0);
  const overdueAmount = overdueBills.reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expensesByCategory = monthTransactions
    .filter(t => t.type === 'saida')
    .reduce((acc, t) => {
      const category = t.category as ExpenseCategory;
      if (!acc[category]) acc[category] = 0;
      acc[category] += t.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

  const categoryColors: Record<ExpenseCategory, string> = {
    funcionario: 'bg-blue-500',
    fornecedor: 'bg-purple-500',
    insumo: 'bg-amber-500',
    aluguel: 'bg-rose-500',
    energia: 'bg-yellow-500',
    agua: 'bg-cyan-500',
    manutencao: 'bg-orange-500',
    imposto: 'bg-red-500',
    outro: 'bg-slate-500',
  };

  const maxExpense = Math.max(...Object.values(expensesByCategory), 1);

  // Monthly comparison data
  const monthlyData = [
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Fev', income: 52000, expenses: 35000 },
    { month: 'Mar', income: totalIncome || 48000, expenses: totalExpenses || 33000 },
  ];

  const maxMonthlyValue = Math.max(
    ...monthlyData.map(m => Math.max(m.income, m.expenses))
  );

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
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Financeiro</h1>
            <p className="text-slate-500 mt-1">Visao geral das suas financas</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="w-5 h-5 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="2026-01">Janeiro 2026</option>
              <option value="2026-02">Fevereiro 2026</option>
              <option value="2026-03">Marco 2026</option>
            </select>
          </motion.div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IncomeIcon className="w-6 h-6 text-green-500" />
              </div>
              <span className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                +15%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Entradas</p>
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
                <ExpenseIcon className="w-6 h-6 text-red-500" />
              </div>
              <span className="flex items-center text-sm text-red-500 font-medium">
                <ArrowDownIcon className="w-4 h-4 mr-1" />
                -8%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Saidas</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <FinanceIcon className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Saldo</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <BillIcon className="w-6 h-6 text-amber-500" />
              </div>
              {overdueBills.length > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  {overdueBills.length} atrasado
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-1">A Pagar</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount + overdueAmount)}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Comparativo Mensal</h2>
            <div className="h-64 flex items-end justify-around gap-4">
              {monthlyData.map((month, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-2 h-48">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.income / maxMonthlyValue) * 100}%` }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="w-8 bg-green-500 rounded-t-lg"
                      title={`Entradas: ${formatCurrency(month.income)}`}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.expenses / maxMonthlyValue) * 100}%` }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="w-8 bg-red-400 rounded-t-lg"
                      title={`Saidas: ${formatCurrency(month.expenses)}`}
                    />
                  </div>
                  <span className="text-sm text-slate-500">{month.month}</span>
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

          {/* Expenses by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Despesas por Categoria</h2>
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount], idx) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">
                        {getExpenseCategoryLabel(category as ExpenseCategory)}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(amount / maxExpense) * 100}%` }}
                        transition={{ delay: 0.7 + idx * 0.05 }}
                        className={`h-2 rounded-full ${categoryColors[category as ExpenseCategory]}`}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Link
            href="/financeiro/entradas"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
          >
            <IncomeIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-semibold text-slate-800">Entradas</p>
              <p className="text-xs text-slate-500">Ver receitas</p>
            </div>
          </Link>

          <Link
            href="/financeiro/saidas"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-red-300 hover:shadow-md transition-all"
          >
            <ExpenseIcon className="w-8 h-8 text-red-500" />
            <div>
              <p className="font-semibold text-slate-800">Saidas</p>
              <p className="text-xs text-slate-500">Ver despesas</p>
            </div>
          </Link>

          <Link
            href="/financeiro/fluxo-caixa"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 hover:shadow-md transition-all"
          >
            <CashFlowIcon className="w-8 h-8 text-rose-500" />
            <div>
              <p className="font-semibold text-slate-800">Fluxo de Caixa</p>
              <p className="text-xs text-slate-500">Movimentacoes</p>
            </div>
          </Link>

          <Link
            href="/financeiro/dre"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-amber-300 hover:shadow-md transition-all"
          >
            <DREIcon className="w-8 h-8 text-amber-500" />
            <div>
              <p className="font-semibold text-slate-800">DRE</p>
              <p className="text-xs text-slate-500">Demonstrativo</p>
            </div>
          </Link>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
        >
          <div className="p-6 border-b border-rose-100">
            <h2 className="text-lg font-semibold text-slate-800">Transacoes Recentes</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {mockTransactions.slice(0, 8).map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'entrada' ? (
                      <IncomeIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ExpenseIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                      {transaction.category !== 'venda' && ` - ${getExpenseCategoryLabel(transaction.category as ExpenseCategory)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'entrada' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    {transaction.status !== 'pago' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.status === 'atrasado'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {transaction.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                      </span>
                    )}
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

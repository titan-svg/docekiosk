'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  ExpenseIcon,
  SearchIcon,
  CalendarIcon,
  ArrowDownIcon,
  PlusIcon,
  DownloadIcon,
  FilterIcon,
} from '@/components/Icons';
import {
  mockTransactions,
  mockSuppliers,
  mockEmployees,
  formatCurrency,
  getExpenseCategoryLabel,
  ExpenseCategory,
} from '@/lib/data';

const expenseCategories: ExpenseCategory[] = [
  'funcionario',
  'fornecedor',
  'insumo',
  'aluguel',
  'energia',
  'agua',
  'manutencao',
  'imposto',
  'outro',
];

const categoryColors: Record<ExpenseCategory, { bg: string; text: string }> = {
  funcionario: { bg: 'bg-blue-100', text: 'text-blue-600' },
  fornecedor: { bg: 'bg-purple-100', text: 'text-purple-600' },
  insumo: { bg: 'bg-amber-100', text: 'text-amber-600' },
  aluguel: { bg: 'bg-rose-100', text: 'text-rose-600' },
  energia: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  agua: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  manutencao: { bg: 'bg-orange-100', text: 'text-orange-600' },
  imposto: { bg: 'bg-red-100', text: 'text-red-600' },
  outro: { bg: 'bg-slate-100', text: 'text-slate-600' },
};

export default function SaidasPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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

  // Filter expense transactions (type === 'saida')
  const expenseTransactions = mockTransactions.filter(t => t.type === 'saida');

  const filteredTransactions = expenseTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || t.category === categoryFilter;
    const matchesStatus = !statusFilter || t.status === statusFilter;
    const matchesDate = !dateFilter || t.createdAt.startsWith(dateFilter);
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const totalExpenses = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const paidExpenses = filteredTransactions.filter(t => t.status === 'pago').reduce((sum, t) => sum + t.amount, 0);
  const pendingExpenses = filteredTransactions.filter(t => t.status === 'pendente').reduce((sum, t) => sum + t.amount, 0);
  const overdueExpenses = filteredTransactions.filter(t => t.status === 'atrasado').reduce((sum, t) => sum + t.amount, 0);

  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return null;
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    return supplier?.name;
  };

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return null;
    const employee = mockEmployees.find(e => e.id === employeeId);
    return employee?.name;
  };

  // Expenses by category for pie chart
  const expensesByCategory = filteredTransactions.reduce((acc, t) => {
    const category = t.category as ExpenseCategory;
    if (!acc[category]) acc[category] = 0;
    acc[category] += t.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const totalForPie = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

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
              <span className="text-slate-800">Saidas</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Saidas</h1>
            <p className="text-slate-500 mt-1">Gerenciamento de despesas e gastos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3"
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-slate-700 rounded-lg hover:bg-rose-50 transition-colors">
              <DownloadIcon className="w-5 h-5" />
              Exportar
            </button>
            <Link
              href="/financeiro/saidas/nova"
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nova Saida
            </Link>
          </motion.div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm mb-1">Total de Saidas</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <ArrowDownIcon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <p className="text-sm text-slate-500 mb-1">Pagas</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(paidExpenses)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {filteredTransactions.filter(t => t.status === 'pago').length} transacoes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <p className="text-sm text-slate-500 mb-1">Pendentes</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(pendingExpenses)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {filteredTransactions.filter(t => t.status === 'pendente').length} transacoes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <p className="text-sm text-slate-500 mb-1">Atrasadas</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueExpenses)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {filteredTransactions.filter(t => t.status === 'atrasado').length} transacoes
            </p>
          </motion.div>
        </div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Distribuicao por Categoria</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = totalForPie > 0 ? ((amount / totalForPie) * 100).toFixed(1) : 0;
                const colors = categoryColors[category as ExpenseCategory];
                return (
                  <div
                    key={category}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg}`}
                  >
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {getExpenseCategoryLabel(category as ExpenseCategory)}
                    </span>
                    <span className={`text-xs ${colors.text}`}>
                      {formatCurrency(amount)} ({percentage}%)
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por descricao..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | '')}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Todas Categorias</option>
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{getExpenseCategoryLabel(cat)}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Todos Status</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
              </select>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Descricao</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Categoria</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Vinculo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Vencimento</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction, idx) => {
                  const colors = categoryColors[transaction.category as ExpenseCategory] || categoryColors.outro;
                  const supplierName = getSupplierName(transaction.supplierId);
                  const employeeName = getEmployeeName(transaction.employeeId);

                  return (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + idx * 0.03 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
                            <ExpenseIcon className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          <p className="text-sm font-medium text-slate-800">{transaction.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                          {getExpenseCategoryLabel(transaction.category as ExpenseCategory)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {supplierName || employeeName || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {transaction.dueDate
                            ? new Date(transaction.dueDate).toLocaleDateString('pt-BR')
                            : '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'pago'
                            ? 'bg-green-100 text-green-600'
                            : transaction.status === 'atrasado'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {transaction.status === 'pago' ? 'Pago' :
                           transaction.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-semibold text-red-600">
                          -{formatCurrency(transaction.amount)}
                        </p>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <ExpenseIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhuma saida encontrada</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

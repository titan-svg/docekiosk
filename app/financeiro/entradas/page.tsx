'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  IncomeIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  ArrowUpIcon,
  EyeIcon,
  DownloadIcon,
  SalesIcon,
} from '@/components/Icons';
import {
  mockTransactions,
  mockSales,
  mockKiosks,
  formatCurrency,
  formatDateTime,
} from '@/lib/data';

export default function EntradasPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
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

  // Filter income transactions (type === 'entrada')
  const incomeTransactions = mockTransactions.filter(t => t.type === 'entrada');

  const filteredTransactions = incomeTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || t.createdAt.startsWith(dateFilter);
    const matchesKiosk = !kioskFilter || t.kioskId === kioskFilter;
    return matchesSearch && matchesDate && matchesKiosk;
  });

  const totalIncome = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Get sale details for each income
  const getSaleDetails = (saleId?: string) => {
    if (!saleId) return null;
    return mockSales.find(s => s.id === saleId);
  };

  const getKioskName = (kioskId: string) => {
    const kiosk = mockKiosks.find(k => k.id === kioskId);
    return kiosk?.name || 'Quiosque desconhecido';
  };

  // Group by date for summary
  const incomeByDate = filteredTransactions.reduce((acc, t) => {
    const date = t.createdAt.split('T')[0];
    if (!acc[date]) acc[date] = 0;
    acc[date] += t.amount;
    return acc;
  }, {} as Record<string, number>);

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
              <span className="text-slate-800">Entradas</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Entradas</h1>
            <p className="text-slate-500 mt-1">Receitas provenientes de vendas</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-slate-700 rounded-lg hover:bg-rose-50 transition-colors">
              <DownloadIcon className="w-5 h-5" />
              Exportar
            </button>
          </motion.div>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1">Total de Entradas</p>
              <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
              <p className="text-green-100 text-sm mt-2">
                {filteredTransactions.length} transacoes
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <ArrowUpIcon className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
            <div className="flex gap-4">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <select
                value={kioskFilter}
                onChange={(e) => setKioskFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Todos os Quiosques</option>
                {mockKiosks.filter(k => k.active).map(kiosk => (
                  <option key={kiosk.id} value={kiosk.id}>{kiosk.name}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {Object.entries(incomeByDate)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 5)
            .map(([date, amount], idx) => (
              <div
                key={date}
                className="bg-white rounded-xl p-4 shadow-sm border border-rose-100"
              >
                <p className="text-sm text-slate-500 mb-1">
                  {new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                </p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(amount)}</p>
              </div>
            ))}
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Data/Hora</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Descricao</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Quiosque</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Pagamento</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Valor</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction, idx) => {
                  const sale = getSaleDetails(transaction.saleId);
                  return (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-800">{formatDateTime(transaction.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <SalesIcon className="w-4 h-4 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{transaction.description}</p>
                            {sale && (
                              <p className="text-xs text-slate-500">
                                {sale.items.length} itens - {sale.paymentMethod}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{getKioskName(transaction.kioskId)}</p>
                      </td>
                      <td className="px-6 py-4">
                        {sale && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            sale.paymentMethod === 'pix' ? 'bg-purple-100 text-purple-600' :
                            sale.paymentMethod === 'credito' ? 'bg-blue-100 text-blue-600' :
                            sale.paymentMethod === 'debito' ? 'bg-cyan-100 text-cyan-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {sale.paymentMethod === 'pix' ? 'PIX' :
                             sale.paymentMethod === 'credito' ? 'Credito' :
                             sale.paymentMethod === 'debito' ? 'Debito' : 'Dinheiro'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-semibold text-green-600">
                          +{formatCurrency(transaction.amount)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sale && (
                          <Link
                            href={`/pdv/vendas/${sale.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                            Ver
                          </Link>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <IncomeIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhuma entrada encontrada</p>
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

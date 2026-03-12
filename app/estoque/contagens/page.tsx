'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  CountIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  CalendarIcon,
  EyeIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@/components/Icons';
import {
  mockStockCounts,
  formatDate,
  getUnitLabel,
  StockCount,
} from '@/lib/data';

export default function ContagensPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCounts = mockStockCounts.filter(count => {
    const matchesSearch = count.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         count.countedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || count.countedAt === dateFilter;
    return matchesSearch && matchesDate;
  });

  // Group counts by date
  const countsByDate = filteredCounts.reduce((acc, count) => {
    const date = count.countedAt;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(count);
    return acc;
  }, {} as Record<string, StockCount[]>);

  const uniqueDates = [...new Set(mockStockCounts.map(c => c.countedAt))].sort().reverse();

  const totalCounts = mockStockCounts.length;
  const totalConsumed = mockStockCounts.reduce((sum, c) => sum + c.consumed, 0);
  const avgConsumption = totalCounts > 0 ? (totalConsumed / totalCounts).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-800"
            >
              Contagens de Estoque
            </motion.h1>
            <p className="text-slate-500 mt-1">
              Historico de todas as contagens realizadas
            </p>
          </div>

          <Link
            href="/estoque/contagens/nova"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors w-fit"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nova Contagem</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <CountIcon className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de Contagens</p>
                <p className="text-2xl font-bold text-slate-800">{totalCounts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <ArrowDownIcon className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Consumido</p>
                <p className="text-2xl font-bold text-amber-600">{totalConsumed} un</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Media Consumo/Contagem</p>
                <p className="text-2xl font-bold text-slate-800">{avgConsumption}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por produto ou responsavel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-slate-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Todas as Datas</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{formatDate(date)}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Counts List */}
        <div className="space-y-6">
          {Object.entries(countsByDate).sort(([a], [b]) => b.localeCompare(a)).map(([date, counts], dateIdx) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * dateIdx }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{formatDate(date)}</h3>
                  <p className="text-sm text-slate-500">{counts.length} contagens</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Estoque Anterior
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Estoque Atual
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Consumo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Responsavel
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {counts.map((count, idx) => (
                        <motion.tr
                          key={count.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.05 * idx }}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <CountIcon className="w-5 h-5 text-pink-500" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{count.productName}</p>
                                <p className="text-sm text-slate-500">{getUnitLabel(count.unit)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-slate-600">{count.previousStock} {getUnitLabel(count.unit)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-medium text-slate-800">{count.currentStock} {getUnitLabel(count.unit)}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <ArrowDownIcon className="w-4 h-4 text-amber-500" />
                              <span className="text-amber-600 font-medium">{count.consumed} {getUnitLabel(count.unit)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-slate-600">{count.countedBy}</span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCounts.length === 0 && (
          <div className="text-center py-12">
            <CountIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma contagem encontrada</h3>
            <p className="text-slate-500 mb-6">Realize sua primeira contagem de estoque</p>
            <Link
              href="/estoque/contagens/nova"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nova Contagem</span>
            </Link>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  EntryIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  CalendarIcon,
  SupplierIcon,
  EyeIcon,
} from '@/components/Icons';
import {
  mockStockEntries,
  mockSuppliers,
  formatDate,
  formatCurrency,
  getUnitLabel,
  StockEntry,
} from '@/lib/data';

export default function EntradasPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
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

  const filteredEntries = mockStockEntries.filter(entry => {
    const matchesSearch = entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.invoiceNumber && entry.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSupplier = supplierFilter === 'all' || entry.supplierId === supplierFilter;
    const matchesDate = !dateFilter || entry.entryDate === dateFilter;
    return matchesSearch && matchesSupplier && matchesDate;
  });

  // Group entries by date
  const entriesByDate = filteredEntries.reduce((acc, entry) => {
    const date = entry.entryDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, StockEntry[]>);

  const uniqueDates = [...new Set(mockStockEntries.map(e => e.entryDate))].sort().reverse();

  const totalEntries = mockStockEntries.length;
  const totalValue = mockStockEntries.reduce((sum, e) => sum + e.totalPrice, 0);
  const totalQuantity = mockStockEntries.reduce((sum, e) => sum + e.quantity, 0);

  // Calculate weighted average price
  const avgPrice = totalQuantity > 0 ? totalValue / totalQuantity : 0;

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-800"
            >
              Entradas de Estoque
            </motion.h1>
            <p className="text-slate-500 mt-1">
              Historico de compras e recebimentos de fornecedores
            </p>
          </div>

          <Link
            href="/estoque/entradas/nova"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors w-fit"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nova Entrada</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <EntryIcon className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de Entradas</p>
                <p className="text-2xl font-bold text-slate-800">{totalEntries}</p>
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <SupplierIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
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
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Quantidade Total</p>
                <p className="text-2xl font-bold text-slate-800">{totalQuantity.toFixed(1)} un</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <EntryIcon className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Preco Medio Pond.</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(avgPrice)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por produto, fornecedor ou NF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Supplier Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-slate-400" />
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">Todos Fornecedores</option>
                {mockSuppliers.filter(s => s.active).map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
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
        </motion.div>

        {/* Entries List */}
        <div className="space-y-6">
          {Object.entries(entriesByDate).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries], dateIdx) => {
            const dateTotal = entries.reduce((sum, e) => sum + e.totalPrice, 0);

            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * dateIdx }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{formatDate(date)}</h3>
                      <p className="text-sm text-slate-500">{entries.length} entradas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total do Dia</p>
                    <p className="font-semibold text-green-600">{formatCurrency(dateTotal)}</p>
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
                            Fornecedor
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Qtd
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Preco Unit.
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            NF
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Responsavel
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {entries.map((entry, idx) => (
                          <motion.tr
                            key={entry.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.05 * idx }}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <EntryIcon className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{entry.productName}</p>
                                  <p className="text-sm text-slate-500">{getUnitLabel(entry.unit)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <SupplierIcon className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">{entry.supplierName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="font-medium text-slate-800">{entry.quantity} {getUnitLabel(entry.unit)}</span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-slate-600">{formatCurrency(entry.unitPrice)}</span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="font-semibold text-green-600">{formatCurrency(entry.totalPrice)}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-slate-600">{entry.invoiceNumber || '-'}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-slate-600">{entry.createdBy}</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <EntryIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma entrada encontrada</h3>
            <p className="text-slate-500 mb-6">Registre sua primeira entrada de estoque</p>
            <Link
              href="/estoque/entradas/nova"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nova Entrada</span>
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

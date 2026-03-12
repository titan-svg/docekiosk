'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  SalesIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  CalendarIcon,
  PrintIcon,
} from '@/components/Icons';
import {
  mockSales,
  mockKiosks,
  formatCurrency,
  formatDateTime,
  PaymentMethod,
} from '@/lib/data';

const paymentMethodLabels: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  debito: 'Debito',
  credito: 'Credito',
};

const paymentMethodColors: Record<PaymentMethod, string> = {
  dinheiro: 'bg-green-100 text-green-700',
  pix: 'bg-purple-100 text-purple-700',
  debito: 'bg-blue-100 text-blue-700',
  credito: 'bg-amber-100 text-amber-700',
};

export default function VendasPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState<PaymentMethod | 'all'>('all');
  const [filterKiosk, setFilterKiosk] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const filteredSales = useMemo(() => {
    return mockSales.filter(sale => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesId = sale.id.toLowerCase().includes(search);
        const matchesOperator = sale.operatorName.toLowerCase().includes(search);
        const matchesProduct = sale.items.some(item =>
          item.productName.toLowerCase().includes(search)
        );
        if (!matchesId && !matchesOperator && !matchesProduct) return false;
      }

      // Payment method filter
      if (filterPayment !== 'all' && sale.paymentMethod !== filterPayment) return false;

      // Kiosk filter
      if (filterKiosk !== 'all' && sale.kioskId !== filterKiosk) return false;

      // Date filters
      if (filterDateFrom) {
        const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
        if (saleDate < filterDateFrom) return false;
      }
      if (filterDateTo) {
        const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
        if (saleDate > filterDateTo) return false;
      }

      return true;
    });
  }, [searchTerm, filterPayment, filterKiosk, filterDateFrom, filterDateTo]);

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = filteredSales.length;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center gap-3"
            >
              <SalesIcon className="w-8 h-8 text-rose-500" />
              Vendas
            </motion.h1>
            <p className="text-slate-500 mt-1">Historico de vendas do sistema</p>
          </div>
          <Link
            href="/pdv"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            Nova Venda
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <p className="text-sm text-slate-500 mb-1">Total de Vendas</p>
            <p className="text-3xl font-bold text-slate-800">{totalSales}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <p className="text-sm text-slate-500 mb-1">Receita Total</p>
            <p className="text-3xl font-bold text-rose-500">{formatCurrency(totalRevenue)}</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="w-5 h-5 text-slate-400" />
            <span className="font-medium text-slate-700">Filtros</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>

            {/* Payment Method */}
            <select
              value={filterPayment}
              onChange={e => setFilterPayment(e.target.value as PaymentMethod | 'all')}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            >
              <option value="all">Todas as Formas</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="pix">PIX</option>
              <option value="debito">Debito</option>
              <option value="credito">Credito</option>
            </select>

            {/* Kiosk */}
            <select
              value={filterKiosk}
              onChange={e => setFilterKiosk(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            >
              <option value="all">Todos os Quiosques</option>
              {mockKiosks.map(kiosk => (
                <option key={kiosk.id} value={kiosk.id}>
                  {kiosk.name}
                </option>
              ))}
            </select>

            {/* Date From */}
            <div className="relative">
              <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={filterDateFrom}
                onChange={e => setFilterDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>

            {/* Date To */}
            <div className="relative">
              <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={filterDateTo}
                onChange={e => setFilterDateTo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>
        </motion.div>

        {/* Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Data/Hora</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Operador</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Quiosque</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Itens</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Peso</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Pagamento</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Total</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                      Nenhuma venda encontrada
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, idx) => {
                    const kiosk = mockKiosks.find(k => k.id === sale.kioskId);
                    return (
                      <motion.tr
                        key={sale.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="hover:bg-rose-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">#{sale.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{formatDateTime(sale.createdAt)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{sale.operatorName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{kiosk?.location || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{sale.items.length}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {sale.weight ? `${sale.weight.toFixed(2)} kg` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${paymentMethodColors[sale.paymentMethod]}`}>
                            {paymentMethodLabels[sale.paymentMethod]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-rose-500 text-right">
                          {formatCurrency(sale.total)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/pdv/vendas/${sale.id}`}
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                              title="Ver detalhes"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Link>
                            <button
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                              title="Imprimir"
                            >
                              <PrintIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
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

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  SalesIcon,
  ChevronRightIcon,
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  KioskIcon,
  TrendIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@/components/Icons';
import { mockSales, mockKiosks, getSalesTrend, getTopProducts, formatCurrency } from '@/lib/data';

export default function RelatorioVendasPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '2026-03-01', end: '2026-03-12' });
  const [kioskFilter, setKioskFilter] = useState('');

  const salesTrend = getSalesTrend();
  const topProducts = getTopProducts();

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

  const filteredSales = mockSales.filter(sale => {
    const matchesKiosk = !kioskFilter || sale.kioskId === kioskFilter;
    return matchesKiosk;
  });

  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  const handleExportPDF = () => {
    alert('Exportando relatorio em PDF... (simulacao)');
  };

  const handleExportExcel = () => {
    alert('Exportando relatorio em Excel... (simulacao)');
  };

  // Payment method breakdown
  const paymentMethods = {
    pix: filteredSales.filter(s => s.paymentMethod === 'pix').length,
    credito: filteredSales.filter(s => s.paymentMethod === 'credito').length,
    debito: filteredSales.filter(s => s.paymentMethod === 'debito').length,
    dinheiro: filteredSales.filter(s => s.paymentMethod === 'dinheiro').length,
  };

  const paymentTotal = Object.values(paymentMethods).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
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
          <span className="text-slate-800">Vendas</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Relatorio de Vendas</h1>
            <p className="text-slate-500 mt-1">Analise detalhada do desempenho de vendas</p>
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <SalesIcon className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Vendas</p>
                  <p className="text-xl font-bold text-slate-800">{totalSales}</p>
                </div>
              </div>
              <span className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                12%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendIcon className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Receita Total</p>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
              <span className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                8%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <SalesIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Ticket Medio</p>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(avgTicket)}</p>
                </div>
              </div>
              <span className="flex items-center text-sm text-red-500 font-medium">
                <ArrowDownIcon className="w-4 h-4 mr-1" />
                3%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Tendencia de Vendas</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {salesTrend.map((day, idx) => {
                const maxRevenue = Math.max(...salesTrend.map(d => d.revenue));
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex justify-center relative group">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="w-8 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-lg min-h-[20px] cursor-pointer hover:from-rose-600 hover:to-pink-500"
                        style={{ height: `${height}%` }}
                      />
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {formatCurrency(day.revenue)}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{day.date}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Payment Methods Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Formas de Pagamento</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">PIX</span>
                  <span className="font-medium text-slate-800">{paymentMethods.pix} ({Math.round((paymentMethods.pix / paymentTotal) * 100)}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(paymentMethods.pix / paymentTotal) * 100}%` }}
                    transition={{ delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Credito</span>
                  <span className="font-medium text-slate-800">{paymentMethods.credito} ({Math.round((paymentMethods.credito / paymentTotal) * 100)}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(paymentMethods.credito / paymentTotal) * 100}%` }}
                    transition={{ delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Debito</span>
                  <span className="font-medium text-slate-800">{paymentMethods.debito} ({Math.round((paymentMethods.debito / paymentTotal) * 100)}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(paymentMethods.debito / paymentTotal) * 100}%` }}
                    transition={{ delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Dinheiro</span>
                  <span className="font-medium text-slate-800">{paymentMethods.dinheiro} ({Math.round((paymentMethods.dinheiro / paymentTotal) * 100)}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(paymentMethods.dinheiro / paymentTotal) * 100}%` }}
                    transition={{ delay: 0.9 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Produtos Mais Vendidos</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">#</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Vendas</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Receita</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Participacao</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, idx) => {
                  const totalTopRevenue = topProducts.reduce((sum, p) => sum + p.revenue, 0);
                  const percentage = (product.revenue / totalTopRevenue) * 100;
                  return (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-pink-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-xs font-bold text-rose-600">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{product.name}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{product.sales}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">{formatCurrency(product.revenue)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: 0.7 + idx * 0.1 }}
                              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-12">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

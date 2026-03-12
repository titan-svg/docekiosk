'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  InventoryIcon,
  ChevronRightIcon,
  DownloadIcon,
  FilterIcon,
  KioskIcon,
  WarningIcon,
  TrendIcon,
  ArrowDownIcon,
} from '@/components/Icons';
import { mockProducts, mockStockCounts, mockStockAlerts, mockKiosks, getCategoryLabel, formatCurrency } from '@/lib/data';

export default function RelatorioEstoquePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState('');
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

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesCategory;
  });

  const totalStockValue = filteredProducts.reduce((sum, p) => sum + (p.stockCurrent * p.cost), 0);
  const totalItems = filteredProducts.reduce((sum, p) => sum + p.stockCurrent, 0);
  const lowStockItems = mockStockAlerts.filter(a => a.status === 'baixo').length;
  const criticalStockItems = mockStockAlerts.filter(a => a.status === 'critico').length;

  // Consumption analysis from stock counts
  const consumptionByProduct = mockStockCounts.reduce((acc, count) => {
    acc[count.productName] = (acc[count.productName] || 0) + count.consumed;
    return acc;
  }, {} as Record<string, number>);

  const topConsumed = Object.entries(consumptionByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleExportPDF = () => {
    alert('Exportando relatorio em PDF... (simulacao)');
  };

  const handleExportExcel = () => {
    alert('Exportando relatorio em Excel... (simulacao)');
  };

  // Category breakdown
  const categoryBreakdown = filteredProducts.reduce((acc, product) => {
    const category = getCategoryLabel(product.category);
    if (!acc[category]) {
      acc[category] = { count: 0, value: 0 };
    }
    acc[category].count += product.stockCurrent;
    acc[category].value += product.stockCurrent * product.cost;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const maxCategoryValue = Math.max(...Object.values(categoryBreakdown).map(c => c.value));

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
          <span className="text-slate-800">Estoque</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Relatorio de Estoque</h1>
            <p className="text-slate-500 mt-1">Analise de consumo e posicao de estoque</p>
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
              <label className="block text-sm font-medium text-slate-600 mb-1">Categoria</label>
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
                >
                  <option value="">Todas as Categorias</option>
                  <option value="sorvete">Sorvetes</option>
                  <option value="acai">Acai</option>
                  <option value="fruta">Frutas</option>
                  <option value="chocolate">Chocolates</option>
                  <option value="topping">Toppings</option>
                </select>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <InventoryIcon className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Valor em Estoque</p>
                <p className="text-xl font-bold text-slate-800">{formatCurrency(totalStockValue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <InventoryIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de Itens</p>
                <p className="text-xl font-bold text-slate-800">{totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <WarningIcon className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estoque Baixo</p>
                <p className="text-xl font-bold text-slate-800">{lowStockItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <WarningIcon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estoque Critico</p>
                <p className="text-xl font-bold text-slate-800">{criticalStockItems}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Estoque por Categoria</h2>
            <div className="space-y-4">
              {Object.entries(categoryBreakdown).map(([category, data], idx) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{category}</span>
                    <span className="font-medium text-slate-800">{formatCurrency(data.value)}</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.value / maxCategoryValue) * 100}%` }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Consumption Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Maior Consumo (Ultimos 7 dias)</h2>
            {topConsumed.length > 0 ? (
              <div className="space-y-3">
                {topConsumed.map(([name, consumed], idx) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-xs font-bold text-rose-600">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(consumed / topConsumed[0][1]) * 100}%` }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{consumed}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Sem dados de consumo</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Alertas de Estoque</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Quiosque</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Atual</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Minimo</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {mockStockAlerts.map((alert, idx) => {
                  const percentage = (alert.currentStock / alert.minimumStock) * 100;
                  return (
                    <motion.tr
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                      className="border-b border-slate-50 hover:bg-pink-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-800">{alert.productName}</td>
                      <td className="py-3 px-4 text-slate-600">{alert.kioskName}</td>
                      <td className="py-3 px-4 text-center text-slate-800">{alert.currentStock} {alert.unit}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{alert.minimumStock} {alert.unit}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alert.status === 'critico'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}>
                            {alert.status === 'critico' ? 'Critico' : 'Baixo'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                alert.status === 'critico' ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-10">{percentage.toFixed(0)}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Product Stock List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Posicao de Estoque Completa</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Categoria</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Estoque</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Minimo</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Custo Unit.</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.slice(0, 10).map((product, idx) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.03 }}
                    className="border-b border-slate-50 hover:bg-pink-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-800">{product.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        product.stockCurrent <= product.stockMin ? 'text-red-600' : 'text-slate-800'
                      }`}>
                        {product.stockCurrent}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">{product.stockMin}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(product.cost)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      {formatCurrency(product.stockCurrent * product.cost)}
                    </td>
                  </motion.tr>
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

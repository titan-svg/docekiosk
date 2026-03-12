'use client';

import { motion } from 'framer-motion';
import AppLayout from '@/components/AppLayout';
import {
  SalesIcon,
  FinanceIcon,
  InventoryIcon,
  AlertIcon,
  TrendIcon,
  ArrowUpIcon,
  WarningIcon,
  PDVIcon,
  CountIcon,
  ExpenseIcon,
} from '@/components/Icons';
import {
  getDashboardStats,
  getSalesTrend,
  getTopProducts,
  getPeakHours,
  mockStockAlerts,
  mockTransactions,
  formatCurrency,
} from '@/lib/data';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = getDashboardStats();
  const salesTrend = getSalesTrend();
  const topProducts = getTopProducts();
  const peakHours = getPeakHours();

  const pendingBills = mockTransactions.filter(
    t => t.type === 'saida' && (t.status === 'pendente' || t.status === 'atrasado')
  ).slice(0, 5);

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800"
        >
          Olá, {user?.name.split(' ')[0]}!
        </motion.h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Confira o resumo do seu negócio hoje, {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <SalesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
            </div>
            <span className="hidden sm:flex items-center text-sm text-green-500 font-medium">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              12%
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Vendas Hoje</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats.todaySales}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FinanceIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <span className="hidden sm:flex items-center text-sm text-green-500 font-medium">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              8%
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Receita Hoje</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800">{formatCurrency(stats.todayRevenue)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            </div>
            {stats.criticalStockCount > 0 && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-600 text-[10px] sm:text-xs font-medium rounded-full">
                {stats.criticalStockCount} crítico
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Alertas Estoque</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats.lowStockCount + stats.criticalStockCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <InventoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Quiosques</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats.activeKiosks}</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">Tendência de Vendas</h2>
            <div className="flex items-center gap-2">
              <TrendIcon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
              <span className="text-xs sm:text-sm text-slate-500">Últimos 7 dias</span>
            </div>
          </div>
          <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
            {salesTrend.map((day, idx) => {
              const maxRevenue = Math.max(...salesTrend.map(d => d.revenue));
              const height = (day.revenue / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                  <div className="w-full flex justify-center h-full items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="w-full max-w-8 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-lg"
                      style={{ minHeight: '20px' }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500">{day.date}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Mais Vendidos</h2>
          <div className="space-y-3 sm:space-y-4">
            {topProducts.slice(0, 4).map((product, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-100 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-rose-600 shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">{product.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">{product.sales} vendas</p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 shrink-0">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts and Bills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
        {/* Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">Alertas de Estoque</h2>
            <Link href="/estoque/alertas" className="text-xs sm:text-sm text-rose-500 hover:text-rose-600 font-medium">
              Ver todos
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {mockStockAlerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                  alert.status === 'critico' ? 'bg-red-50' : 'bg-amber-50'
                }`}
              >
                <WarningIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    alert.status === 'critico' ? 'text-red-500' : 'text-amber-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">{alert.productName}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    {alert.currentStock}/{alert.minimumStock} {alert.unit}
                  </p>
                </div>
                <span
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full shrink-0 ${
                    alert.status === 'critico'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {alert.status === 'critico' ? 'Crítico' : 'Baixo'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Bills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">Contas a Pagar</h2>
            <Link href="/financeiro/contas-pagar" className="text-xs sm:text-sm text-rose-500 hover:text-rose-600 font-medium">
              Ver todas
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {pendingBills.slice(0, 3).map(bill => (
              <div
                key={bill.id}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                  bill.status === 'atrasado' ? 'bg-red-50' : 'bg-slate-50'
                }`}
              >
                <ExpenseIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                    bill.status === 'atrasado' ? 'text-red-500' : 'text-slate-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">{bill.description}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    Vence: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 shrink-0">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Peak Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="hidden sm:block bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-rose-100 mb-6 lg:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">Horários de Pico</h2>
          <span className="text-xs sm:text-sm text-slate-500">Média de vendas por hora</span>
        </div>
        <div className="h-24 sm:h-32 flex items-end justify-between gap-0.5 sm:gap-1">
          {peakHours.map((hour, idx) => {
            const maxSales = Math.max(...peakHours.map(h => h.sales));
            const height = (hour.sales / maxSales) * 100;
            const isPeak = hour.sales >= maxSales * 0.8;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 1 + idx * 0.05 }}
                  className={`w-full rounded-t ${isPeak ? 'bg-rose-500' : 'bg-rose-200'}`}
                  style={{ minHeight: '8px' }}
                />
                <span className="text-[8px] sm:text-[10px] text-slate-400">{hour.hour.split(':')[0]}h</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <Link
          href="/pdv"
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all"
        >
          <PDVIcon className="w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold truncate">Abrir PDV</p>
            <p className="text-[10px] sm:text-xs text-white/80 truncate">Nova venda</p>
          </div>
        </Link>

        <Link
          href="/estoque/contagens/nova"
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all"
        >
          <CountIcon className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">Contagem</p>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Atualizar estoque</p>
          </div>
        </Link>

        <Link
          href="/financeiro/saidas/nova"
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all"
        >
          <ExpenseIcon className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">Despesa</p>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Registrar saída</p>
          </div>
        </Link>

        <Link
          href="/relatorios/vendas"
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all"
        >
          <TrendIcon className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">Relatórios</p>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Ver análises</p>
          </div>
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-slate-400">
        <p>&copy; 2026 DoceKiosk. Sistema de Gestão de Quiosques de Sobremesas.</p>
      </footer>
    </AppLayout>
  );
}

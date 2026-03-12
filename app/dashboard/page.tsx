'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  SalesIcon,
  FinanceIcon,
  InventoryIcon,
  AlertIcon,
  TrendIcon,
  ArrowUpIcon,
  ArrowDownIcon,
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const stats = getDashboardStats();
  const salesTrend = getSalesTrend();
  const topProducts = getTopProducts();
  const peakHours = getPeakHours();

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

  const pendingBills = mockTransactions.filter(
    t => t.type === 'saida' && (t.status === 'pendente' || t.status === 'atrasado')
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-bold text-slate-800"
          >
            Olá, {user.name.split(' ')[0]}!
          </motion.h1>
          <p className="text-slate-500 mt-1">
            Confira o resumo do seu negócio hoje, {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <SalesIcon className="w-6 h-6 text-rose-500" />
              </div>
              <span className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                12%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Vendas Hoje</p>
            <p className="text-2xl font-bold text-slate-800">{stats.todaySales}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FinanceIcon className="w-6 h-6 text-green-500" />
              </div>
              <span className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                8%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Receita Hoje</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(stats.todayRevenue)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertIcon className="w-6 h-6 text-amber-500" />
              </div>
              {stats.criticalStockCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  {stats.criticalStockCount} crítico
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-1">Alertas de Estoque</p>
            <p className="text-2xl font-bold text-slate-800">{stats.lowStockCount + stats.criticalStockCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <InventoryIcon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Quiosques Ativos</p>
            <p className="text-2xl font-bold text-slate-800">{stats.activeKiosks}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Tendência de Vendas</h2>
              <div className="flex items-center gap-2">
                <TrendIcon className="w-5 h-5 text-rose-500" />
                <span className="text-sm text-slate-500">Últimos 7 dias</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {salesTrend.map((day, idx) => {
                const maxRevenue = Math.max(...salesTrend.map(d => d.revenue));
                const height = (day.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="w-8 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-lg min-h-[20px]"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{day.date}</span>
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
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Produtos Mais Vendidos</h2>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-xs font-bold text-rose-600">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sales} vendas</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Alertas de Estoque</h2>
              <Link href="/estoque/alertas" className="text-sm text-rose-500 hover:text-rose-600 font-medium">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {mockStockAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    alert.status === 'critico' ? 'bg-red-50' : 'bg-amber-50'
                  }`}
                >
                  <WarningIcon
                    className={`w-5 h-5 ${
                      alert.status === 'critico' ? 'text-red-500' : 'text-amber-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{alert.productName}</p>
                    <p className="text-xs text-slate-500">
                      Atual: {alert.currentStock} {alert.unit} | Mín: {alert.minimumStock} {alert.unit}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
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
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Contas a Pagar</h2>
              <Link href="/financeiro/contas-pagar" className="text-sm text-rose-500 hover:text-rose-600 font-medium">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {pendingBills.map(bill => (
                <div
                  key={bill.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    bill.status === 'atrasado' ? 'bg-red-50' : 'bg-slate-50'
                  }`}
                >
                  <ExpenseIcon
                    className={`w-5 h-5 ${
                      bill.status === 'atrasado' ? 'text-red-500' : 'text-slate-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{bill.description}</p>
                    <p className="text-xs text-slate-500">
                      Vencimento: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
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
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Horários de Pico</h2>
            <span className="text-sm text-slate-500">Média de vendas por hora</span>
          </div>
          <div className="h-32 flex items-end justify-between gap-1">
            {peakHours.map((hour, idx) => {
              const maxSales = Math.max(...peakHours.map(h => h.sales));
              const height = (hour.sales / maxSales) * 100;
              const isPeak = hour.sales >= maxSales * 0.8;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 1 + idx * 0.05 }}
                    className={`w-full rounded-t ${isPeak ? 'bg-rose-500' : 'bg-rose-200'}`}
                    style={{ height: `${height}%`, minHeight: '8px' }}
                  />
                  <span className="text-[10px] text-slate-400">{hour.hour.split(':')[0]}h</span>
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Link
            href="/pdv"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all card-hover"
          >
            <PDVIcon className="w-8 h-8" />
            <div>
              <p className="font-semibold">Abrir PDV</p>
              <p className="text-xs text-white/80">Nova venda</p>
            </div>
          </Link>

          <Link
            href="/estoque/contagens/nova"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all card-hover"
          >
            <CountIcon className="w-8 h-8 text-rose-500" />
            <div>
              <p className="font-semibold text-slate-800">Nova Contagem</p>
              <p className="text-xs text-slate-500">Atualizar estoque</p>
            </div>
          </Link>

          <Link
            href="/financeiro/saidas/nova"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all card-hover"
          >
            <ExpenseIcon className="w-8 h-8 text-rose-500" />
            <div>
              <p className="font-semibold text-slate-800">Nova Despesa</p>
              <p className="text-xs text-slate-500">Registrar saída</p>
            </div>
          </Link>

          <Link
            href="/relatorios/vendas"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all card-hover"
          >
            <TrendIcon className="w-8 h-8 text-rose-500" />
            <div>
              <p className="font-semibold text-slate-800">Relatórios</p>
              <p className="text-xs text-slate-500">Ver análises</p>
            </div>
          </Link>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestão de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

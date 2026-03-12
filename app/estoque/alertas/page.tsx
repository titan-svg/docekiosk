'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  AlertIcon,
  WarningIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EntryIcon,
  SupplierIcon,
  CheckIcon,
} from '@/components/Icons';
import {
  mockStockAlerts,
  mockProducts,
  mockSuppliers,
  formatDate,
  formatCurrency,
  getUnitLabel,
  getSupplierById,
  getProductById,
  StockAlert,
} from '@/lib/data';

export default function AlertasPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'baixo' | 'critico'>('all');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

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

  const filteredAlerts = mockStockAlerts.filter(alert => {
    const matchesSearch = alert.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.kioskName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const criticalAlerts = mockStockAlerts.filter(a => a.status === 'critico');
  const lowAlerts = mockStockAlerts.filter(a => a.status === 'baixo');

  const toggleAlert = (alertId: string) => {
    setSelectedAlerts(prev => {
      if (prev.includes(alertId)) {
        return prev.filter(id => id !== alertId);
      }
      return [...prev, alertId];
    });
  };

  const selectAllCritical = () => {
    const criticalIds = criticalAlerts.map(a => a.id);
    setSelectedAlerts(criticalIds);
  };

  // Calculate estimated restock cost
  const calculateRestockCost = (alert: StockAlert) => {
    const product = getProductById(alert.productId);
    if (!product) return 0;
    const neededQuantity = alert.minimumStock * 2 - alert.currentStock; // Restock to 2x minimum
    return neededQuantity * product.cost;
  };

  const totalRestockCost = selectedAlerts.reduce((sum, alertId) => {
    const alert = mockStockAlerts.find(a => a.id === alertId);
    return alert ? sum + calculateRestockCost(alert) : sum;
  }, 0);

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
              Alertas de Estoque
            </motion.h1>
            <p className="text-slate-500 mt-1">
              Produtos que precisam de reposicao
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/estoque/entradas/nova"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nova Entrada</span>
            </Link>
          </div>
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
                <AlertIcon className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de Alertas</p>
                <p className="text-2xl font-bold text-slate-800">{mockStockAlerts.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-red-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <WarningIcon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Alertas Criticos</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-amber-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertIcon className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estoque Baixo</p>
                <p className="text-2xl font-bold text-amber-600">{lowAlerts.length}</p>
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
                placeholder="Buscar por produto ou quiosque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'baixo' | 'critico')}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="critico">Critico</option>
                <option value="baixo">Baixo</option>
              </select>
            </div>

            {/* Quick Actions */}
            <button
              onClick={selectAllCritical}
              className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Selecionar Criticos
            </button>
          </div>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert, idx) => {
            const product = getProductById(alert.productId);
            const supplier = product ? getSupplierById(product.supplierId) : null;
            const stockPercentage = (alert.currentStock / alert.minimumStock) * 100;
            const neededQuantity = alert.minimumStock * 2 - alert.currentStock;
            const restockCost = product ? neededQuantity * product.cost : 0;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden ${
                  alert.status === 'critico' ? 'border-red-200' : 'border-amber-200'
                } ${selectedAlerts.includes(alert.id) ? 'ring-2 ring-rose-500' : ''}`}
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Checkbox and Icon */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedAlerts.includes(alert.id)
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'border-slate-300 hover:border-rose-400'
                        }`}
                      >
                        {selectedAlerts.includes(alert.id) && <CheckIcon className="w-4 h-4" />}
                      </button>

                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        alert.status === 'critico' ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                        <WarningIcon className={`w-6 h-6 ${
                          alert.status === 'critico' ? 'text-red-500' : 'text-amber-500'
                        }`} />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800">{alert.productName}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          alert.status === 'critico'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {alert.status === 'critico' ? 'Critico' : 'Baixo'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{alert.kioskName}</p>

                      {/* Stock Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600">
                            {alert.currentStock} / {alert.minimumStock} {getUnitLabel(alert.unit)}
                          </span>
                          <span className={`font-medium ${
                            alert.status === 'critico' ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {stockPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className={`h-full rounded-full ${
                              alert.status === 'critico'
                                ? 'bg-gradient-to-r from-red-500 to-red-400'
                                : 'bg-gradient-to-r from-amber-500 to-amber-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Supplier Info */}
                    <div className="lg:text-right">
                      {supplier && (
                        <div className="flex lg:flex-col items-center lg:items-end gap-2">
                          <div className="flex items-center gap-2">
                            <SupplierIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{supplier.name}</span>
                          </div>
                          <span className="text-sm text-slate-500">{supplier.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Restock Info */}
                    <div className="lg:text-right bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Repor para 2x minimo</p>
                      <p className="text-sm font-medium text-slate-700">
                        +{neededQuantity.toFixed(1)} {getUnitLabel(alert.unit)}
                      </p>
                      <p className="text-lg font-bold text-rose-600">
                        {formatCurrency(restockCost)}
                      </p>
                    </div>

                    {/* Action */}
                    <Link
                      href="/estoque/entradas/nova"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors whitespace-nowrap"
                    >
                      <EntryIcon className="w-4 h-4" />
                      <span>Repor</span>
                    </Link>
                  </div>

                  {/* Alert Date */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Alerta criado em {formatDate(alert.createdAt)}</span>
                    <span className="text-slate-500">
                      Faltam {(alert.minimumStock - alert.currentStock).toFixed(1)} {getUnitLabel(alert.unit)} para minimo
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <CheckIcon className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum alerta ativo</h3>
            <p className="text-slate-500">Todos os produtos estao com estoque adequado</p>
          </div>
        )}

        {/* Selection Summary */}
        {selectedAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 lg:left-[280px] bg-white border-t border-rose-100 p-4 shadow-lg"
          >
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <AlertIcon className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{selectedAlerts.length} alertas selecionados</p>
                  <p className="text-sm text-slate-500">
                    Custo estimado de reposicao: <span className="font-bold text-rose-600">{formatCurrency(totalRestockCost)}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAlerts([])}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Limpar
                </button>
                <Link
                  href="/estoque/entradas/nova"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
                >
                  <EntryIcon className="w-4 h-4" />
                  <span>Criar Pedido</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {selectedAlerts.length > 0 && <div className="h-24"></div>}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

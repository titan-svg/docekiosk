'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  InventoryIcon,
  SearchIcon,
  FilterIcon,
  AlertIcon,
  PlusIcon,
  CountIcon,
  EntryIcon,
} from '@/components/Icons';
import {
  mockProducts,
  mockStockAlerts,
  formatCurrency,
  getCategoryLabel,
  getUnitLabel,
  Product,
  ProductCategory,
} from '@/lib/data';

export default function EstoquePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'critical' | 'ok'>('all');

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

  const getStockStatus = (product: Product) => {
    const percentage = (product.stockCurrent / product.stockMin) * 100;
    if (percentage <= 50) return 'critical';
    if (percentage <= 100) return 'low';
    return 'ok';
  };

  const getStockPercentage = (product: Product) => {
    const maxStock = product.stockMin * 3;
    return Math.min((product.stockCurrent / maxStock) * 100, 100);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const status = getStockStatus(product);
    const matchesStock = stockFilter === 'all' || status === stockFilter;
    return matchesSearch && matchesCategory && matchesStock && product.active;
  });

  const categories: ProductCategory[] = ['sorvete', 'acai', 'fruta', 'chocolate', 'topping'];

  const totalProducts = mockProducts.filter(p => p.active).length;
  const lowStockCount = mockProducts.filter(p => getStockStatus(p) === 'low' && p.active).length;
  const criticalStockCount = mockProducts.filter(p => getStockStatus(p) === 'critical' && p.active).length;
  const totalStockValue = mockProducts.reduce((sum, p) => sum + (p.stockCurrent * p.cost), 0);

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
              Estoque
            </motion.h1>
            <p className="text-slate-500 mt-1">
              Gerencie o estoque de todos os produtos
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/estoque/contagens/nova"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <CountIcon className="w-5 h-5" />
              <span>Nova Contagem</span>
            </Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <InventoryIcon className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de Produtos</p>
                <p className="text-2xl font-bold text-slate-800">{totalProducts}</p>
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
                <AlertIcon className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estoque Baixo</p>
                <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
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
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertIcon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estoque Critico</p>
                <p className="text-2xl font-bold text-red-600">{criticalStockCount}</p>
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <EntryIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Valor em Estoque</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalStockValue)}</p>
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
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">Todas Categorias</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'critical' | 'ok')}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="ok">Estoque OK</option>
              <option value="low">Estoque Baixo</option>
              <option value="critical">Estoque Critico</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, idx) => {
            const status = getStockStatus(product);
            const percentage = getStockPercentage(product);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx % 6) }}
                className="bg-white rounded-xl p-5 shadow-sm border border-rose-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">{product.name}</h3>
                    <p className="text-sm text-slate-500">{getCategoryLabel(product.category)}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      status === 'critical'
                        ? 'bg-red-100 text-red-600'
                        : status === 'low'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {status === 'critical' ? 'Critico' : status === 'low' ? 'Baixo' : 'OK'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Estoque Atual</span>
                    <span className="font-semibold text-slate-800">
                      {product.stockCurrent} {getUnitLabel(product.unit)}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        status === 'critical'
                          ? 'bg-gradient-to-r from-red-500 to-red-400'
                          : status === 'low'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                          : 'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Estoque Minimo</p>
                    <p className="font-medium text-slate-700">
                      {product.stockMin} {getUnitLabel(product.unit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Custo Unit.</p>
                    <p className="font-medium text-slate-700">{formatCurrency(product.cost)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Valor em Estoque</span>
                    <span className="font-semibold text-rose-600">
                      {formatCurrency(product.stockCurrent * product.cost)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <InventoryIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum produto encontrado</h3>
            <p className="text-slate-500">Tente ajustar os filtros de busca</p>
          </div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          <Link
            href="/estoque/contagens"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all"
          >
            <CountIcon className="w-8 h-8 text-rose-500" />
            <div>
              <p className="font-semibold text-slate-800">Contagens</p>
              <p className="text-sm text-slate-500">Historico de contagens</p>
            </div>
          </Link>

          <Link
            href="/estoque/entradas"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all"
          >
            <EntryIcon className="w-8 h-8 text-rose-500" />
            <div>
              <p className="font-semibold text-slate-800">Entradas</p>
              <p className="text-sm text-slate-500">Compras de fornecedores</p>
            </div>
          </Link>

          <Link
            href="/estoque/alertas"
            className="flex items-center gap-3 p-4 bg-white border border-rose-100 rounded-xl hover:border-rose-300 transition-all"
          >
            <AlertIcon className="w-8 h-8 text-amber-500" />
            <div>
              <p className="font-semibold text-slate-800">Alertas</p>
              <p className="text-sm text-slate-500">{mockStockAlerts.length} alertas ativos</p>
            </div>
          </Link>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

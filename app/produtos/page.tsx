'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  IceCreamIcon,
  AcaiIcon,
  FruitIcon,
  ChocolateIcon,
  ToppingIcon,
  ProductIcon,
  XIcon,
} from '@/components/Icons';
import {
  mockProducts,
  mockSuppliers,
  formatCurrency,
  getCategoryLabel,
  getUnitLabel,
  Product,
  ProductCategory,
} from '@/lib/data';

const categoryIcons: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  sorvete: IceCreamIcon,
  acai: AcaiIcon,
  fruta: FruitIcon,
  chocolate: ChocolateIcon,
  topping: ToppingIcon,
};

const categoryColors: Record<ProductCategory, string> = {
  sorvete: 'bg-pink-100 text-pink-600',
  acai: 'bg-purple-100 text-purple-600',
  fruta: 'bg-green-100 text-green-600',
  chocolate: 'bg-amber-100 text-amber-600',
  topping: 'bg-blue-100 text-blue-600',
};

export default function ProductsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.active) ||
      (statusFilter === 'inactive' && !product.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getSupplierName = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    return supplier?.name || 'N/A';
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const categories: ProductCategory[] = ['sorvete', 'acai', 'fruta', 'chocolate', 'topping'];

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Produtos</h1>
            <p className="text-slate-500 mt-1">Gerencie seu catalogo de produtos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/produtos/novo"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-medium shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Produto
            </Link>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 bg-white"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 bg-white"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Category Quick Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            onClick={() => setCategoryFilter('all')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <ProductIcon className="w-4 h-4" />
            Todos ({products.length})
          </button>
          {categories.map(cat => {
            const Icon = categoryIcons[cat];
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {getCategoryLabel(cat)} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Categoria</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Preco/Kg</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Custo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Estoque</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Fornecedor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-600">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  const Icon = categoryIcons[product.category];
                  const isLowStock = product.stockCurrent <= product.stockMin;
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[product.category]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-400">{getUnitLabel(product.unit)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[product.category]}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {getCategoryLabel(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {formatCurrency(product.pricePerKg)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatCurrency(product.cost)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-slate-700'}`}>
                            {product.stockCurrent} {getUnitLabel(product.unit)}
                          </span>
                          {isLowStock && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">Baixo</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {getSupplierName(product.supplierId)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {product.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/produtos/${product.id}`}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/produtos/${product.id}/editar`}
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <EditIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredProducts.map((product, idx) => {
              const Icon = categoryIcons[product.category];
              const isLowStock = product.stockCurrent <= product.stockMin;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[product.category]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-slate-800">{product.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${categoryColors[product.category]}`}>
                            {getCategoryLabel(product.category)}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {product.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-slate-400">Preco</p>
                          <p className="font-medium text-slate-700">{formatCurrency(product.pricePerKg)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Estoque</p>
                          <p className={`font-medium ${isLowStock ? 'text-red-600' : 'text-slate-700'}`}>
                            {product.stockCurrent} {getUnitLabel(product.unit)}
                            {isLowStock && <span className="text-xs text-red-500 ml-1">(Baixo)</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                        <Link
                          href={`/produtos/${product.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Ver
                        </Link>
                        <Link
                          href={`/produtos/${product.id}/editar`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <EditIcon className="w-4 h-4" />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <ProductIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum produto encontrado</h3>
              <p className="text-slate-400">Tente ajustar os filtros ou adicione um novo produto.</p>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-slate-500 text-center">
          Mostrando {filteredProducts.length} de {products.length} produtos
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && productToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Confirmar Exclusao</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                Tem certeza que deseja excluir o produto <strong>{productToDelete.name}</strong>? Esta acao nao pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

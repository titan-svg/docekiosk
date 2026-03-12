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
  SupplierIcon,
  IceCreamIcon,
  AcaiIcon,
  FruitIcon,
  ChocolateIcon,
  ToppingIcon,
  XIcon,
} from '@/components/Icons';
import {
  mockSuppliers,
  mockProducts,
  mockStockEntries,
  getCategoryLabel,
  formatCurrency,
  Supplier,
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

export default function SuppliersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

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

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.cnpj.includes(searchTerm) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.categories.includes(categoryFilter);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && supplier.active) ||
      (statusFilter === 'inactive' && !supplier.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getSupplierStats = (supplierId: string) => {
    const products = mockProducts.filter(p => p.supplierId === supplierId);
    const entries = mockStockEntries.filter(e => e.supplierId === supplierId);
    const totalPurchases = entries.reduce((sum, e) => sum + e.totalPrice, 0);
    return {
      products: products.length,
      purchases: entries.length,
      totalPurchases,
    };
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id));
      setShowDeleteModal(false);
      setSupplierToDelete(null);
    }
  };

  const categories: ProductCategory[] = ['sorvete', 'acai', 'fruta', 'chocolate', 'topping'];

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Fornecedores</h1>
            <p className="text-slate-500 mt-1">Gerencie seus parceiros de fornecimento</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/fornecedores/novo"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-medium shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Fornecedor
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
                  placeholder="Buscar por nome, CNPJ ou contato..."
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

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredSuppliers.map((supplier, idx) => {
            const stats = getSupplierStats(supplier.id);
            return (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  supplier.active ? 'border-rose-100' : 'border-slate-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                        {supplier.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{supplier.name}</h3>
                        <p className="text-sm text-slate-500">{supplier.cnpj}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      supplier.active
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {supplier.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {supplier.categories.map(cat => {
                      const Icon = categoryIcons[cat];
                      return (
                        <span
                          key={cat}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[cat]}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {getCategoryLabel(cat)}
                        </span>
                      );
                    })}
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-slate-400">Contato</p>
                      <p className="font-medium text-slate-700">{supplier.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Telefone</p>
                      <p className="font-medium text-slate-700">{supplier.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400">Cidade</p>
                      <p className="font-medium text-slate-700">{supplier.city} - {supplier.state}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 py-4 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-800">{stats.products}</p>
                      <p className="text-xs text-slate-500">Produtos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-800">{stats.purchases}</p>
                      <p className="text-xs text-slate-500">Compras</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800">{formatCurrency(stats.totalPurchases)}</p>
                      <p className="text-xs text-slate-500">Total</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <Link
                      href={`/fornecedores/${supplier.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver Detalhes
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(supplier)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredSuppliers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 shadow-sm border border-rose-100 text-center"
          >
            <SupplierIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhum fornecedor encontrado</h3>
            <p className="text-slate-400 mb-4">Tente ajustar os filtros ou adicione um novo fornecedor.</p>
            <Link
              href="/fornecedores/novo"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Fornecedor
            </Link>
          </motion.div>
        )}

        {/* Results Count */}
        {filteredSuppliers.length > 0 && (
          <div className="text-sm text-slate-500 text-center">
            Mostrando {filteredSuppliers.length} de {suppliers.length} fornecedores
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && supplierToDelete && (
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
                Tem certeza que deseja excluir o fornecedor <strong>{supplierToDelete.name}</strong>? Esta acao nao pode ser desfeita.
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

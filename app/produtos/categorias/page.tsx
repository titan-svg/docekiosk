'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  IceCreamIcon,
  AcaiIcon,
  FruitIcon,
  ChocolateIcon,
  ToppingIcon,
  CategoryIcon,
  ProductIcon,
  XIcon,
  CheckIcon,
} from '@/components/Icons';
import {
  mockProducts,
  ProductCategory,
  getCategoryLabel,
  formatCurrency,
} from '@/lib/data';

const categoryIcons: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  sorvete: IceCreamIcon,
  acai: AcaiIcon,
  fruta: FruitIcon,
  chocolate: ChocolateIcon,
  topping: ToppingIcon,
};

const categoryColors: Record<ProductCategory, { bg: string; text: string; border: string; gradient: string }> = {
  sorvete: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-rose-500' },
  acai: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-violet-500' },
  fruta: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', gradient: 'from-green-500 to-emerald-500' },
  chocolate: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-500' },
  topping: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-500' },
};

interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  active: boolean;
}

const defaultCategories: Category[] = [
  { id: 'sorvete', name: 'Sorvete', description: 'Sorvetes artesanais e premium', active: true },
  { id: 'acai', name: 'Acai', description: 'Acai puro e preparados especiais', active: true },
  { id: 'fruta', name: 'Frutas', description: 'Frutas frescas e selecionadas', active: true },
  { id: 'chocolate', name: 'Chocolates', description: 'Chocolates para fondue e cobertura', active: true },
  { id: 'topping', name: 'Toppings', description: 'Complementos e coberturas', active: true },
];

export default function CategoriesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

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

  const getCategoryStats = (categoryId: ProductCategory) => {
    const products = mockProducts.filter(p => p.category === categoryId);
    const activeProducts = products.filter(p => p.active);
    const totalValue = products.reduce((sum, p) => sum + (p.pricePerKg * p.stockCurrent), 0);
    return {
      total: products.length,
      active: activeProducts.length,
      totalValue,
    };
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(prev =>
        prev.map(c =>
          c.id === editingCategory.id
            ? { ...c, name: formData.name, description: formData.description }
            : c
        )
      );
    }
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleToggleActive = (categoryId: ProductCategory) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === categoryId ? { ...c, active: !c.active } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <Link href="/produtos" className="hover:text-rose-500 transition-colors">
            Produtos
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Categorias</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Categorias de Produtos</h1>
            <p className="text-slate-500 mt-1">Gerencie as categorias do seu catalogo</p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category, idx) => {
            const Icon = categoryIcons[category.id];
            const colors = categoryColors[category.id];
            const stats = getCategoryStats(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  category.active ? 'border-rose-100' : 'border-slate-200 opacity-60'
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.bg}`}>
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(category.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          category.active
                            ? 'text-green-500 hover:text-green-600 hover:bg-green-50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={category.active ? 'Desativar' : 'Ativar'}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{category.description}</p>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                      <p className="text-xs text-slate-500">Produtos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                      <p className="text-xs text-slate-500">Ativos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800">{formatCurrency(stats.totalValue)}</p>
                      <p className="text-xs text-slate-500">Em Estoque</p>
                    </div>
                  </div>

                  <Link
                    href={`/produtos?categoria=${category.id}`}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <ProductIcon className="w-4 h-4" />
                    Ver Produtos
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Resumo por Categoria</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 text-sm font-medium text-slate-500">Categoria</th>
                  <th className="text-center py-3 text-sm font-medium text-slate-500">Produtos</th>
                  <th className="text-center py-3 text-sm font-medium text-slate-500">Ativos</th>
                  <th className="text-right py-3 text-sm font-medium text-slate-500">Valor em Estoque</th>
                  <th className="text-center py-3 text-sm font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => {
                  const Icon = categoryIcons[category.id];
                  const colors = categoryColors[category.id];
                  const stats = getCategoryStats(category.id);
                  return (
                    <tr key={category.id} className="border-b border-slate-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{category.name}</p>
                            <p className="text-xs text-slate-400">{category.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center font-medium text-slate-700">{stats.total}</td>
                      <td className="py-4 text-center font-medium text-green-600">{stats.active}</td>
                      <td className="py-4 text-right font-medium text-slate-700">{formatCurrency(stats.totalValue)}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          category.active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {category.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50">
                  <td className="py-4 font-semibold text-slate-800">Total</td>
                  <td className="py-4 text-center font-semibold text-slate-800">
                    {mockProducts.length}
                  </td>
                  <td className="py-4 text-center font-semibold text-green-600">
                    {mockProducts.filter(p => p.active).length}
                  </td>
                  <td className="py-4 text-right font-semibold text-slate-800">
                    {formatCurrency(mockProducts.reduce((sum, p) => sum + (p.pricePerKg * p.stockCurrent), 0))}
                  </td>
                  <td className="py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-600">
                      {categories.filter(c => c.active).length}/{categories.length}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Editar Categoria</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descricao
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-medium"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && categoryToDelete && (
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
                <h3 className="text-lg font-semibold text-slate-800">Desativar Categoria</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                Tem certeza que deseja desativar a categoria <strong>{categoryToDelete.name}</strong>? Os produtos desta categoria continuarao existindo.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    handleToggleActive(categoryToDelete.id);
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Desativar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

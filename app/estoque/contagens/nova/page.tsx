'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  CountIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  ArrowDownIcon,
  WarningIcon,
  ChevronRightIcon,
} from '@/components/Icons';
import {
  mockProducts,
  getCategoryLabel,
  getUnitLabel,
  formatCurrency,
  Product,
  ProductCategory,
} from '@/lib/data';

interface CountItem {
  productId: string;
  productName: string;
  unit: string;
  previousStock: number;
  currentStock: number;
  consumed: number;
}

export default function NovaContagemPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [countItems, setCountItems] = useState<Record<string, CountItem>>({});
  const [step, setStep] = useState<'select' | 'count' | 'review'>('select');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const categories: ProductCategory[] = ['sorvete', 'acai', 'fruta', 'chocolate', 'topping'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory && product.active;
  });

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const selectAll = () => {
    const visibleIds = filteredProducts.map(p => p.id);
    setSelectedProducts(prev => {
      const allSelected = visibleIds.every(id => prev.includes(id));
      if (allSelected) {
        return prev.filter(id => !visibleIds.includes(id));
      }
      return [...new Set([...prev, ...visibleIds])];
    });
  };

  const initializeCountItems = () => {
    const items: Record<string, CountItem> = {};
    selectedProducts.forEach(productId => {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        items[productId] = {
          productId,
          productName: product.name,
          unit: product.unit,
          previousStock: product.stockCurrent,
          currentStock: product.stockCurrent,
          consumed: 0,
        };
      }
    });
    setCountItems(items);
    setStep('count');
  };

  const updateCurrentStock = (productId: string, value: number) => {
    setCountItems(prev => {
      const item = prev[productId];
      const consumed = Math.max(0, item.previousStock - value);
      return {
        ...prev,
        [productId]: {
          ...item,
          currentStock: value,
          consumed,
        },
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/estoque/contagens');
  };

  const totalConsumed = Object.values(countItems).reduce((sum, item) => sum + item.consumed, 0);
  const itemsWithConsumption = Object.values(countItems).filter(item => item.consumed > 0).length;

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-bold text-slate-800"
          >
            Nova Contagem de Estoque
          </motion.h1>
          <p className="text-slate-500 mt-1">
            {step === 'select' && 'Selecione os produtos para contar'}
            {step === 'count' && 'Informe as quantidades atuais'}
            {step === 'review' && 'Revise e confirme a contagem'}
          </p>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'select' ? 'bg-rose-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {step !== 'select' ? <CheckIcon className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-sm font-medium ${step === 'select' ? 'text-rose-600' : 'text-slate-600'}`}>
                Selecionar
              </span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-300" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'count' ? 'bg-rose-500 text-white' : step === 'review' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {step === 'review' ? <CheckIcon className="w-5 h-5" /> : '2'}
              </div>
              <span className={`text-sm font-medium ${step === 'count' ? 'text-rose-600' : 'text-slate-600'}`}>
                Contar
              </span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-300" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'review' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${step === 'review' ? 'text-rose-600' : 'text-slate-600'}`}>
                Revisar
              </span>
            </div>
          </div>
        </motion.div>

        {/* Step 1: Select Products */}
        {step === 'select' && (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
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

                <button
                  onClick={selectAll}
                  className="px-4 py-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  {filteredProducts.every(p => selectedProducts.includes(p.id)) ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (idx % 9) }}
                  onClick={() => toggleProduct(product.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedProducts.includes(product.id)
                      ? 'bg-rose-50 border-rose-500'
                      : 'bg-white border-rose-100 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedProducts.includes(product.id) ? 'bg-rose-500 text-white' : 'bg-slate-100'
                      }`}>
                        {selectedProducts.includes(product.id) ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : (
                          <CountIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-sm text-slate-500">
                          {getCategoryLabel(product.category)} | {product.stockCurrent} {getUnitLabel(product.unit)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 lg:left-[280px] bg-white border-t border-rose-100 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <CountIcon className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{selectedProducts.length} produtos selecionados</p>
                  <p className="text-sm text-slate-500">Selecione os produtos para continuar</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/estoque/contagens"
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  onClick={initializeCountItems}
                  disabled={selectedProducts.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </motion.div>

            <div className="h-24"></div>
          </>
        )}

        {/* Step 2: Count Products */}
        {step === 'count' && (
          <>
            <div className="space-y-4 mb-6">
              {Object.values(countItems).map((item, idx) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="bg-white rounded-xl p-5 shadow-sm border border-rose-100"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{item.productName}</h3>
                      <p className="text-sm text-slate-500">
                        Estoque anterior: {item.previousStock} {getUnitLabel(item.unit as 'kg' | 'litro' | 'unidade')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block text-sm text-slate-500 mb-1">Quantidade Atual</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.currentStock}
                          onChange={(e) => updateCurrentStock(item.productId, parseFloat(e.target.value) || 0)}
                          className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-center"
                        />
                      </div>

                      <div className="text-center">
                        <label className="block text-sm text-slate-500 mb-1">Consumo</label>
                        <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
                          item.consumed > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.consumed > 0 && <ArrowDownIcon className="w-4 h-4" />}
                          <span className="font-medium">{item.consumed.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.consumed > item.previousStock * 0.5 && (
                    <div className="mt-3 flex items-center gap-2 text-amber-600">
                      <WarningIcon className="w-4 h-4" />
                      <span className="text-sm">Consumo acima de 50% do estoque anterior</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 lg:left-[280px] bg-white border-t border-rose-100 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ArrowDownIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{itemsWithConsumption} produtos com consumo</p>
                  <p className="text-sm text-slate-500">Total consumido: {totalConsumed.toFixed(2)} unidades</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep('review')}
                  className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
                >
                  Revisar
                </button>
              </div>
            </motion.div>

            <div className="h-24"></div>
          </>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden mb-6"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Resumo da Contagem</h3>
                <p className="text-sm text-slate-500">
                  Data: {new Date().toLocaleDateString('pt-BR')} | Responsavel: {user.name}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Produto</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Anterior</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Atual</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Consumo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.values(countItems).map(item => (
                      <tr key={item.productId} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-800">{item.productName}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {item.previousStock} {getUnitLabel(item.unit as 'kg' | 'litro' | 'unidade')}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-800">
                          {item.currentStock} {getUnitLabel(item.unit as 'kg' | 'litro' | 'unidade')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${item.consumed > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {item.consumed > 0 ? `-${item.consumed.toFixed(2)}` : '0'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-800">Total</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 text-right font-bold text-amber-600">
                        -{totalConsumed.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>

            {/* Action Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 lg:left-[280px] bg-white border-t border-rose-100 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Pronto para salvar</p>
                  <p className="text-sm text-slate-500">{Object.keys(countItems).length} produtos contados</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('count')}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      <span>Confirmar Contagem</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            <div className="h-24"></div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

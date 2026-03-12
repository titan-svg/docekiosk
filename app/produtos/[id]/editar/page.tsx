'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  ProductIcon,
  IceCreamIcon,
  AcaiIcon,
  FruitIcon,
  ChocolateIcon,
  ToppingIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@/components/Icons';
import {
  mockProducts,
  mockSuppliers,
  ProductCategory,
  ProductUnit,
  getCategoryLabel,
  getUnitLabel,
  Product,
} from '@/lib/data';

const categoryIcons: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  sorvete: IceCreamIcon,
  acai: AcaiIcon,
  fruta: FruitIcon,
  chocolate: ChocolateIcon,
  topping: ToppingIcon,
};

const categoryColors: Record<ProductCategory, string> = {
  sorvete: 'border-pink-300 bg-pink-50 text-pink-600',
  acai: 'border-purple-300 bg-purple-50 text-purple-600',
  fruta: 'border-green-300 bg-green-50 text-green-600',
  chocolate: 'border-amber-300 bg-amber-50 text-amber-600',
  topping: 'border-blue-300 bg-blue-50 text-blue-600',
};

interface FormData {
  name: string;
  category: ProductCategory | '';
  unit: ProductUnit;
  pricePerKg: string;
  cost: string;
  stockMin: string;
  stockCurrent: string;
  supplierId: string;
  active: boolean;
}

interface FormErrors {
  name?: string;
  category?: string;
  pricePerKg?: string;
  cost?: string;
  stockMin?: string;
  stockCurrent?: string;
  supplierId?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    unit: 'kg',
    pricePerKg: '',
    cost: '',
    stockMin: '',
    stockCurrent: '',
    supplierId: '',
    active: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const id = params.id as string;
    const foundProduct = mockProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setFormData({
        name: foundProduct.name,
        category: foundProduct.category,
        unit: foundProduct.unit,
        pricePerKg: foundProduct.pricePerKg.toString(),
        cost: foundProduct.cost.toString(),
        stockMin: foundProduct.stockMin.toString(),
        stockCurrent: foundProduct.stockCurrent.toString(),
        supplierId: foundProduct.supplierId,
        active: foundProduct.active,
      });
    }
  }, [params.id]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Sidebar />
        <main className="lg:ml-[280px] p-4 lg:p-8">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Produto nao encontrado</h1>
            <p className="text-slate-500 mb-6">O produto que voce esta procurando nao existe ou foi removido.</p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              Voltar para Produtos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto e obrigatorio';
    }

    if (!formData.category) {
      newErrors.category = 'Selecione uma categoria';
    }

    if (!formData.pricePerKg || parseFloat(formData.pricePerKg) <= 0) {
      newErrors.pricePerKg = 'Preco deve ser maior que zero';
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Custo deve ser maior que zero';
    }

    if (!formData.stockMin || parseInt(formData.stockMin) < 0) {
      newErrors.stockMin = 'Estoque minimo invalido';
    }

    if (!formData.stockCurrent || parseInt(formData.stockCurrent) < 0) {
      newErrors.stockCurrent = 'Estoque atual invalido';
    }

    if (!formData.supplierId) {
      newErrors.supplierId = 'Selecione um fornecedor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Redirect after showing success
    setTimeout(() => {
      router.push(`/produtos/${product.id}`);
    }, 2000);
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const categories: ProductCategory[] = ['sorvete', 'acai', 'fruta', 'chocolate', 'topping'];
  const units: ProductUnit[] = ['kg', 'litro', 'unidade'];

  // Filter suppliers by selected category
  const filteredSuppliers = formData.category
    ? mockSuppliers.filter(s => s.categories.includes(formData.category as ProductCategory))
    : mockSuppliers;

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
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
          <Link href={`/produtos/${product.id}`} className="hover:text-rose-500 transition-colors">
            {product.name}
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Editar</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Editar Produto</h1>
          <p className="text-slate-500 mt-1">Atualize as informacoes do produto</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-3xl"
        >
          <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 lg:p-8">
            {/* Product Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Sorvete de Chocolate Premium"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categoria *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat];
                  const isSelected = formData.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        handleChange('category', cat);
                        // Reset supplier if category changes
                        if (formData.category !== cat) {
                          setFormData(prev => ({ ...prev, supplierId: '' }));
                        }
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? categoryColors[cat]
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{getCategoryLabel(cat)}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Unit */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Unidade de Medida
              </label>
              <div className="flex gap-3">
                {units.map(unit => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => handleChange('unit', unit)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.unit === unit
                        ? 'border-rose-500 bg-rose-50 text-rose-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {getUnitLabel(unit)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price and Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preco de Venda (R$/{getUnitLabel(formData.unit)}) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerKg}
                    onChange={(e) => handleChange('pricePerKg', e.target.value)}
                    placeholder="0,00"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                      errors.pricePerKg ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.pricePerKg && (
                  <p className="mt-1 text-sm text-red-500">{errors.pricePerKg}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custo (R$/{getUnitLabel(formData.unit)}) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => handleChange('cost', e.target.value)}
                    placeholder="0,00"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                      errors.cost ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.cost && (
                  <p className="mt-1 text-sm text-red-500">{errors.cost}</p>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estoque Atual ({getUnitLabel(formData.unit)}) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockCurrent}
                  onChange={(e) => handleChange('stockCurrent', e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.stockCurrent ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.stockCurrent && (
                  <p className="mt-1 text-sm text-red-500">{errors.stockCurrent}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estoque Minimo ({getUnitLabel(formData.unit)}) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockMin}
                  onChange={(e) => handleChange('stockMin', e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.stockMin ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.stockMin && (
                  <p className="mt-1 text-sm text-red-500">{errors.stockMin}</p>
                )}
              </div>
            </div>

            {/* Supplier */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fornecedor *
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => handleChange('supplierId', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 bg-white ${
                  errors.supplierId ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
              >
                <option value="">Selecione um fornecedor</option>
                {filteredSuppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="mt-1 text-sm text-red-500">{errors.supplierId}</p>
              )}
              {formData.category && filteredSuppliers.length === 0 && (
                <p className="mt-1 text-sm text-amber-500">
                  Nenhum fornecedor encontrado para esta categoria.
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    formData.active ? 'bg-rose-500' : 'bg-slate-200'
                  }`}
                  onClick={() => handleChange('active', !formData.active)}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      formData.active ? 'translate-x-5' : ''
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Produto ativo (disponivel para venda)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
              <Link
                href={`/produtos/${product.id}`}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Alteracoes Salvas!
                  </>
                ) : (
                  <>
                    <ProductIcon className="w-5 h-5" />
                    Salvar Alteracoes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  SupplierIcon,
  IceCreamIcon,
  AcaiIcon,
  FruitIcon,
  ChocolateIcon,
  ToppingIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@/components/Icons';
import {
  ProductCategory,
  getCategoryLabel,
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
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  contactPerson: string;
  categories: ProductCategory[];
  active: boolean;
}

interface FormErrors {
  name?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  contactPerson?: string;
  categories?: string;
}

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function NewSupplierPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    contactPerson: '',
    categories: [],
    active: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

  const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      }
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do fornecedor e obrigatorio';
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ e obrigatorio';
    } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ invalido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email e obrigatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone e obrigatorio';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereco e obrigatorio';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade e obrigatoria';
    }

    if (!formData.state) {
      newErrors.state = 'Estado e obrigatorio';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Pessoa de contato e obrigatoria';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'Selecione pelo menos uma categoria';
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
      router.push('/fornecedores');
    }, 2000);
  };

  const handleChange = (field: keyof FormData, value: string | boolean | ProductCategory[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleCategory = (category: ProductCategory) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    handleChange('categories', newCategories);
  };

  const categories: ProductCategory[] = ['sorvete', 'acai', 'fruta', 'chocolate', 'topping'];

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
          <Link href="/fornecedores" className="hover:text-rose-500 transition-colors">
            Fornecedores
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Novo Fornecedor</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Novo Fornecedor</h1>
          <p className="text-slate-500 mt-1">Cadastre um novo parceiro de fornecimento</p>
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
            {/* Company Info */}
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Informacoes da Empresa</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Razao Social / Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Gelatto Premium LTDA"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', formatCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.cnpj ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.cnpj && (
                  <p className="mt-1 text-sm text-red-500">{errors.cnpj}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contato@empresa.com.br"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pessoa de Contato *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  placeholder="Nome do responsavel"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.contactPerson ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-sm text-red-500">{errors.contactPerson}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pt-4 border-t border-slate-100">Endereco</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Endereco *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Rua, numero, complemento"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.address ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Sao Paulo"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 ${
                    errors.city ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-700 bg-white ${
                    errors.state ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                >
                  <option value="">Selecione</option>
                  {brazilianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Categories */}
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pt-4 border-t border-slate-100">Categorias de Produtos</h2>

            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-3">Selecione as categorias que este fornecedor atende *</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat];
                  const isSelected = formData.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? categoryColors[cat]
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{getCategoryLabel(cat)}</span>
                      {isSelected && (
                        <CheckIcon className="w-4 h-4" />
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <p className="mt-2 text-sm text-red-500">{errors.categories}</p>
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
                  Fornecedor ativo
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
              <Link
                href="/fornecedores"
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
                    Fornecedor Cadastrado!
                  </>
                ) : (
                  <>
                    <SupplierIcon className="w-5 h-5" />
                    Cadastrar Fornecedor
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

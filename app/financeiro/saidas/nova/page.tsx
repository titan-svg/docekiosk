'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  ExpenseIcon,
  CalendarIcon,
  SupplierIcon,
  EmployeeIcon,
  CheckIcon,
  XIcon,
} from '@/components/Icons';
import {
  mockSuppliers,
  mockEmployees,
  mockKiosks,
  getExpenseCategoryLabel,
  ExpenseCategory,
} from '@/lib/data';

const expenseCategories: ExpenseCategory[] = [
  'funcionario',
  'fornecedor',
  'insumo',
  'aluguel',
  'energia',
  'agua',
  'manutencao',
  'imposto',
  'outro',
];

const categoryIcons: Record<ExpenseCategory, string> = {
  funcionario: 'bg-blue-100 text-blue-600',
  fornecedor: 'bg-purple-100 text-purple-600',
  insumo: 'bg-amber-100 text-amber-600',
  aluguel: 'bg-rose-100 text-rose-600',
  energia: 'bg-yellow-100 text-yellow-600',
  agua: 'bg-cyan-100 text-cyan-600',
  manutencao: 'bg-orange-100 text-orange-600',
  imposto: 'bg-red-100 text-red-600',
  outro: 'bg-slate-100 text-slate-600',
};

export default function NovaSaidaPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    category: '' as ExpenseCategory | '',
    amount: '',
    dueDate: '',
    kioskId: '',
    supplierId: '',
    employeeId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset supplier/employee when category changes
    if (name === 'category') {
      if (value !== 'fornecedor') {
        setFormData(prev => ({ ...prev, supplierId: '' }));
      }
      if (value !== 'funcionario') {
        setFormData(prev => ({ ...prev, employeeId: '' }));
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descricao e obrigatoria';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria e obrigatoria';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento e obrigatoria';
    }
    if (!formData.kioskId) {
      newErrors.kioskId = 'Quiosque e obrigatorio';
    }
    if (formData.category === 'fornecedor' && !formData.supplierId) {
      newErrors.supplierId = 'Fornecedor e obrigatorio para esta categoria';
    }
    if (formData.category === 'funcionario' && !formData.employeeId) {
      newErrors.employeeId = 'Funcionario e obrigatorio para esta categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSuccess(true);
    setIsSubmitting(false);

    // Redirect after success
    setTimeout(() => {
      router.push('/financeiro/saidas');
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Sidebar />
        <main className="lg:ml-[280px] p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto mt-20 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Saida Registrada!</h2>
            <p className="text-slate-500">A despesa foi registrada com sucesso.</p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/financeiro" className="hover:text-rose-500">Financeiro</Link>
            <span>/</span>
            <Link href="/financeiro/saidas" className="hover:text-rose-500">Saidas</Link>
            <span>/</span>
            <span className="text-slate-800">Nova</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Nova Saida</h1>
          <p className="text-slate-500 mt-1">Registre uma nova despesa ou conta a pagar</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Categoria *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {expenseCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'category', value: cat } } as any)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.category === cat
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center ${categoryIcons[cat]}`}>
                      <ExpenseIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-slate-600">{getExpenseCategoryLabel(cat)}</span>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Descricao *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ex: Pagamento de aluguel - Marco/2026"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    errors.description ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    errors.amount ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
                  Data de Vencimento *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.dueDate ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>

              {/* Kiosk */}
              <div>
                <label htmlFor="kioskId" className="block text-sm font-medium text-slate-700 mb-2">
                  Quiosque *
                </label>
                <select
                  id="kioskId"
                  name="kioskId"
                  value={formData.kioskId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    errors.kioskId ? 'border-red-300' : 'border-slate-200'
                  }`}
                >
                  <option value="">Selecione um quiosque</option>
                  {mockKiosks.filter(k => k.active).map(kiosk => (
                    <option key={kiosk.id} value={kiosk.id}>{kiosk.name}</option>
                  ))}
                </select>
                {errors.kioskId && (
                  <p className="text-red-500 text-sm mt-1">{errors.kioskId}</p>
                )}
              </div>

              {/* Supplier (conditional) */}
              {formData.category === 'fornecedor' && (
                <div>
                  <label htmlFor="supplierId" className="block text-sm font-medium text-slate-700 mb-2">
                    <SupplierIcon className="w-4 h-4 inline mr-1" />
                    Fornecedor *
                  </label>
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.supplierId ? 'border-red-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Selecione um fornecedor</option>
                    {mockSuppliers.filter(s => s.active).map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                  {errors.supplierId && (
                    <p className="text-red-500 text-sm mt-1">{errors.supplierId}</p>
                  )}
                </div>
              )}

              {/* Employee (conditional) */}
              {formData.category === 'funcionario' && (
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700 mb-2">
                    <EmployeeIcon className="w-4 h-4 inline mr-1" />
                    Funcionario *
                  </label>
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.employeeId ? 'border-red-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Selecione um funcionario</option>
                    {mockEmployees.filter(e => e.active).map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position}
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && (
                    <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                  Observacoes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Informacoes adicionais sobre esta despesa..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
              <Link
                href="/financeiro/saidas"
                className="px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Registrar Saida
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

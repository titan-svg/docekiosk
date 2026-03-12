'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  EmployeeIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@/components/Icons';
import { mockKiosks } from '@/lib/data';

export default function NovoFuncionarioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    position: '',
    kioskId: '',
    salary: '',
    hireDate: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      router.push('/funcionarios');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <Link href="/funcionarios" className="hover:text-rose-500 transition-colors">
            Funcionarios
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Novo Funcionario</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Novo Funcionario</h1>
          <p className="text-slate-500 mt-1">Adicione um novo membro a sua equipe</p>
        </motion.div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Funcionario Cadastrado!</h3>
              <p className="text-slate-500">Redirecionando para a lista...</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-rose-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <EmployeeIcon className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Dados do Funcionario</h2>
              <p className="text-sm text-slate-500">Preencha as informacoes abaixo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Maria da Silva"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={e => setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                required
                placeholder="000.000.000-00"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@exemplo.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Telefone *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                required
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Cargo *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
              >
                <option value="">Selecione o cargo</option>
                <option value="Gerente">Gerente</option>
                <option value="Operador de Caixa">Operador de Caixa</option>
                <option value="Atendente">Atendente</option>
                <option value="Auxiliar">Auxiliar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Quiosque *
              </label>
              <select
                name="kioskId"
                value={formData.kioskId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
              >
                <option value="">Selecione o quiosque</option>
                {mockKiosks.filter(k => k.active).map(kiosk => (
                  <option key={kiosk.id} value={kiosk.id}>
                    {kiosk.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Salario (R$) *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0,00"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Data de Admissao *
              </label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Link
              href="/funcionarios"
              className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Cadastrar Funcionario
                </>
              )}
            </button>
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

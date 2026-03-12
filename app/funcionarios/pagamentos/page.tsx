'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  PaymentIcon,
  ChevronRightIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  WarningIcon,
} from '@/components/Icons';
import { mockEmployees, mockTransactions, mockKiosks, formatCurrency, formatDate } from '@/lib/data';

export default function PagamentosFuncionariosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pago' | 'pendente' | 'atrasado'>('all');
  const [monthFilter, setMonthFilter] = useState('');

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

  const employeePayments = mockTransactions.filter(t => t.category === 'funcionario');

  const filteredPayments = employeePayments.filter(payment => {
    const employee = mockEmployees.find(e => e.id === payment.employeeId);
    const matchesSearch = employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMonth = !monthFilter || payment.createdAt.startsWith(monthFilter);
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const totalPaid = employeePayments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = employeePayments.filter(p => p.status === 'pendente').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = employeePayments.filter(p => p.status === 'atrasado').reduce((sum, p) => sum + p.amount, 0);

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return 'N/A';
    const employee = mockEmployees.find(e => e.id === employeeId);
    return employee?.name || 'N/A';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckIcon className="w-4 h-4 text-green-500" />;
      case 'pendente':
        return <ClockIcon className="w-4 h-4 text-amber-500" />;
      case 'atrasado':
        return <WarningIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-600';
      case 'pendente':
        return 'bg-amber-100 text-amber-600';
      case 'atrasado':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
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
          <span className="text-slate-800">Pagamentos</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Pagamentos de Funcionarios</h1>
            <p className="text-slate-500 mt-1">Historico de salarios e pagamentos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all">
              <PlusIcon className="w-5 h-5" />
              <span>Novo Pagamento</span>
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Pago</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pendente</p>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <WarningIcon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Atrasado</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por funcionario..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as 'all' | 'pago' | 'pendente' | 'atrasado')}
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
                >
                  <option value="all">Todos</option>
                  <option value="pago">Pagos</option>
                  <option value="pendente">Pendentes</option>
                  <option value="atrasado">Atrasados</option>
                </select>
              </div>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="month"
                  value={monthFilter}
                  onChange={e => setMonthFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Funcionario</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Descricao</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Vencimento</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Pagamento</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, idx) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="border-b border-slate-50 hover:bg-pink-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                          {getEmployeeName(payment.employeeId).charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{getEmployeeName(payment.employeeId)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{payment.description}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{formatCurrency(payment.amount)}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {payment.dueDate ? formatDate(payment.dueDate) : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {payment.paidAt ? formatDate(payment.paidAt) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClass(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status === 'pago' ? 'Pago' : payment.status === 'pendente' ? 'Pendente' : 'Atrasado'}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="py-12 text-center">
              <PaymentIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Nenhum pagamento encontrado</p>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

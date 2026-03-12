'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  BillIcon,
  SearchIcon,
  CalendarIcon,
  CheckIcon,
  AlertIcon,
  ExpenseIcon,
  FilterIcon,
} from '@/components/Icons';
import {
  mockTransactions,
  mockSuppliers,
  mockEmployees,
  formatCurrency,
  getExpenseCategoryLabel,
  ExpenseCategory,
  Transaction,
} from '@/lib/data';

export default function ContasPagarPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Initialize with pending/overdue bills
    const bills = mockTransactions.filter(
      t => t.type === 'saida' && (t.status === 'pendente' || t.status === 'atrasado' || t.status === 'pago')
    );
    setTransactions(bills);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingBills = filteredTransactions.filter(t => t.status === 'pendente');
  const overdueBills = filteredTransactions.filter(t => t.status === 'atrasado');
  const paidBills = filteredTransactions.filter(t => t.status === 'pago');

  const pendingAmount = pendingBills.reduce((sum, t) => sum + t.amount, 0);
  const overdueAmount = overdueBills.reduce((sum, t) => sum + t.amount, 0);

  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return null;
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    return supplier?.name;
  };

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return null;
    const employee = mockEmployees.find(e => e.id === employeeId);
    return employee?.name;
  };

  const handleMarkAsPaid = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === transactionId
          ? { ...t, status: 'pago' as const, paidAt: new Date().toISOString().split('T')[0] }
          : t
      )
    );
    setShowConfirmModal(null);
  };

  // Group bills by due date for timeline
  const billsByDueDate = filteredTransactions
    .filter(t => t.status !== 'pago')
    .reduce((acc, t) => {
      const date = t.dueDate || 'sem-data';
      if (!acc[date]) acc[date] = [];
      acc[date].push(t);
      return acc;
    }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(billsByDueDate).sort();

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date('2026-03-12');
  };

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/financeiro" className="hover:text-rose-500">Financeiro</Link>
            <span>/</span>
            <span className="text-slate-800">Contas a Pagar</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Contas a Pagar</h1>
          <p className="text-slate-500 mt-1">Gerencie suas contas e vencimentos</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <BillIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pendentes</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(pendingAmount)}</p>
                <p className="text-xs text-slate-400">{pendingBills.length} contas</p>
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
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Atrasadas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueAmount)}</p>
                <p className="text-xs text-slate-400">{overdueBills.length} contas</p>
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
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <ExpenseIcon className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total a Pagar</p>
                <p className="text-2xl font-bold text-rose-600">{formatCurrency(pendingAmount + overdueAmount)}</p>
                <p className="text-xs text-slate-400">{pendingBills.length + overdueBills.length} contas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por descricao..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === '' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setStatusFilter('pendente')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'pendente' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setStatusFilter('atrasado')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'atrasado' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Atrasadas
              </button>
              <button
                onClick={() => setStatusFilter('pago')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'pago' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pagas
              </button>
            </div>
          </div>
        </motion.div>

        {/* Timeline View */}
        {statusFilter !== 'pago' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-8"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Linha do Tempo de Vencimentos</h2>
            <div className="space-y-6">
              {sortedDates.map((date, idx) => {
                const bills = billsByDueDate[date];
                const dateOverdue = isOverdue(date);
                const formattedDate = date === 'sem-data'
                  ? 'Sem data de vencimento'
                  : new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

                return (
                  <div key={date} className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                        dateOverdue ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-3 ${
                          dateOverdue ? 'text-red-600' : 'text-slate-600'
                        }`}>
                          {formattedDate}
                          {dateOverdue && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Vencido</span>}
                        </p>
                        <div className="space-y-2">
                          {bills.map(bill => (
                            <div
                              key={bill.id}
                              className={`flex items-center justify-between p-4 rounded-lg border ${
                                bill.status === 'atrasado'
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  bill.status === 'atrasado' ? 'bg-red-100' : 'bg-amber-100'
                                }`}>
                                  <BillIcon className={`w-5 h-5 ${
                                    bill.status === 'atrasado' ? 'text-red-600' : 'text-amber-600'
                                  }`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-800">{bill.description}</p>
                                  <p className="text-xs text-slate-500">
                                    {getExpenseCategoryLabel(bill.category as ExpenseCategory)}
                                    {(getSupplierName(bill.supplierId) || getEmployeeName(bill.employeeId)) &&
                                      ` - ${getSupplierName(bill.supplierId) || getEmployeeName(bill.employeeId)}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className="text-sm font-semibold text-slate-800">
                                  {formatCurrency(bill.amount)}
                                </p>
                                <button
                                  onClick={() => setShowConfirmModal(bill.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                  Pagar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {idx < sortedDates.length - 1 && (
                      <div className="absolute left-2 top-5 bottom-0 w-0.5 bg-slate-200 -z-10" />
                    )}
                  </div>
                );
              })}

              {sortedDates.length === 0 && (
                <div className="text-center py-8">
                  <CheckIcon className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <p className="text-slate-500">Nenhuma conta pendente encontrada</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Paid Bills (shown when filter is 'pago') */}
        {statusFilter === 'pago' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Contas Pagas</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {paidBills.map(bill => (
                <div key={bill.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{bill.description}</p>
                        <p className="text-xs text-slate-500">
                          Pago em: {bill.paidAt ? new Date(bill.paidAt).toLocaleDateString('pt-BR') : '-'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(bill.amount)}
                    </p>
                  </div>
                </div>
              ))}

              {paidBills.length === 0 && (
                <div className="p-12 text-center">
                  <BillIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Nenhuma conta paga encontrada</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Confirm Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmModal(null)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Confirmar Pagamento</h3>
                  <p className="text-slate-500 mb-6">
                    Tem certeza que deseja marcar esta conta como paga? Esta acao registrara a data de hoje como data de pagamento.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowConfirmModal(null)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleMarkAsPaid(showConfirmModal)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckIcon className="w-5 h-5" />
                      Confirmar Pagamento
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

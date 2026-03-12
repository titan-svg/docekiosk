'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  EmployeeIcon,
  ChevronRightIcon,
  EditIcon,
  PaymentIcon,
  KioskIcon,
  CalendarIcon,
  PhoneIcon,
  EmailIcon,
} from '@/components/Icons';
import { mockEmployees, mockKiosks, mockTransactions, formatCurrency, formatDate } from '@/lib/data';

export default function FuncionarioDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();

  const employeeId = params.id as string;
  const employee = mockEmployees.find(e => e.id === employeeId);
  const kiosk = employee ? mockKiosks.find(k => k.id === employee.kioskId) : null;

  // Get payment history for this employee
  const employeePayments = mockTransactions.filter(
    t => t.employeeId === employeeId && t.category === 'funcionario'
  );

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

  if (!employee) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Sidebar />
        <main className="lg:ml-[280px] p-4 lg:p-8">
          <div className="text-center py-16">
            <EmployeeIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-600 mb-2">Funcionario nao encontrado</h2>
            <Link href="/funcionarios" className="text-rose-500 hover:text-rose-600">
              Voltar para lista
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
          <span className="text-slate-800">{employee.name}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{employee.name}</h1>
              <p className="text-slate-500">{employee.position}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
              <EditIcon className="w-5 h-5" />
              Editar
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Informacoes de Contato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <EmailIcon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">E-mail</p>
                    <p className="text-sm font-medium text-slate-800">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Telefone</p>
                    <p className="text-sm font-medium text-slate-800">{employee.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <EmployeeIcon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">CPF</p>
                    <p className="text-sm font-medium text-slate-800">{employee.cpf}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <KioskIcon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Quiosque</p>
                    <p className="text-sm font-medium text-slate-800">{kiosk?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Dados do Contrato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                  <p className="text-sm text-slate-500 mb-1">Cargo</p>
                  <p className="text-lg font-semibold text-slate-800">{employee.position}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <p className="text-sm text-slate-500 mb-1">Salario</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(employee.salary)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                  <p className="text-sm text-slate-500 mb-1">Data de Admissao</p>
                  <p className="text-lg font-semibold text-slate-800">{formatDate(employee.hireDate)}</p>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Historico de Pagamentos</h2>
                <Link
                  href="/funcionarios/pagamentos"
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  Ver todos
                </Link>
              </div>
              {employeePayments.length > 0 ? (
                <div className="space-y-3">
                  {employeePayments.slice(0, 5).map(payment => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          payment.status === 'pago' ? 'bg-green-100' : 'bg-amber-100'
                        }`}>
                          <PaymentIcon className={`w-5 h-5 ${
                            payment.status === 'pago' ? 'text-green-500' : 'text-amber-500'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{payment.description}</p>
                          <p className="text-sm text-slate-500">
                            {payment.paidAt ? formatDate(payment.paidAt) : `Vence: ${formatDate(payment.dueDate!)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{formatCurrency(payment.amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          payment.status === 'pago'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {payment.status === 'pago' ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PaymentIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Nenhum pagamento registrado</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Status</h3>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${employee.active ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                <span className={`font-medium ${employee.active ? 'text-green-600' : 'text-slate-500'}`}>
                  {employee.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Resumo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tempo na empresa</span>
                  <span className="font-medium text-slate-800">
                    {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pagamentos</span>
                  <span className="font-medium text-slate-800">{employeePayments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total pago</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(employeePayments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.amount, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Acoes Rapidas</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                  <PaymentIcon className="w-5 h-5" />
                  Registrar Pagamento
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                  <CalendarIcon className="w-5 h-5" />
                  Ver Escala
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

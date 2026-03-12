'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  EmployeeIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EyeIcon,
  EditIcon,
  PaymentIcon,
  KioskIcon,
} from '@/components/Icons';
import { mockEmployees, mockKiosks, formatCurrency } from '@/lib/data';

export default function FuncionariosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [kioskFilter, setKioskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

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

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKiosk = !kioskFilter || employee.kioskId === kioskFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && employee.active) ||
      (statusFilter === 'inactive' && !employee.active);
    return matchesSearch && matchesKiosk && matchesStatus;
  });

  const getKioskName = (kioskId: string) => {
    const kiosk = mockKiosks.find(k => k.id === kioskId);
    return kiosk?.name || 'N/A';
  };

  const totalSalaries = filteredEmployees.reduce((sum, e) => sum + e.salary, 0);

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
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Funcionarios</h1>
            <p className="text-slate-500 mt-1">Gerencie sua equipe</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3"
          >
            <Link
              href="/funcionarios/pagamentos"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <PaymentIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Pagamentos</span>
            </Link>
            <Link
              href="/funcionarios/novo"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Novo Funcionario</span>
            </Link>
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
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <EmployeeIcon className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-800">{mockEmployees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <EmployeeIcon className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Ativos</p>
                <p className="text-xl font-bold text-slate-800">{mockEmployees.filter(e => e.active).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <PaymentIcon className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Folha Mensal</p>
                <p className="text-xl font-bold text-slate-800">{formatCurrency(totalSalaries)}</p>
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
                placeholder="Buscar funcionario..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <KioskIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={kioskFilter}
                  onChange={e => setKioskFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
                >
                  <option value="">Todos os Quiosques</option>
                  {mockKiosks.map(kiosk => (
                    <option key={kiosk.id} value={kiosk.id}>
                      {kiosk.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
                >
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Employees Table */}
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Cargo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Quiosque</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Salario</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, idx) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="border-b border-slate-50 hover:bg-pink-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{employee.name}</p>
                          <p className="text-sm text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{employee.position}</td>
                    <td className="py-3 px-4 text-slate-600 text-sm">{getKioskName(employee.kioskId)}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{formatCurrency(employee.salary)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {employee.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/funcionarios/${employee.id}`}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                          <EditIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="py-12 text-center">
              <EmployeeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Nenhum funcionario encontrado</p>
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

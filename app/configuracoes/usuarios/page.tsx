'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  UsersIcon,
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
  FilterIcon,
  KioskIcon,
} from '@/components/Icons';
import { mockUsers, mockKiosks } from '@/lib/data';

export default function ConfiguracaoUsuariosPage() {
  const router = useRouter();
  const { user, isLoading, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState(mockUsers);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    kioskId: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    if (!isLoading && user && !hasPermission('dono')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, hasPermission, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasPermission('dono')) {
    return null;
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    const newUser = {
      id: String(users.length + 1),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role as 'dono' | 'gerente' | 'operador',
      kioskId: formData.kioskId,
      active: true,
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '', role: '', kioskId: '' });
  };

  const handleToggleActive = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, active: !u.active } : u
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getKioskName = (kioskId?: string) => {
    if (!kioskId) return 'Todos';
    const kiosk = mockKiosks.find(k => k.id === kioskId);
    return kiosk?.name || 'N/A';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      dono: 'Proprietario',
      gerente: 'Gerente',
      operador: 'Operador',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      dono: 'bg-purple-100 text-purple-600',
      gerente: 'bg-blue-100 text-blue-600',
      operador: 'bg-slate-100 text-slate-600',
    };
    return colors[role] || 'bg-slate-100 text-slate-600';
  };

  const ownerCount = users.filter(u => u.role === 'dono').length;
  const managerCount = users.filter(u => u.role === 'gerente').length;
  const operatorCount = users.filter(u => u.role === 'operador').length;

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
          <Link href="/configuracoes/quiosques" className="hover:text-rose-500 transition-colors">
            Configuracoes
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Usuarios</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Gerenciar Usuarios</h1>
            <p className="text-slate-500 mt-1">Controle de acesso e permissoes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Usuario
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-800">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Proprietarios</p>
                <p className="text-xl font-bold text-purple-600">{ownerCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Gerentes</p>
                <p className="text-xl font-bold text-blue-600">{managerCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Operadores</p>
                <p className="text-xl font-bold text-slate-600">{operatorCount}</p>
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
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
              />
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors appearance-none bg-white"
              >
                <option value="">Todos os Cargos</option>
                <option value="dono">Proprietario</option>
                <option value="gerente">Gerente</option>
                <option value="operador">Operador</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Cargo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Quiosque</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, idx) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="border-b border-slate-50 hover:bg-pink-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-sm text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getRoleColor(u.role)}`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {getKioskName(u.kioskId)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          u.active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {u.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(u.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            u.active
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                        >
                          {u.active ? <XIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
                        </button>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Nenhum usuario encontrado</p>
            </div>
          )}
        </motion.div>

        {/* Role Permissions Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-rose-100"
        >
          <h3 className="font-semibold text-slate-800 mb-4">Permissoes por Cargo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-700 mb-2">Proprietario</h4>
              <ul className="text-sm text-purple-600 space-y-1">
                <li>- Acesso total ao sistema</li>
                <li>- Gerenciar usuarios</li>
                <li>- Configuracoes gerais</li>
                <li>- Relatorios completos</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-700 mb-2">Gerente</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>- Gerenciar funcionarios</li>
                <li>- Relatorios do quiosque</li>
                <li>- Controle financeiro</li>
                <li>- Estoque e vendas</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-medium text-slate-700 mb-2">Operador</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>- PDV e vendas</li>
                <li>- Contagem de estoque</li>
                <li>- Visualizar produtos</li>
                <li>- Acesso limitado</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Novo Usuario</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cargo *</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 appearance-none bg-white"
                    >
                      <option value="">Selecione o cargo</option>
                      <option value="dono">Proprietario</option>
                      <option value="gerente">Gerente</option>
                      <option value="operador">Operador</option>
                    </select>
                  </div>
                  {formData.role !== 'dono' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Quiosque</label>
                      <select
                        value={formData.kioskId}
                        onChange={e => setFormData(prev => ({ ...prev, kioskId: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 appearance-none bg-white"
                      >
                        <option value="">Todos os quiosques</option>
                        {mockKiosks.filter(k => k.active).map(kiosk => (
                          <option key={kiosk.id} value={kiosk.id}>
                            {kiosk.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddUser}
                    disabled={!formData.name || !formData.email || !formData.role}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 disabled:opacity-50"
                  >
                    Adicionar
                  </button>
                </div>
              </motion.div>
            </motion.div>
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

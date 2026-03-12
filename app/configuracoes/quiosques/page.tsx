'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  KioskIcon,
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
} from '@/components/Icons';
import { mockKiosks, formatDate } from '@/lib/data';

export default function ConfiguracaoQuiosquesPage() {
  const router = useRouter();
  const { user, isLoading, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKiosk, setEditingKiosk] = useState<string | null>(null);
  const [kiosks, setKiosks] = useState(mockKiosks);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    manager: '',
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

  const filteredKiosks = kiosks.filter(kiosk =>
    kiosk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kiosk.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddKiosk = () => {
    const newKiosk = {
      id: String(kiosks.length + 1),
      name: formData.name,
      location: formData.location,
      address: formData.address,
      phone: formData.phone,
      manager: formData.manager,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setKiosks([...kiosks, newKiosk]);
    setShowAddModal(false);
    setFormData({ name: '', location: '', address: '', phone: '', manager: '' });
  };

  const handleToggleActive = (id: string) => {
    setKiosks(kiosks.map(k =>
      k.id === id ? { ...k, active: !k.active } : k
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este quiosque?')) {
      setKiosks(kiosks.filter(k => k.id !== id));
    }
  };

  const activeCount = kiosks.filter(k => k.active).length;
  const inactiveCount = kiosks.filter(k => !k.active).length;

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
          <span className="text-slate-800">Quiosques</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Gerenciar Quiosques</h1>
            <p className="text-slate-500 mt-1">Adicione, edite ou desative quiosques</p>
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
              Novo Quiosque
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
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <KioskIcon className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-800">{kiosks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Ativos</p>
                <p className="text-xl font-bold text-green-600">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <XIcon className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Inativos</p>
                <p className="text-xl font-bold text-slate-600">{inactiveCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-rose-100 mb-6"
        >
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar quiosque..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-colors"
            />
          </div>
        </motion.div>

        {/* Kiosks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredKiosks.map((kiosk, idx) => (
            <motion.div
              key={kiosk.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              className={`bg-white rounded-xl p-5 shadow-sm border ${
                kiosk.active ? 'border-rose-100' : 'border-slate-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    kiosk.active ? 'bg-rose-100' : 'bg-slate-100'
                  }`}>
                    <KioskIcon className={`w-6 h-6 ${kiosk.active ? 'text-rose-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{kiosk.name}</h3>
                    <p className="text-sm text-slate-500">{kiosk.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  kiosk.active
                    ? 'bg-green-100 text-green-600'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {kiosk.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="text-slate-400">Endereco:</span> {kiosk.address}
                </p>
                <p className="text-slate-600">
                  <span className="text-slate-400">Telefone:</span> {kiosk.phone}
                </p>
                {kiosk.manager && (
                  <p className="text-slate-600">
                    <span className="text-slate-400">Gerente:</span> {kiosk.manager}
                  </p>
                )}
                <p className="text-slate-600">
                  <span className="text-slate-400">Desde:</span> {formatDate(kiosk.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEditingKiosk(kiosk.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <EditIcon className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(kiosk.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    kiosk.active
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      : 'text-green-600 bg-green-50 hover:bg-green-100'
                  }`}
                >
                  {kiosk.active ? (
                    <>
                      <XIcon className="w-4 h-4" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Ativar
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(kiosk.id)}
                  className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredKiosks.length === 0 && (
          <div className="text-center py-12">
            <KioskIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Nenhum quiosque encontrado</p>
          </div>
        )}

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
                  <h2 className="text-xl font-bold text-slate-800">Novo Quiosque</h2>
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
                      placeholder="Ex: Quiosque Shopping XYZ"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Localizacao *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: Shopping Center XYZ"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Endereco *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Endereco completo"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(00) 0000-0000"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gerente</label>
                    <input
                      type="text"
                      value={formData.manager}
                      onChange={e => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                      placeholder="Nome do gerente"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddKiosk}
                    disabled={!formData.name || !formData.location || !formData.address || !formData.phone}
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

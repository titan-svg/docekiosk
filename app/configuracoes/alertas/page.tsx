'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  AlertIcon,
  ChevronRightIcon,
  CheckIcon,
  InventoryIcon,
  FinanceIcon,
  SalesIcon,
} from '@/components/Icons';

export default function ConfiguracaoAlertasPage() {
  const router = useRouter();
  const { user, isLoading, hasPermission } = useAuth();

  const [settings, setSettings] = useState({
    stockAlerts: {
      enabled: true,
      lowStockThreshold: 20,
      criticalStockThreshold: 10,
      notifyEmail: true,
      notifyPush: true,
    },
    financialAlerts: {
      enabled: true,
      overdueReminder: 3,
      lowBalanceThreshold: 1000,
      notifyEmail: true,
      notifyPush: false,
    },
    salesAlerts: {
      enabled: true,
      dailySummary: true,
      unusualActivityThreshold: 30,
      notifyEmail: true,
      notifyPush: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const updateStockSettings = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      stockAlerts: { ...prev.stockAlerts, [key]: value },
    }));
  };

  const updateFinancialSettings = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      financialAlerts: { ...prev.financialAlerts, [key]: value },
    }));
  };

  const updateSalesSettings = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      salesAlerts: { ...prev.salesAlerts, [key]: value },
    }));
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
          <Link href="/configuracoes/quiosques" className="hover:text-rose-500 transition-colors">
            Configuracoes
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">Alertas</span>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Configuracao de Alertas</h1>
            <p className="text-slate-500 mt-1">Defina limites e preferencias de notificacao</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Salvar Alteracoes
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-green-700 font-medium">Configuracoes salvas com sucesso!</p>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <InventoryIcon className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Alertas de Estoque</h2>
                  <p className="text-sm text-slate-500">Notificacoes sobre niveis de estoque</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.stockAlerts.enabled}
                  onChange={e => updateStockSettings('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            {settings.stockAlerts.enabled && (
              <div className="space-y-6 pl-4 border-l-2 border-amber-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Limite de Estoque Baixo (%)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={settings.stockAlerts.lowStockThreshold}
                        onChange={e => updateStockSettings('lowStockThreshold', Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <span className="w-12 text-center font-semibold text-slate-800">
                        {settings.stockAlerts.lowStockThreshold}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Alerta quando o estoque atingir este percentual do minimo
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Limite de Estoque Critico (%)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={settings.stockAlerts.criticalStockThreshold}
                        onChange={e => updateStockSettings('criticalStockThreshold', Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                      <span className="w-12 text-center font-semibold text-slate-800">
                        {settings.stockAlerts.criticalStockThreshold}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Alerta urgente quando abaixo deste limite
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.stockAlerts.notifyEmail}
                      onChange={e => updateStockSettings('notifyEmail', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-700">Notificar por e-mail</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.stockAlerts.notifyPush}
                      onChange={e => updateStockSettings('notifyPush', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-700">Notificacao push</span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>

          {/* Financial Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FinanceIcon className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Alertas Financeiros</h2>
                  <p className="text-sm text-slate-500">Contas a pagar e fluxo de caixa</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.financialAlerts.enabled}
                  onChange={e => updateFinancialSettings('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            {settings.financialAlerts.enabled && (
              <div className="space-y-6 pl-4 border-l-2 border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lembrete de Vencimento (dias antes)
                    </label>
                    <select
                      value={settings.financialAlerts.overdueReminder}
                      onChange={e => updateFinancialSettings('overdueReminder', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 appearance-none bg-white"
                    >
                      <option value="1">1 dia antes</option>
                      <option value="3">3 dias antes</option>
                      <option value="5">5 dias antes</option>
                      <option value="7">7 dias antes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Limite de Saldo Baixo (R$)
                    </label>
                    <input
                      type="number"
                      value={settings.financialAlerts.lowBalanceThreshold}
                      onChange={e => updateFinancialSettings('lowBalanceThreshold', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Alerta quando o caixa estiver abaixo deste valor
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.financialAlerts.notifyEmail}
                      onChange={e => updateFinancialSettings('notifyEmail', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-700">Notificar por e-mail</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.financialAlerts.notifyPush}
                      onChange={e => updateFinancialSettings('notifyPush', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-700">Notificacao push</span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sales Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <SalesIcon className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Alertas de Vendas</h2>
                  <p className="text-sm text-slate-500">Resumos e atividades incomuns</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.salesAlerts.enabled}
                  onChange={e => updateSalesSettings('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            {settings.salesAlerts.enabled && (
              <div className="space-y-6 pl-4 border-l-2 border-rose-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.salesAlerts.dailySummary}
                        onChange={e => updateSalesSettings('dailySummary', e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                      />
                      <span className="text-slate-700">Enviar resumo diario de vendas</span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1 ml-8">
                      Receba um relatorio ao final de cada dia
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Limite de Atividade Incomum (%)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={settings.salesAlerts.unusualActivityThreshold}
                        onChange={e => updateSalesSettings('unusualActivityThreshold', Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                      <span className="w-12 text-center font-semibold text-slate-800">
                        {settings.salesAlerts.unusualActivityThreshold}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Alerta se vendas variarem acima deste percentual da media
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.salesAlerts.notifyEmail}
                      onChange={e => updateSalesSettings('notifyEmail', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-700">Notificar por e-mail</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.salesAlerts.notifyPush}
                      onChange={e => updateSalesSettings('notifyPush', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-700">Notificacao push</span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>

          {/* Email Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">E-mails de Notificacao</h2>
            <p className="text-sm text-slate-500 mb-4">
              Adicione e-mails que devem receber as notificacoes configuradas
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-medium flex items-center gap-2">
                {user?.email}
                <span className="text-rose-400">(principal)</span>
              </span>
            </div>

            <button className="mt-4 text-sm text-rose-500 hover:text-rose-600 font-medium">
              + Adicionar outro e-mail
            </button>
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

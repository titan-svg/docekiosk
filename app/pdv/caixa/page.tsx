'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  CashIcon,
  IncomeIcon,
  ExpenseIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
} from '@/components/Icons';
import { formatCurrency, formatDateTime } from '@/lib/data';

interface CashMovement {
  id: string;
  type: 'abertura' | 'entrada' | 'saida' | 'sangria' | 'reforco' | 'fechamento';
  description: string;
  amount: number;
  createdAt: string;
  createdBy: string;
}

interface CashRegister {
  id: string;
  status: 'aberto' | 'fechado';
  openedAt: string;
  closedAt?: string;
  openedBy: string;
  closedBy?: string;
  initialAmount: number;
  finalAmount?: number;
  expectedAmount?: number;
  difference?: number;
  movements: CashMovement[];
}

// Mock data
const mockCashRegister: CashRegister = {
  id: '1',
  status: 'aberto',
  openedAt: '2026-03-12T08:00:00',
  openedBy: 'Carlos Santos',
  initialAmount: 200,
  movements: [
    { id: '1', type: 'abertura', description: 'Abertura de caixa', amount: 200, createdAt: '2026-03-12T08:00:00', createdBy: 'Carlos Santos' },
    { id: '2', type: 'entrada', description: 'Venda #1 - PIX', amount: 27.82, createdAt: '2026-03-12T10:30:00', createdBy: 'Carlos Santos' },
    { id: '3', type: 'entrada', description: 'Venda #2 - Credito', amount: 32.08, createdAt: '2026-03-12T11:15:00', createdBy: 'Carlos Santos' },
    { id: '4', type: 'reforco', description: 'Reforco de troco', amount: 100, createdAt: '2026-03-12T12:00:00', createdBy: 'Ana Paula Silva' },
    { id: '5', type: 'entrada', description: 'Venda #4 - Dinheiro', amount: 29.28, createdAt: '2026-03-12T14:30:00', createdBy: 'Carlos Santos' },
    { id: '6', type: 'sangria', description: 'Sangria de seguranca', amount: -150, createdAt: '2026-03-12T15:00:00', createdBy: 'Ana Paula Silva' },
  ],
};

const movementTypeConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  abertura: { label: 'Abertura', color: 'bg-blue-100 text-blue-700', icon: CashIcon },
  entrada: { label: 'Entrada', color: 'bg-green-100 text-green-700', icon: IncomeIcon },
  saida: { label: 'Saida', color: 'bg-red-100 text-red-700', icon: ExpenseIcon },
  sangria: { label: 'Sangria', color: 'bg-amber-100 text-amber-700', icon: ArrowDownIcon },
  reforco: { label: 'Reforco', color: 'bg-purple-100 text-purple-700', icon: ArrowUpIcon },
  fechamento: { label: 'Fechamento', color: 'bg-slate-100 text-slate-700', icon: CheckIcon },
};

export default function CaixaPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(mockCashRegister);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementType, setMovementType] = useState<'sangria' | 'reforco'>('sangria');
  const [initialAmount, setInitialAmount] = useState('200');
  const [finalAmount, setFinalAmount] = useState('');
  const [movementAmount, setMovementAmount] = useState('');
  const [movementDescription, setMovementDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const currentBalance = cashRegister?.movements.reduce((sum, m) => sum + m.amount, 0) || 0;
  const totalEntries = cashRegister?.movements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.amount, 0) || 0;
  const totalSangrias = Math.abs(cashRegister?.movements.filter(m => m.type === 'sangria').reduce((sum, m) => sum + m.amount, 0) || 0);
  const totalReforcos = cashRegister?.movements.filter(m => m.type === 'reforco').reduce((sum, m) => sum + m.amount, 0) || 0;

  const handleOpenCashRegister = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCashRegister: CashRegister = {
      id: Date.now().toString(),
      status: 'aberto',
      openedAt: new Date().toISOString(),
      openedBy: user.name,
      initialAmount: parseFloat(initialAmount) || 0,
      movements: [
        {
          id: '1',
          type: 'abertura',
          description: 'Abertura de caixa',
          amount: parseFloat(initialAmount) || 0,
          createdAt: new Date().toISOString(),
          createdBy: user.name,
        },
      ],
    };

    setCashRegister(newCashRegister);
    setShowOpenModal(false);
    setIsProcessing(false);
  };

  const handleCloseCashRegister = async () => {
    if (!cashRegister) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const finalAmountNum = parseFloat(finalAmount) || 0;
    const difference = finalAmountNum - currentBalance;

    const closedRegister: CashRegister = {
      ...cashRegister,
      status: 'fechado',
      closedAt: new Date().toISOString(),
      closedBy: user.name,
      finalAmount: finalAmountNum,
      expectedAmount: currentBalance,
      difference,
      movements: [
        ...cashRegister.movements,
        {
          id: Date.now().toString(),
          type: 'fechamento',
          description: 'Fechamento de caixa',
          amount: 0,
          createdAt: new Date().toISOString(),
          createdBy: user.name,
        },
      ],
    };

    setCashRegister(closedRegister);
    setShowCloseModal(false);
    setFinalAmount('');
    setIsProcessing(false);
  };

  const handleAddMovement = async () => {
    if (!cashRegister) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const amount = parseFloat(movementAmount) || 0;
    const newMovement: CashMovement = {
      id: Date.now().toString(),
      type: movementType,
      description: movementDescription || (movementType === 'sangria' ? 'Sangria de caixa' : 'Reforco de caixa'),
      amount: movementType === 'sangria' ? -amount : amount,
      createdAt: new Date().toISOString(),
      createdBy: user.name,
    };

    setCashRegister({
      ...cashRegister,
      movements: [...cashRegister.movements, newMovement],
    });

    setShowMovementModal(false);
    setMovementAmount('');
    setMovementDescription('');
    setIsProcessing(false);
  };

  const handleNewCashRegister = () => {
    setCashRegister(null);
    setShowOpenModal(true);
    setInitialAmount('200');
  };

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center gap-3"
            >
              <CashIcon className="w-8 h-8 text-rose-500" />
              Controle de Caixa
            </motion.h1>
            <p className="text-slate-500 mt-1">Gerenciamento de abertura, movimentacoes e fechamento</p>
          </div>

          {cashRegister?.status === 'aberto' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMovementType('reforco');
                  setShowMovementModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
              >
                <ArrowUpIcon className="w-5 h-5" />
                Reforco
              </button>
              <button
                onClick={() => {
                  setMovementType('sangria');
                  setShowMovementModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
              >
                <ArrowDownIcon className="w-5 h-5" />
                Sangria
              </button>
              <button
                onClick={() => setShowCloseModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                <CheckIcon className="w-5 h-5" />
                Fechar Caixa
              </button>
            </div>
          )}

          {(!cashRegister || cashRegister.status === 'fechado') && (
            <button
              onClick={handleNewCashRegister}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              <CashIcon className="w-5 h-5" />
              Abrir Caixa
            </button>
          )}
        </div>

        {cashRegister ? (
          <>
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-6 mb-6 ${
                cashRegister.status === 'aberto'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-slate-600 to-slate-700'
              } text-white`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      cashRegister.status === 'aberto' ? 'bg-white animate-pulse' : 'bg-slate-400'
                    }`}></div>
                    <span className="text-lg font-semibold">
                      Caixa {cashRegister.status === 'aberto' ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm">
                      {cashRegister.status === 'aberto' ? 'Aberto' : 'Fechado'} em {formatDateTime(cashRegister.status === 'aberto' ? cashRegister.openedAt : cashRegister.closedAt || '')}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    Operador: {cashRegister.status === 'aberto' ? cashRegister.openedBy : cashRegister.closedBy}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm mb-1">Saldo Atual</p>
                  <p className="text-3xl font-bold">{formatCurrency(currentBalance)}</p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CashIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-sm text-slate-500">Valor Inicial</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(cashRegister.initialAmount)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <IncomeIcon className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-sm text-slate-500">Entradas (Vendas)</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntries)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ArrowUpIcon className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-sm text-slate-500">Reforcos</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalReforcos)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <ArrowDownIcon className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-sm text-slate-500">Sangrias</span>
                </div>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalSangrias)}</p>
              </motion.div>
            </div>

            {/* Closed Summary */}
            {cashRegister.status === 'fechado' && cashRegister.difference !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-6 mb-6 ${
                  cashRegister.difference === 0
                    ? 'bg-green-50 border border-green-200'
                    : cashRegister.difference > 0
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3 className="font-semibold text-slate-800 mb-4">Resumo do Fechamento</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Valor Esperado</p>
                    <p className="text-xl font-bold text-slate-800">{formatCurrency(cashRegister.expectedAmount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Valor Informado</p>
                    <p className="text-xl font-bold text-slate-800">{formatCurrency(cashRegister.finalAmount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Diferenca</p>
                    <p className={`text-xl font-bold ${
                      cashRegister.difference === 0
                        ? 'text-green-600'
                        : cashRegister.difference > 0
                        ? 'text-blue-600'
                        : 'text-red-600'
                    }`}>
                      {cashRegister.difference > 0 ? '+' : ''}{formatCurrency(cashRegister.difference)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Movements Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden"
            >
              <div className="p-6 border-b border-rose-100">
                <h2 className="text-lg font-semibold text-slate-800">Movimentacoes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Hora</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Tipo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Descricao</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Operador</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cashRegister.movements.map((movement, idx) => {
                      const config = movementTypeConfig[movement.type];
                      const Icon = config.icon;
                      return (
                        <motion.tr
                          key={movement.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * idx }}
                          className="hover:bg-slate-50/50"
                        >
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(movement.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                              {config.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-800">{movement.description}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{movement.createdBy}</td>
                          <td className={`px-6 py-4 text-sm font-semibold text-right ${
                            movement.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {movement.amount >= 0 ? '+' : ''}{formatCurrency(movement.amount)}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 text-center"
          >
            <CashIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Nenhum caixa aberto</h2>
            <p className="text-slate-500 mb-6">Abra o caixa para comecar a registrar movimentacoes.</p>
            <button
              onClick={() => setShowOpenModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              <CashIcon className="w-5 h-5" />
              Abrir Caixa
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>

      {/* Open Cash Register Modal */}
      <AnimatePresence>
        {showOpenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Abrir Caixa</h2>
                <button
                  onClick={() => setShowOpenModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor Inicial (Fundo de Troco)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                  <input
                    type="number"
                    value={initialAmount}
                    onChange={e => setInitialAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xl"
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg mb-6">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-800">Data e Hora</p>
                  <p className="font-medium text-blue-900">{new Date().toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <button
                onClick={handleOpenCashRegister}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Abrindo...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Confirmar Abertura
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Cash Register Modal */}
      <AnimatePresence>
        {showCloseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Fechar Caixa</h2>
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-500 mb-1">Valor Esperado em Caixa</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(currentBalance)}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor Contado no Caixa
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                  <input
                    type="number"
                    value={finalAmount}
                    onChange={e => setFinalAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xl"
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {finalAmount && (
                <div className={`p-4 rounded-lg mb-6 ${
                  parseFloat(finalAmount) === currentBalance
                    ? 'bg-green-50 border border-green-200'
                    : parseFloat(finalAmount) > currentBalance
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className="text-sm text-slate-600 mb-1">Diferenca</p>
                  <p className={`text-xl font-bold ${
                    parseFloat(finalAmount) === currentBalance
                      ? 'text-green-600'
                      : parseFloat(finalAmount) > currentBalance
                      ? 'text-blue-600'
                      : 'text-red-600'
                  }`}>
                    {(parseFloat(finalAmount) || 0) - currentBalance > 0 ? '+' : ''}
                    {formatCurrency((parseFloat(finalAmount) || 0) - currentBalance)}
                  </p>
                </div>
              )}

              <button
                onClick={handleCloseCashRegister}
                disabled={isProcessing || !finalAmount}
                className="w-full py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Fechando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Confirmar Fechamento
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Movement Modal */}
      <AnimatePresence>
        {showMovementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {movementType === 'sangria' ? 'Sangria de Caixa' : 'Reforco de Caixa'}
                </h2>
                <button
                  onClick={() => setShowMovementModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                  <input
                    type="number"
                    value={movementAmount}
                    onChange={e => setMovementAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xl"
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descricao (opcional)
                </label>
                <input
                  type="text"
                  value={movementDescription}
                  onChange={e => setMovementDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                  placeholder={movementType === 'sangria' ? 'Ex: Sangria de seguranca' : 'Ex: Troco adicional'}
                />
              </div>

              <button
                onClick={handleAddMovement}
                disabled={isProcessing || !movementAmount || parseFloat(movementAmount) <= 0}
                className={`w-full py-3 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  movementType === 'sangria'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Confirmar {movementType === 'sangria' ? 'Sangria' : 'Reforco'}
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  SalesIcon,
  ChevronRightIcon,
  PrintIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CashIcon,
  ScaleIcon,
} from '@/components/Icons';
import {
  mockSales,
  mockKiosks,
  formatCurrency,
  formatDateTime,
  PaymentMethod,
  Sale,
} from '@/lib/data';

const paymentMethodLabels: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  debito: 'Debito',
  credito: 'Credito',
};

const paymentMethodColors: Record<PaymentMethod, string> = {
  dinheiro: 'bg-green-100 text-green-700',
  pix: 'bg-purple-100 text-purple-700',
  debito: 'bg-blue-100 text-blue-700',
  credito: 'bg-amber-100 text-amber-700',
};

export default function VendaDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const saleId = params.id as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const sale: Sale | undefined = mockSales.find(s => s.id === saleId);
  const kiosk = sale ? mockKiosks.find(k => k.id === sale.kioskId) : null;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Sidebar />
        <main className="lg:ml-[280px] p-4 lg:p-8">
          <div className="bg-white rounded-xl p-8 text-center">
            <SalesIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Venda nao encontrada</h2>
            <p className="text-slate-500 mb-6">A venda #{saleId} nao foi encontrada no sistema.</p>
            <Link
              href="/pdv/vendas"
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors"
            >
              Voltar para Vendas
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const saleDate = new Date(sale.createdAt);

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/pdv/vendas" className="hover:text-rose-500 transition-colors">
            Vendas
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800 font-medium">Venda #{sale.id}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center gap-3"
            >
              <SalesIcon className="w-8 h-8 text-rose-500" />
              Venda #{sale.id}
            </motion.h1>
            <p className="text-slate-500 mt-1">Detalhes da venda</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <PrintIcon className="w-5 h-5" />
            Imprimir Comprovante
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sale Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-rose-100"
          >
            <div className="p-6 border-b border-rose-100">
              <h2 className="text-lg font-semibold text-slate-800">Informacoes da Venda</h2>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-sm">Data</span>
                </div>
                <p className="font-medium text-slate-800">
                  {saleDate.toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm">Hora</span>
                </div>
                <p className="font-medium text-slate-800">
                  {saleDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">Operador</span>
                </div>
                <p className="font-medium text-slate-800">{sale.operatorName}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <CashIcon className="w-4 h-4" />
                  <span className="text-sm">Pagamento</span>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${paymentMethodColors[sale.paymentMethod]}`}>
                  {paymentMethodLabels[sale.paymentMethod]}
                </span>
              </div>
            </div>

            {kiosk && (
              <div className="px-6 pb-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Quiosque</p>
                  <p className="font-medium text-slate-800">{kiosk.name}</p>
                  <p className="text-sm text-slate-500">{kiosk.address}</p>
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-slate-800 mb-4">Itens da Venda</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border border-slate-100 rounded-lg">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Produto</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Qtd</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Unidade</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Preco/Kg</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sale.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-sm text-slate-800">{item.productName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-center">
                          {item.quantity.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-center">
                          {item.unit === 'kg' ? 'Kg' : item.unit === 'litro' ? 'L' : 'Un'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 text-right">
                          {formatCurrency(item.pricePerUnit)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800 text-right">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Total Card */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Resumo</h3>

              {sale.weight && (
                <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg mb-4">
                  <ScaleIcon className="w-6 h-6 text-rose-500" />
                  <div>
                    <p className="text-sm text-slate-500">Peso Total</p>
                    <p className="text-xl font-bold text-slate-800">{sale.weight.toFixed(3)} kg</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-700">{formatCurrency(sale.subtotal)}</span>
                </div>

                {sale.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Desconto</span>
                    <span className="font-medium text-green-600">- {formatCurrency(sale.discount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-800">Total</span>
                    <span className="text-2xl font-bold text-rose-500">{formatCurrency(sale.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Acoes</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  <PrintIcon className="w-5 h-5" />
                  Reimprimir Cupom
                </button>
                <Link
                  href="/pdv/vendas"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Voltar para Lista
                </Link>
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

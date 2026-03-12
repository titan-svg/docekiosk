'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  ChevronRightIcon,
  EditIcon,
  TrashIcon,
  IceCreamIcon,
  AcaiIcon,
  FruitIcon,
  ChocolateIcon,
  ToppingIcon,
  SupplierIcon,
  ProductIcon,
  FinanceIcon,
  CartIcon,
  CalendarIcon,
} from '@/components/Icons';
import {
  mockSuppliers,
  mockProducts,
  mockStockEntries,
  mockTransactions,
  formatCurrency,
  formatDate,
  getCategoryLabel,
  getUnitLabel,
  Supplier,
  ProductCategory,
} from '@/lib/data';

const categoryIcons: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  sorvete: IceCreamIcon,
  acai: AcaiIcon,
  fruta: FruitIcon,
  chocolate: ChocolateIcon,
  topping: ToppingIcon,
};

const categoryColors: Record<ProductCategory, { bg: string; text: string }> = {
  sorvete: { bg: 'bg-pink-100', text: 'text-pink-600' },
  acai: { bg: 'bg-purple-100', text: 'text-purple-600' },
  fruta: { bg: 'bg-green-100', text: 'text-green-600' },
  chocolate: { bg: 'bg-amber-100', text: 'text-amber-600' },
  topping: { bg: 'bg-blue-100', text: 'text-blue-600' },
};

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const id = params.id as string;
    const foundSupplier = mockSuppliers.find(s => s.id === id);
    setSupplier(foundSupplier || null);
  }, [params.id]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Sidebar />
        <main className="lg:ml-[280px] p-4 lg:p-8">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Fornecedor nao encontrado</h1>
            <p className="text-slate-500 mb-6">O fornecedor que voce esta procurando nao existe ou foi removido.</p>
            <Link
              href="/fornecedores"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              Voltar para Fornecedores
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Get products from this supplier
  const supplierProducts = mockProducts.filter(p => p.supplierId === supplier.id);

  // Get stock entries (purchases) from this supplier
  const stockEntries = mockStockEntries.filter(e => e.supplierId === supplier.id);
  const totalPurchases = stockEntries.reduce((sum, e) => sum + e.totalPrice, 0);

  // Get pending payments to this supplier
  const pendingPayments = mockTransactions.filter(
    t => t.supplierId === supplier.id && t.status === 'pendente'
  );
  const totalPending = pendingPayments.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <Link href="/fornecedores" className="hover:text-rose-500 transition-colors">
            Fornecedores
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">{supplier.name}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
              {supplier.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{supplier.name}</h1>
              <p className="text-slate-500 mt-1">{supplier.cnpj}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {supplier.categories.map(cat => {
                  const Icon = categoryIcons[cat];
                  const colors = categoryColors[cat];
                  return (
                    <span
                      key={cat}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {getCategoryLabel(cat)}
                    </span>
                  );
                })}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  supplier.active
                    ? 'bg-green-100 text-green-600'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {supplier.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              <EditIcon className="w-4 h-4" />
              Editar
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
              <TrashIcon className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <ProductIcon className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Produtos</p>
            <p className="text-2xl font-bold text-slate-800">{supplierProducts.length}</p>
            <p className="text-xs text-slate-400 mt-1">{supplierProducts.filter(p => p.active).length} ativos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CartIcon className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total em Compras</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalPurchases)}</p>
            <p className="text-xs text-slate-400 mt-1">{stockEntries.length} pedidos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FinanceIcon className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Pendente</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-slate-400 mt-1">{pendingPayments.length} pagamento(s)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Ultima Compra</p>
            <p className="text-2xl font-bold text-slate-800">
              {stockEntries.length > 0 ? formatDate(stockEntries[0].entryDate) : '-'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {stockEntries.length > 0 ? formatCurrency(stockEntries[0].totalPrice) : 'Sem compras'}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Informacoes de Contato</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Pessoa de Contato</span>
                <span className="font-medium text-slate-700">{supplier.contactPerson}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Telefone</span>
                <span className="font-medium text-slate-700">{supplier.phone}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <a href={`mailto:${supplier.email}`} className="font-medium text-rose-500 hover:text-rose-600">
                  {supplier.email}
                </a>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Endereco</span>
                <span className="font-medium text-slate-700 text-right">{supplier.address}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-500">Cidade/Estado</span>
                <span className="font-medium text-slate-700">{supplier.city} - {supplier.state}</span>
              </div>
            </div>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Produtos deste Fornecedor</h2>
              <Link
                href={`/produtos?fornecedor=${supplier.id}`}
                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
              >
                Ver todos
              </Link>
            </div>
            {supplierProducts.length > 0 ? (
              <div className="space-y-3">
                {supplierProducts.slice(0, 5).map(product => {
                  const Icon = categoryIcons[product.category];
                  const colors = categoryColors[product.category];
                  return (
                    <Link
                      key={product.id}
                      href={`/produtos/${product.id}`}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">{getCategoryLabel(product.category)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-700">{formatCurrency(product.pricePerKg)}</p>
                        <p className="text-xs text-slate-500">/{getUnitLabel(product.unit)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhum produto cadastrado para este fornecedor.</p>
            )}
          </motion.div>

          {/* Purchase History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Historico de Compras</h2>
              <Link
                href="/estoque/entradas"
                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
              >
                Ver todas
              </Link>
            </div>
            {stockEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Data</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Produto</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Quantidade</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Preco Unit.</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Total</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">NF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockEntries.map(entry => (
                      <tr key={entry.id} className="border-b border-slate-50">
                        <td className="py-3 text-slate-700">{formatDate(entry.entryDate)}</td>
                        <td className="py-3">
                          <Link href={`/produtos/${entry.productId}`} className="font-medium text-slate-800 hover:text-rose-500">
                            {entry.productName}
                          </Link>
                        </td>
                        <td className="py-3 text-slate-700">{entry.quantity} {getUnitLabel(entry.unit)}</td>
                        <td className="py-3 text-slate-700">{formatCurrency(entry.unitPrice)}</td>
                        <td className="py-3 font-medium text-slate-800">{formatCurrency(entry.totalPrice)}</td>
                        <td className="py-3 text-slate-500">{entry.invoiceNumber || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50">
                      <td colSpan={4} className="py-3 font-semibold text-slate-800 text-right">Total:</td>
                      <td className="py-3 font-bold text-slate-800">{formatCurrency(totalPurchases)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhuma compra registrada para este fornecedor.</p>
            )}
          </motion.div>

          {/* Pending Payments */}
          {pendingPayments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Pagamentos Pendentes</h2>
                <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium">
                  {formatCurrency(totalPending)} pendente
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Descricao</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Valor</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Vencimento</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.map(payment => (
                      <tr key={payment.id} className="border-b border-slate-50">
                        <td className="py-3 text-slate-800">{payment.description}</td>
                        <td className="py-3 font-medium text-slate-800">{formatCurrency(payment.amount)}</td>
                        <td className="py-3 text-slate-700">{payment.dueDate ? formatDate(payment.dueDate) : '-'}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'atrasado'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}>
                            {payment.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

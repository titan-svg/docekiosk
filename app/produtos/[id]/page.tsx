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
  InventoryIcon,
  FinanceIcon,
  TrendIcon,
  AlertIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@/components/Icons';
import {
  mockProducts,
  mockSuppliers,
  mockStockEntries,
  mockSales,
  formatCurrency,
  formatDate,
  getCategoryLabel,
  getUnitLabel,
  Product,
  ProductCategory,
} from '@/lib/data';

const categoryIcons: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  sorvete: IceCreamIcon,
  acai: AcaiIcon,
  fruta: FruitIcon,
  chocolate: ChocolateIcon,
  topping: ToppingIcon,
};

const categoryColors: Record<ProductCategory, { bg: string; text: string; border: string }> = {
  sorvete: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
  acai: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  fruta: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  chocolate: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
  topping: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const id = params.id as string;
    const foundProduct = mockProducts.find(p => p.id === id);
    setProduct(foundProduct || null);
  }, [params.id]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-50 lg:flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Produto nao encontrado</h1>
            <p className="text-slate-500 mb-6">O produto que voce esta procurando nao existe ou foi removido.</p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              Voltar para Produtos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const supplier = mockSuppliers.find(s => s.id === product.supplierId);
  const Icon = categoryIcons[product.category];
  const colors = categoryColors[product.category];
  const isLowStock = product.stockCurrent <= product.stockMin;
  const marginPercent = ((product.pricePerKg - product.cost) / product.pricePerKg * 100).toFixed(1);

  // Get stock entries for this product
  const stockEntries = mockStockEntries.filter(e => e.productId === product.id).slice(0, 5);

  // Calculate sales data for this product
  const productSales = mockSales.flatMap(sale =>
    sale.items.filter(item => item.productId === product.id)
  );
  const totalQuantitySold = productSales.reduce((sum, item) => sum + item.quantity, 0);
  const totalRevenue = productSales.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6"
        >
          <Link href="/produtos" className="hover:text-rose-500 transition-colors">
            Produtos
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-800">{product.name}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${colors.bg}`}>
              <Icon className={`w-8 h-8 ${colors.text}`} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                  <Icon className="w-4 h-4" />
                  {getCategoryLabel(product.category)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.active
                    ? 'bg-green-100 text-green-600'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {product.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/produtos/${product.id}/editar`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              <EditIcon className="w-4 h-4" />
              Editar
            </Link>
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
                <FinanceIcon className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Preco de Venda</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(product.pricePerKg)}</p>
            <p className="text-xs text-slate-400 mt-1">por {getUnitLabel(product.unit)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendIcon className="w-6 h-6 text-green-500" />
              </div>
              <span className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpIcon className="w-4 h-4 mr-1" />
                {marginPercent}%
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Margem de Lucro</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(product.pricePerKg - product.cost)}</p>
            <p className="text-xs text-slate-400 mt-1">Custo: {formatCurrency(product.cost)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white rounded-xl p-6 shadow-sm border ${isLowStock ? 'border-red-200' : 'border-rose-100'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isLowStock ? 'bg-red-100' : 'bg-amber-100'}`}>
                <InventoryIcon className={`w-6 h-6 ${isLowStock ? 'text-red-500' : 'text-amber-500'}`} />
              </div>
              {isLowStock && (
                <span className="flex items-center text-sm text-red-500 font-medium">
                  <AlertIcon className="w-4 h-4 mr-1" />
                  Baixo
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-1">Estoque Atual</p>
            <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
              {product.stockCurrent} {getUnitLabel(product.unit)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Min: {product.stockMin} {getUnitLabel(product.unit)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendIcon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Vendido</p>
            <p className="text-2xl font-bold text-slate-800">{totalQuantitySold.toFixed(2)} {getUnitLabel(product.unit)}</p>
            <p className="text-xs text-slate-400 mt-1">Receita: {formatCurrency(totalRevenue)}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Detalhes do Produto</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Categoria</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {getCategoryLabel(product.category)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Unidade de Medida</span>
                <span className="font-medium text-slate-700">{getUnitLabel(product.unit)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Preco de Venda</span>
                <span className="font-medium text-slate-700">{formatCurrency(product.pricePerKg)}/{getUnitLabel(product.unit)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Custo</span>
                <span className="font-medium text-slate-700">{formatCurrency(product.cost)}/{getUnitLabel(product.unit)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Estoque Minimo</span>
                <span className="font-medium text-slate-700">{product.stockMin} {getUnitLabel(product.unit)}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-500">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                  product.active
                    ? 'bg-green-100 text-green-600'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {product.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Supplier Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Fornecedor</h2>
              {supplier && (
                <Link
                  href={`/fornecedores/${supplier.id}`}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  Ver detalhes
                </Link>
              )}
            </div>
            {supplier ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <SupplierIcon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{supplier.name}</p>
                    <p className="text-sm text-slate-500">{supplier.cnpj}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Contato</span>
                    <span className="font-medium text-slate-700">{supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Telefone</span>
                    <span className="font-medium text-slate-700">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-700 text-sm">{supplier.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500">Cidade</span>
                    <span className="font-medium text-slate-700">{supplier.city} - {supplier.state}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Fornecedor nao encontrado</p>
            )}
          </motion.div>

          {/* Stock History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Historico de Entradas</h2>
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
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Fornecedor</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Quantidade</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Preco Unit.</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">Total</th>
                      <th className="text-left py-3 text-sm font-medium text-slate-500">NF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockEntries.map((entry, idx) => (
                      <tr key={entry.id} className="border-b border-slate-50">
                        <td className="py-3 text-slate-700">{formatDate(entry.entryDate)}</td>
                        <td className="py-3 text-slate-700">{entry.supplierName}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <ArrowUpIcon className="w-3 h-3" />
                            +{entry.quantity} {getUnitLabel(entry.unit)}
                          </span>
                        </td>
                        <td className="py-3 text-slate-700">{formatCurrency(entry.unitPrice)}</td>
                        <td className="py-3 font-medium text-slate-800">{formatCurrency(entry.totalPrice)}</td>
                        <td className="py-3 text-slate-500">{entry.invoiceNumber || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhuma entrada registrada para este produto.</p>
            )}
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

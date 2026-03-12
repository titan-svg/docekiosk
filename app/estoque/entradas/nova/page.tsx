'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  EntryIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  SupplierIcon,
  WarningIcon,
  ProductIcon,
} from '@/components/Icons';
import {
  mockProducts,
  mockSuppliers,
  mockStockEntries,
  getCategoryLabel,
  getUnitLabel,
  formatCurrency,
  Product,
  Supplier,
} from '@/lib/data';

export default function NovaEntradaPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Search states
  const [productSearch, setProductSearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

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

  const filteredProducts = mockProducts.filter(p =>
    p.active && p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredSuppliers = mockSuppliers.filter(s =>
    s.active && s.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const totalPrice = quantity * unitPrice;

  // Calculate weighted average price for the product
  const calculateWeightedAverage = () => {
    if (!selectedProduct) return 0;

    const previousEntries = mockStockEntries.filter(e => e.productId === selectedProduct.id);
    const totalPreviousQty = previousEntries.reduce((sum, e) => sum + e.quantity, 0);
    const totalPreviousValue = previousEntries.reduce((sum, e) => sum + e.totalPrice, 0);

    const totalQty = totalPreviousQty + quantity;
    const totalValue = totalPreviousValue + totalPrice;

    return totalQty > 0 ? totalValue / totalQty : unitPrice;
  };

  const weightedAverage = calculateWeightedAverage();

  const canSubmit = selectedProduct && selectedSupplier && quantity > 0 && unitPrice > 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/estoque/entradas');
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Sidebar />

      <main className="lg:ml-[280px] p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-bold text-slate-800"
          >
            Nova Entrada de Estoque
          </motion.h1>
          <p className="text-slate-500 mt-1">
            {step === 'form' ? 'Preencha os dados da entrada' : 'Revise e confirme a entrada'}
          </p>
        </div>

        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            {/* Product Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ProductIcon className="w-5 h-5 text-rose-500" />
                Produto
              </h3>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={selectedProduct ? selectedProduct.name : productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setSelectedProduct(null);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />

                {showProductDropdown && !selectedProduct && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setProductSearch('');
                          setShowProductDropdown(false);
                          // Auto-fill unit price with cost
                          if (unitPrice === 0) {
                            setUnitPrice(product.cost);
                          }
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-rose-50 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{product.name}</p>
                          <p className="text-sm text-slate-500">{getCategoryLabel(product.category)}</p>
                        </div>
                        <span className="text-sm text-slate-500">
                          {product.stockCurrent} {getUnitLabel(product.unit)}
                        </span>
                      </button>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="px-4 py-3 text-slate-500">Nenhum produto encontrado</p>
                    )}
                  </div>
                )}
              </div>

              {selectedProduct && (
                <div className="mt-4 p-4 bg-rose-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <ProductIcon className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{selectedProduct.name}</p>
                      <p className="text-sm text-slate-500">
                        Estoque atual: {selectedProduct.stockCurrent} {getUnitLabel(selectedProduct.unit)} |
                        Custo: {formatCurrency(selectedProduct.cost)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 hover:bg-rose-100 rounded"
                  >
                    <XIcon className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Supplier Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <SupplierIcon className="w-5 h-5 text-rose-500" />
                Fornecedor
              </h3>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar fornecedor..."
                  value={selectedSupplier ? selectedSupplier.name : supplierSearch}
                  onChange={(e) => {
                    setSupplierSearch(e.target.value);
                    setSelectedSupplier(null);
                    setShowSupplierDropdown(true);
                  }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />

                {showSupplierDropdown && !selectedSupplier && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuppliers.map(supplier => (
                      <button
                        key={supplier.id}
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setSupplierSearch('');
                          setShowSupplierDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-rose-50"
                      >
                        <p className="font-medium text-slate-800">{supplier.name}</p>
                        <p className="text-sm text-slate-500">{supplier.city} - {supplier.state}</p>
                      </button>
                    ))}
                    {filteredSuppliers.length === 0 && (
                      <p className="px-4 py-3 text-slate-500">Nenhum fornecedor encontrado</p>
                    )}
                  </div>
                )}
              </div>

              {selectedSupplier && (
                <div className="mt-4 p-4 bg-rose-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <SupplierIcon className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{selectedSupplier.name}</p>
                      <p className="text-sm text-slate-500">
                        {selectedSupplier.contactPerson} | {selectedSupplier.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSupplier(null)}
                    className="p-1 hover:bg-rose-100 rounded"
                  >
                    <XIcon className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Quantity and Price */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <EntryIcon className="w-5 h-5 text-rose-500" />
                Quantidade e Valores
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantidade {selectedProduct && `(${getUnitLabel(selectedProduct.unit)})`}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preco Unitario (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitPrice || ''}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Data da Entrada
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Numero da Nota Fiscal (opcional)
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Ex: NF-001234"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Total and Average Price Info */}
              {quantity > 0 && unitPrice > 0 && selectedProduct && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Valor Total da Entrada</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPrice)}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Preco Medio Ponderado</p>
                    <p className="text-2xl font-bold text-amber-600">{formatCurrency(weightedAverage)}</p>
                    <p className="text-xs text-slate-500 mt-1">Novo custo medio apos entrada</p>
                  </div>
                </div>
              )}

              {selectedProduct && unitPrice > selectedProduct.cost * 1.2 && (
                <div className="mt-4 flex items-center gap-2 text-amber-600 p-3 bg-amber-50 rounded-lg">
                  <WarningIcon className="w-5 h-5" />
                  <span className="text-sm">
                    O preco unitario esta 20% acima do custo cadastrado ({formatCurrency(selectedProduct.cost)})
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observacoes (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Adicione observacoes sobre esta entrada..."
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Link
                href="/estoque/entradas"
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                onClick={() => setStep('review')}
                disabled={!canSubmit}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Revisar Entrada
              </button>
            </div>
          </motion.div>
        )}

        {step === 'review' && selectedProduct && selectedSupplier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden mb-6">
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Resumo da Entrada</h3>
                <p className="text-sm text-slate-500">
                  Data: {new Date(entryDate).toLocaleDateString('pt-BR')} | Responsavel: {user.name}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="flex items-start gap-4 p-4 bg-rose-50 rounded-lg">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <ProductIcon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selectedProduct.name}</p>
                    <p className="text-sm text-slate-500">{getCategoryLabel(selectedProduct.category)}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Estoque atual: {selectedProduct.stockCurrent} {getUnitLabel(selectedProduct.unit)} |
                      Novo estoque: {(selectedProduct.stockCurrent + quantity).toFixed(2)} {getUnitLabel(selectedProduct.unit)}
                    </p>
                  </div>
                </div>

                {/* Supplier Info */}
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <SupplierIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{selectedSupplier.name}</p>
                    <p className="text-sm text-slate-500">{selectedSupplier.city} - {selectedSupplier.state}</p>
                    <p className="text-sm text-slate-500">{selectedSupplier.contactPerson} | {selectedSupplier.phone}</p>
                  </div>
                </div>

                {/* Details Table */}
                <table className="w-full">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 text-slate-500">Quantidade</td>
                      <td className="py-3 text-right font-medium text-slate-800">
                        {quantity} {getUnitLabel(selectedProduct.unit)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">Preco Unitario</td>
                      <td className="py-3 text-right font-medium text-slate-800">
                        {formatCurrency(unitPrice)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">Valor Total</td>
                      <td className="py-3 text-right font-bold text-green-600 text-lg">
                        {formatCurrency(totalPrice)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">Preco Medio Ponderado</td>
                      <td className="py-3 text-right font-medium text-amber-600">
                        {formatCurrency(weightedAverage)}
                      </td>
                    </tr>
                    {invoiceNumber && (
                      <tr>
                        <td className="py-3 text-slate-500">Nota Fiscal</td>
                        <td className="py-3 text-right font-medium text-slate-800">{invoiceNumber}</td>
                      </tr>
                    )}
                    {notes && (
                      <tr>
                        <td className="py-3 text-slate-500">Observacoes</td>
                        <td className="py-3 text-right text-slate-600">{notes}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep('form')}
                disabled={isSubmitting}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    <span>Confirmar Entrada</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>
    </div>
  );
}

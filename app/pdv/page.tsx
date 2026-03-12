'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import {
  ScaleIcon,
  CartIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  IceCreamIcon,
  AcaiIcon,
  FruitIcon,
  ChocolateIcon,
  ToppingIcon,
  CashIcon,
  PDVIcon,
} from '@/components/Icons';
import {
  mockProducts,
  ProductCategory,
  Product,
  SaleItem,
  PaymentMethod,
  formatCurrency,
  getCategoryLabel,
} from '@/lib/data';

interface CartItem extends SaleItem {
  id: string;
}

const categoryIcons: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  sorvete: IceCreamIcon,
  acai: AcaiIcon,
  fruta: FruitIcon,
  chocolate: ChocolateIcon,
  topping: ToppingIcon,
};

const categoryColors: Record<ProductCategory, string> = {
  sorvete: 'bg-pink-100 text-pink-600 border-pink-200',
  acai: 'bg-purple-100 text-purple-600 border-purple-200',
  fruta: 'bg-green-100 text-green-600 border-green-200',
  chocolate: 'bg-amber-100 text-amber-600 border-amber-200',
  topping: 'bg-rose-100 text-rose-600 border-rose-200',
};

const paymentMethods: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro', icon: 'cash' },
  { value: 'pix', label: 'PIX', icon: 'pix' },
  { value: 'debito', label: 'Debito', icon: 'card' },
  { value: 'credito', label: 'Credito', icon: 'card' },
];

export default function PDVPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [weight, setWeight] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('pix');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSaleId, setLastSaleId] = useState('');

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

  const categories: (ProductCategory | 'all')[] = ['all', 'sorvete', 'acai', 'fruta', 'chocolate', 'topping'];

  const filteredProducts = selectedCategory === 'all'
    ? mockProducts.filter(p => p.active)
    : mockProducts.filter(p => p.active && p.category === selectedCategory);

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;
  const totalWeight = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = () => {
    if (!selectedProduct || !weight) return;

    const weightNum = parseFloat(weight.replace(',', '.'));
    if (isNaN(weightNum) || weightNum <= 0) return;

    const itemTotal = weightNum * selectedProduct.pricePerKg;
    const newItem: CartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: weightNum,
      unit: selectedProduct.unit,
      pricePerUnit: selectedProduct.pricePerKg,
      total: itemTotal,
    };

    setCart([...cart, newItem]);
    setSelectedProduct(null);
    setWeight('');
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    const saleId = `VD${Date.now().toString().slice(-6)}`;
    setLastSaleId(saleId);
    setIsProcessing(false);
    setShowPaymentModal(false);
    setShowSuccessModal(true);

    // Limpar carrinho apos sucesso
    setCart([]);
    setDiscount(0);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 lg:flex">
      <Sidebar />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0 p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center gap-3"
            >
              <PDVIcon className="w-8 h-8 text-rose-500" />
              Ponto de Venda
            </motion.h1>
            <p className="text-slate-500 mt-1">
              Operador: {user.name} | {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ScaleIcon className="w-6 h-6 text-rose-500" />
            <span className="text-lg font-semibold text-slate-700">Self-Service por Peso</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="xl:col-span-2 space-y-4">
            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-rose-100"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => {
                  const Icon = cat === 'all' ? PDVIcon : categoryIcons[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {cat === 'all' ? 'Todos' : getCategoryLabel(cat)}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-rose-100"
            >
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Produtos Disponiveis</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map(product => {
                  const Icon = categoryIcons[product.category];
                  return (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedProduct?.id === product.id
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-slate-100 hover:border-rose-200 hover:bg-rose-50/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${categoryColors[product.category]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="font-medium text-slate-800 text-sm truncate">{product.name}</p>
                      <p className="text-rose-500 font-semibold">{formatCurrency(product.pricePerKg)}/kg</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Weight Input */}
            <AnimatePresence>
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-rose-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Informar Peso</h2>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="p-2 text-slate-400 hover:text-slate-600"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-slate-500 mb-1">Produto selecionado:</p>
                      <p className="font-semibold text-slate-800">{selectedProduct.name}</p>
                      <p className="text-rose-500">{formatCurrency(selectedProduct.pricePerKg)}/kg</p>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Peso (kg)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={weight}
                          onChange={e => setWeight(e.target.value)}
                          placeholder="0,000"
                          className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xl font-mono text-center"
                        />
                        <span className="text-slate-500 font-medium">kg</span>
                      </div>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-slate-500 mb-1">Total:</p>
                      <p className="text-2xl font-bold text-rose-500">
                        {formatCurrency(
                          (parseFloat(weight.replace(',', '.')) || 0) * selectedProduct.pricePerKg
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!weight || parseFloat(weight.replace(',', '.')) <= 0}
                    className="mt-4 w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar ao Carrinho
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-rose-100 h-fit sticky top-4"
          >
            <div className="p-4 border-b border-rose-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <CartIcon className="w-5 h-5 text-rose-500" />
                  Carrinho
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CartIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Carrinho vazio</p>
                  <p className="text-sm">Selecione produtos para adicionar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-slate-500">
                          {item.quantity.toFixed(3)} kg x {formatCurrency(item.pricePerUnit)}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-700">{formatCurrency(item.total)}</p>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-rose-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Peso total:</span>
                  <span className="font-medium text-slate-700">{totalWeight.toFixed(3)} kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Desconto:</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-24 px-2 py-1 text-right border border-slate-200 rounded focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-rose-100">
                  <span className="text-lg font-semibold text-slate-800">Total:</span>
                  <span className="text-2xl font-bold text-rose-500">{formatCurrency(total)}</span>
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  <CashIcon className="w-5 h-5" />
                  Finalizar Venda
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>&copy; 2026 DoceKiosk. Sistema de Gestao de Quiosques de Sobremesas.</p>
        </footer>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
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
                <h2 className="text-xl font-bold text-slate-800">Forma de Pagamento</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map(method => (
                  <button
                    key={method.value}
                    onClick={() => setSelectedPayment(method.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === method.value
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-slate-100 hover:border-rose-200'
                    }`}
                  >
                    <p className="font-semibold text-slate-800">{method.label}</p>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500">Desconto:</span>
                  <span className="font-medium text-green-600">- {formatCurrency(discount)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-lg font-semibold text-slate-800">Total:</span>
                  <span className="text-2xl font-bold text-rose-500">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Confirmar Pagamento
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
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
              className="bg-white rounded-2xl w-full max-w-md p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckIcon className="w-10 h-10 text-green-500" />
              </motion.div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">Venda Realizada!</h2>
              <p className="text-slate-500 mb-4">
                Venda #{lastSaleId} finalizada com sucesso.
              </p>
              <p className="text-3xl font-bold text-rose-500 mb-6">
                {formatCurrency(total)}
              </p>

              <button
                onClick={handleCloseSuccess}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
              >
                Nova Venda
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  LogoIcon,
  DashboardIcon,
  PDVIcon,
  ProductIcon,
  InventoryIcon,
  FinanceIcon,
  SupplierIcon,
  EmployeeIcon,
  ReportIcon,
  SettingsIcon,
  ChevronDownIcon,
  LogoutIcon,
  SalesIcon,
  CashIcon,
  CategoryIcon,
  CountIcon,
  EntryIcon,
  AlertIcon,
  IncomeIcon,
  ExpenseIcon,
  BillIcon,
  CashFlowIcon,
  DREIcon,
  PaymentIcon,
  TrendIcon,
  KioskIcon,
  UsersIcon,
  MenuIcon,
  XIcon,
} from './Icons';

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
  roles?: ('dono' | 'gerente' | 'operador')[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  {
    name: 'PDV',
    icon: PDVIcon,
    children: [
      { name: 'Ponto de Venda', href: '/pdv', icon: PDVIcon },
      { name: 'Vendas', href: '/pdv/vendas', icon: SalesIcon },
      { name: 'Caixa', href: '/pdv/caixa', icon: CashIcon },
    ],
  },
  {
    name: 'Produtos',
    icon: ProductIcon,
    children: [
      { name: 'Todos os Produtos', href: '/produtos', icon: ProductIcon },
      { name: 'Novo Produto', href: '/produtos/novo', icon: EntryIcon },
      { name: 'Categorias', href: '/produtos/categorias', icon: CategoryIcon },
    ],
  },
  {
    name: 'Estoque',
    icon: InventoryIcon,
    children: [
      { name: 'Visão Geral', href: '/estoque', icon: InventoryIcon },
      { name: 'Contagens', href: '/estoque/contagens', icon: CountIcon },
      { name: 'Entradas', href: '/estoque/entradas', icon: EntryIcon },
      { name: 'Alertas', href: '/estoque/alertas', icon: AlertIcon },
    ],
  },
  {
    name: 'Financeiro',
    icon: FinanceIcon,
    roles: ['dono', 'gerente'],
    children: [
      { name: 'Visão Geral', href: '/financeiro', icon: FinanceIcon },
      { name: 'Entradas', href: '/financeiro/entradas', icon: IncomeIcon },
      { name: 'Saídas', href: '/financeiro/saidas', icon: ExpenseIcon },
      { name: 'Contas a Pagar', href: '/financeiro/contas-pagar', icon: BillIcon },
      { name: 'Fluxo de Caixa', href: '/financeiro/fluxo-caixa', icon: CashFlowIcon },
      { name: 'DRE', href: '/financeiro/dre', icon: DREIcon },
    ],
  },
  { name: 'Fornecedores', href: '/fornecedores', icon: SupplierIcon },
  {
    name: 'Funcionários',
    icon: EmployeeIcon,
    roles: ['dono', 'gerente'],
    children: [
      { name: 'Todos', href: '/funcionarios', icon: EmployeeIcon },
      { name: 'Novo', href: '/funcionarios/novo', icon: EntryIcon },
      { name: 'Pagamentos', href: '/funcionarios/pagamentos', icon: PaymentIcon },
    ],
  },
  {
    name: 'Relatórios',
    icon: ReportIcon,
    roles: ['dono', 'gerente'],
    children: [
      { name: 'Vendas', href: '/relatorios/vendas', icon: SalesIcon },
      { name: 'Estoque', href: '/relatorios/estoque', icon: InventoryIcon },
      { name: 'Financeiro', href: '/relatorios/financeiro', icon: FinanceIcon },
      { name: 'Tendências', href: '/relatorios/tendencias', icon: TrendIcon },
    ],
  },
  {
    name: 'Configurações',
    icon: SettingsIcon,
    roles: ['dono'],
    children: [
      { name: 'Quiosques', href: '/configuracoes/quiosques', icon: KioskIcon },
      { name: 'Usuários', href: '/configuracoes/usuarios', icon: UsersIcon },
      { name: 'Alertas', href: '/configuracoes/alertas', icon: AlertIcon },
    ],
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Auto-expand active parent
  useEffect(() => {
    navigation.forEach(item => {
      if (item.children?.some(child => pathname.startsWith(child.href))) {
        setExpandedItems(prev => (prev.includes(item.name) ? prev : [...prev, item.name]));
      }
    });
  }, [pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some(child => pathname.startsWith(child.href));

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.some(role => hasPermission(role));
  };

  const filteredNavigation = navigation.filter(canAccess);

  return (
    <div className="min-h-screen bg-pink-50">
      {/* ========== MOBILE HEADER ========== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-rose-100 shadow-sm z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8" />
          <span className="font-bold text-slate-800">DoceKiosk</span>
        </Link>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
          {user.name.charAt(0)}
        </div>
      </header>

      {/* ========== MOBILE SIDEBAR OVERLAY ========== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 flex flex-col shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-rose-100">
                <div className="flex items-center gap-3">
                  <LogoIcon className="w-10 h-10" />
                  <div>
                    <h1 className="text-lg font-bold text-slate-800">DoceKiosk</h1>
                    <p className="text-xs text-slate-500">Self-Service Doces</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-3 overflow-y-auto">
                {filteredNavigation.map(item => (
                  <div key={item.name} className="mb-1">
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                            isParentActive(item.children)
                              ? 'bg-rose-50 text-rose-600'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            {item.name}
                          </span>
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform ${
                              expandedItems.includes(item.name) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedItems.includes(item.name) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 mt-1 space-y-1">
                                {item.children.map(child => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                                      isActive(child.href)
                                        ? 'bg-rose-500 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <child.icon className="w-4 h-4" />
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                          isActive(item.href!)
                            ? 'bg-rose-500 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="p-3 border-t border-rose-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                >
                  <LogoutIcon className="w-5 h-5" />
                  Sair
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========== DESKTOP SIDEBAR (FIXED) ========== */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[260px] bg-white border-r border-rose-100 flex-col z-30">
        <div className="flex items-center gap-3 p-4 border-b border-rose-100">
          <LogoIcon className="w-10 h-10" />
          <div>
            <h1 className="text-lg font-bold text-slate-800">DoceKiosk</h1>
            <p className="text-xs text-slate-500">Self-Service Doces</p>
          </div>
        </div>

        <div className="p-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {filteredNavigation.map(item => (
            <div key={item.name} className="mb-1">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isParentActive(item.children)
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </span>
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.includes(item.name) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItems.includes(item.name) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 mt-1 space-y-1">
                          {item.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                                isActive(child.href)
                                  ? 'bg-rose-500 text-white'
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <child.icon className="w-4 h-4" />
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(item.href!)
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-rose-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogoutIcon className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT AREA ========== */}
      {/* This is completely separate from the sidebar */}
      <div className="lg:ml-[260px]">
        {/* Spacer for mobile header */}
        <div className="h-14 lg:hidden" />

        {/* Main content */}
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

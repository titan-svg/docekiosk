'use client';

import { useState } from 'react';
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
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: DashboardIcon,
  },
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
  {
    name: 'Fornecedores',
    href: '/fornecedores',
    icon: SupplierIcon,
  },
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

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
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

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-rose-100">
        <LogoIcon className="w-10 h-10" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">DoceKiosk</h1>
          <p className="text-xs text-slate-500">Self-Service Doces</p>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-4 border-b border-rose-100">
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
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map(item => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isParentActive(item.children)
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
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
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 mt-1 space-y-1">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.href)
                                ? 'bg-rose-500 text-white'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
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
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href!)
                    ? 'bg-rose-500 text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-rose-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogoutIcon className="w-5 h-5" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md text-slate-600"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-white flex flex-col shadow-xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-rose-100 flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}

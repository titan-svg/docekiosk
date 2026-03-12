// DoceKiosk - Sistema de Quiosque de Sobremesas Self-Service
// Mock Data e Tipos

// ==================== TIPOS ====================

export type UserRole = 'dono' | 'gerente' | 'operador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  kioskId?: string;
  avatar?: string;
  phone?: string;
  active: boolean;
}

export interface Kiosk {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  manager?: string;
  active: boolean;
  createdAt: string;
}

export type ProductCategory = 'sorvete' | 'acai' | 'fruta' | 'chocolate' | 'topping';
export type ProductUnit = 'kg' | 'litro' | 'unidade';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: ProductUnit;
  pricePerKg: number;
  cost: number;
  stockMin: number;
  stockCurrent: number;
  supplierId: string;
  active: boolean;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  contactPerson: string;
  categories: ProductCategory[];
  active: boolean;
}

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  position: string;
  kioskId: string;
  salary: number;
  hireDate: string;
  active: boolean;
}

export type SaleType = 'peso' | 'item';
export type PaymentMethod = 'dinheiro' | 'pix' | 'debito' | 'credito';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  total: number;
}

export interface Sale {
  id: string;
  kioskId: string;
  operatorId: string;
  operatorName: string;
  type: SaleType;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  weight?: number;
}

export type TransactionType = 'entrada' | 'saida';
export type ExpenseCategory =
  | 'funcionario'
  | 'fornecedor'
  | 'insumo'
  | 'aluguel'
  | 'energia'
  | 'agua'
  | 'manutencao'
  | 'imposto'
  | 'outro';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: ExpenseCategory | 'venda';
  description: string;
  amount: number;
  kioskId: string;
  saleId?: string;
  supplierId?: string;
  employeeId?: string;
  dueDate?: string;
  paidAt?: string;
  status: 'pendente' | 'pago' | 'atrasado';
  createdAt: string;
}

export interface StockCount {
  id: string;
  kioskId: string;
  productId: string;
  productName: string;
  previousStock: number;
  currentStock: number;
  consumed: number;
  unit: ProductUnit;
  countedAt: string;
  countedBy: string;
}

export interface StockEntry {
  id: string;
  kioskId: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: ProductUnit;
  unitPrice: number;
  totalPrice: number;
  invoiceNumber?: string;
  entryDate: string;
  createdBy: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  kioskId: string;
  kioskName: string;
  currentStock: number;
  minimumStock: number;
  unit: ProductUnit;
  status: 'baixo' | 'critico';
  createdAt: string;
}

// ==================== DADOS MOCK ====================

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Eduardo Fernandes',
    email: 'eduardo@docekiosk.com.br',
    role: 'dono',
    avatar: 'https://ui-avatars.com/api/?name=Eduardo+Fernandes&background=f43f5e&color=fff',
    phone: '(11) 99999-1234',
    active: true,
  },
  {
    id: '2',
    name: 'Ana Paula Silva',
    email: 'ana.paula@docekiosk.com.br',
    role: 'gerente',
    kioskId: '1',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Paula&background=ec4899&color=fff',
    phone: '(11) 98888-5678',
    active: true,
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos@docekiosk.com.br',
    role: 'operador',
    kioskId: '1',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Santos&background=a855f7&color=fff',
    phone: '(11) 97777-9012',
    active: true,
  },
  {
    id: '4',
    name: 'Maria Oliveira',
    email: 'maria@docekiosk.com.br',
    role: 'operador',
    kioskId: '2',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Oliveira&background=8b5cf6&color=fff',
    phone: '(11) 96666-3456',
    active: true,
  },
];

export const mockKiosks: Kiosk[] = [
  {
    id: '1',
    name: 'Quiosque Shopping Center Norte',
    location: 'Shopping Center Norte',
    address: 'Av. Otto Baumgart, 500 - Piso L2',
    phone: '(11) 3333-1111',
    manager: 'Ana Paula Silva',
    active: true,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    name: 'Quiosque Shopping Ibirapuera',
    location: 'Shopping Ibirapuera',
    address: 'Av. Ibirapuera, 3103 - Piso 1',
    phone: '(11) 3333-2222',
    manager: 'João Mendes',
    active: true,
    createdAt: '2025-03-01',
  },
  {
    id: '3',
    name: 'Quiosque Shopping Morumbi',
    location: 'Shopping Morumbi',
    address: 'Av. Roque Petroni Jr, 1089 - Piso T',
    phone: '(11) 3333-3333',
    active: false,
    createdAt: '2025-06-01',
  },
];

export const mockProducts: Product[] = [
  // Sorvetes
  {
    id: '1',
    name: 'Sorvete de Chocolate Belga',
    category: 'sorvete',
    unit: 'litro',
    pricePerKg: 89.90,
    cost: 35.00,
    stockMin: 10,
    stockCurrent: 25,
    supplierId: '1',
    active: true,
  },
  {
    id: '2',
    name: 'Sorvete de Morango',
    category: 'sorvete',
    unit: 'litro',
    pricePerKg: 79.90,
    cost: 30.00,
    stockMin: 10,
    stockCurrent: 18,
    supplierId: '1',
    active: true,
  },
  {
    id: '3',
    name: 'Sorvete de Baunilha Premium',
    category: 'sorvete',
    unit: 'litro',
    pricePerKg: 84.90,
    cost: 32.00,
    stockMin: 10,
    stockCurrent: 22,
    supplierId: '1',
    active: true,
  },
  // Açaí
  {
    id: '4',
    name: 'Açaí Puro Tradicional',
    category: 'acai',
    unit: 'litro',
    pricePerKg: 69.90,
    cost: 28.00,
    stockMin: 15,
    stockCurrent: 35,
    supplierId: '2',
    active: true,
  },
  {
    id: '5',
    name: 'Açaí com Guaraná',
    category: 'acai',
    unit: 'litro',
    pricePerKg: 74.90,
    cost: 30.00,
    stockMin: 15,
    stockCurrent: 8,
    supplierId: '2',
    active: true,
  },
  // Frutas
  {
    id: '6',
    name: 'Morango Fresco',
    category: 'fruta',
    unit: 'kg',
    pricePerKg: 45.90,
    cost: 18.00,
    stockMin: 5,
    stockCurrent: 12,
    supplierId: '3',
    active: true,
  },
  {
    id: '7',
    name: 'Banana Prata',
    category: 'fruta',
    unit: 'kg',
    pricePerKg: 25.90,
    cost: 8.00,
    stockMin: 8,
    stockCurrent: 15,
    supplierId: '3',
    active: true,
  },
  {
    id: '8',
    name: 'Kiwi',
    category: 'fruta',
    unit: 'kg',
    pricePerKg: 55.90,
    cost: 22.00,
    stockMin: 3,
    stockCurrent: 6,
    supplierId: '3',
    active: true,
  },
  {
    id: '9',
    name: 'Manga Palmer',
    category: 'fruta',
    unit: 'kg',
    pricePerKg: 35.90,
    cost: 12.00,
    stockMin: 5,
    stockCurrent: 3,
    supplierId: '3',
    active: true,
  },
  // Chocolates
  {
    id: '10',
    name: 'Chocolate ao Leite Cascata',
    category: 'chocolate',
    unit: 'kg',
    pricePerKg: 120.00,
    cost: 55.00,
    stockMin: 5,
    stockCurrent: 8,
    supplierId: '4',
    active: true,
  },
  {
    id: '11',
    name: 'Chocolate Branco Cascata',
    category: 'chocolate',
    unit: 'kg',
    pricePerKg: 125.00,
    cost: 58.00,
    stockMin: 5,
    stockCurrent: 7,
    supplierId: '4',
    active: true,
  },
  {
    id: '12',
    name: 'Chocolate Meio Amargo Cascata',
    category: 'chocolate',
    unit: 'kg',
    pricePerKg: 130.00,
    cost: 60.00,
    stockMin: 3,
    stockCurrent: 2,
    supplierId: '4',
    active: true,
  },
  // Toppings
  {
    id: '13',
    name: 'Granola',
    category: 'topping',
    unit: 'kg',
    pricePerKg: 35.00,
    cost: 12.00,
    stockMin: 3,
    stockCurrent: 8,
    supplierId: '5',
    active: true,
  },
  {
    id: '14',
    name: 'Castanha de Caju',
    category: 'topping',
    unit: 'kg',
    pricePerKg: 95.00,
    cost: 45.00,
    stockMin: 2,
    stockCurrent: 4,
    supplierId: '5',
    active: true,
  },
  {
    id: '15',
    name: 'Leite Condensado',
    category: 'topping',
    unit: 'unidade',
    pricePerKg: 8.90,
    cost: 4.50,
    stockMin: 20,
    stockCurrent: 45,
    supplierId: '5',
    active: true,
  },
  {
    id: '16',
    name: 'Confete Colorido',
    category: 'topping',
    unit: 'kg',
    pricePerKg: 28.00,
    cost: 10.00,
    stockMin: 3,
    stockCurrent: 6,
    supplierId: '5',
    active: true,
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Gelatto Premium LTDA',
    cnpj: '12.345.678/0001-90',
    email: 'contato@gelattopremium.com.br',
    phone: '(11) 4444-1111',
    address: 'Rua dos Sorvetes, 500',
    city: 'São Paulo',
    state: 'SP',
    contactPerson: 'Roberto Gelatto',
    categories: ['sorvete'],
    active: true,
  },
  {
    id: '2',
    name: 'Açaí da Amazônia',
    cnpj: '23.456.789/0001-01',
    email: 'vendas@acaidaamazonia.com.br',
    phone: '(92) 5555-2222',
    address: 'Av. das Palmeiras, 1000',
    city: 'Manaus',
    state: 'AM',
    contactPerson: 'Fernanda Costa',
    categories: ['acai'],
    active: true,
  },
  {
    id: '3',
    name: 'Frutas Frescas SP',
    cnpj: '34.567.890/0001-12',
    email: 'compras@frutasfrescas.com.br',
    phone: '(11) 6666-3333',
    address: 'CEAGESP - Box 123',
    city: 'São Paulo',
    state: 'SP',
    contactPerson: 'José Frutas',
    categories: ['fruta'],
    active: true,
  },
  {
    id: '4',
    name: 'Cacau Show Distribuidora',
    cnpj: '45.678.901/0001-23',
    email: 'atacado@cacaushow.com.br',
    phone: '(11) 7777-4444',
    address: 'Rua do Chocolate, 200',
    city: 'São Paulo',
    state: 'SP',
    contactPerson: 'Alexandre Cacau',
    categories: ['chocolate'],
    active: true,
  },
  {
    id: '5',
    name: 'Doces & Toppings Brasil',
    cnpj: '56.789.012/0001-34',
    email: 'vendas@docestoppings.com.br',
    phone: '(11) 8888-5555',
    address: 'Av. dos Doces, 750',
    city: 'São Paulo',
    state: 'SP',
    contactPerson: 'Carla Doce',
    categories: ['topping'],
    active: true,
  },
];

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ana Paula Silva',
    cpf: '123.456.789-00',
    email: 'ana.paula@docekiosk.com.br',
    phone: '(11) 98888-5678',
    position: 'Gerente',
    kioskId: '1',
    salary: 4500.00,
    hireDate: '2025-01-15',
    active: true,
  },
  {
    id: '2',
    name: 'Carlos Santos',
    cpf: '234.567.890-11',
    email: 'carlos@docekiosk.com.br',
    phone: '(11) 97777-9012',
    position: 'Operador de Caixa',
    kioskId: '1',
    salary: 2200.00,
    hireDate: '2025-02-01',
    active: true,
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    cpf: '345.678.901-22',
    email: 'maria@docekiosk.com.br',
    phone: '(11) 96666-3456',
    position: 'Operador de Caixa',
    kioskId: '2',
    salary: 2200.00,
    hireDate: '2025-03-15',
    active: true,
  },
  {
    id: '4',
    name: 'João Mendes',
    cpf: '456.789.012-33',
    email: 'joao@docekiosk.com.br',
    phone: '(11) 95555-7890',
    position: 'Gerente',
    kioskId: '2',
    salary: 4200.00,
    hireDate: '2025-03-01',
    active: true,
  },
  {
    id: '5',
    name: 'Luciana Ferreira',
    cpf: '567.890.123-44',
    email: 'luciana@docekiosk.com.br',
    phone: '(11) 94444-1234',
    position: 'Atendente',
    kioskId: '1',
    salary: 1800.00,
    hireDate: '2025-04-01',
    active: true,
  },
];

export const mockSales: Sale[] = [
  {
    id: '1',
    kioskId: '1',
    operatorId: '3',
    operatorName: 'Carlos Santos',
    type: 'peso',
    items: [
      { productId: '4', productName: 'Açaí Puro Tradicional', quantity: 0.35, unit: 'kg', pricePerUnit: 69.90, total: 24.47 },
      { productId: '6', productName: 'Morango Fresco', quantity: 0.05, unit: 'kg', pricePerUnit: 45.90, total: 2.30 },
      { productId: '13', productName: 'Granola', quantity: 0.03, unit: 'kg', pricePerUnit: 35.00, total: 1.05 },
    ],
    subtotal: 27.82,
    discount: 0,
    total: 27.82,
    paymentMethod: 'pix',
    weight: 0.43,
    createdAt: '2026-03-12T10:30:00',
  },
  {
    id: '2',
    kioskId: '1',
    operatorId: '3',
    operatorName: 'Carlos Santos',
    type: 'peso',
    items: [
      { productId: '1', productName: 'Sorvete de Chocolate Belga', quantity: 0.25, unit: 'kg', pricePerUnit: 89.90, total: 22.48 },
      { productId: '10', productName: 'Chocolate ao Leite Cascata', quantity: 0.08, unit: 'kg', pricePerUnit: 120.00, total: 9.60 },
    ],
    subtotal: 32.08,
    discount: 0,
    total: 32.08,
    paymentMethod: 'credito',
    weight: 0.33,
    createdAt: '2026-03-12T11:15:00',
  },
  {
    id: '3',
    kioskId: '2',
    operatorId: '4',
    operatorName: 'Maria Oliveira',
    type: 'peso',
    items: [
      { productId: '5', productName: 'Açaí com Guaraná', quantity: 0.50, unit: 'kg', pricePerUnit: 74.90, total: 37.45 },
      { productId: '7', productName: 'Banana Prata', quantity: 0.10, unit: 'kg', pricePerUnit: 25.90, total: 2.59 },
      { productId: '14', productName: 'Castanha de Caju', quantity: 0.02, unit: 'kg', pricePerUnit: 95.00, total: 1.90 },
    ],
    subtotal: 41.94,
    discount: 2.00,
    total: 39.94,
    paymentMethod: 'debito',
    weight: 0.62,
    createdAt: '2026-03-12T12:00:00',
  },
  {
    id: '4',
    kioskId: '1',
    operatorId: '3',
    operatorName: 'Carlos Santos',
    type: 'peso',
    items: [
      { productId: '2', productName: 'Sorvete de Morango', quantity: 0.20, unit: 'kg', pricePerUnit: 79.90, total: 15.98 },
      { productId: '3', productName: 'Sorvete de Baunilha Premium', quantity: 0.15, unit: 'kg', pricePerUnit: 84.90, total: 12.74 },
      { productId: '16', productName: 'Confete Colorido', quantity: 0.02, unit: 'kg', pricePerUnit: 28.00, total: 0.56 },
    ],
    subtotal: 29.28,
    discount: 0,
    total: 29.28,
    paymentMethod: 'dinheiro',
    weight: 0.37,
    createdAt: '2026-03-12T14:30:00',
  },
  {
    id: '5',
    kioskId: '2',
    operatorId: '4',
    operatorName: 'Maria Oliveira',
    type: 'peso',
    items: [
      { productId: '4', productName: 'Açaí Puro Tradicional', quantity: 0.70, unit: 'kg', pricePerUnit: 69.90, total: 48.93 },
      { productId: '6', productName: 'Morango Fresco', quantity: 0.10, unit: 'kg', pricePerUnit: 45.90, total: 4.59 },
      { productId: '8', productName: 'Kiwi', quantity: 0.05, unit: 'kg', pricePerUnit: 55.90, total: 2.80 },
      { productId: '13', productName: 'Granola', quantity: 0.05, unit: 'kg', pricePerUnit: 35.00, total: 1.75 },
    ],
    subtotal: 58.07,
    discount: 0,
    total: 58.07,
    paymentMethod: 'pix',
    weight: 0.90,
    createdAt: '2026-03-12T15:45:00',
  },
];

export const mockTransactions: Transaction[] = [
  // Entradas (vendas)
  ...mockSales.map((sale, idx) => ({
    id: `e${idx + 1}`,
    type: 'entrada' as TransactionType,
    category: 'venda' as const,
    description: `Venda #${sale.id} - ${sale.type === 'peso' ? 'Self-service' : 'À la carte'}`,
    amount: sale.total,
    kioskId: sale.kioskId,
    saleId: sale.id,
    status: 'pago' as const,
    createdAt: sale.createdAt,
  })),
  // Saídas
  {
    id: 's1',
    type: 'saida',
    category: 'funcionario',
    description: 'Salário - Ana Paula Silva',
    amount: 4500.00,
    kioskId: '1',
    employeeId: '1',
    dueDate: '2026-03-05',
    paidAt: '2026-03-05',
    status: 'pago',
    createdAt: '2026-03-01',
  },
  {
    id: 's2',
    type: 'saida',
    category: 'funcionario',
    description: 'Salário - Carlos Santos',
    amount: 2200.00,
    kioskId: '1',
    employeeId: '2',
    dueDate: '2026-03-05',
    paidAt: '2026-03-05',
    status: 'pago',
    createdAt: '2026-03-01',
  },
  {
    id: 's3',
    type: 'saida',
    category: 'fornecedor',
    description: 'Compra - Gelatto Premium LTDA',
    amount: 2500.00,
    kioskId: '1',
    supplierId: '1',
    dueDate: '2026-03-15',
    status: 'pendente',
    createdAt: '2026-03-08',
  },
  {
    id: 's4',
    type: 'saida',
    category: 'fornecedor',
    description: 'Compra - Açaí da Amazônia',
    amount: 1800.00,
    kioskId: '1',
    supplierId: '2',
    dueDate: '2026-03-10',
    paidAt: '2026-03-10',
    status: 'pago',
    createdAt: '2026-03-05',
  },
  {
    id: 's5',
    type: 'saida',
    category: 'aluguel',
    description: 'Aluguel - Shopping Center Norte',
    amount: 8500.00,
    kioskId: '1',
    dueDate: '2026-03-10',
    paidAt: '2026-03-10',
    status: 'pago',
    createdAt: '2026-03-01',
  },
  {
    id: 's6',
    type: 'saida',
    category: 'energia',
    description: 'Conta de Energia - Março',
    amount: 850.00,
    kioskId: '1',
    dueDate: '2026-03-20',
    status: 'pendente',
    createdAt: '2026-03-12',
  },
  {
    id: 's7',
    type: 'saida',
    category: 'fornecedor',
    description: 'Compra - Frutas Frescas SP',
    amount: 650.00,
    kioskId: '1',
    supplierId: '3',
    dueDate: '2026-03-08',
    status: 'atrasado',
    createdAt: '2026-03-01',
  },
];

export const mockStockCounts: StockCount[] = [
  {
    id: '1',
    kioskId: '1',
    productId: '4',
    productName: 'Açaí Puro Tradicional',
    previousStock: 40,
    currentStock: 35,
    consumed: 5,
    unit: 'litro',
    countedAt: '2026-03-10',
    countedBy: 'Ana Paula Silva',
  },
  {
    id: '2',
    kioskId: '1',
    productId: '1',
    productName: 'Sorvete de Chocolate Belga',
    previousStock: 28,
    currentStock: 25,
    consumed: 3,
    unit: 'litro',
    countedAt: '2026-03-10',
    countedBy: 'Ana Paula Silva',
  },
  {
    id: '3',
    kioskId: '1',
    productId: '6',
    productName: 'Morango Fresco',
    previousStock: 15,
    currentStock: 12,
    consumed: 3,
    unit: 'kg',
    countedAt: '2026-03-10',
    countedBy: 'Ana Paula Silva',
  },
];

export const mockStockEntries: StockEntry[] = [
  {
    id: '1',
    kioskId: '1',
    productId: '4',
    productName: 'Açaí Puro Tradicional',
    supplierId: '2',
    supplierName: 'Açaí da Amazônia',
    quantity: 20,
    unit: 'litro',
    unitPrice: 28.00,
    totalPrice: 560.00,
    invoiceNumber: 'NF-001234',
    entryDate: '2026-03-08',
    createdBy: 'Ana Paula Silva',
  },
  {
    id: '2',
    kioskId: '1',
    productId: '1',
    productName: 'Sorvete de Chocolate Belga',
    supplierId: '1',
    supplierName: 'Gelatto Premium LTDA',
    quantity: 15,
    unit: 'litro',
    unitPrice: 35.00,
    totalPrice: 525.00,
    invoiceNumber: 'NF-005678',
    entryDate: '2026-03-05',
    createdBy: 'Ana Paula Silva',
  },
  {
    id: '3',
    kioskId: '1',
    productId: '6',
    productName: 'Morango Fresco',
    supplierId: '3',
    supplierName: 'Frutas Frescas SP',
    quantity: 10,
    unit: 'kg',
    unitPrice: 18.00,
    totalPrice: 180.00,
    entryDate: '2026-03-10',
    createdBy: 'Carlos Santos',
  },
];

export const mockStockAlerts: StockAlert[] = [
  {
    id: '1',
    productId: '5',
    productName: 'Açaí com Guaraná',
    kioskId: '1',
    kioskName: 'Quiosque Shopping Center Norte',
    currentStock: 8,
    minimumStock: 15,
    unit: 'litro',
    status: 'baixo',
    createdAt: '2026-03-12',
  },
  {
    id: '2',
    productId: '9',
    productName: 'Manga Palmer',
    kioskId: '1',
    kioskName: 'Quiosque Shopping Center Norte',
    currentStock: 3,
    minimumStock: 5,
    unit: 'kg',
    status: 'baixo',
    createdAt: '2026-03-12',
  },
  {
    id: '3',
    productId: '12',
    productName: 'Chocolate Meio Amargo Cascata',
    kioskId: '1',
    kioskName: 'Quiosque Shopping Center Norte',
    currentStock: 2,
    minimumStock: 3,
    unit: 'kg',
    status: 'critico',
    createdAt: '2026-03-12',
  },
];

// ==================== FUNÇÕES AUXILIARES ====================

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

export const getSupplierById = (id: string): Supplier | undefined => {
  return mockSuppliers.find(s => s.id === id);
};

export const getKioskById = (id: string): Kiosk | undefined => {
  return mockKiosks.find(k => k.id === id);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find(e => e.id === id);
};

export const getCategoryLabel = (category: ProductCategory): string => {
  const labels: Record<ProductCategory, string> = {
    sorvete: 'Sorvete',
    acai: 'Açaí',
    fruta: 'Frutas',
    chocolate: 'Chocolates',
    topping: 'Toppings',
  };
  return labels[category];
};

export const getUnitLabel = (unit: ProductUnit): string => {
  const labels: Record<ProductUnit, string> = {
    kg: 'Kg',
    litro: 'L',
    unidade: 'Un',
  };
  return labels[unit];
};

export const getExpenseCategoryLabel = (category: ExpenseCategory): string => {
  const labels: Record<ExpenseCategory, string> = {
    funcionario: 'Funcionário',
    fornecedor: 'Fornecedor',
    insumo: 'Insumo',
    aluguel: 'Aluguel',
    energia: 'Energia',
    agua: 'Água',
    manutencao: 'Manutenção',
    imposto: 'Imposto',
    outro: 'Outro',
  };
  return labels[category];
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(3)} kg`;
};

export const getDashboardStats = () => {
  const today = '2026-03-12';
  const todaySales = mockSales.filter(s => s.createdAt.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

  const pendingBills = mockTransactions.filter(
    t => t.type === 'saida' && t.status === 'pendente'
  );
  const pendingAmount = pendingBills.reduce((sum, t) => sum + t.amount, 0);

  const overdueBills = mockTransactions.filter(
    t => t.type === 'saida' && t.status === 'atrasado'
  );
  const overdueAmount = overdueBills.reduce((sum, t) => sum + t.amount, 0);

  const lowStockCount = mockStockAlerts.filter(a => a.status === 'baixo').length;
  const criticalStockCount = mockStockAlerts.filter(a => a.status === 'critico').length;

  return {
    todaySales: todaySales.length,
    todayRevenue,
    pendingBills: pendingBills.length,
    pendingAmount,
    overdueBills: overdueBills.length,
    overdueAmount,
    lowStockCount,
    criticalStockCount,
    totalProducts: mockProducts.length,
    activeKiosks: mockKiosks.filter(k => k.active).length,
  };
};

export const getSalesTrend = () => {
  // Mock data for sales trend (last 7 days)
  return [
    { date: '06/03', sales: 45, revenue: 1850.50 },
    { date: '07/03', sales: 52, revenue: 2120.80 },
    { date: '08/03', sales: 38, revenue: 1580.20 },
    { date: '09/03', sales: 65, revenue: 2780.40 },
    { date: '10/03', sales: 58, revenue: 2450.60 },
    { date: '11/03', sales: 72, revenue: 3120.90 },
    { date: '12/03', sales: 48, revenue: 1980.30 },
  ];
};

export const getTopProducts = () => {
  return [
    { name: 'Açaí Puro Tradicional', sales: 145, revenue: 5820.50 },
    { name: 'Sorvete de Chocolate Belga', sales: 98, revenue: 4250.20 },
    { name: 'Açaí com Guaraná', sales: 87, revenue: 3580.80 },
    { name: 'Sorvete de Morango', sales: 76, revenue: 2890.40 },
    { name: 'Morango Fresco', sales: 65, revenue: 1580.50 },
  ];
};

export const getPeakHours = () => {
  return [
    { hour: '10:00', sales: 15 },
    { hour: '11:00', sales: 22 },
    { hour: '12:00', sales: 35 },
    { hour: '13:00', sales: 42 },
    { hour: '14:00', sales: 38 },
    { hour: '15:00', sales: 45 },
    { hour: '16:00', sales: 52 },
    { hour: '17:00', sales: 48 },
    { hour: '18:00', sales: 55 },
    { hour: '19:00', sales: 62 },
    { hour: '20:00', sales: 45 },
    { hour: '21:00', sales: 28 },
  ];
};

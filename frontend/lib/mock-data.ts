import type { Product, Order, User, InventoryItem, DashboardStats } from './types'

export const products: Product[] = [
  // Cafés
  {
    id: '1',
    name: 'Espresso Tradicional',
    description: 'Café espresso puro e intenso, extraído na medida perfeita',
    price: 8.90,
    image: '/products/espresso-tradicional.png',
    category: 'cafes',
    tags: ['quente', 'clássico', 'intenso'],
    available: true,
    preparationTime: 3,
    ingredients: ['Café 100% arábica'],
    nutritionalInfo: { calories: 5, protein: 0, carbs: 1, fat: 0 }
  },
  {
    id: '2',
    name: 'Cappuccino Italiano',
    description: 'Espresso com leite vaporizado e espuma cremosa, finalizado com canela',
    price: 14.90,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80',
    category: 'cafes',
    tags: ['quente', 'cremoso', 'favorito'],
    available: true,
    preparationTime: 5,
    ingredients: ['Café espresso', 'Leite integral', 'Canela'],
    nutritionalInfo: { calories: 120, protein: 6, carbs: 12, fat: 5 }
  },
  {
    id: '3',
    name: 'Latte Macchiato',
    description: 'Camadas de leite vaporizado e espresso, visual elegante',
    price: 15.90,
    image: '/products/latte-macchiato.png',
    category: 'cafes',
    tags: ['quente', 'suave', 'elegante'],
    available: true,
    preparationTime: 5,
    ingredients: ['Café espresso', 'Leite vaporizado'],
    nutritionalInfo: { calories: 150, protein: 8, carbs: 15, fat: 6 }
  },
  {
    id: '4',
    name: 'Mocha Premium',
    description: 'Espresso com chocolate belga e leite vaporizado, cobertura de chantilly',
    price: 18.90,
    image: '/products/mocha-premium.png',
    category: 'cafes',
    tags: ['quente', 'doce', 'chocolate'],
    available: true,
    preparationTime: 6,
    ingredients: ['Café espresso', 'Chocolate belga', 'Leite', 'Chantilly'],
    nutritionalInfo: { calories: 280, protein: 8, carbs: 35, fat: 12 }
  },
  {
    id: '5',
    name: 'Café Coado Especial',
    description: 'Café coado artesanalmente com grãos selecionados da fazenda',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    category: 'cafes',
    tags: ['quente', 'artesanal', 'suave'],
    available: true,
    preparationTime: 8,
    ingredients: ['Café especial single origin'],
    nutritionalInfo: { calories: 5, protein: 0, carbs: 1, fat: 0 }
  },
  // Bebidas Geladas
  {
    id: '6',
    name: 'Iced Latte',
    description: 'Espresso duplo com leite gelado e gelo, refrescante e encorpado',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80',
    category: 'bebidas-geladas',
    tags: ['gelado', 'refrescante', 'cremoso'],
    available: true,
    preparationTime: 4,
    ingredients: ['Café espresso', 'Leite gelado', 'Gelo'],
    nutritionalInfo: { calories: 130, protein: 7, carbs: 14, fat: 5 }
  },
  {
    id: '7',
    name: 'Frappuccino Caramelo',
    description: 'Bebida gelada cremosa com café, caramelo e chantilly',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
    category: 'bebidas-geladas',
    tags: ['gelado', 'doce', 'cremoso'],
    available: true,
    preparationTime: 6,
    ingredients: ['Café', 'Leite', 'Caramelo', 'Gelo', 'Chantilly'],
    nutritionalInfo: { calories: 380, protein: 6, carbs: 52, fat: 16 }
  },
  {
    id: '8',
    name: 'Cold Brew 12h',
    description: 'Café extraído a frio por 12 horas, sabor suave e adocicado natural',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80',
    category: 'bebidas-geladas',
    tags: ['gelado', 'premium', 'suave'],
    available: true,
    preparationTime: 2,
    ingredients: ['Café cold brew'],
    nutritionalInfo: { calories: 10, protein: 0, carbs: 2, fat: 0 }
  },
  // Lanches
  {
    id: '9',
    name: 'Croissant de Presunto e Queijo',
    description: 'Croissant folhado artesanal recheado com presunto e queijo gruyère',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    category: 'lanches',
    tags: ['quente', 'salgado', 'favorito'],
    available: true,
    preparationTime: 8,
    ingredients: ['Massa folhada', 'Presunto', 'Queijo gruyère'],
    nutritionalInfo: { calories: 380, protein: 15, carbs: 28, fat: 24 }
  },
  {
    id: '10',
    name: 'Sanduíche Caprese',
    description: 'Pão ciabatta com mozzarella de búfala, tomate e manjericão fresco',
    price: 24.90,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80',
    category: 'lanches',
    tags: ['vegetariano', 'fresco', 'leve'],
    available: true,
    preparationTime: 10,
    ingredients: ['Ciabatta', 'Mozzarella de búfala', 'Tomate', 'Manjericão', 'Azeite'],
    nutritionalInfo: { calories: 320, protein: 18, carbs: 32, fat: 14 }
  },
  {
    id: '11',
    name: 'Avocado Toast',
    description: 'Pão australiano com abacate, ovos pochê e pimenta calabresa',
    price: 28.90,
    image: '/products/avocado-toast.png',
    category: 'lanches',
    tags: ['saudável', 'premium', 'brunch'],
    available: true,
    preparationTime: 12,
    ingredients: ['Pão australiano', 'Abacate', 'Ovos', 'Pimenta calabresa'],
    nutritionalInfo: { calories: 420, protein: 16, carbs: 35, fat: 26 }
  },
  // Doces
  {
    id: '12',
    name: 'Brownie de Chocolate',
    description: 'Brownie denso de chocolate 70% com nozes, servido morno',
    price: 14.90,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    category: 'doces',
    tags: ['chocolate', 'quente', 'favorito'],
    available: true,
    preparationTime: 3,
    ingredients: ['Chocolate 70%', 'Manteiga', 'Ovos', 'Nozes'],
    nutritionalInfo: { calories: 380, protein: 5, carbs: 42, fat: 22 }
  },
  {
    id: '13',
    name: 'Cheesecake de Frutas Vermelhas',
    description: 'Cheesecake cremoso com calda artesanal de frutas vermelhas',
    price: 18.90,
    image: '/products/cheesecake-frutas-vermelhas.png',
    category: 'doces',
    tags: ['cremoso', 'frutas', 'premium'],
    available: true,
    preparationTime: 3,
    ingredients: ['Cream cheese', 'Biscoito', 'Frutas vermelhas'],
    nutritionalInfo: { calories: 420, protein: 8, carbs: 38, fat: 26 }
  },
  {
    id: '14',
    name: 'Tiramisù',
    description: 'Clássico italiano com café espresso, mascarpone e cacau',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
    category: 'doces',
    tags: ['café', 'italiano', 'cremoso'],
    available: true,
    preparationTime: 3,
    ingredients: ['Mascarpone', 'Café espresso', 'Biscoito champagne', 'Cacau'],
    nutritionalInfo: { calories: 450, protein: 7, carbs: 45, fat: 28 }
  },
  // Salgados
  {
    id: '15',
    name: 'Pão de Queijo Artesanal',
    description: 'Pão de queijo mineiro feito com queijo canastra, porção com 4 unidades',
    price: 12.90,
    image: '/products/pao-de-queijo.png',
    category: 'salgados',
    tags: ['quente', 'tradicional', 'queijo'],
    available: true,
    preparationTime: 5,
    ingredients: ['Polvilho', 'Queijo canastra', 'Ovos'],
    nutritionalInfo: { calories: 280, protein: 12, carbs: 30, fat: 14 }
  },
  {
    id: '16',
    name: 'Quiche Lorraine',
    description: 'Quiche clássica com bacon crocante, queijo gruyère e nata',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&q=80',
    category: 'salgados',
    tags: ['quente', 'francês', 'cremoso'],
    available: true,
    preparationTime: 8,
    ingredients: ['Massa podre', 'Bacon', 'Queijo gruyère', 'Nata', 'Ovos'],
    nutritionalInfo: { calories: 380, protein: 14, carbs: 22, fat: 28 }
  },
  // Especiais
  {
    id: '17',
    name: 'Affogato',
    description: 'Sorvete de baunilha afogado em espresso quente',
    price: 19.90,
    image: '/products/affogato.png',
    category: 'especiais',
    tags: ['gelado', 'quente', 'sobremesa'],
    available: true,
    preparationTime: 3,
    ingredients: ['Sorvete de baunilha', 'Café espresso'],
    nutritionalInfo: { calories: 250, protein: 4, carbs: 28, fat: 14 }
  },
  {
    id: '18',
    name: 'Café Turco',
    description: 'Café preparado no ibrik tradicional com cardamomo',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
    category: 'especiais',
    tags: ['quente', 'exótico', 'tradicional'],
    available: true,
    preparationTime: 10,
    ingredients: ['Café moído fino', 'Cardamomo', 'Açúcar'],
    nutritionalInfo: { calories: 30, protein: 0, carbs: 6, fat: 0 }
  },
]

export const mockUser: User = {
  id: 'user-1',
  name: 'Maria Silva',
  email: 'maria@email.com',
  phone: '(11) 99999-9999',
  avatar: '/images/avatar.jpg',
  addresses: [
    {
      id: 'addr-1',
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Trabalho',
      street: 'Av. Paulista',
      number: '1000',
      complement: '15º andar',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false,
    },
  ],
  favoriteProducts: ['2', '7', '12'],
  orderHistory: ['order-1', 'order-2', 'order-3'],
  loyaltyPoints: 450,
  role: 'customer',
}

export const mockOrders: Order[] = [
  {
    id: 'order-001',
    items: [
      { product: products[1], quantity: 2, subtotal: 29.80 },
      { product: products[11], quantity: 1, subtotal: 14.90 },
    ],
    status: 'delivered',
    subtotal: 44.70,
    tax: 4.47,
    total: 49.17,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T11:00:00'),
    customerName: 'Maria Silva',
    customerPhone: '(11) 99999-9999',
    paymentMethod: 'pix',
    orderType: 'pickup',
  },
  {
    id: 'order-002',
    items: [
      { product: products[6], quantity: 1, subtotal: 16.90 },
      { product: products[8], quantity: 1, subtotal: 24.90 },
      { product: products[12], quantity: 2, subtotal: 37.80 },
    ],
    status: 'preparing',
    subtotal: 79.60,
    tax: 7.96,
    total: 87.56,
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 20 * 60000),
    customerName: 'João Santos',
    customerPhone: '(11) 98888-8888',
    paymentMethod: 'credit',
    orderType: 'delivery',
    deliveryAddress: {
      id: 'addr-temp',
      label: 'Casa',
      street: 'Av. Paulista',
      number: '1500',
      complement: 'Apto 302',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-200',
      isDefault: true,
    },
  },
  {
    id: 'order-003',
    items: [
      { product: products[0], quantity: 3, subtotal: 26.70 },
      { product: products[14], quantity: 2, subtotal: 25.80 },
    ],
    status: 'pending',
    subtotal: 52.50,
    tax: 5.25,
    total: 57.75,
    createdAt: new Date(Date.now() - 10 * 60000),
    updatedAt: new Date(Date.now() - 10 * 60000),
    customerName: 'Ana Costa',
    customerPhone: '(11) 97777-7777',
    paymentMethod: 'debit',
    orderType: 'dine-in',
    tableNumber: 5,
  },
  {
    id: 'order-004',
    items: [
      { product: products[3], quantity: 1, subtotal: 18.90 },
      { product: products[13], quantity: 1, subtotal: 22.90 },
    ],
    status: 'ready',
    subtotal: 41.80,
    tax: 4.18,
    total: 45.98,
    createdAt: new Date(Date.now() - 25 * 60000),
    updatedAt: new Date(Date.now() - 5 * 60000),
    customerName: 'Carlos Oliveira',
    customerPhone: '(11) 96666-6666',
    paymentMethod: 'pix',
    orderType: 'pickup',
  },
  {
    id: 'order-005',
    items: [
      { product: products[7], quantity: 2, subtotal: 45.80 },
      { product: products[9], quantity: 1, subtotal: 24.90 },
      { product: products[15], quantity: 1, subtotal: 16.90 },
    ],
    status: 'confirmed',
    subtotal: 87.60,
    tax: 8.76,
    total: 96.36,
    createdAt: new Date(Date.now() - 15 * 60000),
    updatedAt: new Date(Date.now() - 12 * 60000),
    customerName: 'Fernanda Lima',
    customerPhone: '(11) 95555-5555',
    paymentMethod: 'credit',
    orderType: 'delivery',
    deliveryAddress: {
      id: 'addr-temp-2',
      label: 'Trabalho',
      street: 'Rua Oscar Freire',
      number: '890',
      complement: 'Sala 12',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01426-001',
      isDefault: false,
    },
  },
]

export const mockInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Café em grãos (kg)', quantity: 25, unit: 'kg', minStock: 10, lastRestocked: new Date('2024-01-10'), supplier: 'Fazenda Boa Vista', costPerUnit: 85 },
  { id: 'inv-2', name: 'Leite integral (L)', quantity: 40, unit: 'L', minStock: 20, lastRestocked: new Date('2024-01-14'), supplier: 'Laticínios Premium', costPerUnit: 6.5 },
  { id: 'inv-3', name: 'Chocolate belga (kg)', quantity: 8, unit: 'kg', minStock: 5, lastRestocked: new Date('2024-01-12'), supplier: 'Callebaut', costPerUnit: 120 },
  { id: 'inv-4', name: 'Açúcar (kg)', quantity: 15, unit: 'kg', minStock: 8, lastRestocked: new Date('2024-01-13'), supplier: 'União', costPerUnit: 8 },
  { id: 'inv-5', name: 'Copos descartáveis (un)', quantity: 500, unit: 'un', minStock: 200, lastRestocked: new Date('2024-01-11'), supplier: 'Descartáveis SP', costPerUnit: 0.35 },
  { id: 'inv-6', name: 'Canela em pó (kg)', quantity: 2, unit: 'kg', minStock: 1, lastRestocked: new Date('2024-01-08'), supplier: 'Especiarias Finas', costPerUnit: 95 },
]

export const mockDashboardStats: DashboardStats = {
  todaySales: 3245.80,
  todayOrders: 47,
  avgOrderValue: 69.05,
  pendingOrders: 5,
  popularProducts: [
    { product: products[1], count: 28 },
    { product: products[6], count: 22 },
    { product: products[11], count: 18 },
    { product: products[8], count: 15 },
    { product: products[14], count: 12 },
  ],
  revenueByHour: [
    { hour: 7, revenue: 180 },
    { hour: 8, revenue: 420 },
    { hour: 9, revenue: 580 },
    { hour: 10, revenue: 320 },
    { hour: 11, revenue: 280 },
    { hour: 12, revenue: 450 },
    { hour: 13, revenue: 380 },
    { hour: 14, revenue: 220 },
    { hour: 15, revenue: 180 },
    { hour: 16, revenue: 135 },
  ],
  ordersByStatus: [
    { status: 'pending', count: 3 },
    { status: 'confirmed', count: 2 },
    { status: 'preparing', count: 5 },
    { status: 'ready', count: 2 },
    { status: 'delivered', count: 35 },
    { status: 'cancelled', count: 0 },
  ],
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} às ${formatTime(date)}`
}

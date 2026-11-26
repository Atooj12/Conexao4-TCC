import type { InventoryItem } from '@/lib/types'

// Itens de exemplo da tela de Estoque (o estoque ainda não existe no back).
// As datas são relativas a hoje para a tela não parecer parada no tempo.
function diasAtras(dias: number) {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d
}

export const estoqueDemonstracao: InventoryItem[] = [
  { id: 'inv-1', name: 'Café em grãos (kg)', quantity: 25, unit: 'kg', minStock: 10, lastRestocked: diasAtras(5), supplier: 'Fazenda Boa Vista', costPerUnit: 85 },
  { id: 'inv-2', name: 'Leite integral (L)', quantity: 40, unit: 'L', minStock: 20, lastRestocked: diasAtras(1), supplier: 'Laticínios Premium', costPerUnit: 6.5 },
  { id: 'inv-3', name: 'Chocolate belga (kg)', quantity: 4, unit: 'kg', minStock: 5, lastRestocked: diasAtras(12), supplier: 'Callebaut', costPerUnit: 120 },
  { id: 'inv-4', name: 'Açúcar (kg)', quantity: 15, unit: 'kg', minStock: 8, lastRestocked: diasAtras(3), supplier: 'União', costPerUnit: 8 },
  { id: 'inv-5', name: 'Copos descartáveis (un)', quantity: 500, unit: 'un', minStock: 200, lastRestocked: diasAtras(7), supplier: 'Descartáveis SP', costPerUnit: 0.35 },
  { id: 'inv-6', name: 'Canela em pó (kg)', quantity: 1, unit: 'kg', minStock: 1, lastRestocked: diasAtras(20), supplier: 'Especiarias Finas', costPerUnit: 95 },
]

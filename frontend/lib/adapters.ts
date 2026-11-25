import type { CartItem, Category, PaymentMethod, Product } from '@/lib/types'

// O back manda os dados no formato dele (nomes em português, enums como número).
// Aqui eles viram os tipos que as telas do site já usam (lib/types.ts).

// ---------- Formato do back ----------

export interface ProdutoDto {
  id: number
  nome: string
  descricao: string | null
  preco: number
  urlImagem: string | null
  categoria: number
  disponivel: boolean
}

// Item do carrinho (GET /api/app/item-pedido) e item de um pedido já finalizado
export interface ItemPedidoDto {
  id: number
  produtoId: number
  produto: ProdutoDto | null
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface PedidoDto {
  id: number
  userId: string
  nomeCliente: string | null
  status: number
  total: number
  formaPagamento: number
  tipoPedido: number
  observacao: string | null
  creationTime: string
  itens: ItemPedidoDto[]
}

export interface ListaPaginada<T> {
  totalCount: number
  items: T[]
}

// ---------- Enums: número do back <-> texto do site ----------

// Mesma ordem do enum CategoriaProduto do back: 0 Cafes, 1 BebidasGeladas, 2 Lanches, 3 Doces, 4 Salgados, 5 Especiais
export const CATEGORIAS: Category[] = ['cafes', 'bebidas-geladas', 'lanches', 'doces', 'salgados', 'especiais']

export function categoriaDoBack(numero: number): Category {
  return CATEGORIAS[numero] ?? 'especiais'
}

export function categoriaParaBack(categoria: Category): number {
  return CATEGORIAS.indexOf(categoria)
}

// 0 Pix, 1 Credito, 2 Debito, 3 Dinheiro
export const FORMAS_PAGAMENTO: PaymentMethod[] = ['pix', 'credit', 'debit', 'cash']

// 0 Retirada, 1 Local (consumir no café). Entrega ainda não existe no back.
export type TipoPedidoSite = 'pickup' | 'dine-in'
export const TIPOS_PEDIDO: TipoPedidoSite[] = ['pickup', 'dine-in']

// ---------- Conversões ----------

export function toProduct(dto: ProdutoDto): Product {
  return {
    id: String(dto.id),
    name: dto.nome,
    description: dto.descricao ?? '',
    price: dto.preco,
    image: dto.urlImagem ?? '',
    category: categoriaDoBack(dto.categoria),
    tags: [],
    available: dto.disponivel,
  }
}

export function toCartItem(dto: ItemPedidoDto): CartItem {
  // O preço que vale é o gravado no item (precoUnitario), não o atual do produto
  const produto: Product = dto.produto
    ? toProduct(dto.produto)
    : { id: String(dto.produtoId), name: 'Produto removido', description: '', price: dto.precoUnitario,
        image: '', category: 'especiais', tags: [], available: false }
  return {
    id: String(dto.id),
    product: { ...produto, price: dto.precoUnitario },
    quantity: dto.quantidade,
    subtotal: dto.subtotal,
  }
}

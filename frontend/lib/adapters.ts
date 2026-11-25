import type { Category, Product } from '@/lib/types'

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

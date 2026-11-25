import { apiFetch } from '@/lib/api'
import { categoriaParaBack, toProduct, type ProdutoDto } from '@/lib/adapters'
import type { Category, Product } from '@/lib/types'

// Cadastro de produtos (admin). A listagem é a mesma do cardápio: useProdutos().
const BASE = '/api/app/produto'

// O que o formulário do admin preenche
export interface DadosProduto {
  name: string
  description: string
  price: number
  image: string
  category: Category
  available: boolean
}

// Mesmos limites do ProdutoDto do back, pra avisar antes de enviar
export const LIMITES = { nome: 128, descricao: 1024, url: 512, precoMin: 0.01, precoMax: 100000 }

function paraBack(d: DadosProduto) {
  return {
    nome: d.name.trim(),
    descricao: d.description.trim() || null,
    preco: d.price,
    urlImagem: d.image.trim() || null,
    categoria: categoriaParaBack(d.category),
    disponivel: d.available,
  }
}

export async function criarProduto(d: DadosProduto): Promise<Product> {
  return toProduct(await apiFetch<ProdutoDto>(BASE, { method: 'POST', body: JSON.stringify(paraBack(d)) }))
}

export async function atualizarProduto(id: string, d: DadosProduto): Promise<Product> {
  return toProduct(await apiFetch<ProdutoDto>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(paraBack(d)) }))
}

export async function excluirProduto(id: string): Promise<void> {
  await apiFetch(`${BASE}/${id}`, { method: 'DELETE' })
}

// Liga/desliga o "Disponível" sem abrir o formulário (o PUT do back pede o produto inteiro)
export async function alternarDisponivel(p: Product): Promise<Product> {
  return atualizarProduto(p.id, {
    name: p.name, description: p.description, price: p.price, image: p.image,
    category: p.category, available: !p.available,
  })
}

// Aceita "12,50", "12.50" e "R$ 12,50". Devolve null se não for número.
export function lerPreco(texto: string): number | null {
  const limpo = texto.replace(/[R$\s]/g, '')
  if (!/^\d+([.,]\d{1,2})?$/.test(limpo)) return null
  return Number(limpo.replace(',', '.'))
}

// Valida o formulário com as mesmas regras do back. Devolve a mensagem de erro de cada campo.
export function validarProduto(d: { name: string; description: string; price: string; image: string }) {
  const erros: Partial<Record<'name' | 'description' | 'price' | 'image', string>> = {}
  if (!d.name.trim()) erros.name = 'Informe o nome.'
  else if (d.name.trim().length > LIMITES.nome) erros.name = `Máximo de ${LIMITES.nome} caracteres.`

  if (d.description.trim().length > LIMITES.descricao) erros.description = `Máximo de ${LIMITES.descricao} caracteres.`

  const preco = lerPreco(d.price)
  if (preco === null) erros.price = 'Use um valor como 12,50.'
  else if (preco < LIMITES.precoMin || preco > LIMITES.precoMax) erros.price = 'O preço precisa ser entre R$ 0,01 e R$ 100.000,00.'

  const url = d.image.trim()
  if (url && !/^https?:\/\/\S+$/i.test(url)) erros.image = 'Use um link que comece com http:// ou https://'
  else if (url.length > LIMITES.url) erros.image = `Máximo de ${LIMITES.url} caracteres.`

  return erros
}

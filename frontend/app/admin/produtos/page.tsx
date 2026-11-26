'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Coffee, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CardapioErro } from '@/components/product-card'
import { showError } from '@/lib/api'
import { CATEGORIAS } from '@/lib/adapters'
import { useProdutos } from '@/lib/use-produtos'
import {
  LIMITES,
  alternarDisponivel,
  atualizarProduto,
  criarProduto,
  excluirProduto,
  lerPreco,
  validarProduto,
} from '@/lib/produtos'
import { formatCurrency } from '@/lib/format'
import { categoryLabels, type Category, type Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Formulario {
  name: string
  description: string
  price: string // texto, para aceitar vírgula
  image: string
  category: Category
  available: boolean
}

const formularioVazio: Formulario = {
  name: '', description: '', price: '', image: '', category: 'cafes', available: true,
}

function AdminProdutosPageConteudo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { produtos, carregando, erro, recarregar } = useProdutos()

  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState<Category | 'all'>('all')

  // Formulário (novo ou edição)
  const [aberto, setAberto] = useState(false)
  const [editando, setEditando] = useState<Product | null>(null)
  const [form, setForm] = useState<Formulario>(formularioVazio)
  const [erros, setErros] = useState<ReturnType<typeof validarProduto>>({})
  const [salvando, setSalvando] = useState(false)
  const [imagemQuebrada, setImagemQuebrada] = useState(false)

  const [paraExcluir, setParaExcluir] = useState<Product | null>(null)
  const [alternando, setAlternando] = useState<string | null>(null)

  // "Novo Produto" do dashboard chega aqui com ?novo=1
  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      abrirNovo()
      router.replace('/admin/produtos')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return produtos.filter(p =>
      (categoria === 'all' || p.category === categoria) &&
      (!termo || p.name.toLowerCase().includes(termo) || p.description.toLowerCase().includes(termo)))
  }, [produtos, busca, categoria])

  const indisponiveis = produtos.filter(p => !p.available).length

  function abrirNovo() {
    setEditando(null)
    setForm(formularioVazio)
    setErros({})
    setImagemQuebrada(false)
    setAberto(true)
  }

  function abrirEdicao(p: Product) {
    setEditando(p)
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toFixed(2).replace('.', ','),
      image: p.image,
      category: p.category,
      available: p.available,
    })
    setErros({})
    setImagemQuebrada(false)
    setAberto(true)
  }

  const campo = <K extends keyof Formulario>(chave: K, valor: Formulario[K]) => {
    setForm(f => ({ ...f, [chave]: valor }))
    if (chave in erros) setErros(e => ({ ...e, [chave]: undefined }))
    if (chave === 'image') setImagemQuebrada(false)
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (salvando) return
    const encontrados = validarProduto(form)
    setErros(encontrados)
    if (Object.values(encontrados).some(Boolean)) return

    setSalvando(true)
    try {
      const dados = { ...form, price: lerPreco(form.price)! }
      if (editando) {
        await atualizarProduto(editando.id, dados)
        toast.success(`${dados.name.trim()} atualizado`)
      } else {
        await criarProduto(dados)
        toast.success(`${dados.name.trim()} cadastrado no cardápio`)
      }
      setAberto(false)
      await recarregar()
    } catch (err) {
      showError(err)
    } finally {
      setSalvando(false)
    }
  }

  const trocarDisponivel = async (p: Product) => {
    setAlternando(p.id)
    try {
      await alternarDisponivel(p)
      toast.success(p.available ? `${p.name} pausado no cardápio` : `${p.name} disponível de novo`)
      await recarregar()
    } catch (err) {
      showError(err)
    } finally {
      setAlternando(null)
    }
  }

  const confirmarExclusao = async () => {
    const p = paraExcluir
    setParaExcluir(null)
    if (!p) return
    try {
      await excluirProduto(p.id)
      toast.success(`${p.name} excluído`)
      await recarregar()
    } catch (err) {
      showError(err)
    }
  }

  const precoPrevia = lerPreco(form.price)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            O que for cadastrado aqui aparece no cardápio do site e do app.
          </p>
        </div>
        <Button className="gap-2" onClick={abrirNovo}>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>
                Cardápio
                {!carregando && !erro && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {produtos.length} produtos{indisponiveis > 0 && `, ${indisponiveis} pausado${indisponiveis > 1 ? 's' : ''}`}
                  </span>
                )}
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={categoria} onValueChange={(v) => setCategoria(v as Category | 'all')}>
                  <SelectTrigger className="sm:w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {CATEGORIAS.map(c => (
                      <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto..."
                    className="pl-10"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {erro ? (
              <CardapioErro mensagem={erro} onTentarDeNovo={recarregar} />
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Disponível</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={5}><div className="h-10 bg-muted rounded animate-pulse" /></TableCell>
                        </TableRow>
                      ))
                    ) : filtrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {produtos.length === 0 ? 'Nenhum produto cadastrado ainda' : 'Nenhum produto com esse filtro'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtrados.map(p => (
                        <TableRow key={p.id} className={cn(!p.available && 'opacity-60')}>
                          <TableCell>
                            <div className="flex items-center gap-3 min-w-[220px]">
                              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                                {p.image ? (
                                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                                ) : (
                                  <Coffee className="h-5 w-5 text-muted-foreground/50" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{p.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{p.description || 'Sem descrição'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{categoryLabels[p.category]}</Badge>
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">{formatCurrency(p.price)}</TableCell>
                          <TableCell>
                            <Switch
                              checked={p.available}
                              disabled={alternando === p.id}
                              onCheckedChange={() => trocarDisponivel(p)}
                              aria-label={p.available ? `Pausar ${p.name}` : `Liberar ${p.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => abrirEdicao(p)} title="Editar">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar {p.name}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setParaExcluir(p)}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir {p.name}</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Formulário: novo / editar */}
      <Dialog open={aberto} onOpenChange={(v) => !salvando && setAberto(v)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editando ? `Editar ${editando.name}` : 'Novo produto'}</DialogTitle>
            <DialogDescription>
              Os campos com * são obrigatórios. O preço aceita vírgula (ex.: 12,50).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={salvar} className="grid gap-6 sm:grid-cols-[1fr_180px]" noValidate>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="p-nome">Nome *</Label>
                <Input
                  id="p-nome"
                  value={form.name}
                  maxLength={LIMITES.nome}
                  onChange={(e) => campo('name', e.target.value)}
                  aria-invalid={!!erros.name}
                />
                {erros.name && <p className="text-xs text-destructive">{erros.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-preco">Preço (R$) *</Label>
                  <Input
                    id="p-preco"
                    inputMode="decimal"
                    placeholder="12,50"
                    value={form.price}
                    onChange={(e) => campo('price', e.target.value)}
                    aria-invalid={!!erros.price}
                  />
                  {erros.price && <p className="text-xs text-destructive">{erros.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={form.category} onValueChange={(v) => campo('category', v as Category)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map(c => (
                        <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-desc">Descrição</Label>
                <Textarea
                  id="p-desc"
                  rows={3}
                  className="resize-none"
                  maxLength={LIMITES.descricao}
                  value={form.description}
                  onChange={(e) => campo('description', e.target.value)}
                />
                {erros.description && <p className="text-xs text-destructive">{erros.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="p-img">Link da foto</Label>
                <Input
                  id="p-img"
                  placeholder="https://..."
                  value={form.image}
                  maxLength={LIMITES.url}
                  onChange={(e) => campo('image', e.target.value)}
                  aria-invalid={!!erros.image}
                />
                {erros.image && <p className="text-xs text-destructive">{erros.image}</p>}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="p-disp">Disponível para pedido</Label>
                  <p className="text-xs text-muted-foreground">Desligado: aparece no cardápio como indisponível</p>
                </div>
                <Switch id="p-disp" checked={form.available} onCheckedChange={(v) => campo('available', v)} />
              </div>
            </div>

            {/* Prévia de como fica no cardápio */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Prévia</p>
              <div className="rounded-lg border overflow-hidden">
                <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                  {form.image.trim() && !erros.image && !imagemQuebrada ? (
                    // img comum: o link é digitado pelo admin e pode ser de qualquer site
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.image.trim()}
                      alt="Prévia"
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={() => setImagemQuebrada(true)}
                    />
                  ) : (
                    <Coffee className="h-10 w-10 text-muted-foreground/40" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{form.name || 'Nome do produto'}</p>
                  <p className="text-sm text-primary">{precoPrevia !== null ? formatCurrency(precoPrevia) : 'R$ --'}</p>
                </div>
              </div>
              {imagemQuebrada && (
                <p className="text-xs text-destructive">Não deu para abrir essa imagem. Confira o link.</p>
              )}
            </div>

            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setAberto(false)} disabled={salvando}>
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar produto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!paraExcluir} onOpenChange={(v) => !v && setParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {paraExcluir?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              O produto sai do cardápio de vez. Pedidos antigos continuam com o valor, mas o item aparece como
              &quot;Produto removido&quot;. Se for só por um tempo, prefira desligar o &quot;Disponível&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmarExclusao}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// useSearchParams precisa de um Suspense em volta para o "next build" gerar a página
export default function AdminProdutosPage() {
  return (
    <Suspense>
      <AdminProdutosPageConteudo />
    </Suspense>
  )
}

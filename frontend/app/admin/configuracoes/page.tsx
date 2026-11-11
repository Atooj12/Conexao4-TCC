'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Save,
  Store,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Truck,
  CreditCard,
  Bell,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do seu estabelecimento
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="geral" className="gap-2">
            <Store className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="horarios" className="gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="entrega" className="gap-2">
            <Truck className="h-4 w-4" />
            Entrega
          </TabsTrigger>
          <TabsTrigger value="pagamento" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Pagamento
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="geral">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informações do Estabelecimento
                </CardTitle>
                <CardDescription>
                  Informações básicas que aparecem para os clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Estabelecimento</Label>
                    <Input id="name" defaultValue="Conexão 4 Café & Bistrô" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slogan">Slogan</Label>
                    <Input id="slogan" defaultValue="Onde cada xícara conta uma história" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    rows={3}
                    defaultValue="Um espaço acolhedor para os amantes de café, oferecendo bebidas artesanais e lanches deliciosos em um ambiente inspirador."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço e Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" defaultValue="Rua das Flores, 123" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" defaultValue="Centro" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" defaultValue="São Paulo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" defaultValue="SP" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" defaultValue="01234-567" />
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <Input id="phone" defaultValue="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </Label>
                    <Input id="email" type="email" defaultValue="contato@conexao4.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input id="website" defaultValue="www.conexao4.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Hours Settings */}
        <TabsContent value="horarios">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Funcionamento
                </CardTitle>
                <CardDescription>
                  Configure os horários de abertura e fechamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { day: 'Segunda-feira', open: '07:00', close: '20:00', enabled: true },
                  { day: 'Terça-feira', open: '07:00', close: '20:00', enabled: true },
                  { day: 'Quarta-feira', open: '07:00', close: '20:00', enabled: true },
                  { day: 'Quinta-feira', open: '07:00', close: '20:00', enabled: true },
                  { day: 'Sexta-feira', open: '07:00', close: '22:00', enabled: true },
                  { day: 'Sábado', open: '08:00', close: '22:00', enabled: true },
                  { day: 'Domingo', open: '08:00', close: '18:00', enabled: true },
                ].map((schedule) => (
                  <div key={schedule.day} className="flex items-center gap-4 p-3 rounded-lg border">
                    <Switch defaultChecked={schedule.enabled} />
                    <span className="w-32 font-medium">{schedule.day}</span>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="time" 
                        defaultValue={schedule.open} 
                        className="w-28"
                        disabled={!schedule.enabled}
                      />
                      <span className="text-muted-foreground">às</span>
                      <Input 
                        type="time" 
                        defaultValue={schedule.close} 
                        className="w-28"
                        disabled={!schedule.enabled}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="entrega">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Configurações de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Habilitar Entregas</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir que clientes façam pedidos para entrega
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Taxa de Entrega Padrão</Label>
                    <Input type="number" defaultValue="5.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pedido Mínimo para Entrega</Label>
                    <Input type="number" defaultValue="25.00" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Raio de Entrega (km)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tempo Estimado (minutos)</Label>
                    <Input type="number" defaultValue="45" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Entrega Grátis</p>
                    <p className="text-sm text-muted-foreground">
                      Oferecer entrega grátis acima de um valor mínimo
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Valor Mínimo para Entrega Grátis</Label>
                  <Input type="number" defaultValue="80.00" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retirada no Local</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Habilitar Retirada</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir que clientes retirem pedidos no estabelecimento
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Tempo Estimado para Retirada (minutos)</Label>
                  <Input type="number" defaultValue="20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="pagamento">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Métodos de Pagamento
                </CardTitle>
                <CardDescription>
                  Configure os métodos de pagamento aceitos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { method: 'PIX', description: 'Pagamento instantâneo', enabled: true },
                  { method: 'Cartão de Crédito', description: 'Visa, Mastercard, Elo', enabled: true },
                  { method: 'Cartão de Débito', description: 'Visa, Mastercard, Elo', enabled: true },
                  { method: 'Dinheiro', description: 'Pagamento na entrega/retirada', enabled: true },
                  { method: 'Vale Refeição', description: 'Alelo, VR, Sodexo', enabled: false },
                ].map((payment) => (
                  <div key={payment.method} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{payment.method}</p>
                      <p className="text-sm text-muted-foreground">{payment.description}</p>
                    </div>
                    <Switch defaultChecked={payment.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notificacoes">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferências de Notificação
                </CardTitle>
                <CardDescription>
                  Configure quando você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Novos Pedidos', description: 'Notificar quando um novo pedido for recebido', enabled: true },
                  { title: 'Pedidos Cancelados', description: 'Notificar quando um pedido for cancelado', enabled: true },
                  { title: 'Estoque Baixo', description: 'Notificar quando um item estiver com estoque baixo', enabled: true },
                  { title: 'Avaliações', description: 'Notificar quando receber uma nova avaliação', enabled: false },
                  { title: 'Relatórios Diários', description: 'Receber resumo diário de vendas por e-mail', enabled: false },
                ].map((notification) => (
                  <div key={notification.title} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch defaultChecked={notification.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

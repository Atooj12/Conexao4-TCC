using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Conexao4.Pedidos
{
    public class PedidoDto : AuditedEntityDto<int>
    {
        public Guid UserId { get; set; }
        public string? NomeCliente { get; set; }
        public StatusPedido Status { get; set; }
        public decimal Total { get; set; }
        public FormaPagamento FormaPagamento { get; set; }
        public TipoPedido TipoPedido { get; set; }
        public string? Observacao { get; set; }
        public List<ItemPedidoDto> Itens { get; set; } = new();
    }
}

using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Conexao4.Pedidos
{
    public class Pedido : AuditedAggregateRoot<int>
    {
        public Guid UserId { get; set; }
        public StatusPedido Status { get; set; } = StatusPedido.Pendente;

        // Calculado no momento em que o carrinho é finalizado
        public decimal Total { get; set; }

        public FormaPagamento FormaPagamento { get; set; }
        public TipoPedido TipoPedido { get; set; }
        public string? Observacao { get; set; }
    }
}

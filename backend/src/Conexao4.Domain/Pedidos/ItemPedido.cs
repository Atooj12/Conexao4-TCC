using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Conexao4.Pedidos
{
    // Enquanto PedidoId == null o item está no carrinho do usuário.
    // Ao finalizar, o item recebe o PedidoId e o preço do momento da compra.
    public class ItemPedido : AuditedAggregateRoot<int>
    {
        public Guid UserId { get; set; }
        public int? PedidoId { get; set; }
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }

        // Preço "congelado" na finalização: se o produto mudar de preço depois,
        // o histórico do pedido não muda.
        public decimal PrecoUnitario { get; set; }
    }
}

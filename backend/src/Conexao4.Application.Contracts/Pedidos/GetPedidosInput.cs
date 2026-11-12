using Volo.Abp.Application.Dtos;

namespace Conexao4.Pedidos;

// Filtro da lista de pedidos do admin (Status vazio = todos)
public class GetPedidosInput : PagedAndSortedResultRequestDto
{
    public StatusPedido? Status { get; set; }
}

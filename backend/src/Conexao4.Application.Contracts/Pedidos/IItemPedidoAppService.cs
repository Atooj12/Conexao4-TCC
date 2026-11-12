using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Conexao4.Pedidos;

// Carrinho do usuário logado. O ABP gera as rotas em /api/app/item-pedido
public interface IItemPedidoAppService : IApplicationService
{
    // GET /api/app/item-pedido
    Task<ListResultDto<ItemPedidoDto>> GetListAsync();

    // POST /api/app/item-pedido/adicionar-ao-carrinho/{produtoId}?quantidade=1
    Task<ItemPedidoDto> AdicionarAoCarrinhoAsync(int produtoId, int quantidade = 1);

    // POST /api/app/item-pedido/{id}/alterar-quantidade?quantidade=2
    Task<ItemPedidoDto> AlterarQuantidadeAsync(int id, int quantidade);

    // DELETE /api/app/item-pedido/{id}
    Task DeleteAsync(int id);

    // POST /api/app/item-pedido/limpar-carrinho
    Task LimparCarrinhoAsync();

    // POST /api/app/item-pedido/finalizar-carrinho  (body JSON: FinalizarCarrinhoInput)
    Task<PedidoDto> FinalizarCarrinhoAsync(FinalizarCarrinhoInput input);
}

using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Conexao4.Pedidos
{
    // O ABP gera as rotas em /api/app/pedido
    public interface IPedidoAppService : IApplicationService
    {
        // GET /api/app/pedido/{id}  (dono do pedido ou admin)
        Task<PedidoDto> GetAsync(int id);

        // GET /api/app/pedido/meus-pedidos
        Task<List<PedidoDto>> GetMeusPedidosAsync();

        // POST /api/app/pedido/{id}/cancelar  (cliente, só se ainda estiver Pendente)
        Task<PedidoDto> CancelarAsync(int id);

        // ---- Admin (permissão Conexao4.Pedidos.Gerenciar) ----

        // GET /api/app/pedido/todos?Status=0&MaxResultCount=50
        Task<PagedResultDto<PedidoDto>> GetTodosAsync(GetPedidosInput input);

        // POST /api/app/pedido/{id}/alterar-status?status=2
        Task<PedidoDto> AlterarStatusAsync(int id, StatusPedido status);

        // GET /api/app/pedido/dashboard
        Task<DashboardDto> GetDashboardAsync();
    }
}

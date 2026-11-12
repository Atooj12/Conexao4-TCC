using Conexao4.Permissions;
using Conexao4.Produtos;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Users;

namespace Conexao4.Pedidos
{
    // Antes era um CrudAppService: qualquer um podia criar/editar/apagar pedido
    // mandando qualquer status ou total. Agora só expõe as operações que fazem sentido.
    // Pedido só nasce pelo ItemPedidoAppService.FinalizarCarrinhoAsync.
    [Authorize]
    public class PedidoAppService : ApplicationService, IPedidoAppService
    {
        private readonly IRepository<Pedido, int> _pedidoRepository;
        private readonly IRepository<ItemPedido, int> _itemRepository;
        private readonly IRepository<Produto, int> _produtoRepository;
        private readonly IReadOnlyRepository<IdentityUser, Guid> _userRepository;

        public PedidoAppService(
            IRepository<Pedido, int> pedidoRepository,
            IRepository<ItemPedido, int> itemRepository,
            IRepository<Produto, int> produtoRepository,
            IReadOnlyRepository<IdentityUser, Guid> userRepository)
        {
            _pedidoRepository = pedidoRepository;
            _itemRepository = itemRepository;
            _produtoRepository = produtoRepository;
            _userRepository = userRepository;
        }

        public async Task<PedidoDto> GetAsync(int id)
        {
            var pedido = await _pedidoRepository.GetAsync(id);

            // Cliente só vê o próprio pedido. Admin vê qualquer um.
            if (pedido.UserId != CurrentUser.GetId() &&
                !await AuthorizationService.IsGrantedAsync(Conexao4Permissions.Pedidos.Gerenciar))
            {
                throw new EntityNotFoundException(typeof(Pedido), id);
            }

            return (await MapPedidosAsync(new List<Pedido> { pedido })).Single();
        }

        public async Task<List<PedidoDto>> GetMeusPedidosAsync()
        {
            var userId = CurrentUser.GetId();
            var query = (await _pedidoRepository.GetQueryableAsync())
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreationTime);

            var pedidos = await AsyncExecuter.ToListAsync(query);
            return await MapPedidosAsync(pedidos);
        }

        public async Task<PedidoDto> CancelarAsync(int id)
        {
            var pedido = await _pedidoRepository.GetAsync(id);

            if (pedido.UserId != CurrentUser.GetId())
                throw new EntityNotFoundException(typeof(Pedido), id);

            if (pedido.Status != StatusPedido.Pendente)
                throw new UserFriendlyException("Só dá pra cancelar um pedido que ainda está pendente.");

            pedido.Status = StatusPedido.Cancelado;
            await _pedidoRepository.UpdateAsync(pedido, autoSave: true);

            return (await MapPedidosAsync(new List<Pedido> { pedido })).Single();
        }

        // ------------------------- Admin -------------------------

        [Authorize(Conexao4Permissions.Pedidos.Gerenciar)]
        public async Task<PagedResultDto<PedidoDto>> GetTodosAsync(GetPedidosInput input)
        {
            var query = await _pedidoRepository.GetQueryableAsync();

            if (input.Status.HasValue)
                query = query.Where(p => p.Status == input.Status.Value);

            var total = await AsyncExecuter.CountAsync(query);

            var pedidos = await AsyncExecuter.ToListAsync(query
                .OrderByDescending(p => p.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount));

            return new PagedResultDto<PedidoDto>(total, await MapPedidosAsync(pedidos));
        }

        [Authorize(Conexao4Permissions.Pedidos.Gerenciar)]
        public async Task<PedidoDto> AlterarStatusAsync(int id, StatusPedido status)
        {
            var pedido = await _pedidoRepository.GetAsync(id);

            if (pedido.Status is StatusPedido.Entregue or StatusPedido.Cancelado)
                throw new UserFriendlyException("Pedido já encerrado (entregue ou cancelado) não pode mudar de status.");

            pedido.Status = status;
            await _pedidoRepository.UpdateAsync(pedido, autoSave: true);

            return (await MapPedidosAsync(new List<Pedido> { pedido })).Single();
        }

        [Authorize(Conexao4Permissions.Pedidos.Gerenciar)]
        public async Task<DashboardDto> GetDashboardAsync()
        {
            // O SQLite não sabe somar/ordenar decimal no banco, então as contas
            // são feitas em memória (LINQ to Objects). Pro volume do TCC é tranquilo.
            var hoje = Clock.Now.Date;
            var amanha = hoje.AddDays(1);

            var pedidosQuery = await _pedidoRepository.GetQueryableAsync();

            var pedidosHoje = await AsyncExecuter.ToListAsync(pedidosQuery
                .Where(p => p.CreationTime >= hoje && p.CreationTime < amanha
                         && p.Status != StatusPedido.Cancelado));

            var pendentes = await AsyncExecuter.CountAsync(pedidosQuery
                .Where(p => p.Status == StatusPedido.Pendente));

            var cancelados = await AsyncExecuter.ToListAsync(pedidosQuery
                .Where(p => p.Status == StatusPedido.Cancelado)
                .Select(p => p.Id));

            var itensVendidos = await _itemRepository.GetListAsync(i =>
                i.PedidoId != null && !cancelados.Contains(i.PedidoId.Value));

            var nomes = (await _produtoRepository.GetListAsync())
                .ToDictionary(p => p.Id, p => p.Nome);

            var vendasHoje = pedidosHoje.Sum(p => p.Total);

            return new DashboardDto
            {
                VendasHoje = vendasHoje,
                PedidosHoje = pedidosHoje.Count,
                TicketMedio = pedidosHoje.Count == 0 ? 0 : Math.Round(vendasHoje / pedidosHoje.Count, 2),
                PedidosPendentes = pendentes,
                TopProdutos = itensVendidos
                    .GroupBy(i => i.ProdutoId)
                    .Select(g => new TopProdutoDto
                    {
                        ProdutoId = g.Key,
                        Nome = nomes.GetValueOrDefault(g.Key, $"Produto #{g.Key}"),
                        Quantidade = g.Sum(i => i.Quantidade),
                        Receita = g.Sum(i => i.PrecoUnitario * i.Quantidade)
                    })
                    .OrderByDescending(t => t.Quantidade)
                    .Take(5)
                    .ToList()
            };
        }

        // ------------------------- auxiliares -------------------------

        // Monta os DTOs com itens, produtos e nome do cliente usando poucas consultas
        // (uma por tabela), em vez de uma consulta por pedido.
        private async Task<List<PedidoDto>> MapPedidosAsync(List<Pedido> pedidos)
        {
            if (pedidos.Count == 0)
                return new List<PedidoDto>();

            var pedidoIds = pedidos.Select(p => (int?)p.Id).ToList();
            var itens = await _itemRepository.GetListAsync(i => pedidoIds.Contains(i.PedidoId));

            var produtoIds = itens.Select(i => i.ProdutoId).Distinct().ToList();
            var produtos = (await _produtoRepository.GetListAsync(p => produtoIds.Contains(p.Id)))
                .ToDictionary(p => p.Id);

            var userIds = pedidos.Select(p => p.UserId).Distinct().ToList();
            var usuarios = (await _userRepository.GetListAsync(u => userIds.Contains(u.Id)))
                .ToDictionary(u => u.Id);

            return pedidos.Select(pedido =>
            {
                var dto = ObjectMapper.Map<Pedido, PedidoDto>(pedido);

                if (usuarios.TryGetValue(pedido.UserId, out var user))
                {
                    var nomeCompleto = $"{user.Name} {user.Surname}".Trim();
                    dto.NomeCliente = string.IsNullOrEmpty(nomeCompleto) ? user.UserName : nomeCompleto;
                }

                dto.Itens = itens
                    .Where(i => i.PedidoId == pedido.Id)
                    .Select(i =>
                    {
                        var itemDto = ObjectMapper.Map<ItemPedido, ItemPedidoDto>(i);
                        if (produtos.TryGetValue(i.ProdutoId, out var produto))
                            itemDto.Produto = ObjectMapper.Map<Produto, ProdutoDto>(produto);
                        return itemDto;
                    })
                    .ToList();

                return dto;
            }).ToList();
        }
    }
}

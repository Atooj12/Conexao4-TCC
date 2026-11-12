using Conexao4.Produtos;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace Conexao4.Pedidos;

// Carrinho = itens do usuário logado que ainda não têm PedidoId.
// [Authorize]: sem token a API responde 401 (antes dava erro 500).
[Authorize]
public class ItemPedidoAppService : ApplicationService, IItemPedidoAppService
{
    private readonly IRepository<ItemPedido, int> _itemRepository;
    private readonly IRepository<Produto, int> _produtoRepository;
    private readonly IRepository<Pedido, int> _pedidoRepository;
    private readonly IPedidoAppService _pedidoAppService;

    public ItemPedidoAppService(
        IRepository<ItemPedido, int> itemRepository,
        IRepository<Produto, int> produtoRepository,
        IRepository<Pedido, int> pedidoRepository,
        IPedidoAppService pedidoAppService)
    {
        _itemRepository = itemRepository;
        _produtoRepository = produtoRepository;
        _pedidoRepository = pedidoRepository;
        _pedidoAppService = pedidoAppService;
    }

    public async Task<ListResultDto<ItemPedidoDto>> GetListAsync()
    {
        var itens = await GetItensDoCarrinhoAsync();
        var produtos = await GetProdutosAsync(itens);

        var dtos = itens.Select(i => MapItem(i, produtos)).ToList();
        return new ListResultDto<ItemPedidoDto>(dtos);
    }

    public async Task<ItemPedidoDto> AdicionarAoCarrinhoAsync(int produtoId, int quantidade = 1)
    {
        if (quantidade < 1)
            throw new UserFriendlyException("A quantidade deve ser pelo menos 1.");

        var produto = await _produtoRepository.FindAsync(produtoId)
            ?? throw new UserFriendlyException("Produto não encontrado.");

        if (!produto.Disponivel)
            throw new UserFriendlyException($"{produto.Nome} está indisponível no momento.");

        var userId = CurrentUser.GetId();

        // Se o produto já está no carrinho, só soma a quantidade
        var item = await _itemRepository.FirstOrDefaultAsync(x =>
            x.UserId == userId && x.PedidoId == null && x.ProdutoId == produtoId);

        if (item == null)
        {
            item = await _itemRepository.InsertAsync(new ItemPedido
            {
                UserId = userId,
                ProdutoId = produtoId,
                Quantidade = quantidade
            }, autoSave: true);
        }
        else
        {
            item.Quantidade += quantidade;
            await _itemRepository.UpdateAsync(item, autoSave: true);
        }

        return MapItem(item, new Dictionary<int, Produto> { [produto.Id] = produto });
    }

    public async Task<ItemPedidoDto> AlterarQuantidadeAsync(int id, int quantidade)
    {
        if (quantidade < 1)
            throw new UserFriendlyException("A quantidade deve ser pelo menos 1. Para tirar o item, use o DELETE.");

        var item = await GetItemDoCarrinhoAsync(id);
        item.Quantidade = quantidade;
        await _itemRepository.UpdateAsync(item, autoSave: true);

        var produtos = await GetProdutosAsync(new List<ItemPedido> { item });
        return MapItem(item, produtos);
    }

    public async Task DeleteAsync(int id)
    {
        var item = await GetItemDoCarrinhoAsync(id);
        await _itemRepository.DeleteAsync(item);
    }

    public async Task LimparCarrinhoAsync()
    {
        var itens = await GetItensDoCarrinhoAsync();
        await _itemRepository.DeleteManyAsync(itens);
    }

    public async Task<PedidoDto> FinalizarCarrinhoAsync(FinalizarCarrinhoInput input)
    {
        var itens = await GetItensDoCarrinhoAsync();
        if (itens.Count == 0)
            throw new UserFriendlyException("Seu carrinho está vazio.");

        var produtos = await GetProdutosAsync(itens);

        var indisponiveis = itens
            .Where(i => !produtos.TryGetValue(i.ProdutoId, out var p) || !p.Disponivel)
            .Select(i => produtos.TryGetValue(i.ProdutoId, out var p) ? p.Nome : $"#{i.ProdutoId}")
            .ToList();
        if (indisponiveis.Any())
            throw new UserFriendlyException($"Indisponível no momento: {string.Join(", ", indisponiveis)}. Remova do carrinho para continuar.");

        // O total é calculado aqui no servidor, com o preço atual (o cliente não manda o preço)
        foreach (var item in itens)
            item.PrecoUnitario = produtos[item.ProdutoId].Preco;

        var pedido = await _pedidoRepository.InsertAsync(new Pedido
        {
            UserId = CurrentUser.GetId(),
            Status = StatusPedido.Pendente,
            Total = itens.Sum(i => i.PrecoUnitario * i.Quantidade),
            FormaPagamento = input.FormaPagamento,
            TipoPedido = input.TipoPedido,
            Observacao = input.Observacao
        }, autoSave: true);

        foreach (var item in itens)
            item.PedidoId = pedido.Id;
        await _itemRepository.UpdateManyAsync(itens, autoSave: true);

        return await _pedidoAppService.GetAsync(pedido.Id);
    }

    // ---------- auxiliares ----------

    private async Task<List<ItemPedido>> GetItensDoCarrinhoAsync()
    {
        var userId = CurrentUser.GetId();
        return await _itemRepository.GetListAsync(x => x.UserId == userId && x.PedidoId == null);
    }

    // Garante que o item existe, é do usuário logado e ainda está no carrinho
    private async Task<ItemPedido> GetItemDoCarrinhoAsync(int id)
    {
        var item = await _itemRepository.FindAsync(id);
        if (item == null || item.UserId != CurrentUser.GetId() || item.PedidoId != null)
            throw new EntityNotFoundException(typeof(ItemPedido), id);

        return item;
    }

    private async Task<Dictionary<int, Produto>> GetProdutosAsync(List<ItemPedido> itens)
    {
        var ids = itens.Select(i => i.ProdutoId).Distinct().ToList();
        var produtos = await _produtoRepository.GetListAsync(p => ids.Contains(p.Id));
        return produtos.ToDictionary(p => p.Id);
    }

    private ItemPedidoDto MapItem(ItemPedido item, Dictionary<int, Produto> produtos)
    {
        var dto = ObjectMapper.Map<ItemPedido, ItemPedidoDto>(item);
        if (produtos.TryGetValue(item.ProdutoId, out var produto))
        {
            dto.Produto = ObjectMapper.Map<Produto, ProdutoDto>(produto);
            dto.PrecoUnitario = produto.Preco; // no carrinho vale o preço atual
        }
        return dto;
    }
}

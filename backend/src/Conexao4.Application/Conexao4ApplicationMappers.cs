using Conexao4.Pedidos;
using Conexao4.Produtos;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace Conexao4;

// Mapperly gera o código de cópia propriedade-por-propriedade em tempo de compilação.

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class ProdutoToProdutoDtoMapper : MapperBase<Produto, ProdutoDto>
{
    public override partial ProdutoDto Map(Produto source);

    public override partial void Map(Produto source, ProdutoDto destination);
}

// Usado pelo CrudAppService de Produto no Create/Update
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class ProdutoDtoToProdutoMapper : MapperBase<ProdutoDto, Produto>
{
    public override partial Produto Map(ProdutoDto source);

    public override partial void Map(ProdutoDto source, Produto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class ItemPedidoToItemPedidoDtoMapper : MapperBase<ItemPedido, ItemPedidoDto>
{
    [MapperIgnoreTarget(nameof(ItemPedidoDto.Produto))] // preenchido no AppService
    public override partial ItemPedidoDto Map(ItemPedido source);

    [MapperIgnoreTarget(nameof(ItemPedidoDto.Produto))]
    public override partial void Map(ItemPedido source, ItemPedidoDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class PedidoToPedidoDtoMapper : MapperBase<Pedido, PedidoDto>
{
    // Itens e NomeCliente vêm de outras tabelas, preenchidos no PedidoAppService
    [MapperIgnoreTarget(nameof(PedidoDto.Itens))]
    [MapperIgnoreTarget(nameof(PedidoDto.NomeCliente))]
    public override partial PedidoDto Map(Pedido source);

    [MapperIgnoreTarget(nameof(PedidoDto.Itens))]
    [MapperIgnoreTarget(nameof(PedidoDto.NomeCliente))]
    public override partial void Map(Pedido source, PedidoDto destination);
}

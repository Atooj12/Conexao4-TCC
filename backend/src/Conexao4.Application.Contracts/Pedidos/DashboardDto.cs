using System.Collections.Generic;

namespace Conexao4.Pedidos;

public class DashboardDto
{
    public decimal VendasHoje { get; set; }
    public int PedidosHoje { get; set; }
    public decimal TicketMedio { get; set; }
    public int PedidosPendentes { get; set; }
    public List<TopProdutoDto> TopProdutos { get; set; } = new();
}

public class TopProdutoDto
{
    public int ProdutoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal Receita { get; set; }
}

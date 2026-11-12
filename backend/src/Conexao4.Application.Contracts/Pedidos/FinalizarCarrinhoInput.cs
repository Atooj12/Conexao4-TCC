using System.ComponentModel.DataAnnotations;

namespace Conexao4.Pedidos;

public class FinalizarCarrinhoInput
{
    public FormaPagamento FormaPagamento { get; set; }
    public TipoPedido TipoPedido { get; set; }

    [StringLength(500)]
    public string? Observacao { get; set; }
}

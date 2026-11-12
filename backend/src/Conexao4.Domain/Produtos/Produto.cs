using Volo.Abp.Domain.Entities.Auditing;

namespace Conexao4.Produtos
{
    public class Produto : AuditedAggregateRoot<int>
    {
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? UrlImagem { get; set; }

        // decimal (e não float) porque é dinheiro: float tem erro de arredondamento
        public decimal Preco { get; set; }

        public CategoriaProduto Categoria { get; set; }

        // Produto pausado continua no cardápio, mas não pode ir pro carrinho
        public bool Disponivel { get; set; } = true;
    }
}

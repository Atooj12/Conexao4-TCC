using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Conexao4.Produtos
{
    public class ProdutoDto : AuditedEntityDto<int>
    {
        [Required]
        [StringLength(128)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 100000)]
        public decimal Preco { get; set; }

        [StringLength(1024)]
        public string? Descricao { get; set; }

        [StringLength(512)]
        public string? UrlImagem { get; set; }

        public CategoriaProduto Categoria { get; set; }

        public bool Disponivel { get; set; } = true;
    }
}

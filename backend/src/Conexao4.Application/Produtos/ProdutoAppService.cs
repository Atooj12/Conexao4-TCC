using Conexao4.Permissions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Conexao4.Produtos
{
    // GET (listar/ver) é público: o cardápio aparece sem login.
    // Criar/editar/excluir exige as permissões de produto (o admin já tem todas).
    public class ProdutoAppService :
        CrudAppService<
            Produto,                        // entidade
            ProdutoDto,                     // DTO de saída
            int,                            // tipo da chave
            PagedAndSortedResultRequestDto  // paginação/ordenação
            >,
        IProdutoAppService
    {
        public ProdutoAppService(IRepository<Produto, int> repository)
            : base(repository)
        {
            CreatePolicyName = Conexao4Permissions.Produtos.Create;
            UpdatePolicyName = Conexao4Permissions.Produtos.Edit;
            DeletePolicyName = Conexao4Permissions.Produtos.Delete;
        }
    }
}

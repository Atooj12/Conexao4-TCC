using Conexao4.Produtos;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;

namespace Conexao4
{
    // Roda pelo Conexao4.DbMigrator. Só insere se a tabela estiver vazia,
    // então pode rodar várias vezes sem duplicar.
    // O usuário "admin" (senha 1q2w3E*) é criado pelo próprio ABP e recebe todas as permissões.
    public class Conexao4DataSeederContributor : IDataSeedContributor, ITransientDependency
    {
        public const string SenhaPadrao = "1q2w3E*";

        private readonly IRepository<Produto, int> _produtoRepository;
        private readonly IdentityUserManager _userManager;
        private readonly IGuidGenerator _guidGenerator;

        public Conexao4DataSeederContributor(
            IRepository<Produto, int> produtoRepository,
            IdentityUserManager userManager,
            IGuidGenerator guidGenerator)
        {
            _produtoRepository = produtoRepository;
            _userManager = userManager;
            _guidGenerator = guidGenerator;
        }

        public async Task SeedAsync(DataSeedContext context)
        {
            await SeedProdutosAsync();
            await SeedClienteDeTesteAsync();
        }

        private async Task SeedProdutosAsync()
        {
            if (await _produtoRepository.GetCountAsync() > 0)
                return;

            const string unsplash = "https://images.unsplash.com/photo-";

            var produtos = new List<Produto>
            {
                P("Cappuccino Italiano", "Espresso com leite vaporizado e espuma cremosa, finalizado com canela", 14.90m, CategoriaProduto.Cafes, unsplash + "1572442388796-11668a67e53d?w=600&q=80"),
                P("Café Coado Especial", "Café coado artesanalmente com grãos selecionados da fazenda", 9.90m, CategoriaProduto.Cafes, unsplash + "1495474472287-4d71bcdd2085?w=600&q=80"),
                P("Iced Latte", "Espresso duplo com leite gelado e gelo, refrescante e encorpado", 16.90m, CategoriaProduto.BebidasGeladas, unsplash + "1517701604599-bb29b565090c?w=600&q=80"),
                P("Frappuccino Caramelo", "Bebida gelada cremosa com café, caramelo e chantilly", 22.90m, CategoriaProduto.BebidasGeladas, unsplash + "1572490122747-3968b75cc699?w=600&q=80"),
                P("Cold Brew 12h", "Café extraído a frio por 12 horas, sabor suave e adocicado natural", 18.90m, CategoriaProduto.BebidasGeladas, unsplash + "1517701550927-30cf4ba1dba5?w=600&q=80"),
                P("Croissant de Presunto e Queijo", "Croissant folhado artesanal recheado com presunto e queijo gruyère", 19.90m, CategoriaProduto.Lanches, unsplash + "1555507036-ab1f4038808a?w=600&q=80"),
                P("Sanduíche Caprese", "Pão ciabatta com mozzarella de búfala, tomate e manjericão fresco", 24.90m, CategoriaProduto.Lanches, unsplash + "1528735602780-2552fd46c7af?w=600&q=80"),
                P("Brownie de Chocolate", "Brownie denso de chocolate 70% com nozes, servido morno", 14.90m, CategoriaProduto.Doces, unsplash + "1606313564200-e75d5e30476c?w=600&q=80"),
                P("Tiramisù", "Clássico italiano com café espresso, mascarpone e cacau", 22.90m, CategoriaProduto.Doces, unsplash + "1571877227200-a0d98ea607e9?w=600&q=80"),
                P("Quiche Lorraine", "Quiche clássica com bacon crocante, queijo gruyère e nata", 16.90m, CategoriaProduto.Salgados, "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Quiche_Lorraine-2009.jpg/500px-Quiche_Lorraine-2009.jpg"),
                P("Coxinha", "Coxinha de frango com catupiry, massa crocante", 8.90m, CategoriaProduto.Salgados, "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Coxinha_-_iguaria_brasileira_01.jpg/250px-Coxinha_-_iguaria_brasileira_01.jpg"),
                P("Chocolate Quente da Casa", "Chocolate cremoso com chantilly, receita especial da casa", 15.90m, CategoriaProduto.Especiais, "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hahndorf_Hot_Chocolate.jpg/250px-Hahndorf_Hot_Chocolate.jpg"),
            };

            await _produtoRepository.InsertManyAsync(produtos, autoSave: true);
        }

        // Cliente comum (sem permissão de admin), pra demo e pros testes do app Android
        private async Task SeedClienteDeTesteAsync()
        {
            if (await _userManager.FindByNameAsync("cliente") != null)
                return;

            var user = new IdentityUser(_guidGenerator.Create(), "cliente", "cliente@conexao4.com")
            {
                Name = "Cliente",
                Surname = "Teste"
            };
            var resultado = await _userManager.CreateAsync(user, SenhaPadrao);
            Microsoft.AspNetCore.Identity.AbpIdentityResultExtensions.CheckErrors(resultado);
        }

        private static Produto P(string nome, string descricao, decimal preco, CategoriaProduto categoria, string urlImagem)
        {
            return new Produto
            {
                Nome = nome,
                Descricao = descricao,
                Preco = preco,
                Categoria = categoria,
                UrlImagem = urlImagem,
                Disponivel = true
            };
        }
    }
}

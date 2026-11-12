using Conexao4.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Conexao4.Permissions;

public class Conexao4PermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var grupo = context.AddGroup(Conexao4Permissions.GroupName, L("Permission:Conexao4"));

        var produtos = grupo.AddPermission(Conexao4Permissions.Produtos.Default, L("Permission:Produtos"));
        produtos.AddChild(Conexao4Permissions.Produtos.Create, L("Permission:Produtos.Create"));
        produtos.AddChild(Conexao4Permissions.Produtos.Edit, L("Permission:Produtos.Edit"));
        produtos.AddChild(Conexao4Permissions.Produtos.Delete, L("Permission:Produtos.Delete"));

        var pedidos = grupo.AddPermission(Conexao4Permissions.Pedidos.Default, L("Permission:Pedidos"));
        pedidos.AddChild(Conexao4Permissions.Pedidos.Gerenciar, L("Permission:Pedidos.Gerenciar"));
    }

    private static LocalizableString L(string nome)
    {
        return LocalizableString.Create<Conexao4Resource>(nome);
    }
}

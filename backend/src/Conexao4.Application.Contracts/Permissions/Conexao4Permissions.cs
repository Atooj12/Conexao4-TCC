namespace Conexao4.Permissions;

public static class Conexao4Permissions
{
    public const string GroupName = "Conexao4";

    public static class Produtos
    {
        public const string Default = GroupName + ".Produtos";
        public const string Create = Default + ".Criar";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    public static class Pedidos
    {
        public const string Default = GroupName + ".Pedidos";

        // Quem tem essa permissão é tratado como admin no front
        public const string Gerenciar = Default + ".Gerenciar";
    }
}

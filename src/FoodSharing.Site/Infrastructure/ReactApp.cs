
namespace FoodSharing.Site.Infrastructure;

public readonly struct ReactApp
{
    public String Name { get; }
    public String ContainerId { get; }
    public SystemUser? SystemUser { get; }

    public ReactApp(String name, SystemUser? systemUser, String containerId = "root")
    {
        Name = name;
        SystemUser = systemUser;
        ContainerId = containerId;
    }
}
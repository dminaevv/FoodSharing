﻿namespace FoodSharing.Site.Services.Chat.Repositories.Models;

public class ChatDB
{
    public Guid Id   { get; set; }
    public Guid[] MembersIds { get; set; }
    public Guid? AnnouncementId { get; set; }
    public DateTimeOffset CreatedDateTimeUtc  { get; set; }
    public DateTimeOffset? ModifiedDateTimeUtc  { get; set; }
    public Boolean IsRemoved  { get; set; }

}
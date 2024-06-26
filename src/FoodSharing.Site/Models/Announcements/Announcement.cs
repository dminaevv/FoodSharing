﻿    namespace FoodSharing.Site.Models.Announcements;

public class Announcement
{
    public Guid Id  { get; }
    public String Name  { get; }
    public Guid OwnerUserId { get; }
    public String Description  { get; }
    public Guid CategoryId  { get; }
    public String GramsWeight  { get; }
    public Guid CityId  { get; }
    public String[] ImagesUrls  { get; }
    public DateTime CreatedAt  { get; }

    public Announcement(
        Guid id, String name, Guid ownerUserId, String description, Guid categoryId, 
        String gramsWeight, Guid cityId, String[] imagesUrls, DateTime createdAt
    )
    {
        Id = id;
        Name = name;
        OwnerUserId = ownerUserId;
        Description = description;
        CategoryId = categoryId;
        GramsWeight = gramsWeight;
        CityId = cityId;
        ImagesUrls = imagesUrls;
        CreatedAt = createdAt;
    }
}
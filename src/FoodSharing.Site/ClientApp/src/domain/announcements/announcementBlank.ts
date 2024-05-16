import { Announcement } from "./announcement";

export class AnnouncementBlank {
    constructor(
        public id: string | null,
        public name: string | null,
        public ownerUserId: string | null,
        public description: string | null,
        public categoryId: string | null,
        public gramsWeight: number | null,
        public cityId: string | null,
        public imagesUrls: string[],
        public uploadPhotos: File[]
    ) { }

    public static Empty(userId: string) {
        return new AnnouncementBlank(null, null, userId, null, null, null, null, [], []);
    }
}

export function mapToAnnouncementBlank(announcement: Announcement) {
    return new AnnouncementBlank(
        announcement.id, announcement.name, announcement.ownerUserId, announcement.description,
        announcement.categoryId, announcement.gramsWeight, announcement.cityId, announcement.imagesUrls, []
    );
}

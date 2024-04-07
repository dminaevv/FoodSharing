import { Announcement } from "./announcement";

export class AnnouncementBlank {
    constructor(
        public id: string | null,
        public name: string | null,
        public description: string | null,
        public categoryId: string | null,
        public gramsWeight: number | null,
        public imagesUrls: string[], 
        public uploadPhotosBase64: string[]
    ) { }

    public static Empty() {
        return new AnnouncementBlank(null, null, null, null, null, [], []);
    }
}

export function mapToAnnouncementBlank(announcement: Announcement) {
    return new AnnouncementBlank(
        announcement.id, announcement.name, announcement.description,
        announcement.categoryId, announcement.gramsWeight, announcement.imagesUrls, []
    );
}

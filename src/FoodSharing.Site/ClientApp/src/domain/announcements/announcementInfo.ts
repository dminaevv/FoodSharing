import { User, mapToUser } from "../users/user";
import { AnnouncementCategory, mapToAnnouncementCategory } from "./announcementCategory";

export class AnnouncementDetailInfo {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public category: AnnouncementCategory,
        public gramsWeight: number,
        public imagesUrls: string[],
        public owner: User,
        public isFavorite: boolean
    ) { }
}

export function mapToAnnouncementDetailInfo(data: any) {
    return new AnnouncementDetailInfo(
        data.id,
        data.name,
        data.description,
        mapToAnnouncementCategory(data.category),
        data.gramsWeight,
        data.imagesUrls,
        mapToUser(data.owner),
        data.isFavorite
    )
}
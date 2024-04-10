import { AnnouncementShortInfo, mapToAnnouncementShortInfo } from "../announcements/announcementShortInfo";
import { User, mapToUser } from "../users/user";

export class Chat {
    constructor(
        public id: string,
        public members: User[],
        public announcement: AnnouncementShortInfo | null
    ) { }
}

export function mapToChat(data: any) {
    const members = (data.members as any[]).map(mapToUser);
    const announcement = data.announcement != null ? mapToAnnouncementShortInfo(data.announcement) : null;

    return new Chat(data.id, members, announcement);
}
import { AnnouncementShortInfo, mapToAnnouncementShortInfo } from "../announcements/announcementShortInfo";

export class Chat {
    constructor(
        public id: string,
        public memberIds: string[],
        public announcement: AnnouncementShortInfo | null
    ) { }
}

export function mapToChat(data: any) {
    const announcement = data.announcement != null ? mapToAnnouncementShortInfo(data.announcement) : null;

    return new Chat(data.id, data.memberIds, announcement);
}
import { Uuid } from "../../tools/uuid";
import { AnnouncementShortInfo } from "../announcements/announcementShortInfo";
import { User } from "../users/user";

export class ChatBlank {
    constructor(
        public members: User[],
        public announcement: AnnouncementShortInfo | null
    ) { }

    public static create(members: User[], announcement: AnnouncementShortInfo | null) {
        return new ChatBlank(members, announcement);
    }
}

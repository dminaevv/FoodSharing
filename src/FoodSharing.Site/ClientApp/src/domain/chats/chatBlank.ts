import { Uuid } from "../../tools/uuid";
import { AnnouncementShortInfo } from "../announcements/announcementShortInfo";
import { User } from "../users/user";

export class ChatBlank {
    constructor(
        public id: string,
        public members: User[],
        public announcement: AnnouncementShortInfo | null
    ) { }

    public static create(members: User[], announcement: AnnouncementShortInfo | null) {
        return new ChatBlank(Uuid.create(), members, announcement);
    }
}

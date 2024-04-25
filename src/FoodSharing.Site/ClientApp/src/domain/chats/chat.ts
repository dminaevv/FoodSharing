
export class Chat {
    constructor(
        public id: string,
        public memberIds: string[],
        public announcementId: string | null,
        public lastMessageId: string
    ) { }
}

export function mapToChat(data: any) {
    return new Chat(data.id, data.memberIds, data.announcementId, data.lastMessageId);
}
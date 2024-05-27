import { MessageStatus } from "./messageStatus";

export class Message {
    constructor(
        public id: string,
        public chatId: string,
        public content: string,
        public createdUserId: string,
        public status: MessageStatus,
        public createdDateTimeUtc: Date,
    ) { }

    public updateStatusToRead() {
        this.status = MessageStatus.Read;
    }
}

export function mapToMessage(data: any) {
    return new Message(data.id, data.chatId, data.content, data.createdUserId, data.status, new Date(data.createdDateTimeUtc))
}
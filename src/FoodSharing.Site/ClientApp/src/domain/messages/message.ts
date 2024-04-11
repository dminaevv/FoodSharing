export class Message {
    constructor(
        public id: string,
        public chatId: string,
        public content: string,
        public createdUserId: string,
        public createdDateTimeUtc: Date,
    ) { }
}

export function mapToMessage(data: any) {
    return new Message(data.id, data.chatId, data.content, data.createdUserId, new Date(data.createdDateTimeUtc))
}
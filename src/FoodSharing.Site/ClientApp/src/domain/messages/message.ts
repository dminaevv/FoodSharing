export class Message {
    constructor(
        public id: string,
        public dialogId: string,
        public content: string,
        public createdUserId: string,
        public createdDateTimeUtc: Date,
    ) { }
}

export function mapToMessage(data: any) {
    return new Message(data.id, data.dialogId, data.content, data.createdUserId, data.createdDateTimeUtc)
}
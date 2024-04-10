export class MessageBlank {
    constructor(
        public id: string | null,
        public dialogId: string | null,
        public content: string | null,
        public createdUserId: string | null,
        public createdDateTimeUtc: Date | null,
    ) { }

    public static empty(dialogId: string, senderId: string) {
        return new MessageBlank(null, dialogId, null, senderId, null)
    }
}

export function mapToMessageBlank(data: any) {
    return new MessageBlank(data.id, data.dialogId, data.content, data.createdUserId, data.createdDateTimeUtc)
}
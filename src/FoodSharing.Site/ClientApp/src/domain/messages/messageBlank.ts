export class MessageBlank {
    constructor(
        public id: string | null,
        public chatId: string | null,
        public content: string | null
    ) { }

    public static empty() {
        return new MessageBlank(null, null, null)
    }
}

export function mapToMessageBlank(data: any) {
    return new MessageBlank(data.id, data.dialogId, data.content)
}
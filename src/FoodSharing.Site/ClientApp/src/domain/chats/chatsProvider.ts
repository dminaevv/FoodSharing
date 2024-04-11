import { HttpClient } from "../../tools/httpClient";
import { Message, mapToMessage } from "../messages/message";
import { Chat, mapToChat } from "./chat";

export class ChatsProvider {
    public static async getByAnnouncementId(announcementId: string): Promise<{ chat: Chat | null, messages: Message[] }> {
        const any = await HttpClient.get("/chat/getByAnnouncementId", { announcementId });

        const chat = any.chat != null ? mapToChat(any.chat) : null;
        const messages = (any.messages as any[]).map(mapToMessage);

        return { chat, messages };
    }
}
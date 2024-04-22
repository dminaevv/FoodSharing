import { HttpClient } from "../../tools/httpClient";
import { Message, mapToMessage } from "../messages/message";
import { User, mapToUser } from "../users/user";
import { Chat, mapToChat } from "./chat";

export class ChatsProvider {
    public static async getByAnnouncementId(announcementId: string): Promise<{ chat: Chat | null, messages: Message[], members: User[] }> {
        const any = await HttpClient.get("/chat/getByAnnouncementId", { announcementId });

        const chat = any.chat != null ? mapToChat(any.chat) : null;
        const messages = (any.messages as any[]).map(mapToMessage);
        const members = (any.members as any[]).map(mapToUser);

        return { chat, messages, members };
    }
}
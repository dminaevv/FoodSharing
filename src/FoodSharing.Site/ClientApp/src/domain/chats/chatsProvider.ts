import { HttpClient } from "../../tools/httpClient";
import { Chat, mapToChat } from "./chat";

export class ChatsProvider {
    public static async get(chatId: string): Promise<Chat> {
        const any = await HttpClient.get("/chat/get", { chatId });

        return mapToChat(any);
    }
}
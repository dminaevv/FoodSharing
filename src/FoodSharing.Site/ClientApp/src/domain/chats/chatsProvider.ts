import { HttpClient } from "../../tools/httpClient";
import { Announcement, mapToAnnouncement } from "../announcements/announcement";
import { Message, mapToMessage } from "../messages/message";
import { User, mapToUser } from "../users/user";
import { Chat, mapToChat } from "./chat";

export class ChatsProvider {
    public static async get(chatId: string): Promise<{ chat: Chat, messages: Message[], members: User[] }> {
        const any = await HttpClient.get("/chat/get", { chatId });

        const chat = mapToChat(any.chat);
        const messages = (any.messages as any[]).map(mapToMessage);
        const members = (any.members as any[]).map(mapToUser);

        return { chat, messages, members };
    }

    public static async getByAnnouncementId(announcementId: string): Promise<{ chat: Chat | null, messages: Message[], members: User[] }> {
        const any = await HttpClient.get("/chat/getByAnnouncementId", { announcementId });

        const chat = any.chat != null ? mapToChat(any.chat) : null;
        const messages = (any.messages as any[]).map(mapToMessage);
        const members = (any.members as any[]).map(mapToUser);

        return { chat, messages, members };
    }

    public static async getChats(): Promise<{ chats: Chat[], messages: Message[], members: User[], announcements: Announcement[] }> {
        const any = await HttpClient.get("/chat/get-list");

        const chat = (any.chats as any[]).map(mapToChat);
        const messages = (any.messages as any[]).map(mapToMessage);
        const members = (any.members as any[]).map(mapToUser);
        const announcements = (any.announcements as any[]).map(mapToAnnouncement);

        return { chats: chat, messages, members, announcements };
    }
}
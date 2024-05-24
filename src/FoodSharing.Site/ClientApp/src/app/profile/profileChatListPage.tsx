import { Card, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { Announcement } from "../../domain/announcements/announcement";
import { Chat } from "../../domain/chats/chat";
import { ChatsProvider } from "../../domain/chats/chatsProvider";
import { Message } from "../../domain/messages/message";
import { User } from "../../domain/users/user";
import { useSystemUser } from "../../hooks/useSystemUser";


export function ProfileChatListPage() {
    const systemUser = useSystemUser();
    const navigate = useNavigate();

    const [chats, setChats] = useState<Chat[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [lastMessages, setLastMessages] = useState<Message[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        loadChats();
    }, [])

    function loadChats() {
        BlockUi.block(async () => {
            const result = await ChatsProvider.getChats();

            setChats(result.chats);
            setMembers(result.members);
            setLastMessages(result.messages);
            setAnnouncements(result.announcements);
        })
    }

    function renderChat(chat: Chat) {
        const lastMessage = lastMessages.find(m => m.id == chat.lastMessageId)!;
        const users = members.filter(m => chat.memberIds.includes(m.id) && m.id != systemUser?.id)!;
        const announcement = announcements.find(a => a.id == chat.announcementId)!

        return (
            <Card key={chat.id} sx={{ borderRadius: 3, '&:hover': { backgroundColor: '#f7f7f7', cursor: 'pointer' }, transition: 'background-color 0.3s' }} onClick={() => navigate(`/profile/chat/${chat.id}`)}>
                <Stack direction='row' justifyContent='space-between' p={2}>
                    <Stack direction='row' gap={2} overflow='hidden'>
                        <Stack width="110px" height="65px">
                            <img src={announcement.imagesUrls[0]} style={{ width: "110px", height: "100%", objectFit: "cover", borderRadius: 10, aspectRatio: '4/3' }} />
                        </Stack>
                        <Stack direction='column'>
                            <Typography fontSize={16} fontWeight='bold' sx={{ lineHeight: 1.4 }}>
                                {
                                    users.map(user => user.firstName ?? user.email)
                                }
                            </Typography>
                            <Typography fontSize={14} sx={{ lineHeight: 1 }}>{announcement.name}</Typography>
                            <Typography fontSize={14} sx={{
                                color: '#808080', lineHeight: 2, overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                            >
                                {lastMessage.content}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack >
                        <Typography fontSize={16} >
                            {lastMessage.createdDateTimeUtc.toLocaleDateString()}
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        )
    }

    return (
        <Stack direction='column' gap={2} flexWrap='nowrap'>
            {chats.map(renderChat)}
        </Stack>
    )
}

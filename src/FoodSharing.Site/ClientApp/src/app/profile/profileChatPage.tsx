import * as signalR from '@microsoft/signalr';
import { Avatar, Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlockUi } from '../../components/blockUi/blockUi';
import { CLink } from '../../components/link';
import { Announcement } from '../../domain/announcements/announcement';
import { AnnouncementsProvider } from '../../domain/announcements/announcementsProvider';
import { ChatsProvider } from '../../domain/chats/chatsProvider';
import { Message, mapToMessage } from '../../domain/messages/message';
import { MessageBlank } from '../../domain/messages/messageBlank';
import { User } from '../../domain/users/user';
import { useSystemUser } from '../../hooks/useSystemUser';
import { AnnouncementLinks, UsersLinks } from '../../tools/constants/links';
import { Uuid } from '../../tools/uuid';

export function ProfileChatPage() {
    const { chatId, announcementId } = useParams<{ chatId?: string, announcementId: string }>();

    const systemUser = useSystemUser();

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);

    const [chatIdState, setChatId] = useState<string | null>(chatId ?? null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageBlank, setMessageBlank] = useState<MessageBlank>(MessageBlank.empty());
    const [members, setMembers] = useState<User[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadAnnouncement(announcementId ?? null);
        loadChat();
    }, [systemUser?.id])

    useEffect(() => {
        return startConnection();
    }, [chatIdState])

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    function loadChat() {
        BlockUi.block(async () => {
            if (chatIdState == null) {
                if (announcementId == null) throw new Error();

                const result = await ChatsProvider.getByAnnouncementId(announcementId);
                setMembers(result.members);

                if (result.chat != null) {
                    setChatId(result.chat.id);
                    setMessages(result.messages);
                }
                else {
                    setChatId(Uuid.create());
                }
            }
            else {
                const result = await ChatsProvider.get(chatIdState);
                setMembers(result.members);
                setChatId(result.chat.id);
                setMessages(result.messages);
                loadAnnouncement(result.chat.announcementId)
            }
        })
    }

    function loadAnnouncement(id: string | null) {
        BlockUi.block(async () => {
            if (id == null) return;

            const announcement = await AnnouncementsProvider.get(id);
            setAnnouncement(announcement);
        })
    }

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView();
    };

    function startConnection() {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/chat?chatId=${chatIdState}`)
            .build();

        connection.on('NewMessage', (anyMessage: any) => {
            const message = mapToMessage(anyMessage);
            setMessages(prevMessages => [...prevMessages, message]);
        });

        connection.start().then(() => {
            setConnection(connection);
        });

        return () => {
            connection.stop();
        };
    }

    async function onSendMessage() {
        if (systemUser == null) throw new Error();

        const blank = { ...messageBlank };
        blank.chatId = chatIdState;
        blank.createdUserId = systemUser.id;
        blank.createdDateTimeUtc = new Date();
        blank.id = Uuid.create();

        const message = mapToMessage(blank);
        setMessages(prev => ([...prev, message]))

        await connection?.send("SendMessage", { message, announcementId });
        setMessageBlank(MessageBlank.empty())
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSendMessage();
        }
    };

    return (
        <Grid height="80vh" wrap='nowrap' overflow='hidden' gap={2} position="relative">
            <Box height={"100%"} >
                {
                    announcement != null &&
                    <Paper sx={{
                        zIndex: 10,
                        margin: 0.5,
                        borderRadius: "10px",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
                    }}>
                        <Stack direction='row' gap={2} p={1} height="100%">
                            <Box sx={{ width: "60px" }}>
                                <img src={announcement.imagesUrls[0]} style={{ width: "100%", height: "100%", objectFit: 'contain' }} />
                            </Box>
                            <Stack>
                                <CLink text={announcement.name} href={AnnouncementLinks.toAnnouncement(announcement.id)} sx={{
                                    lineHeight: 1, overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    lineHeightStep: 1
                                }} />
                                <Typography fontSize={14} sx={{ color: '#808080', lineHeight: 2 }}>{announcement.description}</Typography>
                            </Stack>
                        </Stack>
                    </Paper>

                }
                <Grid container width="100%" height={"90%"} direction='column' zIndex={5} wrap='nowrap' sx={{ p: 2 }}>
                    <Grid item xs={10} sx={{ overflowY: "hidden" }}>
                        <Stack direction='column' gap={1} sx={{ width: '100%', height: "100%", overflowY: "auto" }}>
                            {
                                messages.length > 0
                                    ? messages.slice().map((message, index) => {
                                        const member = members.find(m => m.id === message.createdUserId)!;
                                        return (
                                            <Box key={index} >
                                                <Stack direction="row" alignItems="flex-start" gap={1} >
                                                    <Avatar alt="Avatar" sx={{ width: 40, height: 40 }} src={member.avatarUrl ?? 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'} />
                                                    <Stack>
                                                        <Stack direction="row" alignItems="center" gap={1}>
                                                            <CLink text={member.firstName ?? member.email} href={UsersLinks.toUser(member.id)} />
                                                            <Typography variant="subtitle2" style={{ color: '#808080' }}>
                                                                {message.createdDateTimeUtc.toLocaleTimeString()}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography style={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Box>

                                        )
                                    })
                                    : <Stack sx={{ width: "100%", height: "100%" }} alignItems='center' justifyContent='center'><Typography>Сообщений нет. Напишите первое</Typography></Stack>
                            }
                            <div ref={messagesEndRef} />
                        </Stack>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="Сообщение"
                            variant="outlined"
                            fullWidth
                            value={messageBlank.content ?? ''}
                            onKeyDown={onKeyDown}
                            multiline
                            maxRows={10}
                            onChange={(e) => setMessageBlank(prev => ({ ...prev, content: e.target.value }))}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button variant="contained" onClick={onSendMessage}>
                            Отправить
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}

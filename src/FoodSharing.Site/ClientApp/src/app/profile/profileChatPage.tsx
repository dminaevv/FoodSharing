import * as signalR from '@microsoft/signalr';
import { Avatar, Box, Button, Card, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { MessageStatus } from '../../domain/messages/messageStatus';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export function ProfileChatPage() {
    const { chatId, announcementId } = useParams<{ chatId?: string, announcementId: string }>();

    const systemUser = useSystemUser();

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);

    const [chatIdState, setChatId] = useState<string | null>(chatId ?? null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageBlank, setMessageBlank] = useState<MessageBlank>(MessageBlank.empty());
    const [members, setMembers] = useState<User[]>([]);
    const [initialScrollDone, setInitialScrollDone] = useState(false);
    const [messagesIsLoaded, setMessagesIsLoaded] = useState(false);

    const unReadMessageCount = useMemo(() => messages.filter(m => m.status == MessageStatus.Sent && m.createdUserId != systemUser?.id).length, [messages]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (systemUser?.id == null) return;

        loadAnnouncement(announcementId ?? null);
        loadChat();

    }, [systemUser?.id])

    useEffect(() => {
        return startConnection();
    }, [chatIdState])

    useEffect(() => {
        if (!initialScrollDone && messagesIsLoaded) {
            scrollToBottom();
            setInitialScrollDone(true);
            return;
        }

        const container = messagesContainerRef.current;
        if (container == null) return;

        const isUserAtBottom = container.scrollHeight - container.scrollTop;

        if (isUserAtBottom < 1500) {
            scrollToBottom();
        }
    }, [messages.length]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                markMessagesAsRead();
            }
        }, {
            root: messagesContainerRef.current,
            rootMargin: '0px',
            threshold: 1.0
        });

        if (lastMessageRef.current) {
            observer.observe(lastMessageRef.current);
        }

        return () => {
            if (lastMessageRef.current) {
                observer.unobserve(lastMessageRef.current);
            }
        };
    }, [messages.length, connection]);

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

            setMessagesIsLoaded(true)
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
    }

    async function markMessagesAsRead() {
        if (connection == null) return;
        await connection.send("MarkMessagesAsRead", {});
    }

    function startConnection() {
        if (chatIdState == null || String.isNullOrWhitespace(chatIdState)) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/chat?chatId=${chatIdState}`)
            .build();

        connection.on('NewMessage', (anyMessage: any) => {
            const message = mapToMessage(anyMessage);
            setMessages(prevMessages => [...prevMessages, message]);
        });

        connection.on('MessagesRead', (messageIds: string[]) => {
            setMessages(prevMessages => prevMessages.map(message => {
                if (messageIds.includes(message.id)) {
                    return { ...message, status: MessageStatus.Read } as Message;
                }
                return message;
            }));
        });


        connection.start().then(() => {
            setConnection(connection);
        });

        return () => {
            connection.stop();
        };
    }

    async function sendMessage() {
        if (systemUser == null) throw new Error();

        const message = await connection?.invoke("SendMessage", { messageBlank, announcementId });
        if (message == null) return;

        setMessages(prev => ([...prev, mapToMessage(message)]));
        setMessageBlank(MessageBlank.empty());
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <Stack sx={{ height: '100%', overflow: 'hidden' }} gap={2}>
            <Stack sx={{ height: "80px" }}>
                {announcement != null &&
                    <Stack sx={{
                        margin: 0.2,
                        borderRadius: "10px",
                    }}>
                        <Paper sx={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", height: '100%' }}>
                            <Stack direction='row' gap={2} p={1}>
                                <Box sx={{ width: "10%" }}>
                                    <img src={announcement.imagesUrls[0]} style={{ width: "100%", objectFit: 'contain', aspectRatio: '4/3' }} alt="announcement" />
                                </Box>
                                <Stack sx={{ maxWidth: "80%" }}>
                                    <CLink text={announcement.name} href={AnnouncementLinks.toAnnouncement(announcement.id)} sx={{
                                        lineHeight: 1, overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        lineHeightStep: 1
                                    }} />
                                    <Typography fontSize={14} sx={{
                                        mt: 2,
                                        color: '#808080', lineHeight: 1, overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        lineHeightStep: 1
                                    }}>{announcement.description}</Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Stack>
                }
            </Stack>
            <Stack sx={{ overflowY: 'auto', height: "100%", mt: 2 }} ref={messagesContainerRef}>
                <Stack direction='column' gap={1} >
                    {messages.length > 0
                        ? messages.map((message, index) => {
                            const member = members.find(m => m.id === message.createdUserId)!;
                            const isLastMessage = index === messages.length - 1;

                            return (
                                <Box key={index} ref={isLastMessage ? lastMessageRef : null}>
                                    <Stack direction="row" alignItems="flex-start" gap={1} >
                                        <Avatar alt="Avatar" sx={{ width: 40, height: 40 }} src={member.avatarUrl ?? 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'} />
                                        <Stack>
                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <CLink text={member.firstName ?? member.email} href={UsersLinks.toUser(member.id)} />
                                                <Typography variant="subtitle2" style={{ color: '#808080' }}>
                                                    {message.createdDateTimeUtc.toLocaleTimeString()}
                                                </Typography>
                                                <Stack direction='row'>
                                                    <CheckIcon sx={{ fontSize: 15, color: message.status == MessageStatus.Read ? "#3778fa" : "#9f9f9f" }} />
                                                    {message.status == MessageStatus.Read && <CheckIcon sx={{ fontSize: 15, color: "#3778fa" }} />}
                                                </Stack>
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
            </Stack>

            <Stack sx={{ height: "105px", position: 'relative' }}>
                {unReadMessageCount != 0 &&
                    <Paper elevation={2}
                        sx={{ position: 'absolute', top: -45, cursor: 'pointer', backgroundColor: 'white', borderRadius: 10, px: 1, py: 0.5 }} onClick={scrollToBottom}>
                        <Stack direction='row' alignItems='center'>
                            <Typography>
                                Новые сообщения
                            </Typography>
                            <KeyboardArrowDownIcon />
                        </Stack>
                    </Paper>
                }
                <Stack direction='column' gap={1.5}>
                    <Stack sx={{ height: '105px' }}>
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
                        <Button variant="contained" onClick={sendMessage}>
                            Отправить
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

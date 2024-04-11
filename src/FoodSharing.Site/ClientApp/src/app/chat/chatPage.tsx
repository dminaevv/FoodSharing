import * as signalR from '@microsoft/signalr';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlockUi } from '../../components/blockUi/blockUi';
import { Announcement } from '../../domain/announcements/announcement';
import { AnnouncementsProvider } from '../../domain/announcements/announcementsProvider';
import { ChatsProvider } from '../../domain/chats/chatsProvider';
import { Message, mapToMessage } from '../../domain/messages/message';
import { MessageBlank } from '../../domain/messages/messageBlank';
import { useSystemUser } from '../../hooks/useSystemUser';
import { Uuid } from '../../tools/uuid';


export function ChatPage() {
    const systemUser = useSystemUser();
    const { announcementId } = useParams();

    const [chatId, setChatId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageBlank, setMessageBlank] = useState<MessageBlank>(MessageBlank.empty());
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadAnnouncement()
        loadChat();
    }, [systemUser?.id])

    useEffect(() => {
        return startConnection();
    }, [chatId])

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    function loadChat() {
        BlockUi.block(async () => {
            if (announcementId == null) return;

            const result = await ChatsProvider.getByAnnouncementId(announcementId);

            if (result.chat != null) {
                setChatId(result.chat.id);
                setMessages(result.messages)
            }
            else {
                setChatId(Uuid.create());
            }
        })
    }

    function loadAnnouncement() {
        BlockUi.block(async () => {
            if (announcementId == null) return;

            const announcement = await AnnouncementsProvider.get(announcementId);
            setAnnouncement(announcement);
        })
    }

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    function startConnection() {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/chat?chatId=${chatId}`)
            .build();

        connection.on('NewMessage', (anyMessage: any) => {
            console.log(anyMessage)
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
        blank.chatId = chatId;
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
        <Grid container direction='column' wrap='nowrap' height="100vh" overflow='hidden' gap={2}>
            <Grid item xs={2}>
                <Typography variant="h5">ЧАТ</Typography>
                {announcement != null &&
                    <Stack direction='row' gap={2} height="70px">
                        <Box sx={{ width: "60px" }}>
                            <img src={announcement.imagesUrls[0]} style={{ width: "100%", height: "100%", objectFit: 'contain' }} />
                        </Box>
                        <Typography>{announcement.name}</Typography>
                    </Stack>
                }
            </Grid>
            <Grid item xs={8} sx={{ height: "100%", overflowY: "auto", px: 2 }}>
                {
                    messages.length > 0
                        ?
                        <Grid container direction='column' gap={1}>
                            {
                                messages.map((message) => (
                                    <Grid item xs key={message.id}>
                                        <Typography variant="subtitle2" style={{ color: '#808080' }}>{message.createdDateTimeUtc.toLocaleTimeString()}</Typography>
                                        <Typography style={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
                                    </Grid>
                                ))
                            }
                            <div ref={messagesEndRef} />
                        </Grid>

                        : <Typography>Сообщений нет. Напишите первое</Typography>
                }
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Сообщение"
                    variant="outlined"
                    fullWidth
                    value={messageBlank.content ?? ''}
                    onKeyDown={onKeyDown}
                    multiline
                    onChange={(e) => setMessageBlank(prev => ({ ...prev, content: e.target.value }))}
                    style={{ marginBottom: '10px' }}
                />
                <Button variant="contained" onClick={onSendMessage}>
                    Отправить
                </Button>
            </Grid>
        </Grid>
    )
}

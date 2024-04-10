import * as signalR from '@microsoft/signalr';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Message, mapToMessage } from '../../domain/messages/message';
import { MessageBlank } from '../../domain/messages/messageBlank';
import { useSystemUser } from '../../hooks/useSystemUser';
import { Uuid } from '../../tools/uuid';

export function ChatPage() {
    const systemUser = useSystemUser();
    const { chatId } = useParams();

    const [messages, setMessages] = useState<Message[]>([]);
    const [messageBlank, setMessageBlank] = useState<MessageBlank>(MessageBlank.empty(null!, systemUser!.id));
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        return startConnection();
    }, [systemUser?.id]);

    useEffect(() => {

    }, [])

    function startConnection() {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/chat?chatId=${chatId}`)
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
        const blank = { ...messageBlank };
        blank.createdDateTimeUtc = new Date();
        blank.id = Uuid.create();

        const message = mapToMessage(blank);
        setMessages(prev => ([...prev, message]))

        await connection?.send("SendMessage", message);
        setMessageBlank(MessageBlank.empty(chatId!, systemUser!.id))
    };

    function loadChat() {
        if (chatId == null) return;


    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
                <Typography variant="h5">ЧАТ</Typography>
                <div style={{ marginTop: '10px', marginBottom: '20px', minHeight: '200px', overflowY: 'auto' }}>
                    {
                        messages.map((message) => (
                            <div key={message.id}>
                                <Typography>{message.content}</Typography>
                            </div>
                        ))}
                </div>
                <TextField
                    label="Сообщение"
                    variant="outlined"
                    fullWidth
                    value={messageBlank.content ?? ''}
                    onChange={(e) => setMessageBlank(prev => ({ ...prev, content: e.target.value }))}
                    style={{ marginBottom: '10px' }}
                />
                <Button variant="contained" onClick={onSendMessage}>
                    Отправить
                </Button>
            </Paper>
        </Container>
    )
}

import { LockOutlined as LockOutlinedIcon, MailOutline as MailOutlineIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Container, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isShowCodeInput, setIsShowCodeInput] = useState(false);

    const navigate = useNavigate();

    function sendCode(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsShowCodeInput(true);
    };

    const resetPassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Здесь должен быть код для сброса пароля
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Сброс пароля
                    </Typography>
                    <form onSubmit={isShowCodeInput ? resetPassword : sendCode} style={{ width: '100%', marginTop: '1rem' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <Avatar sx={{ mr: 1 }}>
                                        <MailOutlineIcon />
                                    </Avatar>
                                ),
                            }}
                        />
                        {!isShowCodeInput &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Отправить код
                            </Button>
                        }
                        {isShowCodeInput &&
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="code"
                                    label="Код подтверждения"
                                    name="code"
                                    autoComplete="off"
                                    autoFocus
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Сбросить пароль
                                </Button>
                            </>
                        }
                        {isShowCodeInput &&
                            <Typography sx={{ fontSize: 12 }}>На вашу почту отправлено сообщение с кодом для сброса пароля!</Typography>
                        }

                    </form>
                </Box>
            </Paper>
        </Container>
    );
};
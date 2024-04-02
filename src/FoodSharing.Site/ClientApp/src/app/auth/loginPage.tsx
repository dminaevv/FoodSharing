import { Avatar, Box, Button, Container, CssBaseline, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoPhoto from '../../content/img/logo.jpeg';
import { UserProvider } from '../../domain/users/userProvider';
import { useNotifications } from '../../hooks/useNotifications';
import { AuthLinks } from '../../tools/constants/links';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { addErrorNotification } = useNotifications();

    async function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = await UserProvider.login(email, password);
        if (!result.isSuccess) return addErrorNotification(result.errorsString);

        // navigate("/")
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }} src={logoPhoto} />
                    <Typography component="h1" variant="h5">
                        Вход
                    </Typography>
                    <Box component="form" onSubmit={login} sx={{ mt: 3 }}>
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
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Войти
                        </Button>
                    </Box>
                    <Grid container>
                        <Grid item xs>
                            <Typography variant="body2" sx={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate(AuthLinks.resetPassword)}>
                                Забыли пароль?
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" sx={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate(AuthLinks.register)}>
                                Регистрация
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};


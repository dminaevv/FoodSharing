import { Avatar, Box, Button, Container, CssBaseline, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoPhoto from '../../content/img/logo.jpeg';
import { UserProvider } from '../../domain/users/userProvider';
import { useNotifications } from '../../hooks/useNotifications';
import { AuthLinks } from '../../tools/constants/links';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const { addErrorNotification, addSuccessNotification } = useNotifications();

    async function register(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = await UserProvider.register(email, password);
        if (!result.isSuccess) return addErrorNotification(result.errorsString);

        addSuccessNotification("Регистрация прошла успешно. Теперь вы можете авторизоваться!")
        navigate("/login")
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, width: 60, height: 60, bgcolor: 'secondary.main' }} src={logoPhoto} />
                    <Typography component="h1" variant="h5">
                        Регистрация
                    </Typography>
                    <Box component="form" onSubmit={register} sx={{ mt: 3 }}>
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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Подтверждение пароля"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            error={confirmPassword != password}
                            helperText={confirmPassword != password ? "Пароли должны совпадать" : null}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Зарегистрироваться
                        </Button>
                    </Box>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Typography variant="body2" sx={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate(AuthLinks.login)}>
                                Вход
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

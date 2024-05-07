import { Avatar, Box, Button, Grid, Stack, SxProps, TextField, Theme, Typography } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../content/img/logo.jpeg';
import { useSystemUser } from '../hooks/useSystemUser';
import { AnnouncementLinks, AuthLinks, InfrastructureLinks, ProfileLinks } from '../tools/constants/links';

interface IProps {
    sx?: SxProps<Theme>
}

export function Header(props: IProps & PropsWithChildren) {
    const { searchText } = useParams();

    const systemUser = useSystemUser();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState<string | null>(searchText ?? null);

    function search() {
        if (String.isNullOrEmpty(searchQuery)) {
            navigate(InfrastructureLinks.home)
            return;
        };

        navigate(AnnouncementLinks.toSearch(searchQuery))
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            search();
        }
    }


    return (
        <Box sx={props.sx}>
            <Grid container spacing={3} sx={{ mb: { xs: 2, sm: 2 } }}>
                <Grid item xs={0} sm={1} md={3} sx={{ display: { xs: 'none', sm: 'flex' }, cursor: 'pointer' }} alignItems='center' onClick={() => navigate(InfrastructureLinks.home)}>
                    <Stack gap={1} direction='row' alignItems='center'>
                        <img src={logo} width='50px' />
                        <Typography fontWeight='bold' color='#2b90ff' sx={{ display: { sm: "none", md: 'block' }, fontSize: { xs: 0, sm: 25 } }}>FOODSHARING</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={10} md={7}>
                    <Box sx={{ backgroundColor: '#2b90ff', borderRadius: '15px', display: 'flex', alignItems: 'center', p: 0.5 }}>
                        <TextField
                            variant="standard"
                            sx={{
                                width: '80%',
                                backgroundColor: 'white',
                                borderRadius: '10px', pl: 1,
                                borderColor: 'transparent'
                            }}
                            InputProps={{
                                disableUnderline: true
                            }}
                            value={searchQuery ?? ""}
                            onChange={event => setSearchQuery(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button sx={{ color: "white", height: "100%", width: "20%", borderRadius: '10px' }} onClick={search}>
                            Найти
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={0} sm={1} md={2} sx={{
                    display: { xs: 'none', sm: 'flex' }
                }}>
                    {
                        systemUser != null
                            ?
                            <Box alignItems='center' sx={{ display: 'flex', cursor: "pointer" }} onClick={() => navigate(ProfileLinks.announcements)}>
                                <Avatar src={systemUser.user.avatarUrl ?? ""} />
                                <Box height="100%" ml={1} sx={{ display: { sm: "none", md: 'flex' }, flexDirection: "column", justifyContent: 'center' }}>
                                    <Typography lineHeight={1}>  {systemUser.user.getFullName ?? systemUser.email}</Typography>
                                </Box>
                            </Box>
                            : <Typography onClick={() => navigate(AuthLinks.login)}>Войти</Typography>
                    }
                </Grid>
            </Grid>
            <Box>
                {props.children}
            </Box>
        </Box>
    )
}

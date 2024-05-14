import ProfileIcon from '@mui/icons-material/AccountCircle';
import AnnouncementIcon from '@mui/icons-material/Campaign';
import MessageIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';

import { BottomNavigation, BottomNavigationAction, Box, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfrastructureLinks, ProfileLinks } from '../../tools/constants/links';
import { Header } from '../header';

interface IProps {
    sx?: SxProps<Theme>
}

export default function Page(props: IProps & PropsWithChildren) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box display='flex' flexDirection='column' height="100vh" width="100%" sx={{ ...props.sx }}>
            <Header sx={{ mx: 2, mt: 2, display: { xs: 'none', md: 'block' } }} />
            <Box sx={{ height: "100%" }}>
                {props.children}
            </Box>
            {
                isMobile &&
                <Box>
                    <BottomNavigation >
                        <BottomNavigationAction label="Поиск" icon={<SearchIcon />} onClick={() => navigate(InfrastructureLinks.home)} />
                        <BottomNavigationAction label="Избранное" icon={<FavoriteIcon />} onClick={() => navigate(ProfileLinks.favorites)} />
                        <BottomNavigationAction label="Профиль" icon={<ProfileIcon />} onClick={() => navigate(ProfileLinks.settings)} />
                        <BottomNavigationAction label="Продукты" icon={<AnnouncementIcon />} onClick={() => navigate(ProfileLinks.announcements)} />
                        <BottomNavigationAction label="Сообщения" icon={<MessageIcon />} onClick={() => navigate(ProfileLinks.chats)} />
                    </BottomNavigation>
                </Box>
            }
        </Box>
    )
}

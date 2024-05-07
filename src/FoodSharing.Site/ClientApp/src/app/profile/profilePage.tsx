import { Box, Divider, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useSystemUser } from '../../hooks/useSystemUser';
import { NeverUnreachable } from '../../tools/errors/neverUnreachable';
import { enumToArrayNumber } from '../../tools/extensions/enumUtils';
import Page from '../infrastructure/page';
import { UserShortInfoCard } from '../users/userShortInfoCard';
import { FavoritesPage } from './favouritesPage';
import { FeedbacksPage } from './feedbacksPage';
import { ProfileAnnouncementPage } from './profileAnnouncementPage';
import { ProfileChatListPage } from './profileChatListPage';
import { ProfileChatPage } from './profileChatPage';
import { SettingsPage } from './profileSettingsPage';

enum PageType {
    Announcement,
    Chats,
    Chat,
    Feedbacks,
    Favourites,
    Settings
}

export function ProfilePage() {
    const [selectedPage, setSelectedPage] = useState<PageType | null>(null);
    const systemUser = useSystemUser();
    const user = systemUser?.user!;


    useEffect(() => {
        const pathname = location.pathname;
        const pageType = getPageTypeByPathname(pathname) ?? null;
        setSelectedPage(pageType);

    }, [location.pathname]);

    function getPageTypeDisplayName(pageType: PageType) {
        switch (pageType) {
            case PageType.Announcement: return "Мои объявления";
            case PageType.Chats: return "Мои сообщения";
            case PageType.Chat: return "Переписка";
            case PageType.Feedbacks: return "Мои отзывы";
            case PageType.Favourites: return "Избранное";
            case PageType.Settings: return "Настройки";

            default: throw new NeverUnreachable(pageType)
        }
    }

    function getPageTypeRoutedName(pageType: PageType) {
        switch (pageType) {
            case PageType.Announcement: return "profile/announcements";
            case PageType.Chats: return "profile/chats";
            case PageType.Chat: return "profile/chat";
            case PageType.Feedbacks: return "profile/feedbacks";
            case PageType.Favourites: return "profile/favorites";
            case PageType.Settings: return "profile/settings";

            default: throw new NeverUnreachable(pageType)
        }
    }

    function getPageTypeByPathname(pathname: string) {
        switch (pathname) {
            case "/profile/announcements": return PageType.Announcement;
            case "/profile/chats": return PageType.Chats;
            case "/profile/chat": return PageType.Chat;
            case "/profile/feedbacks": return PageType.Feedbacks;
            case "/profile/favorites": return PageType.Favourites;
            case "/profile/settings": return PageType.Settings;
        }
    }

    function IsDisplayedPageType(pageType: PageType) {
        switch (pageType) {
            case PageType.Announcement: return true;
            case PageType.Chats: return true;
            case PageType.Chat: return false;
            case PageType.Feedbacks: return true;
            case PageType.Favourites: return true;
            case PageType.Settings: return true;

            default: throw new NeverUnreachable(pageType)
        }
    }

    return (
        <Page>
            <Grid container>
                <Grid item xs={3} sx={{ display: { xs: 'none', md: 'block' }, p: 2 }}>
                    <UserShortInfoCard user={user} />
                    <Divider />
                    <Box mt={2}>
                        {
                            enumToArrayNumber<PageType>(PageType).map(pageType => IsDisplayedPageType(pageType) &&
                                <Link to={`${window.location.origin}/${getPageTypeRoutedName(pageType)}`} onClick={() => setSelectedPage(pageType)} key={pageType} style={{ textDecoration: 'none' }}>
                                    <Typography
                                        sx={{
                                            fontSize: 18, my: 1, cursor: 'pointer',
                                            fontWeight: selectedPage === pageType ? "bold" : "",
                                            color: selectedPage === pageType ? "black" : "#14abdb"
                                        }}
                                    >
                                        {getPageTypeDisplayName(pageType)}
                                    </Typography>
                                </Link>
                            )
                        }
                    </Box>
                </Grid>
                <Grid item xs={12} md={9} sx={{ p: 2, height: '100%' }}>
                    <Routes>
                        <Route path="/announcements" element={<ProfileAnnouncementPage />} />
                        <Route path="/chats" element={<ProfileChatListPage />} />
                        <Route path="/chat/:chatId" element={<ProfileChatPage />} />
                        <Route path="/chat/announcement/:announcementId" element={<ProfileChatPage />} />
                        <Route path="/feedbacks" element={<FeedbacksPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </Grid>
            </Grid>
        </Page >
    );
};

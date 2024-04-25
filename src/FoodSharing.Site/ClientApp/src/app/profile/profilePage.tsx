import { Box, Divider, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
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
import { SettingsPage } from './settingsPage';

enum PageType {
    Announcement,
    Chats,
    Chat,
    Feedbacks,
    Favourites,
    Settings
}

export function ProfilePage() {
    const [selectedPage, setSelectedPage] = useState<PageType>(PageType.Announcement);
    const systemUser = useSystemUser();
    const user = systemUser?.user!;

    const location = useLocation();

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Обработка загрузки нового аватара
    };

    return (
        <Page sx={{ overflow: "hidden" }}>
            <Grid container height="100%">
                <Grid item xs={3}>
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
                <Grid item xs={9}>
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

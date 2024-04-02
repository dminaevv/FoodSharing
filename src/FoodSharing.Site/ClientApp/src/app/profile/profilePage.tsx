import { Box, Divider, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSystemUser } from '../../hooks/useSystemUser';
import { NeverUnreachable } from '../../tools/errors/neverUnreachable';
import { enumToArrayNumber } from '../../tools/extensions/enumUtils';
import Page from '../infrastructure/page';
import { UserShortInfoCard } from '../users/userShortInfoCard';
import { FavouritesPage } from './favouritesPage';
import { FeedbacksPage } from './feedbacksPage';
import { ProfileAnnouncementPage } from './profileAnnouncementPage';
import { SettingsPage } from './settingsPage';

enum PageType {
    Announcement,
    Feedbacks,
    Favourites,
    Settings
}

export function ProfilePage() {
    const [selectedPage, setSelectedPage] = useState<PageType>(PageType.Announcement);

    const systemUser = useSystemUser();
    const user = systemUser?.user!;

    function getPageTypeDisplayName(pageType: PageType) {
        switch (pageType) {
            case PageType.Announcement: return "Мои объявления";
            case PageType.Feedbacks: return "Мои отзывы";
            case PageType.Favourites: return "Избранное";
            case PageType.Settings: return "Настройки";

            default: throw new NeverUnreachable(pageType)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Обработка загрузки нового аватара
    };

    function renderSelectedPage() {
        switch (selectedPage) {
            case PageType.Announcement: return <ProfileAnnouncementPage />;
            case PageType.Feedbacks: return <FeedbacksPage />;
            case PageType.Favourites: return <FavouritesPage />;
            case PageType.Settings: return <SettingsPage />;

            default: throw new NeverUnreachable(selectedPage)
        }
    }

    return (
        <Page>
            <Grid container>
                <Grid item xs={3}>
                    <UserShortInfoCard user={user} />
                    <Divider />
                    <Box mt={2}>
                        {
                            enumToArrayNumber<PageType>(PageType).map(pageType =>
                                <Typography
                                    key={pageType}
                                    onClick={() => setSelectedPage(pageType)}
                                    sx={{
                                        fontSize: 18, my: 1, cursor: 'pointer',
                                        fontWeight: selectedPage == pageType ? "bold" : "",
                                        color: selectedPage == pageType ? "black" : "#14abdb"
                                    }}
                                >
                                    {getPageTypeDisplayName(pageType)}
                                </Typography>
                            )
                        }
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    {renderSelectedPage()}
                </Grid>
            </Grid>
        </Page>
    );
};
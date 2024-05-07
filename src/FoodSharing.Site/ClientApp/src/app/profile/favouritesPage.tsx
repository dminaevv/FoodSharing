import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BlockUi } from "../../components/blockUi/blockUi";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { AnnouncementList } from "../announcement/announcementList";

export function FavoritesPage() {
    const [favoriteAnnouncements, setFavoriteAnnouncements] = useState<AnnouncementShortInfo[]>([]);

    useEffect(() => {
        loadFavoriteAnnouncements();
    }, [])

    function loadFavoriteAnnouncements() {
        BlockUi.block(async () => {
            const favoriteAnnouncements = await AnnouncementsProvider.getFavoriteAnnouncements();
            setFavoriteAnnouncements(favoriteAnnouncements);
        })
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', my: { xs: 0, md: 2 } }}>Избранное</Typography>
            <Box mt={2} >
                <AnnouncementList announcements={favoriteAnnouncements} />
            </Box>
        </Box>
    )
}

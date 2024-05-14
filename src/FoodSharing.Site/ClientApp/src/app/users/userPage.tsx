import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { UserInfo } from "../../domain/users/userInfo";
import { UserProvider } from "../../domain/users/userProvider";
import { AnnouncementList } from "../announcement/announcementList";
import Page from "../infrastructure/page";
import { UserShortInfoCard } from "./userShortInfoCard";

export function UserPage() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [announcements, setAnnouncements] = useState<AnnouncementShortInfo[]>([])

    useEffect(() => {
        loadUser();
    }, [])

    function loadUser() {
        if (id == null) return;

        BlockUi.block(async () => {
            const userInfo = await UserProvider.getUserInfo(id);
            setUserInfo(userInfo);

            const announcementsPagedResult = await AnnouncementsProvider.getUserAnnouncements(userInfo.id, 1, 1000);
            setAnnouncements(announcementsPagedResult.values);
        })
    }

    return (
        <Page>
            {userInfo != null
                ? <Box p={2}>
                    <Grid container direction={{ xs: 'column', md: 'row' }}>
                        <Grid item xs={3}>
                            <UserShortInfoCard user={userInfo} />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant="h4" my={2} sx={{ fontWeight: 'bold' }}>Продукты пользователя</Typography>
                            <AnnouncementList
                                announcements={announcements}
                            />
                        </Grid>
                    </Grid>
                </Box>
                : <>Такой страницы нет!</>}
        </Page>
    )
}

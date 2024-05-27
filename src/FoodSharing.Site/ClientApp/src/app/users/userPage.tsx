import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { CPagination } from "../../components/cPagination";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { UserInfo } from "../../domain/users/userInfo";
import { UserProvider } from "../../domain/users/userProvider";
import { AnnouncementList } from "../announcement/announcementList";
import Page from "../infrastructure/page";
import { UserShortInfoCard } from "./userShortInfoCard";

interface IFilter {
    page: number;
    pageSize: number;
}


export function UserPage() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [announcements, setAnnouncements] = useState<AnnouncementShortInfo[]>([])
    const [filters, setFilters] = useState<IFilter>({ page: 1, pageSize: 50 })
    const [totalRows, setTotalRows] = useState<number>(0)

    useEffect(() => {
        loadUser();
    }, [])

    useEffect(() => {
        loadAnnouncements({});
    }, [userInfo?.id])

    async function loadUser() {
        if (id == null) return;
        const userInfo = await UserProvider.getUserInfo(id);
        setUserInfo(userInfo);
    }

    function loadAnnouncements(parameters: Partial<IFilter>) {
        if (userInfo == null) return;

        const newFilter = { ...filters, ...parameters };

        BlockUi.block(async () => {
            const announcementsPagedResult = await AnnouncementsProvider.getUserAnnouncements(userInfo.id, newFilter.page, newFilter.pageSize);
            setAnnouncements(announcementsPagedResult.values);
            setTotalRows(announcementsPagedResult.totalRows);
        })

        setFilters(newFilter)
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
                            {totalRows > filters.pageSize &&
                                <Box pb={2}>
                                    <CPagination
                                        totalRows={totalRows}
                                        page={filters.page}
                                        pageSize={filters.pageSize}
                                        showTotalRows
                                        totalRowsText="Всего продуктов"
                                        onChangePageSize={pageSize => loadAnnouncements({ page: 1, pageSize })}
                                        onChange={page => loadAnnouncements({ page })}
                                    />
                                </Box>

                            }
                        </Grid>
                    </Grid>
                </Box>
                : <>Такой страницы нет!</>}
        </Page>
    )
}

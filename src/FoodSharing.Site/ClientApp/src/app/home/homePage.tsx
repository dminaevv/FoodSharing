import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { AnnouncementList } from "../announcement/announcementList";
import { Header } from "../header";
import Page from "../infrastructure/page";
import { CPagination } from "../../components/cPagination";

interface IFilter {
    page: number;
    pageSize: number;
}

export function HomePage() {
    const { searchText } = useParams();

    const [searchAnnouncements, setAnnouncements] = useState<AnnouncementShortInfo[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [filter, setFilter] = useState<IFilter>({ page: 1, pageSize: 50 });

    useEffect(() => {
        search({});
    }, [searchText])

    function search(params: Partial<IFilter>) {
        const newFilter = { ...filter, ...params }

        BlockUi.block(async () => {
            const announcements = await AnnouncementsProvider.search(searchText ?? null, newFilter.page, newFilter.pageSize);
            setTotalRows(announcements.totalRows);
            setAnnouncements(announcements.values);
        })

        setFilter(newFilter);
    }

    return (
        <Page>
            <Box sx={{ px: 2 }}>
                <Header sx={{ mt: 2, display: { xs: 'block', md: 'none' } }} />
                {
                    <>
                        {
                            searchAnnouncements.length != 0 &&
                            <AnnouncementList
                                announcements={searchAnnouncements}
                            />
                        }
                        <Typography sx={{ fontStyle: 'italic', color: 'gray', mx: 2, my: 4 }}>
                            {
                                searchAnnouncements.length == 0 && "К сожалению, ничего не удалось найти по вашему запросу. Но есть другие объявления: "
                            }
                        </Typography>
                    </>
                }
                {totalRows > filter.pageSize &&
                    <CPagination
                        totalRows={totalRows}
                        pageSize={filter.pageSize}
                        onChange={page => search(({ page }))}
                    />
                }
            </Box>
        </Page>
    )
}

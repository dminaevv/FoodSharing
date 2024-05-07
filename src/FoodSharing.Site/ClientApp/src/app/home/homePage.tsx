import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { AnnouncementList } from "../announcement/announcementList";
import { Header } from "../header";
import Page from "../infrastructure/page";

export function HomePage() {
    const { searchText } = useParams();

    const [searchAnnouncements, setAnnouncements] = useState<AnnouncementShortInfo[]>([]);
    const [allAnnouncements, setAllAnnouncements] = useState<AnnouncementShortInfo[]>([]);

    useEffect(() => {
        loadAnnouncements()
    }, [])

    useEffect(() => {
        search();
    }, [searchText])

    const isSearchMode = searchText != null;

    function search() {
        if (String.isNullOrEmpty(searchText)) {
            setAnnouncements([])
            return;
        };
        BlockUi.block(async () => {
            const announcements = await AnnouncementsProvider.search(searchText, 1, 50);
            setAnnouncements(announcements.values);
        })
    }

    function loadAnnouncements() {
        BlockUi.block(async () => {
            const announcementsResult = await AnnouncementsProvider.getPageAnnouncements(1, 1000);
            setAllAnnouncements(announcementsResult.values);
        });
    }

    return (
        <Page>
            <Box sx={{ px: 2 }}>
                <Header sx={{ mt: 2, display: { xs: 'block', md: 'none' } }} />
                {
                    isSearchMode &&
                    <>
                        {
                            searchAnnouncements.length != 0 &&
                            <AnnouncementList
                                announcements={searchAnnouncements}
                            />
                        }
                        <Typography sx={{ fontStyle: 'italic', color: 'gray', mx: 2, my: 4 }}>
                            {
                                searchAnnouncements.length == 0
                                    ? "К сожалению, ничего не удалось найти по вашему запросу. Но есть другие объявления: "
                                    : "Так же посмотрите другие объявления, возможно, именно это вам необходимо"
                            }
                        </Typography>
                    </>
                }
                <AnnouncementList
                    announcements={allAnnouncements.filter(a => !searchAnnouncements.some(an => an.id == a.id))}
                />
            </Box>
        </Page>
    )
}

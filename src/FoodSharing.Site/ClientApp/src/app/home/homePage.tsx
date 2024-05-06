import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { AnnouncementList } from "../announcement/announcementList";
import Page from "../infrastructure/page";

export function HomePage() {
    const { searchText } = useParams();

    const [announcements, setAnnouncements] = useState<AnnouncementShortInfo[]>([]);
    const [allAnnouncements, setAllAnnouncements] = useState<AnnouncementShortInfo[]>([]);

    useEffect(() => {
        loadAnnouncements()
    }, [])

    useEffect(() => {
        search();
    }, [searchText])


    function search() {
        if (String.isNullOrEmpty(searchText)) {
            setAnnouncements([])
            return;
        };
        console.log(searchText);
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
            <AnnouncementList
                announcements={announcements.length == 0 ? allAnnouncements : announcements}
            />
        </Page>
    )
}

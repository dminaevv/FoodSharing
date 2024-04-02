import { useEffect, useState } from "react";
import { BlockUi } from "../../components/blockUi/blockUi";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { AnnouncementList } from "../announcement/announcementList";
import Page from "../infrastructure/page";

export function HomePage() {
    const [announcements, setAnnouncements] = useState<AnnouncementShortInfo[]>([]);

    useEffect(() => {
        loadAnnouncements()
    }, [])

    function loadAnnouncements() {
        BlockUi.block(async () => {
            const announcementsResult = await AnnouncementsProvider.getPageAnnouncements(1, 1000);
            setAnnouncements(announcementsResult.values);
        });
    }

    return (
        <Page>
            <AnnouncementList
                announcements={announcements}
            />
        </Page>
    )
}

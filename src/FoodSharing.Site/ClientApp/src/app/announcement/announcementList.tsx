import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementCard } from "./announcementCard";

interface IProps {
    announcements: AnnouncementShortInfo[];
}

export function AnnouncementList(props: IProps) {
    const [announcements, setAnnouncements] = useState<AnnouncementShortInfo[]>([...props.announcements])

    useEffect(() => {
        setAnnouncements(props.announcements)
    }, [props.announcements])

    function changeAnnouncement(announcementId: string, assignable: Partial<AnnouncementShortInfo>) {
        setAnnouncements(prev => {
            const newAnnouncements = [...prev]

            const editedAnnouncementIndex = prev.findIndex(a => a.id == announcementId);
            const editedAnnouncement = { ...prev[editedAnnouncementIndex] };
            const newAnnouncement = { ...editedAnnouncement, ...assignable }

            newAnnouncements[editedAnnouncementIndex] = newAnnouncement;

            return newAnnouncements;
        })
    }

    return (
        <Box display='grid' gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={2} alignContent='center'>
            {
                announcements.map(announcement =>
                    <Box key={announcement.id}>
                        <AnnouncementCard announcement={announcement} changeAnnouncement={changeAnnouncement} />
                    </Box>
                )
            }
        </Box>
    )
}

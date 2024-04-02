import { Box } from "@mui/material"
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo"
import { AnnouncementCard } from "./announcementCard"

interface IProps {
    announcements: AnnouncementShortInfo[]
}

export function AnnouncementList(props: IProps) {
    return (
        <Box display='grid' gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2} alignContent='center'>
            {
                props.announcements.map(announcement =>
                    <Box key={announcement.id}>
                        <AnnouncementCard announcement={announcement} />
                    </Box>
                )
            }
        </Box>
    )
}

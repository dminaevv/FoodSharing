import LikeIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { Link } from '../../components/link';
import { AnnouncementShortInfo } from '../../domain/announcements/announcementShortInfo';
import { AnnouncementLinks } from '../../tools/constants/links';

interface IProps {
    announcement: AnnouncementShortInfo
}

export function AnnouncementCard(props: IProps) {

    function addFavorite() {

    }

    return (
        <Card sx={{
            width: "100%",
            height: "100%",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "flex-start"
        }}
            elevation={3}
        >
            <CardMedia
                component="img"
                alt="Изображение"
                height="100%"
                image={props.announcement.mainImgUrl}
            />
            <CardContent sx={{ height: "30%", pb: 1 }}>
                <Box display='flex' alignItems='flex-start' justifyContent='space-between'>
                    <Link text={props.announcement.name} href={AnnouncementLinks.toAnnouncement(props.announcement.id)} sx={{
                        lineHeight: 1, overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }} />
                    <IconButton sx={{ p: 0 }} onClick={() => { }}><LikeIcon /></IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mt: 1
                }}>
                    {props.announcement.description}
                </Typography>
            </CardContent >
        </Card >
    )
}

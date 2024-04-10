import LikeIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { Box, Card, CardContent, CardMedia, IconButton, Tooltip, Typography, Zoom } from '@mui/material';
import { useState } from 'react';
import { Link } from '../../components/link';
import { AnnouncementShortInfo } from '../../domain/announcements/announcementShortInfo';
import { AnnouncementsProvider } from '../../domain/announcements/announcementsProvider';
import { AnnouncementLinks } from '../../tools/constants/links';

interface IProps {
    announcement: AnnouncementShortInfo;
    changeAnnouncement: (announcementId: string, assignable: Partial<AnnouncementShortInfo>) => void;
}

export function AnnouncementCard(props: IProps) {
    const [showToolTip, setShowToolTip] = useState(false);

    function toggleFavorite() {
        const isFavorite = props.announcement.isFavorite;
        props.changeAnnouncement(props.announcement.id, { isFavorite: !isFavorite })
        AnnouncementsProvider.toggleFavorite(props.announcement.id);

        if (!isFavorite) {
            setShowToolTip(true);
            setTimeout(() => setShowToolTip(false), 3000);
        }
        else {
            setShowToolTip(false)
        }
    }

    return (
        <Card sx={{
            width: "100%",
            height: "100%",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "flex-start"
        }}
            elevation={1}
        >
            <CardMedia
                component="img"
                alt="Изображение"
                height="100%"
                image={props.announcement.mainImgUrl}
            />
            <CardContent sx={{ height: "30%", pb: 1, pt: 1 }}>
                <Box display='flex' alignItems='flex-end' justifyContent='space-between'>
                    <Link text={props.announcement.name} href={AnnouncementLinks.toAnnouncement(props.announcement.id)} sx={{
                        lineHeight: 1, overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }} />
                    <Tooltip
                        placement="top"
                        arrow
                        TransitionComponent={Zoom}
                        title="Добавлено в избранное"
                        open={showToolTip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        onClose={() => setShowToolTip(false)}
                    >
                        <IconButton sx={{ p: 0 }} onClick={toggleFavorite}>
                            {
                                props.announcement.isFavorite
                                    ? <FavoriteTwoToneIcon sx={{ color: 'red' }} />
                                    : <LikeIcon />
                            }
                        </IconButton>
                    </Tooltip>
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

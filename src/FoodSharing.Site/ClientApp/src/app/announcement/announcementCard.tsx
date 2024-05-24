import LikeIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography, Zoom } from '@mui/material';
import { useState } from 'react';
import { CLink } from '../../components/link';
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
                sx={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                }}
                image={props.announcement.mainImgUrl}
            />
            <CardContent sx={{
                pt: 1,
                "&:last-child": {
                    paddingBottom: 1,
                    px: 1
                }
            }}>
                <Box display='flex' alignItems='flex-end' justifyContent='space-between' p={0}>
                    <CLink text={props.announcement.name} href={AnnouncementLinks.toAnnouncement(props.announcement.id)} sx={{
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

                <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>{props.announcement.cityName}</Typography>
                </Stack>
            </CardContent >
        </Card >
    )
}

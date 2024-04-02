import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BlockUi } from "../../components/blockUi/blockUi";
import { Link } from '../../components/link';
import { Announcement } from "../../domain/announcements/announcement";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { AnnouncementLinks } from '../../tools/constants/links';

export function ProfileAnnouncementPage() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        loadUserAnnouncement();
    }, [])

    function loadUserAnnouncement() {
        BlockUi.block(async () => {
            const announcements = await AnnouncementsProvider.getMyAnnouncements();
            setAnnouncements(announcements);
        })
    }

    function removeAnnouncement(id: string) {
        BlockUi.block(async () => {
            const a = await AnnouncementsProvider.remove(id);
            loadUserAnnouncement();
        })
    }

    return (
        <Box>
            <Stack direction='row' alignItems='center' gap={1}>
                <Typography variant="h4" my={2} sx={{ fontWeight: 'bold' }}>Мои объявления</Typography>
                <IconButton onClick={() => navigate(AnnouncementLinks.create)}><ControlPointIcon /></IconButton>
            </Stack>
            <Grid container direction='column' wrap='nowrap' spacing={2} width="100%">
                {
                    announcements.map(announcement =>
                        <Grid item xs container columnSpacing={2} wrap="nowrap" sx={{ height: " 170px" }}>
                            <Grid item xs={3}>
                                <img src={announcement.imagesUrls[0]} width="100%" height={"100%"} style={{ objectFit: "cover", borderRadius: 10 }} />
                            </Grid>
                            <Grid item xs={4}>
                                <Stack>
                                    <Link href={AnnouncementLinks.toAnnouncement(announcement.id)} text={announcement.name} sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {announcement.description}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={3}>
                                <Stack >
                                    <Stack direction='row' gap={1} alignItems='center'>
                                        <VisibilityIcon sx={{ fontSize: 15 }} />
                                        <Typography fontSize={15}>Просмотры</Typography>
                                    </Stack>
                                    <Stack direction='row' gap={1} alignItems='center'>
                                        <FavoriteIcon sx={{ fontSize: 15 }} />
                                        <Typography fontSize={15}>Лайки</Typography>
                                    </Stack>
                                    <Stack direction='row' gap={1} alignItems='center'>
                                        <ChatBubbleIcon sx={{ fontSize: 15 }} />
                                        <Typography fontSize={15}>Нет новых сообщений</Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                            <Grid item xs={2}>
                                <Stack gap={1}>
                                    <Button size='small'
                                        variant='outlined'
                                        sx={{ fontSize: 12 }}
                                        color='info'
                                        onClick={() => navigate(AnnouncementLinks.toEdit(announcement.id))}
                                    >
                                        Редактировать
                                    </Button>

                                    <Button
                                        size='small'
                                        variant='outlined'
                                        sx={{ fontSize: 12 }}
                                        color='error'
                                        onClick={() => removeAnnouncement(announcement.id)}
                                    >
                                        Удалить
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    )
                }
            </Grid>
        </Box>
    )
}
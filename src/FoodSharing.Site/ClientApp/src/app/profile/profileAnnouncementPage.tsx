import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BlockUi } from "../../components/blockUi/blockUi";
import { CLink } from '../../components/link';
import { Announcement } from "../../domain/announcements/announcement";
import { AnnouncementStatistics } from '../../domain/announcements/announcementStatistics';
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { AnnouncementLinks } from '../../tools/constants/links';

export function ProfileAnnouncementsPage() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [announcementsStatistics, setAnnouncementsStatistics] = useState<AnnouncementStatistics[]>([]);

    const confirm = useConfirmDialog();

    useEffect(() => {
        loadUserAnnouncement();
    }, [])

    function loadUserAnnouncement() {
        BlockUi.block(async () => {
            const announcements = await AnnouncementsProvider.getMyAnnouncements();
            setAnnouncements(announcements);

            const announcementsStatistics = await AnnouncementsProvider.GetAnnouncementsStatistics(announcements.map(a => a.id));
            setAnnouncementsStatistics(announcementsStatistics);

            console.log(announcementsStatistics)
        })
    }

    async function removeAnnouncement(id: string) {
        const confirmResult = await confirm("Вы уверены, что хотите удалить продукт ?")
        if (!confirmResult) return;

        BlockUi.block(async () => {
            await AnnouncementsProvider.remove(id);
            loadUserAnnouncement();
        })
    }

    return (
        <Box>
            <Stack direction='row' alignItems='center'>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: { xs: 0, md: 2 } }}>Мои продукты</Typography>
                <IconButton onClick={() => navigate(AnnouncementLinks.create)}><ControlPointIcon /></IconButton>
            </Stack>
            <Grid container direction='column' wrap='nowrap' spacing={2} width="100%" mt={1} height="100">
                {
                    announcements.map(announcement => {
                        const announcementsStatistic = announcementsStatistics.find(s => s.announcementId == announcement.id);

                        return (
                            <Grid key={announcement.id} item xs container columnSpacing={{ xs: 0, md: 2 }} rowSpacing={2} wrap="nowrap" direction={{ xs: 'column', md: 'row' }} >
                                <Grid item xs={3}>
                                    <img src={announcement.imagesUrls[0]} width="100%" height={"100%"} style={{ objectFit: "cover", borderRadius: 10 }} />
                                </Grid>
                                <Grid item xs={4}>
                                    <Stack>
                                        <CLink href={AnnouncementLinks.toAnnouncement(announcement.id)} text={announcement.name} sx={{ mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {announcement.description}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={3} >
                                    <Stack >
                                        <Tooltip title="Количество просмотров продукта">
                                            <Stack direction='row' gap={1} alignItems='center'>
                                                <VisibilityIcon sx={{ fontSize: 15 }} />
                                                <Typography fontSize={15}>{announcementsStatistic?.viewsCount}</Typography>
                                            </Stack>
                                        </Tooltip>
                                        <Tooltip title="Количество добавлений продукта в избранное">
                                            <Stack direction='row' gap={1} alignItems='center'>
                                                <FavoriteIcon sx={{ fontSize: 15 }} />
                                                <Typography fontSize={15}>{announcementsStatistic?.favoriteCount}</Typography>
                                            </Stack>
                                        </Tooltip>
                                        <Tooltip title="Количество чатов с этим продуктом">
                                            <Stack direction='row' gap={1} alignItems='center'>
                                                <ChatBubbleIcon sx={{ fontSize: 15 }} />
                                                <Typography fontSize={15}>{announcementsStatistic?.messageCount}</Typography>
                                            </Stack>
                                        </Tooltip>
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
                    )
                }
            </Grid>
        </Box>
    )
}

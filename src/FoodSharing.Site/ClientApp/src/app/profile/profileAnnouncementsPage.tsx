import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Box, Button, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BlockUi } from "../../components/blockUi/blockUi";
import { CLink } from '../../components/link';
import { Announcement } from "../../domain/announcements/announcement";
import { AnnouncementStatistics } from '../../domain/announcements/announcementStatistics';
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { useSystemUser } from '../../hooks/useSystemUser';
import { AnnouncementLinks } from '../../tools/constants/links';

export function ProfileAnnouncementsPage() {
    const navigate = useNavigate();
    const systemUser = useSystemUser();

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
        })
    }

    function canCreateAnnouncement() {
        if (systemUser == null) return false;

        if (systemUser.user.firstName == null) return false;
        if (systemUser.user.lastName == null) return false;
        if (systemUser.user.phone == null) return false;

        return true;
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
        <Box sx={{ height: "100%" }}>
            {!canCreateAnnouncement() &&
                <Alert severity="warning">Для того, чтобы разместить свой продукт, необходимо заполнить обязательные поля в профиле:
                    {systemUser?.user.firstName == null && <Typography variant='body2'>- Имя</Typography>}
                    {systemUser?.user.lastName == null && <Typography variant='body2'>- Фамилия</Typography>}
                    {systemUser?.user.phone == null && <Typography variant='body2'>- Номер телефона</Typography>}
                </Alert>
            }
            <Stack direction='row' alignItems='center'>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: { xs: 0, md: 2 } }}>Мои продукты</Typography>
                {canCreateAnnouncement() &&
                    <IconButton onClick={() => navigate(AnnouncementLinks.create)}><ControlPointIcon /></IconButton>
                }
            </Stack>
            <Grid container direction='column' wrap='nowrap' spacing={2} width="100%" mt={1} sx={{ height: "100%", overflowY: "auto" }}>
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
                                            disabled={!canCreateAnnouncement()}
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

import LikeIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Avatar, Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlockUi } from '../../components/blockUi/blockUi';
import { Link } from '../../components/link';
import { AnnouncementDetailInfo } from '../../domain/announcements/announcementInfo';
import { AnnouncementsProvider } from '../../domain/announcements/announcementsProvider';
import { ChatLinks, UsersLinks } from '../../tools/constants/links';
import Page from '../infrastructure/page';

export function AnnouncementPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [announcementInfo, setAnnouncementInfo] = useState<AnnouncementDetailInfo | null>(null);

    useEffect(() => {
        loadAnnouncement();
    }, [])

    function loadAnnouncement() {
        BlockUi.block(async () => {
            if (id == null) return;

            const announcement = await AnnouncementsProvider.getInfo(id);

            setAnnouncementInfo(announcement);
            setSelectedImageUrl(announcement.imagesUrls[0])
        })
    }

    function convertGramsToKilogram(grams: number) {
        return grams / 1_000;
    }

    function toggleFavorite() {
        if (announcementInfo == null) return;

        const isFavorite = announcementInfo.isFavorite;
        setAnnouncementInfo({ ...announcementInfo, isFavorite: !isFavorite })
        AnnouncementsProvider.toggleFavorite(announcementInfo.id);
    }

    return (
        <Page>
            {
                announcementInfo != null
                    ?
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Stack gap={2}>
                                    <Box>
                                        <Typography variant="h4" fontWeight='bold'>{announcementInfo.name}</Typography>
                                    </Box>
                                    <Box >
                                        <Button size="small" startIcon={announcementInfo.isFavorite ? <FavoriteRoundedIcon /> : <LikeIcon />} variant="outlined" onClick={toggleFavorite}>
                                            {
                                                announcementInfo.isFavorite
                                                    ? "В избранном"
                                                    : "Добавить в избранное"
                                            }
                                        </Button>
                                    </Box>
                                    <Stack gap={1} width="600px">
                                        <Box height="500px" position='relative' display='flex' alignItems='center' overflow='hidden'>
                                            <Box sx={{ zIndex: 10, width: '100%', height: "100%" }}>
                                                <img src={selectedImageUrl ?? ""} style={{ width: "100%", height: "100%", objectFit: 'contain' }} />
                                            </Box>
                                            <Box sx={{ position: 'absolute', left: 0, top: 0, zIndex: 1, width: "100%", height: "100%" }}>
                                                <img src={selectedImageUrl ?? ""} style={{ width: "100%", height: "100%", objectFit: 'cover', filter: "blur(20px)" }} />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Grid container direction='row' sx={{ overflow: 'hidden' }} spacing={1}>
                                                {
                                                    announcementInfo.imagesUrls.map((url, index) =>
                                                        <Grid item xs={1.5} key={index}>
                                                            <img
                                                                src={url}
                                                                alt='Изображение'
                                                                onClick={() => setSelectedImageUrl(url)}
                                                                style={{ outline: selectedImageUrl == url ? '2px solid #1976d2' : "", width: "100%", height: "100%", objectFit: 'cover' }}
                                                            />
                                                        </Grid>
                                                    )
                                                }
                                            </Grid>
                                        </Box>
                                    </Stack>
                                    <Grid item>
                                        <Stack gap={2}>
                                            <Box>
                                                {/* <Typography variant='h5' mb={1} fontWeight='bold'>Адрес</Typography>
                                                <YMaps>
                                                    <Map
                                                        defaultState={{ center: [55.75, 37.57], zoom: 9 }}
                                                        width="100%"
                                                        height="400px"
                                                    >
                                                        <Placemark geometry={[55.75, 37.57]} />
                                                        <SearchControl options={{ float: 'right' }} />
                                                    </Map>
                                                </YMaps> */}
                                            </Box>
                                            <Box>
                                                <Typography variant='h5' mb={1} fontWeight='bold'>Описание</Typography>
                                                <Typography>{announcementInfo.description}</Typography>
                                            </Box>
                                            <Stack>
                                                <Typography variant='h5' mb={1} fontWeight='bold'>Характеристики</Typography>
                                                <Typography>Доступное количество: {convertGramsToKilogram(announcementInfo.gramsWeight)}кг</Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack>
                                    <Stack gap={1} direction='row' justifyContent='space-between'>
                                        <Stack>
                                            <Link text={announcementInfo.owner.getFullName ?? "Пользователь"} href={UsersLinks.toUser(announcementInfo.owner.id)} />
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                0,0 - 0 отзывов
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" >
                                                На платформе с {announcementInfo.owner.registrationDate.getFullYear()} года
                                            </Typography>

                                        </Stack>
                                        <Avatar alt="Avatar" sx={{ width: 50, height: 50 }} src={announcementInfo.owner.avatarUrl ?? 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'} />
                                    </Stack>
                                    <Button variant='outlined' fullWidth sx={{ mt: 2 }} onClick={() => navigate(ChatLinks.toAnnouncementChat(announcementInfo.id))}>
                                        Написать
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                    :
                    <Typography>Такого объявления нет!</Typography>
            }
        </Page>

    )
}

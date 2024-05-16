import { Autocomplete, Avatar, Box, Button, Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { CSelect } from "../../components/cSelect";
import { AnnouncementCategory } from "../../domain/announcements/announcementCategory";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { City } from "../../domain/city/city";
import { CityProvider } from "../../domain/city/cityProvider";
import { AnnouncementLinks } from "../../tools/constants/links";
import { AnnouncementList } from "../announcement/announcementList";
import { Header } from "../header";
import Page from "../infrastructure/page";

export function HomePage() {
    const { searchText, categoryId } = useParams();
    const navigate = useNavigate();

    const [searchAnnouncements, setAnnouncements] = useState<AnnouncementShortInfo[]>([]);
    const [allAnnouncements, setAllAnnouncements] = useState<AnnouncementShortInfo[]>([]);

    const [categories, setCategories] = useState<AnnouncementCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | null>(null);

    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);


    useEffect(() => {
        loadAnnouncements();
        loadCategories();
        loadCities();
    }, [])

    useEffect(() => {
        search();
    }, [searchText])

    useEffect(() => {
        loadCategory();
    }, [categoryId])

    const isSearchMode = searchText != null;
    function search() {
        if (String.isNullOrEmpty(searchText)) {
            setAnnouncements([])
            return;
        };
        BlockUi.block(async () => {
            const announcements = await AnnouncementsProvider.search(searchText, 1, 50);
            setAnnouncements(announcements.values);
        })
    }

    function loadCities() {
        BlockUi.block(async () => {
            const cities = await CityProvider.getCities();
            setCities(cities);
        })
    }

    function loadCategory() {
        if (categoryId == null) return setSelectedCategory(null);

        BlockUi.block(async () => {
            const category = await AnnouncementsProvider.getCategory(categoryId);
            setSelectedCategory(category);
        })
    }

    function loadAnnouncements() {
        BlockUi.block(async () => {
            const announcementsResult = await AnnouncementsProvider.getPageAnnouncements(1, 1000);
            setAllAnnouncements(announcementsResult.values);
        });
    }

    function loadCategories() {
        BlockUi.block(async () => {
            const categories = await AnnouncementsProvider.getCategories();
            setCategories(categories);
        });
    }

    function changeCategory(category: AnnouncementCategory | null) {
        if (category == null) return setSelectedCategory(null);

        setSelectedCategory(category);
        navigate(AnnouncementLinks.toCategory(category.id))
    }

    return (
        <Page>
            <Box sx={{ px: 2 }}>
                <Header sx={{ mt: 2, display: { xs: 'block', md: 'none' } }} />
                <Grid direction={{ xs: 'column-reverse', md: 'row' }} container wrap="nowrap" mt={{ xs: 1, md: 2 }} spacing={2}>
                    <Grid item xs={8} sx={{ pb: { xs: 1, md: 0 } }}>
                        {
                            selectedCategory != null &&
                            <Stack direction='row' gap={2} alignItems='center' mb={3}>
                                <Avatar
                                    alt="Avatar"
                                    sx={{ width: 100, height: 100 }}
                                    src={selectedCategory.iconUrl}
                                />
                                <Typography variant="h3" fontWeight='Bold'>{selectedCategory.name}</Typography>
                            </Stack>
                        }
                        {
                            isSearchMode &&
                            <>
                                {
                                    searchAnnouncements.length != 0 &&
                                    <AnnouncementList
                                        announcements={searchAnnouncements}
                                    />
                                }
                                <Typography sx={{ fontStyle: 'italic', color: 'gray', mx: 2, my: 4 }}>
                                    {
                                        searchAnnouncements.length == 0
                                            ? "К сожалению, ничего не удалось найти по вашему запросу. Но есть другие продукты: "
                                            : "Так же посмотрите другие продукты, возможно, именно это вам необходимо"
                                    }
                                </Typography>
                            </>
                        }
                        <AnnouncementList
                            announcements={allAnnouncements.filter(a => !searchAnnouncements.some(an => an.id == a.id))}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Фильтры
                            </Typography>
                            <Stack spacing={2} alignItems="center">
                                <CSelect
                                    label="Категория"
                                    value={selectedCategory}
                                    getOptionLabel={option => option.name}
                                    getOptionValue={option => option.id}
                                    options={categories}
                                    clearable
                                    onChange={changeCategory}
                                />
                                <Autocomplete
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Город"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password'
                                            }}
                                        />
                                    )}
                                    fullWidth
                                    autoHighlight
                                    value={cities.find(c => c.id == selectedCity?.id) ?? null}
                                    getOptionLabel={option => option.name}
                                    options={cities}
                                    size="small"
                                    noOptionsText="Город не найден"
                                    onChange={(_, city) => setSelectedCity(city)}
                                />
                                <Button variant="contained" fullWidth onClick={() => { setSelectedCategory(null); }}>
                                    Сбросить
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>

            </Box>
        </Page >
    )
}

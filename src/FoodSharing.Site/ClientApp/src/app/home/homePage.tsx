import { Autocomplete, Avatar, Box, Button, Card, Grid, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { CSelect } from "../../components/cSelect";
import { AnnouncementCategory } from "../../domain/announcements/announcementCategory";
import { AnnouncementShortInfo } from "../../domain/announcements/announcementShortInfo";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { City } from "../../domain/city/city";
import { CityProvider } from "../../domain/city/cityProvider";
import { AnnouncementList } from "../announcement/announcementList";
import { Header } from "../header";
import Page from "../infrastructure/page";

interface IFilter {
    selectedCategory: AnnouncementCategory | null;
    selectedCity: City | null;
}

export function HomePage() {
    const { searchText, categoryId } = useParams();

    const [searchAnnouncements, setAnnouncements] = useState<AnnouncementShortInfo[]>([]);

    const [categories, setCategories] = useState<AnnouncementCategory[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [filter, setFilter] = useState<IFilter>({ selectedCategory: null, selectedCity: null });

    useEffect(() => {
        loadCategories();
        loadCities();
    }, [])

    useEffect(() => {
        loadCategory();
    }, [categoryId])

    useEffect(() => {
        search();
    }, [filter.selectedCategory, filter.selectedCity, searchText])

    function search() {
        BlockUi.block(async () => {
            const announcements = await AnnouncementsProvider.search(searchText ?? null, filter.selectedCategory?.id ?? null, filter.selectedCity?.id ?? null, 1, 50);
            console.log(announcements)
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
        if (categoryId == null) return setFilter(prev => ({ ...prev, selectedCategory: null }));

        BlockUi.block(async () => {
            const category = await AnnouncementsProvider.getCategory(categoryId);
            setFilter(prev => ({ ...prev, selectedCategory: category }));
        })
    }

    function loadCategories() {
        BlockUi.block(async () => {
            const categories = await AnnouncementsProvider.getCategories();
            setCategories(categories);
        });
    }

    function changeCategory(category: AnnouncementCategory | null) {
        if (category == null) return setFilter(prev => ({ ...prev, selectedCategory: category }));

        setFilter(prev => ({ ...prev, selectedCategory: category }));
    }

    return (
        <Page>
            <Box sx={{ px: 2, overflow: 'auto' }}>
                <Header sx={{ mt: 2, display: { xs: 'block', md: 'none' } }} />
                <Grid container direction={{ xs: 'column-reverse', md: 'row' }} wrap="nowrap" mt={{ xs: 1, md: 2 }} spacing={2} sx={{ overflowY: 'auto' }}>
                    <Grid item xs={8} sx={{ pb: { xs: 1, md: 0 }, height: "100%", overflowY: 'auto' }}>
                        {
                            filter.selectedCategory != null &&
                            <Stack direction='row' gap={2} alignItems='center' mb={3}>
                                <Avatar
                                    alt="Avatar"
                                    sx={{ width: 100, height: 100 }}
                                    src={filter.selectedCategory.iconUrl}
                                />
                                <Typography variant="h3" fontWeight='Bold'>{filter.selectedCategory.name}</Typography>
                            </Stack>
                        }
                        {
                            <>
                                {
                                    searchAnnouncements.length != 0 &&
                                    <AnnouncementList
                                        announcements={searchAnnouncements}
                                    />
                                }
                                <Typography sx={{ fontStyle: 'italic', color: 'gray', mx: 2, my: 4 }}>
                                    {
                                        searchAnnouncements.length == 0 && "К сожалению, ничего не удалось найти по вашему запросу."
                                    }
                                </Typography>
                            </>
                        }

                    </Grid>
                    <Grid item xs={4} sx={{ height: "100%" }}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Фильтры
                            </Typography>
                            <Stack spacing={2} alignItems="center">
                                <CSelect
                                    label="Категория"
                                    value={filter.selectedCategory}
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
                                    value={cities.find(c => c.id == filter.selectedCity?.id) ?? null}
                                    getOptionLabel={option => option.name}
                                    options={cities}
                                    size="small"
                                    noOptionsText="Город не найден"
                                    onChange={(_, selectedCity) => setFilter(prev => ({ ...prev, selectedCity }))}
                                />
                                <Button variant="contained" fullWidth onClick={() => setFilter(prev => ({ selectedCategory: null, selectedCity: null }))}>
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

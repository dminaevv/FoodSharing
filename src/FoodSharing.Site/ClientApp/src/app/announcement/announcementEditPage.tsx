import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlockUi } from "../../components/blockUi/blockUi";
import { CSelect } from "../../components/cSelect";
import { AnnouncementBlank, mapToAnnouncementBlank } from "../../domain/announcements/announcementBlank";
import { AnnouncementCategory } from "../../domain/announcements/announcementCategory";
import { AnnouncementsProvider } from "../../domain/announcements/announcementsProvider";
import { useNotifications } from "../../hooks/useNotifications";
import { useSystemUser } from "../../hooks/useSystemUser";
import { ProfileLinks } from "../../tools/constants/links";
import Page from "../infrastructure/page";
import { AnnouncementPhotoGrid } from "./announcementPhotoGrid";

export function AnnouncementEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const systemUser = useSystemUser();

    const [announcementBlank, setAnnouncementBlank] = useState<AnnouncementBlank>(AnnouncementBlank.Empty(systemUser!.id));
    const [uploadPhotos, setUploadPhotos] = useState<File[]>([]);
    const [categories, setCategories] = useState<AnnouncementCategory[]>([]);

    const { addErrorNotification, addSuccessNotification } = useNotifications();

    useEffect(() => {
        loadPhoto();
    }, [uploadPhotos])

    async function loadPhoto() {
        setAnnouncementBlank(prev => ({ ...prev, uploadPhotos }))
    }

    useEffect(() => {
        loadAnnouncementCategories();
        loadAnnouncement();
    }, [])


    function loadAnnouncementCategories() {
        BlockUi.block(async () => {
            const categories = await AnnouncementsProvider.getCategories();
            setCategories(categories);
        });
    }

    function loadAnnouncement() {
        if (id == null) return;

        BlockUi.block(async () => {
            const announcement = await AnnouncementsProvider.get(id);
            const announcementBlank = mapToAnnouncementBlank(announcement);

            setAnnouncementBlank(announcementBlank);
        });
    }

    function saveAnnouncement() {
        BlockUi.block(async () => {
            const result = await AnnouncementsProvider.save(announcementBlank);
            if (!result.isSuccess) return addErrorNotification(result.errorsString);

            addSuccessNotification("Объявление успешно добавлено");
            navigate(ProfileLinks.main)
        })
    }

    function changeCategory(category: AnnouncementCategory | null) {
        const categoryId = category == null ? null : category.id;

        setAnnouncementBlank(prevAnnouncement => ({
            ...prevAnnouncement,
            categoryId,
        }));
    }

    function changeWeight(value: string) {
        const gramsWeight = String.isNullOrWhitespace(value) ? null : +value;

        setAnnouncementBlank((prevAnnouncement) => ({
            ...prevAnnouncement,
            gramsWeight,
        }));
    }

    return (
        <Page>
            <Typography variant='h4'>{id == null ? "Создание объявления" : "Редактирование объявления"}</Typography>
            <Box mt={2} maxWidth="600px">
                <Stack gap={1}>
                    <TextField
                        label="Название"
                        size="small"
                        value={announcementBlank.name ?? ""}
                        onChange={event => setAnnouncementBlank(prev => ({ ...prev, name: event.target.value }))}
                    />

                    <TextField
                        label="Описание"
                        size="small"
                        multiline
                        minRows={2}
                        maxRows={8}
                        value={announcementBlank.description ?? ""}
                        onChange={event => setAnnouncementBlank(prev => ({ ...prev, description: event.target.value }))}
                    />
                    <CSelect
                        label="Категория"
                        value={categories.find(c => c.id == announcementBlank.categoryId) ?? null}
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.id}
                        options={categories}
                        clearable
                        onChange={changeCategory}
                    />

                    <TextField
                        label="Вес (в граммах)"
                        type="number"
                        size="small"
                        value={announcementBlank.gramsWeight ?? ""}
                        onChange={event => changeWeight(event.target.value)}
                    />
                </Stack>

                <AnnouncementPhotoGrid
                    photoUrls={announcementBlank.imagesUrls}
                    setAnnouncementBlank={setAnnouncementBlank}
                    uploadPhotos={uploadPhotos}
                    setUploadPhotos={setUploadPhotos}
                />

                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={saveAnnouncement}>
                    Сохранить
                </Button>
            </Box>
        </Page>
    )
}


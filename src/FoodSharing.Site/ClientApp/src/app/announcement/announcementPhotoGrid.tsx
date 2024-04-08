import { AddCircleOutline } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar, Typography } from "@mui/material";
import { useRef } from "react";
import { AnnouncementBlank } from "../../domain/announcements/announcementBlank";
import { useNotifications } from "../../hooks/useNotifications";

interface IProps {
    photoUrls: string[];
    setAnnouncementBlank: React.Dispatch<React.SetStateAction<AnnouncementBlank>>;
    uploadPhotos: File[];
    setUploadPhotos: React.Dispatch<React.SetStateAction<File[]>>
}

export function AnnouncementPhotoGrid(props: IProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const { addErrorNotification } = useNotifications();

    function getAllPhotoCount() {
        return props.photoUrls.length + props.uploadPhotos.length;
    }

    function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const selectedPhotos = Array.from(event.target.files);
            const maxPhotoCount = 10;
            const maxPhotoSizeMb = 5;
            const maxPhotoSizeByte = maxPhotoSizeMb * 1024 * 1024;

            const availableQuantityToAdd = maxPhotoCount - props.uploadPhotos.length;
            if (availableQuantityToAdd == 0) return addErrorNotification(`Максимальное количество фото - ${maxPhotoCount}`);

            let availablePhoto = selectedPhotos.length <= availableQuantityToAdd
                ? selectedPhotos
                : selectedPhotos.slice(0, availableQuantityToAdd);

            if (availablePhoto.some(p => p.size >= maxPhotoSizeByte)) {
                addErrorNotification(`Максимальный размер фото - ${maxPhotoSizeMb}МБ`);
                availablePhoto = availablePhoto.filter(a => a.size < maxPhotoSizeByte)
            }

            props.setUploadPhotos(prev => [...prev, ...availablePhoto]);
        }
    };

    function handleDeleteUploadedPhoto(photoIndex: number) {
        const updatedPhotos = [...props.uploadPhotos];
        updatedPhotos.splice(photoIndex, 1);
        props.setUploadPhotos(updatedPhotos);

        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    };

    function handleDeleteExistedPhoto(url: string) {
        props.setAnnouncementBlank(prev => {
            const imageUrls = prev.imagesUrls;
            const newImageUrls = imageUrls.filter(u => u != url);

            return ({ ...prev, imagesUrls: newImageUrls })
        });
    }

    const openFileDialog = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = 'image/*';
        inputElement.multiple = true;

        inputElement.addEventListener("change", (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                handlePhotoChange({ target: { files: target.files } } as React.ChangeEvent<HTMLInputElement>);
            }
        });

        inputElement.click();
    };

    return (
        <Box p={1}>
            <Typography variant="h6">Загрузите до 10 фото</Typography>
            <ImageList cols={(getAllPhotoCount() + 1).butNotMore(4)} sx={{ width: "100%", height: "100%" }}>
                {props.photoUrls.map((url, index) => (
                    <ImageListItem key={index}>
                        <img src={url} alt={`photo-${index}`} style={{
                            objectFit: 'contain'
                        }} />
                        <ImageListItemBar
                            actionIcon={
                                <IconButton onClick={() => handleDeleteExistedPhoto(url)}>
                                    <DeleteIcon sx={{ color: "white" }} />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
                {props.uploadPhotos.map((photo, index) => (
                    <ImageListItem key={index}>
                        <img src={URL.createObjectURL(photo)} alt={`photo-${index}`} style={{
                            objectFit: 'contain'
                        }} />
                        <ImageListItemBar
                            actionIcon={
                                <IconButton onClick={() => handleDeleteUploadedPhoto(index)}>
                                    <DeleteIcon sx={{ color: "white" }} />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
                <ImageListItem onClick={openFileDialog}>
                    <Box display='flex' alignItems='center' justifyContent='center' height="100%">
                        <IconButton >
                            <AddCircleOutline sx={{ fontSize: 100 }} />
                        </IconButton>
                    </Box>
                </ImageListItem>
            </ImageList>
        </Box>
    );
};

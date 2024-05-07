import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { ChangeEvent, useState } from "react";
import { BlockUi } from "../../components/blockUi/blockUi";
import { UserBlank, mapToUserBlank } from "../../domain/users/userBlank";
import { UserProvider } from "../../domain/users/userProvider";
import { useNotifications } from "../../hooks/useNotifications";
import { useSystemUser } from "../../hooks/useSystemUser";

export function SettingsPage() {
    const systemUser = useSystemUser();

    const [userBlank, setUserBlank] = useState<UserBlank>(mapToUserBlank(systemUser!.user))

    const { addErrorNotification, addSuccessNotification } = useNotifications();

    function saveUser() {
        BlockUi.block(async () => {
            const saveResult = await UserProvider.save(userBlank);
            if (!saveResult.isSuccess) return addErrorNotification(saveResult.errorsString);

            addSuccessNotification("Профиль успешно сохранён");
        })
    }

    function logout() {
        UserProvider.logout();
    }

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setUserBlank(prev => ({ ...prev, avatarUrl: imageUrl, avatarFile: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const openFileDialog = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = 'image/*';

        inputElement.addEventListener("change", (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                handleAvatarChange({ target: { files: target.files } } as React.ChangeEvent<HTMLInputElement>);
            }
        });

        inputElement.click();
    };

    return (
        <Box>
            <Stack direction='row' alignItems='center' gap={1}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: { xs: 0, md: 2 } }}>Настойки</Typography>
            </Stack>
            <Box mt={2} maxWidth="600px">
                <Stack gap={2} direction={{ xs: 'column-reverse', md: 'row' }}>
                    <Stack gap={2} sx={{ width: "100%" }}>
                        <TextField
                            label="Почта"
                            size="small"
                            value={userBlank.email ?? ""}
                            onChange={event => setUserBlank(prev => ({ ...prev, email: event.target.value }))}
                        />
                        <TextField
                            label="Имя"
                            size="small"
                            value={userBlank.firstName ?? ""}
                            onChange={event => setUserBlank(prev => ({ ...prev, firstName: event.target.value }))}
                        />
                        <TextField
                            label="Фамилия"
                            size="small"
                            value={userBlank.lastName ?? ""}
                            onChange={event => setUserBlank(prev => ({ ...prev, lastName: event.target.value }))}
                        />
                        <MuiTelInput
                            label="Номер телефона"
                            onlyCountries={['RU']}
                            defaultCountry={'RU'}
                            size="small"
                            placeholder="Введите номер телефона"
                            value={userBlank.phone ?? undefined}
                            onChange={phone => setUserBlank(prev => ({ ...prev, phone }))}
                            inputProps={{
                                maxLength: 16
                            }}
                        />
                    </Stack>
                    <Box sx={{ position: 'relative', borderRadius: "50%" }}>
                        <Avatar
                            alt="Avatar"
                            sx={{ width: 200, height: 200, cursor: 'pointer' }}
                            src={userBlank.avatarUrl ?? 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'}
                        />
                        <Box sx={{ width: 200, height: 200, cursor: 'pointer', position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => openFileDialog()}>
                            <PhotoCameraIcon sx={{ color: 'white' }} />
                        </Box>
                    </Box>
                </Stack>

                <Stack gap={2} direction='row'>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={saveUser}>
                        Сохранить
                    </Button>
                    <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={logout}>
                        Выйти из профиля
                    </Button>
                </Stack>

            </Box>
        </Box>
    )
}

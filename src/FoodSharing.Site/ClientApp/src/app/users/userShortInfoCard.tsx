import { Avatar, Box, Typography } from "@mui/material";
import { User } from "../../domain/users/user";
import { UserInfo } from "../../domain/users/userInfo";

interface IProps {
    user: UserInfo | User,
}

export function UserShortInfoCard(props: IProps) {
    return (
        <Box>
            <Avatar alt="Avatar" sx={{ width: 100, height: 100 }} src={props.user.avatarUrl ?? 'https://www.abc.net.au/news/image/8314104-1x1-940x940.jpg'} />
            <Typography variant="h4" sx={{ mt: 2 }}>
                {props.user.getFullName ?? "Пользователь"}
            </Typography>
            <Typography variant="body2" color="text.secondary" >
                На платформе с {props.user.registrationDate.getFullYear()} года
            </Typography>
        </Box>
    )
}

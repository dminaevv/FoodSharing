import { SxProps, Theme, Typography } from '@mui/material'

interface IProps {
    text: string,
    href: string,
    sx?: SxProps<Theme>
}

export function Link(props: IProps) {
    return (
        <Typography component={'a'} href={props.href} sx={{
            textDecoration: 'none',
            color: '#2b90ff',
            '&:hover': {
                color: '#e62a2a'
            },
            ...props.sx
        }}>
            {props.text}
        </Typography>
    )
}

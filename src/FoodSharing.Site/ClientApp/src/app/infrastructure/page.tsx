import { Box, SxProps, Theme } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Header } from '../header'

interface IProps {
    sx?: SxProps<Theme>
}

export default function Page(props: IProps & PropsWithChildren) {
    return (
        <Box display='flex' flexDirection='column' height="100%" width="100%" sx={{ ...props.sx }} >
            <Header />
            <Box>
                {props.children}
            </Box>
        </Box>
    )
}

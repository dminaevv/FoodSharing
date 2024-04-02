import { Box, Stack } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Header } from '../header'

export default function Page(props: PropsWithChildren) {
    return (
        <Stack direction='column' height="100%" width="100%">
            <Header />
            <Box>
                {props.children}
            </Box>
        </Stack>
    )
}

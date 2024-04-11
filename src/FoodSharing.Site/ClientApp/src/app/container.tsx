import { Box } from '@mui/material'
import { PropsWithChildren } from 'react'

export function Container(props: PropsWithChildren) {
    return (
        <Box sx={{ maxHeight: '100vh', display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
            <Box sx={{ width: '1300px' }}>
                {props.children}
            </Box>
        </Box>
    )
}

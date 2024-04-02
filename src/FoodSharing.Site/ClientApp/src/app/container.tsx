import { Box } from '@mui/material'
import { PropsWithChildren } from 'react'

export function Container(props: PropsWithChildren) {
    return (
        <Box sx={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '1300px' }}>
                {props.children}
            </Box>
        </Box>
    )
}

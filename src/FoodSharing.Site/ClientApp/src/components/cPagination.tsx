import { Box, MenuItem, Pagination, Select, SelectChangeEvent, SxProps, Theme } from "@mui/material"
import React, { ChangeEvent, memo, useState } from "react"

interface Props {
    page?: number
    shape?: 'circular' | 'rounded'
    color?: 'primary' | 'secondary' | 'standard'
    totalRows: number,
    pageSize: number,
    pageSizeOptions?: number[],
    onChange: (page: number) => void
    onChangePageSize?: (page: number) => void;
    mode?: 'desktop' | 'mobile',
    showTotalRows?: boolean,
    totalRowsText?: string
}

export const CPagination = memo((props: Props) => {
    let handler: NodeJS.Timeout;

    const mode = props.mode != null ? props.mode : 'desktop';

    const [inputPage, setInputPage] = useState<string | null>(null);
    const pageCount: number = Math.ceil(props.totalRows / props.pageSize);
    const size: 'small' | 'medium' = mode === 'mobile' ? 'small' : 'medium';

    function onChange(event: React.ChangeEvent<unknown>, page: number) {
        setInputPage(null);

        if (props.onChange) props.onChange(page);
    }

    function setPage(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.value.length > 5) return;

        const value: string = event.target.value.replace('.', '').replace(',', '').replace('e', '');

        setInputPage(value);

        const number: number = parseInt(value);

        clearTimeout(handler);

        if (!isNaN(number) && number <= pageCount && number > 0 && number !== props.page && number % 1 === 0) {
            handler = setTimeout(() => {
                props.onChange(number);
                setInputPage(null);
            }, 500);
        }
    }

    function getValue(): string {
        if (inputPage === null || inputPage === undefined) return props.page?.toString() ?? '';

        return inputPage ?? '';
    }

    function getInputBorder(): string {
        return pageCount > 0 ? "1px solid #c4c4c4" : "1px solid #e9e9e9";
    }

    function getPageSizes(): number[] {
        if (!props.pageSizeOptions || props.pageSizeOptions.length === 0) return [];

        const pageSizes: number[] = props.pageSizeOptions.filter(o => o % 1 === 0);

        if (pageSizes.indexOf(props.pageSize) === -1) pageSizes.push(props.pageSize);

        return pageSizes.sort((s1, s2) => s1 > s2 ? 1 : -1);
    }

    function changePageSize(event: SelectChangeEvent<number>) {
        if (props.onChangePageSize) props.onChangePageSize(+event.target.value);
    }

    const pageSizes: number[] = getPageSizes();

    const selectStyle: SxProps<Theme> = {
        fontSize: '0.9rem',
        width: '72px',
        height: mode !== 'mobile' ? '32px' : '26px',
        textAlign: 'center',
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: '1px solid #c4c4c4' },
        "& fieldset": { top: '0px' },
        "& fieldset legend": { display: 'none' }
    }

    return (
        <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box component="span" sx={{ mr: props.showTotalRows === true ? 3 : 0, display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
                {props.pageSizeOptions && props.onChangePageSize &&
                    <Box sx={{ mr: 1 }}>
                        <Select sx={selectStyle} value={props.pageSize} onChange={changePageSize}>
                            {pageSizes.map((pc, index) => (
                                <MenuItem key={index} value={pc}>{pc.toString()}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                }

                <Box>
                    <Pagination
                        shape={props.shape ?? 'rounded'}
                        color={props.color ?? 'primary'}
                        variant='outlined'
                        size={size}
                        page={props.page}
                        count={pageCount}
                        onChange={onChange}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </Box>
                {mode === 'mobile' ?
                    <Box sx={{ ml: 1 }}>
                        <input type="number"
                            value={getValue()}
                            onChange={setPage}
                            style={{
                                fontSize: '0.9rem', width: '52px', height: '26px', paddingTop: 0, paddingBottom: 0, paddingLeft: 5,
                                paddingRight: 5, border: getInputBorder(), borderRadius: '5px', textAlign: 'center'
                            }}
                            disabled={pageCount < 1}
                            pattern='[0-9]*'
                            min={0}
                            maxLength={5}
                            onBlur={() => { setInputPage(null) }}
                        />
                    </Box>

                    :

                    <Box sx={{ ml: 1 }}>
                        <input type="number"
                            value={getValue()}
                            onChange={setPage}
                            style={{
                                fontSize: '0.9rem', width: '72px', height: '32px', paddingTop: 0, paddingBottom: 0, paddingLeft: 5,
                                paddingRight: 5, border: getInputBorder(), borderRadius: '5px', textAlign: 'center'
                            }}
                            disabled={pageCount < 1}
                            pattern='[0-9]*'
                            min={0}
                            maxLength={5}
                            onBlur={() => { setInputPage(null) }}
                        />
                    </Box>
                }
            </Box>

            {props.showTotalRows &&
                <Box sx={{ p: '4px' }}>
                    {props.totalRowsText}:&nbsp;{props.totalRows < 1 ? '–' : props.totalRows}
                </Box>
            }
        </Box>
    )
})
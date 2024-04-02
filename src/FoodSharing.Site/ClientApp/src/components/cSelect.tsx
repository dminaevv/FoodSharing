import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from "@mui/material";
import React, { MutableRefObject } from "react";

export interface IProps<TValue> {
    label: string
    emptyLabel?: string
    disabled?: boolean
    value: TValue | null
    options: TValue[]
    defaultValue?: string
    errorMessage?: string | null
    onChange: (values: TValue | null) => void
    getOptionLabel: (value: TValue) => string
    getOptionValue: (value: TValue) => string | number
    renderValue?: (option: TValue) => React.ReactNode
    renderOption?: (option: TValue) => React.ReactNode
    clearable?: boolean
    sx?: SxProps<Theme>
    ref?: MutableRefObject<null>
    onFocus?: () => void;
    onBlur?: () => void;
}

export const CSelect = <TValue,>(props: IProps<TValue>) => {
    function onChange(event: SelectChangeEvent<string>): void {
        const selectedOption = props.options.find(o => props.getOptionValue(o).toString() === event.target.value) ?? null;

        props.onChange(selectedOption)
    }

    function renderValue(value: string) {
        const selectedOption = props.options.find(o => props.getOptionValue(o).toString() === value) ?? null;

        if (selectedOption === null) {
            if (!props.emptyLabel)
                return ""
            else
                return props.emptyLabel;
        }

        if (props.renderValue)
            return props.renderValue(selectedOption);
        else
            return props.getOptionLabel(selectedOption);
    }

    function isSelected(option: TValue) {
        return props.getOptionValue(option) === (props.value !== null ? props.getOptionValue(props.value) : null);
    }

    function renderOptions() {
        return (
            props.options.map((option, index) => (
                <MenuItem selected={isSelected(option)} key={index} value={props.getOptionValue(option).toString()}>
                    {props.renderOption ? props.renderOption!(option) : props.getOptionLabel(option)}
                </MenuItem>
            ))
        )
    }

    if (props.clearable)
        return (
            <FormControl fullWidth sx={{ ...props.sx }} size="small">
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    value={props.value !== null ? props.getOptionValue(props.value).toString() : ""}
                    label={props.label}
                    onChange={onChange}
                    placeholder={props.label}
                    disabled={props.disabled}
                    renderValue={renderValue}
                    ref={props.ref}
                    onFocus={props.onFocus}
                    defaultValue={props.defaultValue}
                    onBlur={props.onBlur}
                    error={props.errorMessage != null}
                    sx={{
                        "& .MuiSelect-iconOutlined": { display: 'none' },
                        "&.Mui-focused .MuiIconButton-root": { color: 'primary.main' },
                        "&.MuiInputBase-adornedEnd": { pr: 0 }
                    }}
                    endAdornment={props.clearable ?
                        <IconButton sx={{ position: 'absolute', right: 2 }} onClick={() => props.onChange(null)}>
                            <ClearIcon />
                        </IconButton>
                        :
                        <></>
                    }
                >
                    {renderOptions()}
                </Select>
                <FormHelperText color={'error'}>{props.errorMessage}</FormHelperText>
            </FormControl>
        )
    else
        return (
            < FormControl fullWidth sx={{ ...props.sx }} size="small">
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    size="small"
                    value={props.value !== null ? props.getOptionValue(props.value).toString() : ""}
                    label={props.label}
                    onChange={onChange}
                    placeholder={props.label}
                    disabled={props.disabled}
                    renderValue={renderValue}
                    ref={props.ref}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    error={props.errorMessage != null}
                    defaultValue={props.defaultValue}
                >
                    {renderOptions()}
                </Select>
                <FormHelperText color={'error'}>{props.errorMessage}</FormHelperText>
            </ FormControl>
        )
}
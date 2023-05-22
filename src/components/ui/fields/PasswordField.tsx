import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import React, { ReactNode, forwardRef } from 'react'

type Props = {
  error: boolean;
  name: string;
  label: string;
  helperText?: ReactNode | string,
  showPassword: boolean,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  isTouched: boolean,
  required?: boolean | undefined,
  disabled?: boolean | undefined,
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  //ref: ((instance: unknown) => void) | React.RefObject<unknown>
}

const PasswordField = forwardRef(function PasswordField(props : Props, ref) {

  const {helperText, error, onClick, showPassword, isTouched, label, ...control} = props
  return (
    <>
    <FormControl
      fullWidth
      error={isTouched && error} 
      variant="outlined">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        ref={ref}
        {...control}
        type={showPassword ? 'text' : 'password'}
        label={label}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={onClick}
              edge="end"
            >
              {showPassword ? <VisibilityOff/> : <Visibility/>}
              </IconButton>
          </InputAdornment>
        }
      />
      {isTouched && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
    </>
  )
})

export default PasswordField
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { FC, forwardRef } from 'react'

type Props = {
  name: string
  label: string,
  error: string | undefined,
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

  const {error, onClick, showPassword, isTouched, label, ...control} = props
  return (
    <>
    <FormControl
      fullWidth
      error={isTouched && error !== undefined} 
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
      {isTouched && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
    </>
  )
})

export default PasswordField
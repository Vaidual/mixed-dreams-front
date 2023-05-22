import { Button, Checkbox, TextField } from '@mui/material'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AuthService } from 'services/auth/auth.service';
import PasswordField from 'components/ui/fields/PasswordField';

const schema = yup.object({
  email: yup.string()
    .required("required")
    .trim(),
  password: yup.string()
    .required("required")
    .trim()
    .min(8),
  rememberMe: yup.boolean().required()
}).required();

type FormDataType =  {
  email: string
  password: string
  rememberMe: boolean
}; 

const Login: FC = () => {

  const { register, handleSubmit, getFieldState, formState: { errors } } = useForm<FormDataType>({
    resolver: yupResolver(schema),
    mode: 'onTouched'
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormDataType) => {
    console.log(data)
    console.log(await AuthService.login(data))
  }

  return (
    <>
      <div className='mt-20 mx-auto max-w-sm'>
        <div>
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>
        <div className='mt-6'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <TextField {...register("email")}
                fullWidth
                label="Email*"
                error={errors.email !== undefined} 
                helperText={errors.email?.message} 
                variant="outlined" />
              <PasswordField {...register('password')} 
                error={errors.password?.message} 
                showPassword={showPassword}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
                label='Password*'
                isTouched={getFieldState('password').isTouched}/>
              <div className='flex justify-between flex-wrap'>
                <FormControlLabel className='' {...register("rememberMe")} control={<Checkbox/>} label="Remember me?" />
                <Link className='whitespace-nowrap self-center' to={'#'}>
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className='mt-4'>
              <Button fullWidth variant='contained' type='submit'>Sign In</Button>
            </div>
          </form>
          <p className="mt-6 text-center text-base">
            Not a member?{' '}
            <Link color='secondary' to={'/signup'} className="whitespace-nowrap font-semibold leading-6">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login

// Basic FormControl
/* <FormControl
  fullWidth
  error={getFieldState('password').isTouched && !!errors.password} 
  variant="outlined">
  <InputLabel>Password</InputLabel>
  <OutlinedInput
    {...register('password')}
    type={showPassword ? 'text' : 'password'}
    label="Password"
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword((showPassword) => !showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff/> : <Visibility/>}
          </IconButton>
      </InputAdornment>
    }
  />
  {getFieldState('password').isTouched && <FormHelperText>{errors.password?.message}</FormHelperText>}
</FormControl> */
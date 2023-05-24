import { Button, Checkbox, TextField } from '@mui/material'
import { FC, useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AuthService } from 'services/auth/auth.service';
import PasswordField from 'components/ui/fields/PasswordField';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from 'components/ui/text/ErrorMessage';
import { login } from 'store/user/user.actions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';
import { SnackbarContext } from 'providers/Snackbar.provider';
import { useRedirect } from 'hooks/useRedirect';
import { IStandardError } from 'interfaces/responseError.interface';
import { ErrorCodes } from 'enums/ErrorCodes';

type FormDataType =  {
  email: string
  password: string
  rememberMe: boolean
}; 

const schema = yup.object({
    email: yup.string()
      .required()
      .trim()
      .email(),
    password: yup.string()
      .required()
      .trim()
      .min(8),
    rememberMe: yup.boolean().required()
  }).required();

const Login: FC = () => {
  
  const { register, handleSubmit, getFieldState, formState: { errors } } = useForm<FormDataType>({
    resolver: yupResolver(schema),
    mode: 'onTouched'
  });

  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation(['common\\form', 'login','common\\errors']);
  const dispatch = useDispatch<AppDispatch>();
  const redirect = useRedirect();
  const { setSnack } = useContext(SnackbarContext);
  const onSubmit = async (data: FormDataType) => {
    try {
      await dispatch(login(data)).unwrap()
      redirect()
    } catch (e) {
      const error = e as IStandardError;
      setSnack({ message: t(`common\\errors:${ErrorCodes[error.errorCode]}`), color: 'error', open: true })
    }
  }

  return (
    <>
      <div className='mt-20 mx-auto max-w-sm'>
        <div>
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
            {t('login:title')}
          </h2>
        </div>
        <div className='mt-6'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <TextField {...register("email")}
                fullWidth
                label={`${t('fields.email')}*`}
                error={errors.email !== undefined} 
                helperText={ <ErrorMessage error={errors.email?.message} field={t('common\\form:ssfields.email') as string}/>} 
                variant="outlined" />
              <PasswordField {...register('password')}
                error={errors.password !== undefined} 
                helperText={<ErrorMessage error={errors.password?.message} field={t('fields.password') as string}/>} 
                showPassword={showPassword}
                onClick={() => setShowPassword((showPassword) => !showPassword)}
                label={`${t('fields.password')}*`}
                isTouched={getFieldState('password').isTouched}/>
              <div className='flex justify-between flex-wrap'>
                <FormControlLabel {...register("rememberMe")} control={<Checkbox/>} label={t('login:rememberMe')} />
                <Link className='whitespace-nowrap self-center' to={'#'}>
                {t('login:forgotPassword')}
                </Link>
              </div>
            </div>
            <div className='mt-4'>
              <Button fullWidth variant='contained' type='submit'>{t('login:signIn')}</Button>
            </div>
          </form>
          <p className="mt-6 text-center text-base">
          {t('login:notMember')}{' '}
            <Link color='secondary' to={'/signup'} className="whitespace-nowrap font-semibold leading-6">
            {t('login:createAccount')}
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
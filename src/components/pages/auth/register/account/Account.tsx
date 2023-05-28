import { FC, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import { FormStateContext, FormStateType, useFormState } from 'hooks/useFormState';
import { produce } from 'immer';
import { Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import PasswordField from 'components/ui/fields/PasswordField';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from 'components/ui/text/ErrorMessage';

const schema = yup.object({
  email: yup.string()
    .required('validations.required')
    .trim()
    .email(),
  password: yup.string()
    .required('validations.required')
    .trim()
    .min(8)
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*[!?*.(){}[\]\-=+&^%$#@:;`~|\\'""/,><_]).{8,}$/, "validations.passwordCharacters"),
  confirmPassword: yup.string()
    .required('validations.required')
    .trim()
    .oneOf([yup.ref('password')], "validations.passwordsNotMatching"),
}).required();

type FormDataType = yup.InferType<typeof schema>;

const Contact: FC<{onNext: () => void}> = ({onNext}) => {

  const { t } = useTranslation(['register', 'common\\form']);
  const { formState, setFormState } = useFormState();
  const [showPassword, setShowPassword] = useState(false);

  const { register, getValues, getFieldState, trigger, formState: { errors, isDirty, isValid } } = useForm<FormDataType>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      email: formState.steps.account.value.email,
      password: formState.steps.account.value.password,
      confirmPassword: formState.steps.account.value.confirmPassword,
    }
  });
 
  useEffect(() => {
    if (formState.steps.account.hadError)
      trigger()
  }, [formState.steps.account.hadError, trigger])

  useEffect(() => {
    setFormState(
      produce((formState) => {
        formState.steps.account.dirty = isDirty;
      })
    );
  }, [isDirty, setFormState]);

  const updateState = () => {
    setFormState(
      produce((formState) => {
        formState.steps.account.value = getValues();
        formState.steps.account.valid = isValid;
        formState.steps.account.dirty = false;
        formState.steps.account.hadError = Object.entries(errors).length > 0;
      })
    );
  }

  const location = useLocation();

  return (
    <>
      <div className='flex items-center flex-col'>
        <h2 className='text-2xl text-center font-bold tracking-tight'>{t('title')}</h2>
        <h3 className='text-lg mt-2'>{t('subTitle')}</h3>
      </div>
      <form className='mt-6'>
        <div className='space-y-4'>
          <TextField {...register("email")}
            fullWidth
            label={`${t('common\\form:fields.email')}*`}
            error={errors.email !== undefined}
            helperText={<ErrorMessage error={errors.email?.message} field={t('common\\form:fields.email') as string}/>}
            variant="outlined" />
          <PasswordField {...register('password')}
            error={errors.password !== undefined}
            helperText={<ErrorMessage error={errors.password?.message} field={t('common\\form:fields.password') as string}/>} 
            showPassword={showPassword}
            onClick={() => setShowPassword((showPassword) => !showPassword)}
            label={`${t('common\\form:fields.password')}*`}
            isTouched={getFieldState('password').isTouched}/>
          <PasswordField {...register('confirmPassword')} 
            error={errors.confirmPassword !== undefined}
            helperText={<ErrorMessage error={errors.confirmPassword?.message} field={t('common\\form:fields.confirmPassword') as string}/>} 
            showPassword={showPassword}
            onClick={() => setShowPassword((showPassword) => !showPassword)}
            label={`${t('common\\form:fields.confirmPassword')}*`}
            isTouched={getFieldState('confirmPassword').isTouched}/>
        </div>

      </form>
      <p className='text-left w-full mt-3 text-base'>
        {t('alreadyHaveAccount')}{" "}
        <Link to={'/login'} state={{from: location.state?.from}} className="font-semibold">
        {t('common\\form:options.signIn')}
        </Link>
      </p>
      <div className='mt-2 flex justify-end'>
        <Button onClick={() => {updateState(); onNext();}} disabled={!isValid}>
        {t('common\\form:buttons.next')}
        </Button>
      </div>
    </>
  );
}

export default Contact
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import { useFormState } from 'hooks/useFormState';
import { produce } from 'immer';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PasswordField from 'components/ui/fields/PasswordField';

const schema = yup.object({
  email: yup.string()
    .required("required")
    .trim()
    .email("email"),
  password: yup.string()
    .required("required")
    .trim()
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*[!?*.(){}[\]\-=+&^%$#@:;`~|\\'""/,><_]).{8,}$/, "char"),
  confirmPassword: yup.string()
    .required("required")
    .trim()
    .oneOf([yup.ref('password')], "match"),
}).required();

type FormDataType = yup.InferType<typeof schema>;

const Contact: FC<{onNext: () => void}> = ({onNext}) => {

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

  return (
    <>
      <div>
        <h2 className='text-2xl text-center font-bold tracking-tight'>Let's create your account.</h2>
        <h3 className='text-lg mt-2'>Signing up for MixedDreams is fast and free.</h3>
      </div>
      <form className='mt-6'>
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
          <PasswordField {...register('confirmPassword')} 
            error={errors.confirmPassword?.message} 
            showPassword={showPassword}
            onClick={() => setShowPassword((showPassword) => !showPassword)}
            label='Confirm Password*'
            isTouched={getFieldState('confirmPassword').isTouched}/>
        </div>

      </form>
      <p className='text-left w-full mt-3 text-base'>
        Already have account?{" "}
        <Link to={'/login'} className="font-semibold">
          Sign in
        </Link>
      </p>
      <Box sx={{width:'100%', marginTop:'10px', justifyContent: 'flex-end', display:'flex'}}>
        <Button onClick={() => {updateState(); onNext();}} disabled={!isValid}>
          Next
        </Button>
      </Box>
    </>
  );
}

export default Contact
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import { useFormState } from 'hooks/useFormState';
import { produce } from 'immer';
import { Box, Button } from '@mui/material';

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

  const { register, getValues, trigger, formState: { errors, isDirty, isValid } } = useForm<FormDataType>({
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
    <h1>Let's create your account.</h1>
      <h3>Signing up for MixedDreams is fast and free.</h3>
      <form>
        <TextField {...register("email")}
          fullWidth
          label="Email*"
          error={errors.email !== undefined} 
          helperText={errors.email?.message} 
          variant="outlined" />

        <TextField {...register("password")}
          fullWidth
          label="Password*"
          error={errors.password !== undefined} 
          helperText={errors.password?.message} 
          variant="outlined" />

        <TextField {...register("confirmPassword")}
          fullWidth
          label="Confirm password*"
          error={errors.confirmPassword !== undefined} 
          helperText={errors.confirmPassword?.message} 
          variant="outlined" />

      </form>
      <Box sx={{width:'100%', marginTop:'10px', justifyContent: 'flex-end', display:'flex'}}>
        <Button onClick={() => {updateState(); onNext();}} disabled={!isValid}>
          Next
        </Button>
      </Box>
    </>
  );
}

export default Contact
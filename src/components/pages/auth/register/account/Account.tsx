import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import { IRegisterStepsProps } from '../registerWrapper/RegisterWrapper';

const schema = yup.object({
  email: yup.string()
    .required("required")
    .email("email"),
  password: yup.string()
    .required("required")
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*[!?*.(){}[\]\-=+&^%$#@:;`~|\\'""/,><_]).{8,}$/, "char"),
  confirmPassword: yup.string()
    .required("required")
    .oneOf([yup.ref('password')], "match"),
}).required();

type FormDataType = yup.InferType<typeof schema>;

const Contact: FC<IRegisterStepsProps> = ({setNextBtnIsDisabled, setFormState, formState}) => {

  const { register, setValue, getValues, formState: { errors, isValid } } = useForm<FormDataType>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: formState
  });

//   useEffect(() => {
//     Object.entries(formState).forEach(
//       ([name, value]: any) => setValue(name, value));
// }, []);

useEffect(() => {
  return () => {
    console.log({...formState, ...getValues()})
    setFormState({...formState, ...getValues()})
  }
}, [])

  useEffect(() => {
    setNextBtnIsDisabled(!isValid)
  }, [isValid]); 

  // useEffect(() => {
  //   setFormData({ ...getValues()})
  // }, [getValues]); 

  return (
    <>
    <h1>Let's create your account.</h1>
      <h3>Signing up for MixedDreams is fast and free.</h3>
      <form>
        <TextField {...register("email")}
          label="Email"
          error={errors.email !== undefined} 
          helperText={errors.email?.message} 
          variant="outlined" />

        <TextField {...register("password")}
          label="Password"
          error={errors.password !== undefined} 
          helperText={errors.password?.message} 
          variant="outlined" />

        <TextField {...register("confirmPassword")}
          label="Confirm password"
          error={errors.confirmPassword !== undefined} 
          helperText={errors.confirmPassword?.message} 
          variant="outlined" />

      </form>
    </>
  );
}

export default Contact
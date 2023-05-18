import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import styles from './Contact.module.css';
import { useFormState } from '../../../../../hooks/useFormState';
import { useNavigate } from 'react-router-dom';

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

type FormData = yup.InferType<typeof schema>;

const Contact: FC = () => {

  const {formState, setFormState} = useFormState();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched'
  });
  

  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormData> = data => {
    setFormState({...formState, ...data})
    navigate("/signup/business");
  }

  return (
    <div className={styles.formWrapper}>
      <h1>Let's create your account.</h1>
      <h3>Signing up for MixedDreams is fast and free.</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("email")}
         className={styles.input}
          label="Email"
          error={errors.email !== undefined} 
          helperText={errors.email?.message} 
          variant="outlined" />

        <TextField {...register("password")}
          className={styles.input}
          label="Password"
          error={errors.password !== undefined} 
          helperText={errors.password?.message} 
          variant="outlined" />

        <TextField {...register("confirmPassword")}
          className={styles.input}
          label="Confirm password"
          error={errors.confirmPassword !== undefined} 
          helperText={errors.confirmPassword?.message} 
          variant="outlined" />

        <input type="submit" />
      </form>
    </div>
  );
}

export default Contact
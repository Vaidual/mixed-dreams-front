import { FC } from 'react'
import { useFormState } from '../../../../../hooks/useFormState';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { SubmitHandler, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { IRegisterCompany } from "@/interfaces/IRegisterCompany";

const schema = yup.object({
  country: yup.string()
    .max(100)
    .required()
}).required();

type FormData = yup.InferType<typeof schema>;

const Business: FC = () => {
  const {formState, setFormState} = useFormState();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched'
  });

  const onSubmit: SubmitHandler<FormData> = data => {
    //setFormState({...data, ...formState});
    const reg = {...data, ...formState} as IRegisterCompany;
    console.log(reg)
  };

  return (
    
    <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("country")}
          label="Country"
          error={errors.country !== undefined} 
          helperText={errors.country?.message} 
          variant="outlined" />

        <input type="submit" />
      </form>
  )
}

export default Business
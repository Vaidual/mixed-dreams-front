import { FC, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import { IRegisterStepsProps } from '../registerWrapper/RegisterWrapper';
import { useForm } from 'react-hook-form';


// interface IBusinessSchema {  
//   country: string;
//   street: string;
//   zipCode: string;
//   state: string;
//   apartment: string;
//   city: string;
// }

const schema = yup.object({ 
  companyName: yup.string()
    .required()
    .min(2)
    .max(50),
  birthday: yup.date()
    .required(),
  country: yup.string()
    .required()
    .max(100),
  street: yup.string()
    .required()
    .max(100),
  zipCode: yup.string()
    .required()
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/),
  state: yup.string()
    .required()
    .max(100),
  apartment: yup.string()
    .required()
    .max(100),
  city: yup.string()
    .required()
    .max(100),
}).required();

type FormData = yup.InferType<typeof schema>;

const Business: FC<IRegisterStepsProps> = ({setNextBtnIsDisabled, setFormState, formState}) => {
  const { register, setValue, getValues, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      apartment: formState.address?.apartment,
      city: formState.address?.city,
      state: formState.address?.state,
      country: formState.address?.country,
      street: formState.address?.street,
      zipCode: formState.address?.zipCode,
    }
  });

  useEffect(() => {
    return () => {
      const {companyName, birthday, ...address} = getValues()
      console.log(address)
      setFormState({...formState, companyName, birthday: String(birthday), address: address})
    }
  }, [])

  useEffect(() => {
    setNextBtnIsDisabled(!isValid)
  }, [isValid]); 
  
  return (
    
    <form>
        <TextField {...register("country")}
          label="Country"
          error={errors.country !== undefined} 
          helperText={errors.country?.message} 
          variant="outlined" />

        {/*<DatePicker />*/}
      </form>
  )
}

export default Business
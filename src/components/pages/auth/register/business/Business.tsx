import { FC, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import { useFormState } from 'hooks/useFormState';
import { produce } from 'immer';
import { Box, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { isValid as isDateValid } from 'date-fns';
import styles from "./Business.module.css";


// interface IBusinessSchema {  
//   country: string;
//   street: string;
//   zipCode: string;
//   state: string;
//   apartment: string;
//   city: string;
// }

const schema = yup.object().shape({ 
  companyName: yup.string()
    .required()
    .trim()
    .min(2)
    .max(50),
  birthday: yup.date()
    .nullable()
    .required()
    .min(new Date(1950, 1, 1), "min")
    .max(new Date(), "max"),

  firstName: yup.string()
    .required()
    .trim()
    .min(2)
    .max(50),
  lastName: yup.string()
    .required()
    .trim()
    .min(2)
    .max(100),

  country: yup.string()
    .required()
    .trim()
    .min(2)
    .max(100),
  street: yup.string()
    .required()
    .trim()
    .min(2)
    .max(100),
  zipCode: yup.string()
    .required()
    .trim()
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/),
  state: yup.string()
    .required()
    .trim()
    .min(2)
    .max(100),
  apartment: yup
    .string()
    .nullable()
    .notRequired()
    .when('apartment', {
      is: (value: string) => value?.length,
      then: (rule) => rule.min(2),
    }),
  city: yup.string()
    .trim()
    .required()
    .min(2)
    .max(100),
},
[
  ['apartment', 'apartment'],
]).required();

type FormData = yup.InferType<typeof schema>;

const Business: FC<{onComplete: () => void; onPrev: () => void;}> = ({onPrev, onComplete}) => {

  const { formState, setFormState } = useFormState();

  const { trigger, register, getValues, control, formState: { errors, isDirty, isValid } } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      birthday: formState.steps.business.value.birthday !== null ? formState.steps.business.value.birthday : undefined,
      companyName: formState.steps.business.value.companyName,
      apartment: formState.steps.business.value.address.apartment,
      city: formState.steps.business.value.address.city,
      state: formState.steps.business.value.address.state,
      firstName: formState.steps.business.value.firstName,
      lastName: formState.steps.business.value.lastName,
      country: formState.steps.business.value.address.country,
      street: formState.steps.business.value.address.street,
      zipCode: formState.steps.business.value.address.zipCode,
    }
  });
  
  useEffect(() => {
    if (formState.steps.business.hadError)
      trigger()
  }, [formState.steps.business.hadError, trigger])

  useEffect(() => {
    setFormState(
      produce((formState) => {
        formState.steps.business.dirty = isDirty;
      })
    );
  }, [isDirty, setFormState]);

  const updateState = () => {
    setFormState(
      produce((formState) => {
        const {companyName, birthday, firstName, lastName, apartment, ...address} = getValues()
        formState.steps.business.value = {
          companyName, 
          birthday: isDateValid(birthday) ? birthday : null, 
          firstName, 
          lastName, 
          address: {apartment: apartment ?? null, ...address}}
        formState.steps.business.valid = isValid;
        formState.steps.business.dirty = false;
        formState.steps.business.hadError = Object.entries(errors).length > 0;
      })
    );
  }

  return (
    <>
    <form>
      <TextField {...register("companyName")}
        label="Business name*"
        error={errors.companyName !== undefined} 
        helperText={errors.companyName?.message} 
        variant="outlined" />

          <Controller
              name="birthday"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: {error, invalid}
              }) => (
                <DatePicker
                  label="Date of birth*"
                  disableFuture
                  value={value !== undefined ? value : null}
                  onChange={(value) =>{
                    onChange(isDateValid(new Date(value!)) ? value : null)
                  }
                  }
                />
              )}
            />



      <div className={styles.doubleFieldBlock}>
        <TextField {...register("firstName")}
          label="First Name*"
          error={errors.firstName !== undefined} 
          helperText={errors.firstName?.message} 
          variant="outlined" />
        <TextField {...register("lastName")}
          label="Last Name*"
          error={errors.lastName !== undefined} 
          helperText={errors.lastName?.message} 
          variant="outlined" />
      </div>
      <div className={styles.doubleFieldBlock}>
      <TextField {...register("country")}
        label="Country*"
        error={errors.country !== undefined} 
        helperText={errors.country?.message} 
        variant="outlined" />
      <TextField {...register("city")}
        label="Street*"
        error={errors.city !== undefined} 
        helperText={errors.city?.message} 
        variant="outlined" />
      </div>
      <div className={styles.doubleFieldBlock}>
      <TextField {...register("state")}
        label="State*"
        error={errors.state !== undefined} 
        helperText={errors.state?.message} 
        variant="outlined" />
      <TextField {...register("street")}
        label="City*"
        error={errors.street !== undefined} 
        helperText={errors.street?.message} 
        variant="outlined" />
      </div>
      <div className={styles.doubleFieldBlock}>
      <TextField {...register("apartment")}
        label="Apartment"
        error={errors.apartment !== undefined} 
        helperText={errors.apartment?.message} 
        variant="outlined" />
      <TextField {...register("zipCode")}
        label="Postal code*"
        error={errors.zipCode !== undefined} 
        helperText={errors.zipCode?.message} 
        variant="outlined" />
      </div>
      </form>
      <Box sx={{display:'flex', justifyContent:'space-between', width: '100%', marginTop:'10px'}}>
        <Button onClick={() => {updateState(); onPrev();}}>
          Prev
        </Button>
        <Button onClick={() => {updateState(); onComplete();}} disabled={!isValid}>
          Finish
        </Button>
      </Box>
      </>
  )
}

export default Business
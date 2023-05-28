import { FC, useContext, useEffect, useState } from 'react'
import ConfirmDialog from '../dialogs/ConfirmDialog';
import { Autocomplete, Button, Checkbox, FormControlLabel, MenuItem, Skeleton, TextField, createFilterOptions } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IngredientsService } from 'services/ingredients/ingredients.service';
import { Ingredient, PostIngredient } from 'interfaces/ingredient.interface';
import { IStandardError } from 'interfaces/responseError.interface';
import { ErrorCodes } from 'enums/ErrorCodes';
import { useTranslation } from 'react-i18next';
import { SnackbarContext } from 'providers/Snackbar.provider';
import { Units } from 'enums/Units';
import { SubmitHandler, useForm } from 'react-hook-form';
import useUnitItems from './UnitsItems';
import { ErrorMessage } from '../text/ErrorMessage';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { GetProductIngredient } from 'interfaces/product.interface';

type FormValues = {
  ingredient: IngredientOption | null;
  hasAmount: boolean;
  amount: number | null,
  unit: Units | null,
};

interface IngredientOption {
  inputValue?: string,
  name: string,
  id?: string
}

const schema = yup.object().shape({
  hasAmount: yup.boolean()
    .required(),
  amount: yup.number()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .when('hasAmount', {
      is: (value: boolean) => value,
      then: (rule) => rule.required('111').min(0, '222'),
    }),
  unit: yup.number()
    .when('hasAmount', {
      is: (value: boolean) => value,
      then: (rule) => rule.required(),
    }),

},).required();
type FormData = yup.InferType<typeof schema>;

const AddIngredientModal: FC<{ isOpen: boolean, handleClose: () => void, addIngredient: (newIngredient: GetProductIngredient) => void }> = ({ isOpen, handleClose, addIngredient }) => {
  const { t } = useTranslation(['common\\errors']);
  const { setSnack } = useContext(SnackbarContext);
  const queryClient = useQueryClient()

  const ingredients = useQuery<Array<Ingredient>>(['getAvailableIngredients'], () => {
    return IngredientsService.get();
  });

  const CreateIngredient = useMutation(['createIngredient'], (ingredient: PostIngredient) => {
    return IngredientsService.post(ingredient)
  }, {
    onSuccess(newIngredient) {
      queryClient.setQueryData<Array<Ingredient>>(['getAvailableIngredients'], oldValue => [newIngredient, ...oldValue!]);
    },
    onError(error) {
      setSnack({ message: t(`${ErrorCodes[(error as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 10_000 });
    }
  });

  useEffect(() => {
    if (ingredients.isError) {
      setSnack({ message: t(`${ErrorCodes[(ingredients.error as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 10_000 });
      handleClose();
    }
  }, [ingredients.isError, handleClose, ingredients.error, setSnack, t]);



  const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [measureInputsDisabled, setMeasureInputsDisabled] = useState<boolean>(true);


  const [ingredient, setIngredient] = useState<IngredientOption | null>(null);
  const filter = createFilterOptions<IngredientOption>();

  const onSubmit: SubmitHandler<FormData> = data => {
    if (ingredient === null || ingredient.id === undefined) {
      return;
    }
    if (data.hasAmount) {
      addIngredient({ ...data, id: ingredient.id, name: ingredient.name });
    } else {
      addIngredient({ hasAmount: data.hasAmount, id: ingredient.id, name: ingredient.name });
    }
    handleClose();
  };

  const items = useUnitItems().map(u =>
    <MenuItem key={u.key} value={u.key}>
      {u.label}
    </MenuItem>);
  return (
    <ConfirmDialog
      title='Add an ingredient'
      description={ingredients.isLoading ?
        <Skeleton className='h-56' variant="rectangular" />
        : (
          <form className='mt-4 space-y-3' id="add-ingredient-form" onSubmit={handleSubmit(onSubmit)}>
            <h3 className='text-lg'>{'Pick ingredient'}</h3>
            <Autocomplete
              value={ingredient}
              onChange={async (event, newValue) => {
                if (typeof newValue === 'string') {
                  setIngredient({
                    name: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  const newIngredient = await CreateIngredient.mutateAsync({ name: (newValue as IngredientOption).inputValue! });
                  setIngredient(newIngredient)
                } else {
                  setIngredient(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.name);
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `Add "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              options={ingredients.data ? ingredients.data.map(i => ({ id: i.id, name: i.name } as IngredientOption)) : []}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                  return option;
                }
                // Regular option
                return option.name;
              }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params}
                  label="Ingredient" />
              )}
            />
            <div>
              <div className='mt-8'>
                <FormControlLabel label="Has amount"
                  control={
                    <Checkbox {...register('hasAmount')}
                      onChange={(value) => {
                        setMeasureInputsDisabled(!value.target.checked);
                        register('hasAmount').onChange(value);
                        if (!value.target.checked) {
                          trigger('amount')
                        }
                      }
                      }
                    />}
                />
              </div>
              <div>
                <TextField {...register('amount')}
                  disabled={measureInputsDisabled}
                  error={!!errors.amount}
                  fullWidth
                  helperText={
                    <ErrorMessage
                      error={errors.amount?.message}
                      field={t("common\form:fields.email") as string}
                    />
                  }
                  label='Amount'
                  type='number'
                />
              </div>
              <div className='mt-4'>
                <TextField
                  defaultValue={Units.Item}
                  inputProps={{
                    ...register('unit'),
                  }}
                  disabled={measureInputsDisabled}
                  fullWidth
                  label='Unit'
                  select
                >
                  {items}
                </TextField>
              </div>
            </div>
          </form>
        )
      }
      isOpen={isOpen}
      handleClose={handleClose}
      actions={
        ingredients.isLoading ?
          <Skeleton variant="rectangular" className='h-10 w-20' />
          :
          <Button
            type='submit'
            form='add-ingredient-form'
            color='primary'
            variant='contained'
          >
            'Add'
          </Button>
      }
    />
  )
}

export default AddIngredientModal
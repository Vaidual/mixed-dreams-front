import {FC, useContext, useEffect, useState} from 'react'
import ConfirmDialog from '../dialogs/ConfirmDialog';
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Skeleton,
    TextField,
    createFilterOptions
} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {IngredientsService} from 'services/ingredients/ingredients.service';
import {Ingredient, PostIngredient} from 'interfaces/ingredient.interface';
import {IStandardError} from 'interfaces/responseError.interface';
import {ErrorCodes} from 'enums/ErrorCodes';
import {useTranslation} from 'react-i18next';
import {SnackbarContext} from 'providers/Snackbar.provider';
import {Units} from 'enums/Units';
import {SubmitHandler, useForm} from 'react-hook-form';
import useUnitItems from './UnitsItems';
import {ErrorMessage} from '../text/ErrorMessage';
import * as yup from "yup";
import {yupResolver} from '@hookform/resolvers/yup';
import {GetProductIngredient} from 'interfaces/product.interface';
import {yupLocale} from 'utils/yupLocale';

yup.setLocale(yupLocale);

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
            then: (rule) => rule.required().min(0),
        }),
    unit: yup.number()
        .nullable()
        .when('hasAmount', {
            is: (value: boolean) => value,
            then: (rule) => rule.required(),
        }),

},).required();
type FormData = yup.InferType<typeof schema>;

type Props<T extends boolean = boolean> = {
    isEditing: T,
    isOpen: boolean,
    handleClose: () => void,
    onSave: (newIngredient: GetProductIngredient) => void,
    ingredientToUpdate: T extends true ? GetProductIngredient : undefined,
}

const AddIngredientModal: FC<Props> = ({isOpen, handleClose, onSave, ingredientToUpdate, isEditing}) => {
    const {t} = useTranslation(['ingredients', 'common\\errors']);
    const {setSnack} = useContext(SnackbarContext);
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
            setSnack({
                message: t(`${ErrorCodes[(error as IStandardError)?.errorCode]}`),
                color: 'error',
                open: true,
                autoHideDuration: 10_000
            });
        }
    });

    useEffect(() => {
        if (ingredients.isError) {
            setSnack({
                message: t(`${ErrorCodes[(ingredients.error as IStandardError)?.errorCode]}`),
                color: 'error',
                open: true,
                autoHideDuration: 10_000
            });
            handleClose();
        }
    }, [ingredients.isError, handleClose, ingredients.error, setSnack, t]);

    const options = ingredients.data ? ingredients.data.map(i => ({
        id: i.id,
        name: i.name
    } as IngredientOption)) : []


    const {register, handleSubmit, trigger, formState: {errors}} = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: ingredientToUpdate
    });

    const [measureInputsDisabled, setMeasureInputsDisabled] = useState<boolean>(ingredientToUpdate ? !ingredientToUpdate.hasAmount : false);

    const [ingredient, setIngredient] = useState<IngredientOption | null>(ingredientToUpdate ? {
        id: ingredientToUpdate.id,
        name: ingredientToUpdate.name
    } as IngredientOption : null);
    const filter = createFilterOptions<IngredientOption>();

    const onSubmit: SubmitHandler<FormData> = data => {
        if (ingredient === null || ingredient.id === undefined) {
            return;
        }
        if (data.hasAmount) {
            onSave({...data, id: ingredient.id, name: ingredient.name});
        } else {
            onSave({hasAmount: data.hasAmount, id: ingredient.id, name: ingredient.name});
        }
        handleClose();
    };

    const items = useUnitItems().map(u =>
        <MenuItem key={u.key} value={u.key}>
            {u.label}
        </MenuItem>);
    return (
        <ConfirmDialog
            title={isEditing ? t('addToProductDialog.editTitle') : t('addToProductDialog.addTitle')}
            description={ingredients.isLoading ?
                <Skeleton className='h-56' variant="rectangular"/>
                : (
                    <form className='mt-4 space-y-3' id="add-ingredient-form" onSubmit={handleSubmit(onSubmit)}>
                        <h3 className='text-lg'>{t('addToProductDialog.content.pickIngredient')}</h3>
                        <Autocomplete
                            value={ingredient}
                            onChange={async (event, newValue) => {
                                if (typeof newValue === 'string') {
                                    setIngredient({
                                        name: newValue,
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    const newIngredient = await CreateIngredient.mutateAsync({name: (newValue as IngredientOption).inputValue!});
                                    setIngredient(newIngredient)
                                } else {
                                    setIngredient(newValue);
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                const {inputValue} = params;
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
                            options={options}
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
                                           label={t('fields.ingredient')}/>
                            )}
                        />
                        <div>
                            <div className='mt-8'>
                                <FormControlLabel label={t('fields.hasAmount')}
                                                  control={
                                                      <Checkbox {...register('hasAmount')}
                                                                defaultChecked={ingredientToUpdate ? ingredientToUpdate.hasAmount : false}
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
                                                   field={t('fields.amount') as string}
                                               />
                                           }
                                           label={t('fields.amount')}
                                           type='number'
                                />
                            </div>
                            <div className='mt-4'>
                                <TextField
                                    //defaultValue={Units.Item}
                                    inputProps={{
                                        defaultValue: ingredientToUpdate?.unit != null ? ingredientToUpdate?.unit : "",
                                        ...register('unit'),
                                    }}
                                    disabled={measureInputsDisabled}
                                    fullWidth
                                    label={t('fields.unit')}
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
                    <Skeleton variant="rectangular" className='h-10 w-20'/>
                    :
                    <Button
                        type='submit'
                        form='add-ingredient-form'
                        color='primary'
                        variant='contained'
                    >
                        {t('addToProductDialog.actions.add')}
                    </Button>
            }
        />
    )
}

export default AddIngredientModal
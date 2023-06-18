import { AppBar, Autocomplete, Box, Button, ButtonBase, Checkbox, Dialog, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SvgIcon, TextField, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { SnackbarContext } from 'providers/Snackbar.provider';
import { useTranslation } from 'react-i18next';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService } from 'services/products/products.service';
import { ErrorCodes } from 'enums/ErrorCodes';
import { IStandardError } from 'interfaces/responseError.interface';
import { ProductCategory, GetProductIngredient, ProductWithDetails, PostProductIngredient, PostProduct, PutProduct } from 'interfaces/product.interface';
import { Visibility } from 'enums/Visibility';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FileUpload } from 'components/ui/fileUpload/FileUpload';
import { ErrorMessage } from 'components/ui/text/ErrorMessage';
import MaterialReactTable, { MRT_ColumnDef, MaterialReactTableProps } from 'material-react-table';
import { useMaterialReactTableLocalization } from 'hooks/useMaterialReactTableLocalization';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { LoadingButton } from '@mui/lab';
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog';
import AddIngredientModal from 'components/ui/add-ingredient/AddIngredientModal';
import useUnitItems from 'components/ui/add-ingredient/UnitsItems';
import { Delete, Edit } from '@mui/icons-material';
import { Units } from 'enums/Units';
import { yupLocale } from 'utils/yupLocale';
import ErrorPage from "../error/ErrorPage";

yup.setLocale(yupLocale);

interface FormProductType extends Omit<ProductWithDetails, "id"> {
  id: string | null,
}

const defaultProduct: FormProductType = {
  id: null,
  name: '',
  description: '',
  price: null,
  amountInStock: null,
  visibility: Visibility.Hidden,
  primaryImage: null,
  recommendedTemperature: null,
  recommendedHumidity: null,
  ingredients: [],
  productCategory: null,
  preparationTime: null
};

type SchemaType = Omit<FormProductType, "primaryImage" | "id" | "ingredients">
const schema = yup.object().shape({
  name: yup.string()
    .required()
    .max(50),
  description: yup.string().nullable()
    .max(2000),
  price: yup.number()
    .required()
    .min(0)
    .transform((value) => (isNaN(value) ? null : value))
    .nullable(),
  amountInStock: yup.number()
    .required()
    .min(0)
    .transform((value) => (isNaN(value) ? null : value))
    .nullable(),
  visibility: yup.mixed<Visibility>()
    .required()
    .oneOf(Object.values(Visibility) as Visibility[]),

  recommendedTemperature: yup.number()
    .required()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(-20)
    .max(100),
  recommendedHumidity: yup.number()
    .required()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(0)
    .max(100),
  preparationTime: yup.number()
    .integer()
    .required()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(1)
    .max(600),

},).required();

type FormData = yup.InferType<typeof schema>;

const Product: FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(true);
  const { t } = useTranslation(['product', 'common\\errors']);

  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
    navigate('/products')
  };

  const { productId } = useParams();
  const isEditing: boolean = productId !== undefined;

  const [product, setProduct] = useState<FormProductType>(defaultProduct);

  const categories = useQuery<ReadonlyArray<ProductCategory>>(['getProductCategories'], () => {
    return ProductService.getProductCategories();
  }, {
    cacheTime: 60 * 60 * 1000,
    staleTime: 10 * 60 * 1000
  });

  const { isLoading, error, isSuccess, data} = useQuery<ProductWithDetails>(['getProductWithDetails', productId], () => {
    return ProductService.getProductWithDetails(productId!);
  }, {
    enabled: isEditing,
    retry: (failureCount, error) => {
      return (error as IStandardError).statusCode == 404 ? false : (failureCount < 4)
    },
  });

  const { setSnack } = useContext(SnackbarContext);
  useEffect(() => {
    if (isEditing && !isSuccess && !isLoading) {
      setSnack({ message: t(`common\\errors:${ErrorCodes[(error as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 20_000 })
    }
  }, [isEditing, isSuccess, error, setSnack, t, isLoading]);

  const { reset, register, trigger, getValues, formState: { errors, isValid }, handleSubmit } = useForm<SchemaType>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: useMemo(() => {
      return product;
    }, [product])
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setProduct(data);
      setImage(data.primaryImage !== null ? {url: data.primaryImage} : null)
      setProductIngredients(data.ingredients);
      setCategory(data.productCategory !== null ? categories.data?.find(c => c.id === data.productCategory)! : null);
      reset(data);
    }
  }, [data]);

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [image, setImage] = useState<{ object?: File, url: string } | null>(data?.primaryImage ? { url: data?.primaryImage } : null);
  const clearImage = () => {
    setImage(null);
  }


  const [productIngredients, setProductIngredients] = useState<Array<GetProductIngredient>>(product.ingredients);

  const createProduct = useMutation(['createProduct'], (product: PostProduct) => {
    return ProductService.createProduct(product);
  }, {
    onSuccess() {
      if (image?.object) {
        URL.revokeObjectURL(image.url);
      }
      queryClient.invalidateQueries({ queryKey: ['getCompanyProducts'] })
      handleClose();
    },
    onError(postError) {
      setSnack({ message: t(`${ErrorCodes[(postError as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 10_000 });
    }
  });
  const updateProduct = useMutation(['updateProduct'], (product: PutProduct) => {
    return ProductService.updateProduct(productId!, product);
  }, {
    onSuccess() { 
      if (image?.object) {
        URL.revokeObjectURL(image.url);
      }
      queryClient.invalidateQueries({ queryKey: ['getCompanyProducts'] })
      handleClose();
    },
    onError(postError) {
      setSnack({ message: t(`${ErrorCodes[(postError as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 10_000 });
    }
  });

  const onSubmit: SubmitHandler<SchemaType> = data => {
    if (isEditing) {
      const putProduct = {
        ...data,
        description: data.description === null ? "" : data.description,
        primaryImage: image?.url === product.primaryImage || image === null ? null : image.object,
        changeImage: image?.url !== product.primaryImage,
        ingredients: productIngredients.map<PostProductIngredient>((i) => {
          return {
            id: i.id,
            hasAmount: i.hasAmount,
            unit: i.unit ? i.unit : null,
            amount: i.amount ? i.amount : null
          }
        }),
        productCategoryId: category !== null ? category.id : null
      } as PutProduct;
      updateProduct.mutate(putProduct)
    } else {
      const postProduct = {
        ...data,
        description: data.description === null ? "" : data.description,
        primaryImage: image === null ? null : image.object,
        ingredients: productIngredients.map<PostProductIngredient>((i) => {
          return {
            id: i.id,
            hasAmount: i.hasAmount,
            unit: i.unit ? i.unit : null,
            amount: i.amount ? i.amount : null
          }
        }),
        productCategoryId: category !== null ? category.id : null
      } as PostProduct;

      createProduct.mutate(postProduct)
    }
  }

  const handleAddIngredient = (newIngredient: GetProductIngredient) => {
    setProductIngredients((prev) => [newIngredient, ...prev])
  }

  const handleDeleteIngredient = (id: string) => {
    setProductIngredients((prev) => prev.filter(function (ing) {
      return ing.id !== id;
    }))
  }
  const handleUpdateIngredients = (ingredients: GetProductIngredient[]) => {
    setProductIngredients(ingredients);
  }

  const { palette } = useTheme();
  const SectionDivider: FC = () => <Divider className='border-b-4' variant='fullWidth' />;
  const SectionTitle: FC<{ title: string }> = ({ title }) => <span className='font-bold'>{title}</span>;

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState<boolean>(false);
  const handleLeaveDialogClose = () => {
    setIsLeaveDialogOpen(false)
  };
  const handleLeaveDialogOpen = () => {
    setIsLeaveDialogOpen(true)
  };

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const handleSaveDialogClose = () => {
    setIsSaveDialogOpen(false);
  };
  const handleSaveDialogOpen = () => {
    if (!isValid) {
      trigger();
      return;
    }
    setIsSaveDialogOpen(true);
  };
  const handleSaveDialogSave = () => {
    handleSubmit(onSubmit)();
  };

  console.log(isEditing && isSuccess)
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
    >
      <AppBar className='fixed' color='default' sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleLeaveDialogOpen}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <div className='flex-grow text-center text-lg font-bold'>{isEditing ? t('topbar.title.edit') : t('topbar.title.create')}</div>
          <Button onClick={handleSaveDialogOpen} className='text-white font-bold' variant='contained'>
            {t('topbar.save')}
          </Button>
        </Toolbar>
      </AppBar>
      {((isEditing && !isLoading) || !isEditing) &&
          (((isEditing && isSuccess) || !isEditing) ? <div className='max-w-3xl mx-auto w-full mt-10'>
          <section className='flex flex-col space-y-5 mb-10 mt-10'>
            <SectionTitle title={t('details.title')} />
            <div className='flex flex-row  space-x-5'>
              <div className='flex flex-col space-y-5 w-full'>
                <TextField {...register('name')}
                  label={t('details.fields.name.label')}
                  error={!!errors.name}
                  helperText={
                    <ErrorMessage
                      error={errors.name?.message}
                      field={t('details.fields.name.label') as string}
                    />
                  }
                  required />
                <Autocomplete
                  value={category}
                  onChange={(event: any, newValue: ProductCategory | null) => {
                    console.log(newValue)
                    setCategory(newValue);
                  }}
                  getOptionLabel={option => option.name}
                  options={categories.data ?? []}
                  renderInput={(params) =>
                    <TextField {...params}
                      label={t('details.fields.category.label')}
                      error={!!errors.productCategory}
                      helperText={errors.productCategory?.message}
                    />
                  }
                />
              </div>
              <div className={`flex flex-col w-[192px] justify-between rounded-lg border border-solid border-gray-900/25 ${image == null ?? "bg-gray-900/25"}`}>
                {image != null &&
                  <>
                    <img className='max-h-[90px] w-[190px] rounded-t-lg object-cover' src={image.url} alt='' />
                    <Button className={`min-h-6 self-end h-full rounded-b-lg font-bold`}
                      onClick={clearImage}
                      variant='text'
                      fullWidth
                    >
                      {t('details.fields.image.remove')}
                    </Button>
                  </>}
              </div>
            </div>
            <TextField {...register('description')}
              label={t('details.fields.description.label')}
              error={!!errors.description}
              helperText={
                <ErrorMessage
                  error={errors.description?.message}
                  field={t('details.fields.description.label') as string}
                />
              }
              placeholder={t("details.fields.description.placeholder") as string}
              multiline
            />
            <div>
              <label className="block text-sm font-medium leading-6">{t('details.fields.image.label')}</label>
              <FileUpload setImage={setImage} accept='image/*' />
            </div>
            <TextField {...register('price')}
              label={t('details.fields.price.label')}
              type='number'
              error={!!errors.price}
              helperText={
                <ErrorMessage
                  error={errors.price?.message}
                  field={t('details.fields.price.label') as string}
                />
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">$</InputAdornment>
              }}
            />
            <TextField {...register('preparationTime')}
              error={!!errors.preparationTime}
              helperText={
                <ErrorMessage
                  error={errors.preparationTime?.message}
                  field={t('details.fields.preparationTime.label') as string}
                />
              }
              label={t('details.fields.preparationTime.label')}
              type='number'
            />
            <SectionDivider />
          </section>
          <section className='flex flex-col space-y-5 mb-10'>
            <SectionTitle title={t('ingredients.title')} />
            <IngredientsTable handleUpdateIngredients={handleUpdateIngredients} handleDeleteIngredient={handleDeleteIngredient} addIngredient={handleAddIngredient} data={productIngredients ?? []} />
            <SectionDivider />
          </section>
          <section className='flex flex-col space-y-5 mb-10'>
            <SectionTitle title={t('settings.title')} />
            <TextField {...register('amountInStock')}
              error={!!errors.amountInStock}
              helperText={
                <ErrorMessage
                  error={errors.amountInStock?.message}
                  field={t('settings.fields.stock.label') as string}
                />
              }
              label={t('settings.fields.stock.label')}
              type='number'
            />
            <TextField
              defaultValue={defaultProduct.visibility}
              inputProps={{
                ...register('visibility'),
              }}
              error={!!errors.visibility}
              helperText={
                <ErrorMessage
                  error={errors.visibility?.message}
                  field={t('settings.fields.visibility.label') as string}
                />
              }
              label={t('settings.fields.visibility.label')}
              select
            >
              <MenuItem key={Visibility.Hidden} value={Visibility.Hidden}>
                {t('visibility.hidden')}
              </MenuItem>
              <MenuItem key={Visibility.Unavailable} value={Visibility.Unavailable}>
                {t('visibility.unavailable')}
              </MenuItem>
              <MenuItem key={Visibility.Visible} value={Visibility.Visible}>
                {t('visibility.visible')}
              </MenuItem>
            </TextField>
            <SectionDivider />
          </section>
          <section className='flex flex-col space-y-5 mb-10'>
            <SectionTitle title={t('storageFeatures.title')} />
            <TextField {...register('recommendedTemperature')}
              error={!!errors.recommendedTemperature}
              helperText={
                <ErrorMessage
                  error={errors.recommendedTemperature?.message}
                  field={t('storageFeatures.fields.temperature.label') as string}
                />
              }
              label={t('storageFeatures.fields.temperature.label')}
              type='number'
            />
            <TextField {...register('recommendedHumidity')}
              //InputLabelProps={{ shrink: getValues('recommendedHumidity') !== null}}  
              error={!!errors.recommendedHumidity}
              helperText={
                <ErrorMessage
                  error={errors.recommendedHumidity?.message}
                  field={t('storageFeatures.fields.humidity.label') as string}
                />
              }
              label={t('storageFeatures.fields.humidity.label')}
              type='number'
            />
            <SectionDivider />
          </section>
        </div> : <div className="mx-auto mt-20">
            <ErrorPage/>
          </div>)
      }
      <ConfirmDialog
        title={isEditing ? t('leaveDialog.title.edit') : t('leaveDialog.title.create')}
        description={isEditing ? t('leaveDialog.description.edit') : t('leaveDialog.description.create')}
        isOpen={isLeaveDialogOpen}
        handleClose={handleLeaveDialogClose}
        actions={
          <>
            <Button className='mr-4 py-3 px-5 text-base'
              onClick={handleClose}
              color='primary'
              variant='outlined'
            >
              {t('leaveDialog.actions.discard')}
            </Button>
            <Button className='py-3 px-5 text-base '
              onClick={handleLeaveDialogClose}
              color='primary'
              variant='contained'
            >
              {t('leaveDialog.actions.stay')}
            </Button>
          </>
        }
      />
      <ConfirmDialog
        title={isEditing ? t('saveDialog.title.edit') : t('saveDialog.title.create')}
        description={isEditing ? t('saveDialog.description.edit') : t('saveDialog.description.create')}
        isOpen={isSaveDialogOpen}
        handleClose={handleSaveDialogClose}
        actions={
          <>
            <Button className='mr-4 py-3 px-5 text-base'
              disabled={createProduct.isLoading || updateProduct.isLoading}
              onClick={handleSaveDialogClose}
              color='primary'
              variant='outlined'
            >
              {t('saveDialog.actions.cancel')}
            </Button>
            <LoadingButton className='py-3 px-5 text-base '
              loading={createProduct.isLoading || updateProduct.isLoading}
              disabled={createProduct.isLoading || updateProduct.isLoading}
              onClick={handleSaveDialogSave}
              color='primary'
              variant='contained'
            >
              {isEditing ? t('saveDialog.actions.accept.save') : t('saveDialog.actions.accept.create')}
            </LoadingButton>
          </>
        }
      />
    </Dialog>

  )
}

const IngredientsTable: FC<{
  data: GetProductIngredient[],
  handleDeleteIngredient: (id: string) => void,
  handleUpdateIngredients: (ingredients: GetProductIngredient[]) => void
  addIngredient: (newIngredient: GetProductIngredient) => void
}> = ({
  data, addIngredient, handleDeleteIngredient, handleUpdateIngredients }) => {
    const items = useUnitItems()
    const { t } = useTranslation(['product', 'ingredients', 'common\\form']);

    const columns = useMemo<MRT_ColumnDef<GetProductIngredient>[]>(
      () => [
        {
          accessorKey: 'id',
          header: 'Id',
        },
        {
          accessorKey: 'name',
          header: t('ingredients.headers.name'),
          maxSize: 100,
        },
        {
          accessorKey: 'hasAmount',
          header: t('ingredients.headers.hasAmount'),
          maxSize: 20,
          Cell: ({ cell }) => (
            <Checkbox checked={cell.getValue<boolean>()} />
          ),
          muiTableBodyCellEditTextFieldProps: {
            required: true,
            type: 'checkbox',
            variant: 'outlined',
          },
        },
        {
          accessorKey: 'amount',
          maxSize: 40,
          header: t('ingredients.headers.amount'),
          Cell: ({ cell }) => (
            cell.getValue<number>() ? <span >{cell.getValue<number>()}</span> : <span >&#8212;</span>
          ),
          enableEditing: row => row.getValue<boolean>('hasAmount')
        },
        {
          accessorKey: 'unit',
          header: t('ingredients.headers.unit'),
          editVariant: 'select',
          editSelectOptions: items.map(i => ({ value: i.key, text: i.label })),
          Cell: ({ cell }) => (
            cell.getValue<number>() ? <span >{t(`ingredients:units.${Units[cell.getValue<number>()]}`)}</span> : <span >&#8212;</span>
          ),
          enableEditing: row => row.getValue<boolean>('hasAmount')
        },
      ],
      [items],
    );

    const lang = useMaterialReactTableLocalization();

    type AddModalProps = {
      isOpen: boolean,
    }
    const [addModalProps, setAddModalProps] = useState<AddModalProps>({ isOpen: false });
    const handleAddDialogClose = () => {
      setAddModalProps({ isOpen: false })
    };
    const handleAddDialogOpen = () => {
      setAddModalProps({ isOpen: true });
    };

    const handleSaveRow: MaterialReactTableProps<GetProductIngredient>['onEditingRowSave'] =
      async ({ exitEditingMode, row, values }) => {
        data[row.index] = values;

        handleUpdateIngredients([...data]);
        exitEditingMode();
      };

    return (
      <MaterialReactTable columns={columns} data={data}
        initialState={{ columnVisibility: { id: false } }}
        enableRowActions
        positionActionsColumn="last"
        localization={lang}
        // editingMode="table"
        // enableEditing
        // onEditingRowSave={handleSaveRow}
        renderTopToolbarCustomActions={() => {
          return <div>
            <Tooltip arrow title="Add New Ingredient">
              <IconButton onClick={handleAddDialogOpen}>
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
            {addModalProps.isOpen ? <AddIngredientModal
              addIngredient={addIngredient}
              isOpen={true}
              handleClose={handleAddDialogClose} /> : null}
          </div>;
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            {/* <Tooltip arrow placement="left" title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <Edit />
            </IconButton>
          </Tooltip> */}
            <Tooltip arrow placement="right" title={t("common\\form:buttons.delete")}>
              <IconButton color="error" onClick={() => handleDeleteIngredient(row.getValue('id'))}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    )
  }
export default Product
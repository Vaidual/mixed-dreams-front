import { AppBar, Autocomplete, Box, Button, ButtonBase, Dialog, Divider, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SvgIcon, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import { FC, ReactNode, forwardRef, useContext, useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { SnackbarContext } from 'providers/Snackbar.provider';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
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
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';

interface FormProductType extends Omit<ProductWithDetails, "id"> {
  id: string | null,
};

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
  productCategory: null
};

type SchemaType = Omit<FormProductType, "primaryImage" | "id" | "ingredients">
const schema = yup.object().shape({
  name: yup.string()
    .required()
    .max(50),
  description: yup.string()
    .max(50),
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
    .oneOf(Object.values(Visibility) as Visibility[])
    .required(),
  recommendedTemperature: yup.number()
    .required()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(-89.2)
    .max(500),
  recommendedHumidity: yup.number()
    .required()
    .transform((value) => (isNaN(value) ? null : value))
    .nullable()
    .min(0)
    .max(100),

},).required();

type FormData = yup.InferType<typeof schema>;

const Product: FC = () => {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation(['products', 'common\\errors']);

  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
    navigate('/products')
  };

  const { productId } = useParams();
  const isEditing: boolean = productId !== undefined;

  const [product, setProduct] = useState<FormProductType>(defaultProduct);

  const { isLoading, error, isSuccess, data } = useQuery<ProductWithDetails>(['getProductWithDetails', productId], () => {
    return ProductService.getProductWithDetails(productId!);
  }, {
    enabled: isEditing
  });

  const categories = useQuery<ReadonlyArray<ProductCategory>>(['getProductCategories'], () => {
    return ProductService.getProductCategories();
  });

  useEffect(() => {
    if (data) {
      setProduct(data)
    }
  }, [data]);

  const { setSnack } = useContext(SnackbarContext);
  useEffect(() => {
    if (isEditing && !isSuccess && !isLoading) {
      setSnack({ message: t(`common\\errors:${ErrorCodes[(error as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 20_000 })
    }
  }, [isEditing, isSuccess, error, setSnack, t, isLoading]);

  const { register, getValues, control, formState: { errors }, handleSubmit } = useForm<SchemaType>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: product
  });

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [image, setImage] = useState<{ object?: File, url: string } | null>(data?.primaryImage ? { url: data?.primaryImage } : null);
  const clearImage = () => {
    setImage(null);
  }

  const onSubmit: SubmitHandler<SchemaType> = data => {
    if (isEditing) {
      console.log({ ...data, 
        primaryImage: image?.url === product.primaryImage || image === null ? null : image.object, 
        changeImage: image?.url !== product.primaryImage,
        ingredients: product.ingredients.map<PostProductIngredient>((i) => { return { 
          id: i.id, 
          hasAmount: i.hasAmount, 
          unit: i.unit, 
          amount: i.amount } 
        }),
        productCategory: category?.id ?? null
      } as PutProduct);
    } else {
      console.log({ ...data, 
        primaryImage: image === null ? null : image.object, 
        ingredients: product.ingredients.map<PostProductIngredient>((i) => { return { 
          id: i.id, 
          hasAmount: i.hasAmount, 
          unit: i.unit, 
          amount: i.amount } 
        }),
        productCategory: category?.id ?? null
      } as PostProduct);
      if (image?.object) {
        URL.revokeObjectURL(image.url);
      }
    }

  }

  const { palette } = useTheme();
  const SectionDivider: FC = () => <Divider className='border-b-4' variant='fullWidth' />;
  const SectionTitle: FC<{ title: string }> = ({ title }) => <span className='font-bold'>{title}</span>;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
    >
      <AppBar color='default' sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <div className='flex-grow text-center text-lg font-bold'>{isEditing ? 'Update item' : 'Create item'}</div>
          <Button onClick={handleSubmit(onSubmit)} className='text-white font-bold' variant='contained'>
            {'Save'}
          </Button>
        </Toolbar>
      </AppBar>
      <div className='max-w-2xl mx-auto w-full mt-10'>
        <section className='flex flex-col space-y-5 mb-10'>
          <SectionTitle title={'Details'} />
          <div className='flex flex-row  space-x-5'>
            <div className='flex flex-col space-y-5 w-full'>
              <TextField {...register('name')}
                label='Name'
                error={!!errors.name}
                helperText={
                  <ErrorMessage
                    error={errors.name?.message}
                    field={t("common\form:fields.email") as string}
                  />
                }
                required />
              <Autocomplete
                value={category}
                onChange={(event: any, newValue: ProductCategory | null) => {
                  setCategory(newValue);
                }}
                getOptionLabel={option => option.name}
                options={categories.data ?? []}
                renderInput={(params) =>
                  <TextField {...params}
                    label="Category"
                    error={!!errors.productCategory}
                    helperText={errors.productCategory?.message}
                  />
                }
              />
              {/* <Autocomplete {...register('productCategory')}
                onChange={(e) => {
                  console.log(e)
                }}
                getOptionLabel={option => option.name}
                options={categories.data ?? []}
                renderInput={(params) =>
                  <TextField {...params}
                    label="Category"
                    error={!!errors.productCategory}
                    helperText={errors.productCategory?.message}
                  />
                }
              /> */}
            </div>
            <div className='flex flex-col w-[192px] justify-between rounded-lg border border-solid border-gray-900/25 bg-gray-900/25'>
              {image != null &&
                <>
                  <img className='max-h-[90px] w-[192px] rounded-t-lg' src={image.url} alt='' />
                  <Button sx={{ backgroundColor: palette.grey[800] }} className={`min-h-6 self-end h-full rounded-b-lg bg-[${palette.background.default}]`}
                    onClick={clearImage}
                    variant='text'
                    fullWidth
                  >
                    {'Remove'}
                  </Button>
                </>}
            </div>
          </div>
          <TextField {...register('description')}
            label="Description"
            error={!!errors.description}
            helperText={
              <ErrorMessage
                error={errors.description?.message}
                field={t("common\form:fields.email") as string}
              />
            }
            placeholder="Add an item description. Describe details like features, options, or interesting notes"
            multiline
          />
          <div>
            <label className="block text-sm font-medium leading-6">Cover photo</label>
            <FileUpload setImage={setImage} accept='image/*' />
          </div>
          <TextField {...register('price')}
            label='Price'
            type='number'
            error={!!errors.price}
            helperText={
              <ErrorMessage
                error={errors.price?.message}
                field={t("common\form:fields.email") as string}
              />
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>
            }}
          />
          <SectionDivider />
        </section>
        <section className='flex flex-col space-y-5 mb-10'>
          <SectionTitle title={'Ingredients'} />
          <IngredientsTable data={product.ingredients ?? []} />
          <SectionDivider />
        </section>
        <section className='flex flex-col space-y-5 mb-10'>
          <SectionTitle title={'Settings'} />
          <TextField {...register('amountInStock')}
            error={!!errors.amountInStock}
            helperText={
              <ErrorMessage
                error={errors.amountInStock?.message}
                field={t("common\form:fields.email") as string}
              />
            }
            label='Stock'
            type='number'
          />
          <TextField {...register('visibility')}
            value={getValues('visibility')}
            error={!!errors.visibility}
            helperText={
              <ErrorMessage
                error={errors.visibility?.message}
                field={t("common\form:fields.email") as string}
              />
            }
            label='Visibility'
            select
          >
            <MenuItem key={Visibility.Hidden} value={Visibility.Hidden}>
              {'Hidden'}
            </MenuItem>
            <MenuItem key={Visibility.Unavaiable} value={Visibility.Unavaiable}>
              {'Unavaiable'}
            </MenuItem>
            <MenuItem key={Visibility.Visible} value={Visibility.Visible}>
              {'Visible'}
            </MenuItem>
          </TextField>
          <SectionDivider />
        </section>
        <section className='flex flex-col space-y-5 mb-10'>
          <SectionTitle title={'Storage Features'} />
          <TextField {...register('recommendedTemperature')}
            error={!!errors.recommendedTemperature}
            helperText={
              <ErrorMessage
                error={errors.recommendedTemperature?.message}
                field={t("common\form:fields.email") as string}
              />
            }
            label='Recommended temperature'
            type='number'
          />
          <TextField {...register('recommendedHumidity')}
            error={!!errors.recommendedHumidity}
            helperText={
              <ErrorMessage
                error={errors.recommendedHumidity?.message}
                field={t("common\form:fields.email") as string}
              />
            }
            label='Recommended humidity'
            type='number'
          />
          <SectionDivider />
        </section>
      </div>
    </Dialog>

  )
}

const IngredientsTable: FC<{ data: GetProductIngredient[] }> = ({ data }) => {
  const columns = useMemo<MRT_ColumnDef<GetProductIngredient>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
      },
      {
        accessorKey: 'hasAmount',
        header: 'Has amount',
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
      },
      {
        accessorKey: 'unit',
        header: 'Unit',
      },
    ],
    [],
  );

  return (
    <MaterialReactTable columns={columns} data={data}
      initialState={{ columnVisibility: { id: false } }} //hide firstName column by default
      enableRowActions
      positionActionsColumn="last"
    />
  )
}
export default Product
import { AppBar, Box, Button, ButtonBase, Dialog, Divider, IconButton, Select, SvgIcon, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import { FC, useContext, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { SnackbarContext } from 'providers/Snackbar.provider';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from 'services/products/products.service';
import { ErrorCodes } from 'enums/ErrorCodes';
import { IStandardError } from 'interfaces/responseError.interface';
import { ProductIngredient, ProductWithDetails } from 'interfaces/product.interface';
import { Visibility } from 'enums/Visibility';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FileUpload } from 'components/ui/fileUpload/FileUpload';

interface FormProductType extends Omit<ProductWithDetails, "id"> {
  id: string | null,
};

const defaultProduct: FormProductType = {
  id: null,
  name: '',
  description: '',
  price: null,
  amountInStock: 0,
  visibility: Visibility.Hidden,
  primaryImage: null,
  recommendedTemperature: null,
  recommendedHumidity: null,
  ingredients: [],
  productCategory: null
};

const schema = yup.object().shape({
  name: yup.string()
    .required()
    .max(50),
  description: yup.string()
    .max(50),
  price: yup.number().nullable(),
  amountInStock: yup.number().nullable(),
  visibility: yup.mixed<Visibility>()
    .oneOf(Object.values(Visibility) as Visibility[])
    .required(),
  recommendedTemperature: yup.number().nullable(),
  recommendedHumidity: yup.number().nullable(),
  ingredients: yup.array<ProductIngredient>().nullable(),
  productCategory: yup.string().nullable(),
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

  const [product, setProduct] = useState<FormProductType>();

  const { isLoading, error, isSuccess, data } = useQuery<ProductWithDetails>(['getProductWithDetails', productId], () => {
    return ProductService.getProductWithDetails(productId!);
  }, {
    enabled: !!productId
  });

  useEffect(() => {
    if (!productId) {
      setProduct(defaultProduct)
    }
  }, [productId]);

  useEffect(() => {
    if (data) {
      setProduct(data)
    }
  }, [data]);

  const { setSnack } = useContext(SnackbarContext);
  useEffect(() => {
    if (!!productId && !isSuccess && !isLoading) {
      setSnack({ message: t(`common\\errors:${ErrorCodes[(error as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 20_000 })
    }
  }, [productId, isSuccess, error, setSnack, t, isLoading]);

  const { register } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: product
  });

  const [image, setImage] = useState<string | null>(data?.primaryImage ?? null);
  const clearImage = () => {
    setImage(null);
  }

  const {palette} = useTheme();

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
          <Box sx={{ flexGrow: 1 }} >{!!productId ? 'Update item' : 'Create item'}</Box>
          <Button sx={{ color: 'white' }}
            variant='contained'
          >
            {'Save'}
          </Button>
        </Toolbar>
      </AppBar>
      <div className='max-w-2xl mx-auto w-full mt-10'>
        <div className='flex flex-col space-y-5'>
          <span className='font-bold'>Details</span>
          <div className='flex flex-row  space-x-5'>
            <div className='flex flex-col space-y-5 w-full'>
              <TextField {...register('name')}
                label='Name'
                required />
              
              <Select
              placeholder='sjiqshu'
                  value={'product?.productCategory'}
                  label="Category"
                  //onChange={handleChange}
                >
                  {/* <MenuItem value={10}>Ten</MenuItem> */}
                </Select>
            </div>
            <div className='flex flex-col w-[192px] justify-between rounded-lg border border-solid border-gray-900/25 bg-gray-900/25'>
              {image != null && 
              <>
                <img className='max-h-[90px] w-[192px] rounded-t-lg' src={image} alt=''/>
                <Button sx={{backgroundColor: palette.grey[800]}} className={`min-h-6 self-end h-full rounded-b-lg bg-[${palette.background.default}]`}
                  onClick={clearImage} 
                  variant='text' 
                  fullWidth
                >
                  {'Remove'}
                </Button>
              </>}
            </div>
          </div>
          <TextField
            {...register('name')}
            label="Description"
            placeholder="Add an item description. Describe details like features, options, or interesting notes"
            multiline
          />
          <div>
            <label className="block text-sm font-medium leading-6">Cover photo</label>
            <FileUpload setImage={setImage} accept='image/*'/>
          </div>
          <Divider className='border-b-4' variant='fullWidth' />
        </div>
      </div>
    </Dialog>


  )
}
export default Product
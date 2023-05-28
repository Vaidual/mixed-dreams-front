import { Box, Button, MenuItem, Skeleton, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CompanyProduct } from 'interfaces/product.interface'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { ProductService } from 'services/products/products.service'
import { Outlet, useNavigate } from 'react-router-dom'
import { ErrorCodes } from 'enums/ErrorCodes'
import { IStandardError } from 'interfaces/responseError.interface'
import { SnackbarContext } from 'providers/Snackbar.provider'
import { useTranslation } from 'react-i18next'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import { LoadingButton } from '@mui/lab'
import { useMaterialReactTableLocalization } from 'hooks/useMaterialReactTableLocalization'

const Products: FC = () => {
  const { t } = useTranslation(['products', 'common\\errors']);
  const queryClient = useQueryClient();

  const { isLoading, data, error, isSuccess } = useQuery<CompanyProduct[]>(['getCompanyProducts'], () => {
    return ProductService.getCompanyProducts();
  });

  const { setSnack } = useContext(SnackbarContext);
  useEffect(() => {
    if (!isSuccess && !isLoading) {
      setSnack({ message: t(`common\\errors:${ErrorCodes[(error as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 20_000 })
    }
  }, [isSuccess, error, setSnack, t, isLoading]);

  const columns = useMemo<MRT_ColumnDef<CompanyProduct>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Product',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        Cell: ({ cell }) => (

          cell.getValue<number>()?.toLocaleString?.('en-US', {
            style: 'currency',
            currency: 'USD',
          })
        ),
      },
      {
        accessorKey: 'amountInStock',
        header: 'Stock',
        Cell: ({ cell }) => (
          <Box
            component="div"
            className='w-1'
            sx={(theme) => ({
              backgroundColor:
                cell.getValue<number>() < 10
                  ? theme.palette.error.main
                  : cell.getValue<number>() >= 10 &&
                    cell.getValue<number>() < 25
                    ? theme.palette.warning.main
                    : theme.palette.success.main,
              minWidth: '2rem',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '0.25rem',
              color: '#fff',
              px: '0.25rem',
            })}
          >
            {cell.getValue<number>()}
          </Box>
        ),
      },
    ],
    [],
  );

  const navigate = useNavigate();
  const handleProductCreate = () => {
    navigate('/products/new');
  };
  const handleProductEdit = (id: string) => {
    navigate('/products/' + id);
  };
  const handleProductDelete = () => {
    deleteProduct.mutate(deleteModelProps.product?.id!);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModelProps({ isOpen: true, product: { id, name } });
  };

  type DeleteModelProps = {
    isOpen: boolean,
    product?: {
      id: string,
      name: string
    }
  }
  const [deleteModelProps, setDeleteModelProps] = useState<DeleteModelProps>({ isOpen: false });
  const handleDeleteDialogClose = () => {
    setDeleteModelProps({ isOpen: false })
  };

  const deleteProduct = useMutation(['deleteProduct'], (id: string) => {
    return ProductService.deleteProduct(id)
  }, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['getCompanyProducts'] })
      handleDeleteDialogClose();
    },
    onError(deletionError,) {
      setSnack({ message: t(`common\\errors:${ErrorCodes[(deletionError as IStandardError)?.errorCode]}`), color: 'error', open: true, autoHideDuration: 10_000 })
    }
  })

  const lang = useMaterialReactTableLocalization();

  return (
    <div className='w-full'>
      <div className='flex flex-row justify-between mt-4'>
        <div>
          wd
        </div>
        <div>
          <Button className='text-white font-bold rounded-md'
            variant='contained'
            onClick={handleProductCreate}
          >Create a Product</Button>
        </div>
      </div>
      <div className='mt-4'>
        <MaterialReactTable columns={columns} data={data ?? []}
          state={{ isLoading: isLoading }}
          initialState={{ columnVisibility: { id: false } }} //hide firstName column by default
          enableRowActions
          positionActionsColumn="last"
          localization={lang}
          renderRowActionMenuItems={({ row }) => [
            <MenuItem key="edit" onClick={() => handleProductEdit(row.getValue('id'))}>
              Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={() => openDeleteModal(row.getValue('id'), row.getValue('name'))}>
              <Typography color='red'>Delete</Typography>
            </MenuItem>,
          ]}
        />
      </div>
      <Outlet />
      <ConfirmDialog
        title='Delete product'
        description={'Are you sure you want to delete the ' + <strong>{deleteModelProps.product?.name}</strong> + ' product? This action cannot be undone.'}
        isOpen={deleteModelProps.isOpen}
        handleClose={handleDeleteDialogClose}
        actions={
          <LoadingButton
            loading={deleteProduct.isLoading}
            disabled={deleteProduct.isLoading}
            onClick={handleProductDelete}
            color='error'
            variant='contained'
          >
            'Delete'
          </LoadingButton>
        }
      />
    </div>
  )
}

export default Products

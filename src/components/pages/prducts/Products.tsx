import { Button, CircularProgress, Dialog, ListItemIcon, MenuItem, Skeleton, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CompanyProduct } from 'interfaces/product.interface'
import MaterialReactTable, { MRT_ColumnDef, MRT_Row } from 'material-react-table'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { ProductService } from 'services/products/products.service'
import Product from '../home/product/Product'
import { Outlet, useNavigate } from 'react-router-dom'
import { ErrorCodes } from 'enums/ErrorCodes'
import { IStandardError } from 'interfaces/responseError.interface'
import { SnackbarContext } from 'providers/Snackbar.provider'
import { useTranslation } from 'react-i18next'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import { LoadingButton } from '@mui/lab'

const Products: FC = () => {
  const { t } = useTranslation(['products', 'common\\errors']);
  const queryClient = useQueryClient()

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
      },
      {
        accessorKey: 'name',
        header: 'Product',
      },
      {
        accessorKey: 'price',
        header: 'Price',
      },
      {
        accessorKey: 'amountInStock',
        header: 'Stock',
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
    setDeleteModelProps({ isOpen: true, product: {id, name} });
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
        {isLoading ?
          <Skeleton variant="rectangular" className='w-full h-96' />
          : <MaterialReactTable columns={columns} data={data ?? []}
            initialState={{ columnVisibility: { id: false } }} //hide firstName column by default
            enableRowActions
            positionActionsColumn="last"
            renderRowActionMenuItems={({ row }) => [
              <MenuItem key="edit" onClick={() => handleProductEdit(row.getValue('id'))}>
                Edit
              </MenuItem>,
              <MenuItem key="delete" onClick={() => openDeleteModal(row.getValue('id'), row.getValue('name'))}>
                <Typography color='red'>Delete</Typography>
              </MenuItem>,
            ]}
          />}
      </div>
      <Outlet />
      <ConfirmDialog
        title='Delete product'
        description={'Are you sure you want to delete the '+ <strong>{deleteModelProps.product?.name}</strong> + ' product? This action cannot be undone.'}
        isOpen={deleteModelProps.isOpen}
        isFetching={false}
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

// const DeleteCollarModal = (props) => {
//   const {t} = useTranslation();

//   const [open, setOpen] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);
//   const handleClickOpen = () => {
//       if (props.selectedCollars.some(c => c.inUse === true)) {
//           props.setAlert({severity: "error", children: t('collars.modals.delete.alerts.inUseError')});
//           return;
//       } else if (props.selectedCollars.length === 0) {
//           props.setAlert({
//               severity: "error",
//               children: t('collars.modals.delete.alerts.zeroSelected')
//           });
//           return;
//       }
//       setOpen(true);
//   };

//   const handleSubmit = () => {
//     const {isLoading, data, isSuccess} = useMutation(['deleteProduct'], () => {
//       return ProductService.deleteProduct()
//     })
//       if (isSuccess) {
//         props.setAlert({
//           severity: "success",
//           children: t('collars.modals.delete.alerts.success')
//         });
//         props.getCollars()
//         setOpen(false);
//       } else {
//         props.setAlert({severity: "error", children: error.message})
//       }
//   }

//   const handleModalClose = () => {
//       setOpen(false);
//   };


//   return (
//       <>
//           <Button onClick={handleClickOpen}
//                   startIcon={<DeleteIcon color={"primary"}/>}>{t('global.table.actions.delete')}</Button>
//           <Dialog open={open} onClose={handleModalClose}>
//               <DialogTitle>{t('collars.modals.delete.title')}</DialogTitle>
//               <DialogContent>
//                   <DialogContentText>
//                       {t('collars.modals.delete.description')}
//                   </DialogContentText>

//               </DialogContent>
//               <DialogActions>
//                   <LoadingButton color={"warning"} loading={isFetching}
//                                  onClick={handleSubmit}>{t('collars.modals.delete.deleteBtn')}</LoadingButton>
//                   <Button color={"inherit"} onClick={handleModalClose}>{t('collars.modals.delete.cancelBtn')}</Button>
//               </DialogActions>
//           </Dialog>
//       </>
//   )

// }

import { Alert, Snackbar } from '@mui/material'
// import { NotificationContext } from 'providers/NotificationContext';
// import { FC, useContext, useState } from 'react'

// const Notification: FC = () => {
//   const [open, setOpen] = useContext(NotificationContext)
//   const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
//   };
  
//   return (
//     <>
//       <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//         <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
//           This is a success message!
//         </Alert>
//       </Snackbar>
//     </>
//   )
// }

// export default Notification
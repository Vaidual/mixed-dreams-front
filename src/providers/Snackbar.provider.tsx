import { Alert, AlertColor, Snackbar } from "@mui/material";
import { ReactNode, createContext, useState } from "react";

interface Snack {
  message: string;
  color?: AlertColor;
  autoHideDuration?: number;
  open: boolean;
}

const DefaultSnack: Snack = {
  message: '',
  color: 'info',
  autoHideDuration: 5000,
  open: false,
}

type SnackDefaultValue = {
  snack: Snack,
  setSnack: React.Dispatch<React.SetStateAction<Snack>>
};

export const SnackbarContext = createContext<SnackDefaultValue>({snack: DefaultSnack, setSnack: () => {}});

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snack, setSnack] = useState(DefaultSnack);
  const [isOpen, setisOpen] = useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack((prev) => ({...prev, open: false}));
  };
  return (
    <SnackbarContext.Provider value={{snack, setSnack}}>
      {children}
      <Snackbar open={snack.open} autoHideDuration={snack.autoHideDuration ?? DefaultSnack.autoHideDuration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snack.color ?? DefaultSnack.color}>
          {snack.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
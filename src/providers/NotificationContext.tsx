import { SnackbarOrigin } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";

const MAX_SNACK = 5;

const AUTO_HIDE_DURATION = 7000;

const POSITION: SnackbarOrigin = {
  vertical: "top",
  horizontal: "right"
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={MAX_SNACK}
      autoHideDuration={AUTO_HIDE_DURATION}
      anchorOrigin={POSITION}
    >
      {children}
    </SnackbarProvider>
  );
}


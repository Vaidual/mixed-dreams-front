import { useTheme } from "@mui/material";
import { toast } from "react-toastify";

export const useToast = () => {
  const theme = useTheme();
  return (message: string) => toast(message, {
    position: "top-right",
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme.palette.mode
    });
}
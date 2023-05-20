import { createTheme } from "@mui/material";
import { zhCN } from '@mui/material/locale';

export const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  zhCN, // use 'de' locale for UI texts (start, next month, ...)
);
import { ThemeOptions, createTheme } from '@mui/material/styles'

export const theme: ThemeOptions = createTheme({
  palette: {
    background: {
      default: '#f0f0f0',
    },
  },
  typography: {
    fontFamily: 'Open Sans, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
          borderRadius: 10,
        },
      },
    },
  },
})

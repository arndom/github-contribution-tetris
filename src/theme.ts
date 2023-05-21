import { Poppins } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

export const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif']
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#005f2c',
      contrastText: '#fff'
    },
    secondary: {
      main: '#27d545',
      contrastText: '#fff'
    },
    error: {
      main: '#eb2945'
    },
    background: {
      default: '#00040B'
    }
  },

  typography: {
    fontFamily: poppins.style.fontFamily,
    allVariants: {
      color: '#fff'
    },
    button: {
      textTransform: 'capitalize'
    }
  },

  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#101217',
          display: 'flex',
          placeItems: 'center',
          gap: '8px',
          padding: '15px 20px'
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.26)'
          }
        }
      }
    }
  }
});

export default theme;

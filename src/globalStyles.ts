// ** MUI Imports
import { Theme } from '@mui/material/styles';

const GlobalStyles = (theme: Theme) => {
  return {
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        backgroundColor: theme.palette.secondary.main
      }
    }
  };
};

export default GlobalStyles;

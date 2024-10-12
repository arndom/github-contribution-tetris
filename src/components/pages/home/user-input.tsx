import { Box, Button, CircularProgress, InputAdornment, styled, TextField, Typography } from '@mui/material';

export const UserInputHolder = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3.25),

  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2)
  }
}));

export const UserInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'inherit',
    borderRadius: '8px',
    fontSize: '1.15rem',

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      boxShadow: '0 0 1.25rem 0.15rem rgba(39, 213, 69, 0.5)',
      borderWidth: '2px'
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'unset',
      borderWidth: '2px',
      boxShadow: '0 0 1.25rem 0.15rem rgba(39, 213, 69, 0.25)'
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px'
    },

    [theme.breakpoints.down('md')]: {
      fontSize: '0.95rem'
    }
  }
}));

export const UserInputDivider = styled(Typography)(({ theme }) => ({
  fontSize: '1.15rem',
  color: '#687473',

  [theme.breakpoints.down('md')]: {
    fontSize: '0.95rem'
  }
}));

export const UserInputEndAdornment = styled(InputAdornment)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

export const LoadingButton = styled(Button)(() => ({
  borderRadius: '8px',
  boxShadow: 'none'
}));

export const Loader = styled(CircularProgress)(() => ({
  color: 'rgba(39, 213, 69, 0.75)',
  filter: 'drop-shadow(0 0 .3rem #ffffff70)'
}));

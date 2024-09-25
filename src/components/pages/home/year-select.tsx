import { styled, Select, SxProps, Theme, SelectProps } from '@mui/material';

const yearMenuStyle: SxProps<Theme> = (theme) => ({
  '& .MuiPaper-root': {
    background: theme.palette.background.default,
    maxHeight: '180px'
  }
});

const YearSelect = styled((props: SelectProps) => (
  <Select
    {...{
      ...props,
      variant: 'standard',
      MenuProps: {
        sx: yearMenuStyle
      }
    }}
  />
))(() => ({
  '& .MuiSelect-select': {
    color: '#fff',
    letterSpacing: '0.045em'
  },

  '& .MuiSvgIcon-root': {
    color: '#fff'
  },

  '&:after, :before': {
    border: 'none'
  },

  '&:hover:not(.Mui-disabled, .Mui-error):before': {
    border: 'none'
  }
}));

export default YearSelect;

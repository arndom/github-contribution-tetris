import { ReactNode } from 'react';

import { styled } from '@mui/material/styles';
import Radio, { RadioProps } from '@mui/material/Radio';

const BpIcon = styled('span')(() => ({
  width: 70,
  height: 70,

  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2
  },

  'input:disabled ~ &': {
    boxShadow: 'none'
  },

  button: {
    height: '100%'
  }
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  borderRadius: 10,
  border: `2px solid ${theme.palette.primary.main}`
}));

interface Props extends RadioProps {
  children: ReactNode;
}

export default function CustomRadio(props: Props) {
  const { children } = props;

  return (
    <Radio
      disableRipple
      color='default'
      checkedIcon={<BpCheckedIcon>{children}</BpCheckedIcon>}
      icon={<BpIcon>{children}</BpIcon>}
      {...props}
    />
  );
}

import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function Footer() {
  return (
    <Box
      my={1}
      sx={{
        height: '20px',
        display: 'flex',
        justifyContent: 'flex-end',

        a: {
          '&::after': {
            content: '"|"',
            opacity: '0.25',
            margin: '0px 8px'
          },

          '&:last-child::after': {
            content: '""'
          }
        }
      }}
    >
      <Typography
        variant='caption'
        component='a'
        href='https://github.com/arndom'
        target='_blank'
        sx={{
          filter: 'grayscale(1)'
        }}
      >
        Contribute ⭐
      </Typography>

      <Typography variant='caption' component='a' href='https://github.com/arndom' target='_blank'>
        Made by arndom
      </Typography>
    </Box>
  );
}

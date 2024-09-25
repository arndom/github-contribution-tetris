import { Typography } from '@mui/material';
import { Fragment } from 'react';

const Header = () => {
  return (
    <Fragment>
      <Typography
        variant='h2'
        component='h1'
        fontWeight={500}
        sx={{
          filter: 'drop-shadow(0 0 .3rem #ffffff70)',
          fontSize: { xs: '1.5rem', md: '3.75rem' }
        }}
      >
        Your GitHub story as Tetris
      </Typography>

      <Typography
        variant='body1'
        mt={{ xs: 1, md: 2.5 }}
        color='grey'
        sx={{
          fontSize: { xs: '0.85rem', md: '1rem' }
        }}
      >
        Enter your GitHub username to
        <br />
        generate tetris from your contribution graph
      </Typography>
    </Fragment>
  );
};

export default Header;

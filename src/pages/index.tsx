import { useState } from 'react';
import { useRouter } from 'next/router';

import {
  TextField,
  Typography,
  Box,
  useTheme,
  Button,
  InputAdornment,
  Select,
  SelectChangeEvent,
  MenuItem,
  CircularProgress
} from '@mui/material';

import axios from 'axios';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();

  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [loading, setLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [user, setUser] = useState('');

  const isUserError = userError.replace(/\s/g, '').length !== 0;

  // current year to year github was founded(2008)
  const years = () => {
    let currentYear = new Date().getFullYear();
    const _years = [currentYear];

    while (currentYear !== 2008) {
      _years.push(--currentYear);
    }

    return _years;
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value);
  };

  const handleSubmit = () => {
    setUserError('');
    setLoading(true);

    axios
      .get(`/api/check?user=${user}`)
      .then((res) => {
        if (res.data) router.push(`/${user}?year=${year}`);
        if (!res.data) setUserError('Sorry, could not find your profile');

        setLoading(false);
      })
      .catch((error) => {
        console.log('failed to fetch');
        console.log(error);
        setUserError('Sorry, an error occured, check console');
        setLoading(false);
      });
  };

  return (
    <>
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

      <Box
        mt={{ xs: 2, md: 3.25 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <TextField
          value={user}
          onChange={(e) => setUser(String(e.target.value).replace(/\s/g, ''))}
          variant='outlined'
          placeholder='username'
          name='gh_username'
          error={isUserError}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'inherit',
              borderRadius: '8px',
              fontSize: { xs: '0.95rem', md: '1.15rem' },

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
              }
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position='end'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography sx={{ fontSize: { xs: '0.95rem', md: '1.15rem' }, color: '#687473' }}>|</Typography>

                <Select
                  variant='standard'
                  label='Year'
                  value={year}
                  onChange={handleYearChange}
                  sx={{
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
                  }}
                  MenuProps={{
                    sx: {
                      '& .MuiPaper-root': {
                        background: theme.palette.background.default,
                        maxHeight: '180px'
                      }
                    }
                  }}
                >
                  {years().map((yr) => (
                    <MenuItem key={yr} value={yr}>
                      {yr}
                    </MenuItem>
                  ))}
                </Select>

                {!loading && (
                  <Button
                    disabled={user.replace(/\s/g, '').length === 0}
                    onClick={handleSubmit}
                    sx={{
                      borderRadius: '8px',
                      boxShadow: 'none'
                    }}
                  >
                    Generate
                  </Button>
                )}

                {loading && (
                  <CircularProgress
                    sx={{
                      color: 'rgba(39, 213, 69, 0.75)',
                      filter: 'drop-shadow(0 0 .3rem #ffffff70)'
                    }}
                  />
                )}
              </InputAdornment>
            )
          }}
        />
      </Box>

      {isUserError && (
        <Typography variant='body2' color='error' mt={2}>
          {userError}
        </Typography>
      )}
    </>
  );
}

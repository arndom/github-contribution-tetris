import { ChangeEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, SelectChangeEvent, MenuItem } from '@mui/material';
import axios from 'axios';
import Header from '../components/pages/home/header';
import YearSelect from '../components/pages/home/year-select';
import {
  Loader,
  LoadingButton,
  UserInput,
  UserInputDivider,
  UserInputEndAdornment,
  UserInputHolder
} from '../components/pages/home/user-input';
import useGitHubYears from '../hooks/use-github-years';

export default function Home() {
  const router = useRouter();

  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [userError, setUserError] = useState('');

  const githubYears = useGitHubYears();
  const isUserError = userError.replace(/\s/g, '').length !== 0;

  const handleYearChange = (e: SelectChangeEvent<unknown>) => {
    const _year = String(e.target.value);
    setYear(_year);
  };

  const handleUserInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser(String(e.target.value).replace(/\s/g, ''));
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

  const hasUserInputted = useMemo(() => {
    const userLength = user.replace(/\s/g, '').length;

    return userLength === 0;
  }, [user]);

  return (
    <>
      <Header />

      <UserInputHolder>
        <UserInput
          value={user}
          onChange={handleUserInputChange}
          variant='outlined'
          placeholder='username'
          name='gh_username'
          error={isUserError}
          InputProps={{
            endAdornment: (
              <UserInputEndAdornment position='end'>
                <UserInputDivider>|</UserInputDivider>

                <YearSelect label='Year' value={year} onChange={handleYearChange}>
                  {githubYears.map((yr) => (
                    <MenuItem key={yr} value={yr}>
                      {yr}
                    </MenuItem>
                  ))}
                </YearSelect>

                {!loading && (
                  <LoadingButton disabled={hasUserInputted} onClick={handleSubmit}>
                    Generate
                  </LoadingButton>
                )}

                {loading && <Loader />}
              </UserInputEndAdornment>
            )
          }}
        />
      </UserInputHolder>

      {isUserError && (
        <Typography variant='body2' color='error' mt={2}>
          {userError}
        </Typography>
      )}
    </>
  );
}

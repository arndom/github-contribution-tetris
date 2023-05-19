import { useEffect, useRef, useState } from 'react';

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
  CircularProgress,
  Slider
} from '@mui/material';

import axios from 'axios';

import {
  DataStruct,
  boxMargin,
  boxWidth,
  canvasMargin,
  drawContributions,
  drawSelectedContributions,
  scaleFactor,
  textHeight,
  yearHeight
} from '../utils/drawContributions';

import { countPieces } from '../utils/generateTetrisPieces';
import Tetris from '../components/Tetris';

const marks = Array.from({ length: 52 })
  .map((a, i) => {
    if (i <= 42) {
      return {
        value: i * (boxWidth + boxMargin) * scaleFactor
      };
    }
  })
  .filter((a) => a !== undefined);

export default function Home() {
  const theme = useTheme();

  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [loading, setLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [data, setData] = useState<DataStruct>();
  const [sliderValue, setSliderValue] = useState(0);

  const [contributionGrid, setContributionGrid] = useState<number[][]>([]);
  const [selectedContributions, setSelectedContributions] = useState<number[][]>([]);
  const [extractedSelectedContributions, setExtractedSelectedContributions] = useState<number[][]>([]);
  const [tetrisPieces, setTetrisPieces] = useState<Record<string, number>>();

  const [preGameMode, setPreGameMode] = useState(false);
  const [preGameLoading, setPreGameLoading] = useState(true);

  const isUserError = userError.replace(/\s/g, '').length !== 0;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedContributionRef = useRef<HTMLCanvasElement>(null);

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

  const handleLoading = () => {
    setLoading(true);

    axios
      .get('/api/test')
      .then((res) => {
        if (res.data) {
          setData(res.data);
          console.log(res.data);
        }

        if (!res.data) setUserError('Sorry, could not find your profile');

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const handleGeneration = () => setPreGameMode(true);

  // draw all contributions
  useEffect(() => {
    if (canvasRef.current && data) {
      drawContributions(
        canvasRef.current,
        {
          data,
          username: 'arndom',
          themeName: 'githubDark',
          skipHeader: true
        },
        setContributionGrid
      );
    }
  }, [data, canvasRef]);

  // handle pre game generation
  useEffect(() => {
    if (contributionGrid.length > 0) {
      const getSelectedContribution = async () => {
        const startPoint = marks.findIndex((i) => i?.value === sliderValue);
        const endPoint = startPoint + 10;
        const selectedContribution = contributionGrid.map((row) => row.slice(startPoint, endPoint));

        return selectedContribution;
      };

      const getTetrisPieces = async (): Promise<(number[][] | Record<string, number>)[]> => {
        const value = await getSelectedContribution();
        const tetrisPieces = countPieces(value);

        return tetrisPieces;
      };

      (async () => {
        setPreGameLoading(true);
        await getSelectedContribution().then((res) => setSelectedContributions(res));
        await getTetrisPieces().then((res) => {
          const [_tetrisPieces, _extractedSelectedContributions] = res;
          setExtractedSelectedContributions(_extractedSelectedContributions as number[][]);
          setTetrisPieces(_tetrisPieces as Record<string, number>);
        });
        setPreGameLoading(false);
      })();
    }
  }, [contributionGrid, sliderValue]);

  // draw selected contribution
  useEffect(() => {
    if (
      !preGameLoading &&
      preGameMode &&
      tetrisPieces &&
      selectedContributions.length > 0 &&
      extractedSelectedContributions.length > 0
    ) {
      selectedContributionRef.current &&
        drawSelectedContributions(selectedContributionRef.current, selectedContributions);

      setTimeout(() => {
        selectedContributionRef.current &&
          drawSelectedContributions(selectedContributionRef.current, extractedSelectedContributions);
      }, 1200);
    }
  }, [selectedContributions, tetrisPieces, preGameMode, extractedSelectedContributions, preGameLoading]);

  if (!data) {
    return (
      <>
        <Typography
          variant='h2'
          component='h1'
          fontWeight={500}
          sx={{
            filter: 'drop-shadow(0 0 .3rem #ffffff70)'
          }}
        >
          Your GitHub story as Tetris
        </Typography>

        <Typography variant='body1' mt={2.5} color='grey'>
          Enter your GitHub username to
          <br />
          generate tetris from your contribution graph
        </Typography>

        <Box
          mt={3.25}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <TextField
            variant='outlined'
            placeholder='username'
            name='gh_username'
            error={isUserError}
            sx={{
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
                  <Typography sx={{ fontSize: '1.15rem', color: '#687473' }}>|</Typography>

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
                      onClick={handleLoading}
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

  if (!preGameLoading && preGameMode && tetrisPieces) {
    return (
      <>
        {/* <canvas ref={selectedContributionRef} />

        <Box mt={1}>
          <Typography>Number of Pieces</Typography>

          {Object.keys(tetrisPieces).map((piece) => (
            <Typography variant='subtitle2' my={0.5} key={piece}>{`Piece ${piece}: ${tetrisPieces[piece]}`}</Typography>
          ))}
        </Box> */}

        <Tetris />
      </>
    );
  }

  return (
    <>
      <Box>
        <canvas ref={canvasRef} />
        <Slider
          size='small'
          value={sliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay='on'
          sx={{
            mt: -1,
            '& .MuiSlider-valueLabel': {
              width: `${(10 * (boxWidth + boxMargin) + canvasMargin * 4) * scaleFactor}px`,

              '&.MuiSlider-valueLabelOpen': {
                transform: 'scale(1) translateY(-100%) translateX(50%)',
                height: (yearHeight - textHeight + canvasMargin) * scaleFactor
              },

              background: 'transparent',
              border: `1px solid ${theme.palette.primary.main}`,
              borderWidth: boxMargin,
              top: '-8px',
              padding: 0,

              '&::before, .MuiSlider-valueLabelLabel': {
                display: 'none'
              }
            }
          }}
          min={0}
          max={(52 * (boxWidth + boxMargin) + canvasMargin * 4) * scaleFactor}
          step={null}
          marks={marks as { value: number }[]}
        />
      </Box>

      <Typography variant='body1' mb={1} color='grey'>
        Use the slider to select your playable section
      </Typography>

      <Typography
        variant='body2'
        component={Button}
        sx={{ color: 'rgba(39, 213, 69, 0.75)' }}
        onClick={handleGeneration}
      >
        Play Game
      </Typography>
    </>
  );
}

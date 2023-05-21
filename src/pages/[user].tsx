import { useRef, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  useTheme,
  Backdrop,
  CircularProgress,
  Slider,
  IconButton,
  Link,
  keyframes
} from '@mui/material';
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
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { fetchData } from '../utils/fetch';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { countPieces } from '../utils/generateTetrisPieces';
import Tetris from '../components/Tetris';
import Image from 'next/image';

const fadeIn = keyframes`
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
`;

const styles = {
  fadeStyle: {
    animation: `${fadeIn} 1s ease-in-out`
  }
};

const marks = Array.from({ length: 52 })
  .map((a, i) => {
    if (i <= 42) {
      return {
        value: i * (boxWidth + boxMargin) * scaleFactor
      };
    }
  })
  .filter((a) => a !== undefined);

const steps = ['GRAPH', 'EXTRACTED', 'GAME'];
const PIECES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

const User = ({ data, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const theme = useTheme();

  const contributionRef = useRef<HTMLCanvasElement>(null);
  const selectedContributionRef = useRef<HTMLCanvasElement>(null);
  const extractedSelectedContributionRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);

  const [sliderValue, setSliderValue] = useState(0);
  const [contributionGrid, setContributionGrid] = useState<number[][]>([]);
  const [selectedContributions, setSelectedContributions] = useState<number[][]>([]);
  const [extractedSelectedContributions, setExtractedSelectedContributions] = useState<number[][]>([]);
  const [tetrisPieces, setTetrisPieces] = useState<Record<string, number>>();
  const [showExtracted, setShowExtracted] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const incrementStep = () => setCurrentStep((prev) => ++prev);
  const decrementStep = () => setCurrentStep((prev) => --prev);

  const disableStepDecrement = currentStep === 0;
  const disableStepIncrement = currentStep === 1;
  const disableStepUpdates = currentStep === 2;

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const convertTetrisPiecesToArrayPieces = (obj: {
    [key: string]: number;
  }): ('I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z')[] =>
    Object.entries(obj).flatMap(([key, value]) => Array(value).fill(key));

  // get contribution data
  useEffect(() => {
    if (contributionRef.current && data && currentStep === 0) {
      const c = drawContributions(contributionRef.current, {
        data,
        username: String(user),
        themeName: 'githubDark',
        skipHeader: true
      });

      setContributionGrid(c);
    }
  }, [data, user, contributionRef, setLoading, currentStep]);

  useEffect(() => {
    if (contributionGrid.length > 0) setLoading(false);
  }, [contributionGrid.length]);

  // generate selected contribution data
  useEffect(() => {
    if (contributionGrid.length > 0) {
      setShowExtracted(false);

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
        await getSelectedContribution().then((res) => setSelectedContributions(res));
        await getTetrisPieces().then((res) => {
          const [_tetrisPieces, _extractedSelectedContributions] = res;
          setExtractedSelectedContributions(_extractedSelectedContributions as number[][]);
          setTetrisPieces(_tetrisPieces as Record<string, number>);
        });
      })();
    }
  }, [contributionGrid, sliderValue]);

  // draw selected & extracted contribution data
  useEffect(() => {
    if (
      selectedContributionRef.current &&
      extractedSelectedContributionRef.current &&
      selectedContributions.length > 0 &&
      extractedSelectedContributions.length > 0 &&
      tetrisPieces &&
      currentStep === 1
    ) {
      drawSelectedContributions(selectedContributionRef.current, selectedContributions);
      drawSelectedContributions(extractedSelectedContributionRef.current, selectedContributions);

      setTimeout(() => {
        extractedSelectedContributionRef.current &&
          drawSelectedContributions(extractedSelectedContributionRef.current, extractedSelectedContributions);
      }, 1800);

      setTimeout(() => {
        setShowExtracted(true);
      }, 2000);
    }
  }, [selectedContributions, extractedSelectedContributions, currentStep, tetrisPieces]);

  if (!data) {
    return (
      <Typography
        component={Link}
        href='/'
        color='primary'
        sx={{ textDecoration: 'underline !important', fontSize: '1.25rem' }}
      >
        User not found. Go home
      </Typography>
    );
  }

  return (
    <>
      {steps[currentStep] === steps[0] && (
        <Box>
          <canvas ref={contributionRef} />

          {!loading && (
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
          )}
        </Box>
      )}

      {steps[currentStep] === steps[1] && tetrisPieces && (
        <Box sx={{ display: 'flex', gap: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column ' }}>
            <Typography variant='overline'>Selected Contributions</Typography>
            <canvas ref={selectedContributionRef} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column ' }}>
            <Typography variant='overline'>Extracted Contributions</Typography>
            <canvas ref={extractedSelectedContributionRef} />
          </Box>

          {showExtracted && (
            <Box sx={[{ display: 'flex', flexDirection: 'column' }, showExtracted && styles.fadeStyle]}>
              <Typography variant='overline'>Extracted Pieces</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                {PIECES.map((piece) => (
                  <Box
                    key={piece}
                    sx={{
                      fontFamily: 'monospace',
                      flexBasis: '30%',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      gap: 0.5
                    }}
                  >
                    <Image src={`/img/${piece.toLowerCase()}.svg`} width={30} height={30} alt={`piece-${piece}`} />
                    <sub style={{ color: 'grey' }}>x{tetrisPieces[piece]}</sub>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {steps[currentStep] === steps[2] && tetrisPieces && (
        <Tetris initialQueue={convertTetrisPiecesToArrayPieces(tetrisPieces)} />
      )}

      {currentStep === 0 && (
        <Typography variant='body1' color='grey'>
          Use the slider to select your playable section
        </Typography>
      )}

      {!disableStepUpdates && (
        <Box my={1.75} sx={{ display: 'flex' }}>
          <IconButton onClick={decrementStep} sx={{ p: 0 }} disabled={disableStepDecrement}>
            <ArrowBack
              sx={{
                width: '1.15em',
                height: '1.15em',
                fill: disableStepDecrement ? 'grey' : 'rgba(39, 213, 69, 0.75)',
                transform: disableStepDecrement ? 'scale(0.65)' : 'scale(1)'
              }}
            />
          </IconButton>

          <IconButton onClick={incrementStep} sx={{ p: 0 }} disabled={disableStepIncrement}>
            <ArrowForward
              sx={{
                width: '1.15em',
                height: '1.15em',
                fill: disableStepIncrement ? 'grey' : 'rgba(39, 213, 69, 0.75)',
                transform: disableStepIncrement ? 'scale(0.65)' : 'scale(1)'
              }}
            />
          </IconButton>
        </Box>
      )}

      {steps[currentStep] === steps[1] && (
        <>
          {!showExtracted && (
            <CircularProgress
              size={20}
              sx={{
                mt: -1.75,
                mb: 1.5,
                color: 'rgba(39, 213, 69, 0.75)',
                filter: 'drop-shadow(0 0 .3rem #ffffff70)'
              }}
            />
          )}

          <Button onClick={incrementStep} variant='contained'>
            Play Game
          </Button>
        </>
      )}

      <Backdrop
        open={loading}
        sx={{
          zIndex: 5,
          position: 'absolute'
        }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  data: DataStruct | null;
  user: string;
}> = async (context: GetServerSidePropsContext) => {
  const { query, res } = context;
  const user = String(query['user']);
  const year = Number(query['year']);

  const data = await fetchData(user, year);

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

  return { props: { data, user } };
};

export default User;

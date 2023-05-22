import { useRef, useState, useEffect } from 'react';
import { Typography, Box, Button, Backdrop, CircularProgress, Link } from '@mui/material';

import { useRouter } from 'next/router';
import axios from 'axios';

import {
  DataStruct,
  boxMargin,
  boxWidth,
  drawContributions,
  drawSelectedContributions,
  scaleFactor
} from '../utils/drawContributions';
import { countPieces } from '../utils/generateTetrisPieces';

import Step1 from '../components/steps/Step1';
import Step2 from '../components/steps/Step2';
import Step3 from '../components/steps/Step3';

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
const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

// TODO: hotfix -> refactor to CSR to fix 504 error
const User = () => {
  const [data, setData] = useState<DataStruct | null>();
  const router = useRouter();
  const { user, year } = router.query;

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
  const [initLoading, setInitLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);
  const incrementStep = () => setCurrentStep((prev) => ++prev);
  const decrementStep = () => setCurrentStep((prev) => --prev);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  // init data
  useEffect(() => {
    if (user && year) {
      (async () => {
        await axios
          .get(`/api/contributions?user=${user}&year=${year}`)
          .then((res) => {
            setData(res.data);
            setInitLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setInitLoading(false);
          });
      })();
    }
  }, [user, year]);

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
  }, [data, user, contributionRef, currentStep]);

  // loading for contribution slider
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
      }, 2500);
    }
  }, [selectedContributions, extractedSelectedContributions, currentStep, tetrisPieces]);

  if (initLoading) {
    return (
      <Backdrop
        open={initLoading}
        sx={{
          zIndex: 5,
          position: 'absolute'
        }}
      >
        <CircularProgress
          sx={{
            color: 'rgba(39, 213, 69, 0.75)',
            filter: 'drop-shadow(0 0 .3rem #ffffff70)'
          }}
        />
      </Backdrop>
    );
  }

  if (data === null && !initLoading) {
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
      {steps[currentStep] === steps[0] && <Step1 {...{ loading, contributionRef, sliderValue, handleSliderChange }} />}
      {steps[currentStep] === steps[1] && tetrisPieces && (
        <Step2
          {...{ selectedContributionRef, extractedSelectedContributionRef, showExtracted, pieces, tetrisPieces }}
        />
      )}
      {steps[currentStep] === steps[2] && tetrisPieces && <Step3 {...{ tetrisPieces }} />}

      {currentStep === 0 && (
        <Typography variant='body1' color='grey'>
          Use the slider to select your playable section
        </Typography>
      )}

      {!(currentStep === 2) && (
        <Box my={1.75} sx={{ display: 'flex' }}>
          <Button onClick={decrementStep} sx={{ p: 0 }} disabled={currentStep === 0}>
            Prev
          </Button>

          <Button onClick={incrementStep} sx={{ p: 0 }} disabled={currentStep === 1}>
            Next
          </Button>
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

          <Button onClick={incrementStep} disabled={!showExtracted} variant='contained'>
            Play Game
          </Button>
        </>
      )}
    </>
  );
};

export default User;

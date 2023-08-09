import { Box, Button, FormControlLabel, Grid, RadioGroup, Slider, Typography, useTheme } from '@mui/material';
import { boxMargin, boxWidth, canvasMargin, scaleFactor, textHeight, yearHeight } from '../../utils/drawContributions';
import { ChangeEvent, Dispatch, RefObject, SetStateAction } from 'react';
import CustomRadio from '../CustomRadio';

interface Props {
  isDesktop: boolean;
  contributionRef: RefObject<HTMLCanvasElement>;
  loading: boolean;
  sliderValue: number;
  handleSliderChange: (event: Event, newValue: number | number[]) => void;
  mobileSelectedGroup: number;
  setMobileSelectedGroup: Dispatch<SetStateAction<number>>;
}

const marks = Array.from({ length: 52 })
  .map((a, i) => {
    if (i <= 42) {
      return {
        value: i * (boxWidth + boxMargin) * scaleFactor
      };
    }
  })
  .filter((a) => a !== undefined);

const Step1 = (props: Props) => {
  const {
    isDesktop,
    loading,
    contributionRef,
    sliderValue,
    handleSliderChange,
    mobileSelectedGroup,
    setMobileSelectedGroup
  } = props;

  const theme = useTheme();
  const months = ['I', 'II', 'III', 'IV', 'V'];

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const _val = target.value;
    setMobileSelectedGroup(Number(_val));
  };

  if (!isDesktop) {
    return (
      <RadioGroup
        name='room.space'
        value={mobileSelectedGroup}
        onChange={handleRadioChange}
        sx={{ flexDirection: 'row', mb: 1 }}
      >
        <Grid container spacing={3} sx={{ mb: 1 }}>
          {months.map((month, i) => (
            <Grid key={month} item xs={4}>
              <FormControlLabel
                sx={{ m: 0, flexBasis: { xs: 0, md: '25%', xl: 0 } }}
                value={i + 1}
                control={
                  <CustomRadio>
                    <Typography
                      variant='body2'
                      component={Button}
                      fontWeight={500}
                      sx={{
                        filter: 'drop-shadow(0 0 .3rem #ffffff70)',
                        fontSize: { xs: '1.5rem', md: '3.75rem' }
                      }}
                    >
                      {month}
                    </Typography>
                  </CustomRadio>
                }
                label=''
              />
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    );
  }

  return (
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
  );
};

export default Step1;

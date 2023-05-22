import { Box, Slider, useTheme } from '@mui/material';
import { boxMargin, boxWidth, canvasMargin, scaleFactor, textHeight, yearHeight } from '../../utils/drawContributions';
import { RefObject } from 'react';

interface Props {
  contributionRef: RefObject<HTMLCanvasElement>;
  loading: boolean;
  sliderValue: number;
  handleSliderChange: (event: Event, newValue: number | number[]) => void;
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
  const { loading, contributionRef, sliderValue, handleSliderChange } = props;
  const theme = useTheme();

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

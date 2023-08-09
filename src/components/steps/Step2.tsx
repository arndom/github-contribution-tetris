import { Typography, Box, keyframes } from '@mui/material';
import Image from 'next/image';
import { RefObject } from 'react';

interface Props {
  isDesktop: boolean;
  selectedContributionRef: RefObject<HTMLCanvasElement>;
  extractedSelectedContributionRef: RefObject<HTMLCanvasElement>;
  showExtracted: boolean;
  pieces: string[];
  tetrisPieces: Record<string, number> | undefined;
}

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

const Step2 = (props: Props) => {
  const { isDesktop, selectedContributionRef, extractedSelectedContributionRef, showExtracted, pieces, tetrisPieces } =
    props;

  if (!isDesktop) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='body2' sx={{ textTransform: 'uppercase' }}>
            Contributions
          </Typography>

          <canvas
            ref={extractedSelectedContributionRef}
            style={{
              width: '80vw',
              height: 'calc(calc(80vh / 100vw) * 80vw)'
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column ' }}>
        <Typography variant='overline'>Selected Contributions</Typography>
        <canvas ref={selectedContributionRef} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column ' }}>
        <Typography variant='overline'>Extracted Contributions</Typography>
        <canvas ref={extractedSelectedContributionRef} />
      </Box>

      {showExtracted && tetrisPieces && (
        <Box sx={[{ display: 'flex', flexDirection: 'column' }, showExtracted && styles.fadeStyle]}>
          <Typography variant='overline'>Extracted Pieces</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
            {pieces.map((piece) => (
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
  );
};

export default Step2;

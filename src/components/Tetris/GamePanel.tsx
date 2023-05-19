import { Button, Box, Dialog, Typography } from '@mui/material';

import Tetris from '../../modules/react-tetris/components/Tetris';
import Controller from './Controller';

const GamePanel = (): JSX.Element => (
  <Box sx={styles.container}>
    <Tetris>
      {({ Gameboard, PieceQueue, points, linesCleared, state, controller }) => (
        <Box>
          <Box sx={{ opacity: state === 'PLAYING' ? 1 : 0.5 }}>
            <Box sx={styles.score}>
              <Box sx={styles.half}>
                <p>
                  points
                  <br />
                  <Digits>{points}</Digits>
                </p>
              </Box>

              <Box sx={styles.half}>
                <p>
                  lines
                  <br />
                  <Digits>{linesCleared}</Digits>
                </p>
              </Box>
            </Box>

            <Box sx={styles.gameboardContainer}>
              <Box sx={styles.gameboard}>
                <Gameboard />
              </Box>

              <Box sx={styles.pieceQueue}>
                <PieceQueue />
              </Box>
            </Box>

            <Controller controller={controller} />
          </Box>

          <Dialog open={state === 'PAUSED'}>
            <Typography variant='h6'>Paused</Typography>
            <Button variant='contained' size='small' onClick={controller.resume}>
              Resume
            </Button>
          </Dialog>

          <Dialog open={state === 'LOST'}>
            <Typography variant='h6'>Game Over</Typography>
            <Button variant='contained' size='small' onClick={controller.restart}>
              Restart
            </Button>
          </Dialog>
        </Box>
      )}
    </Tetris>
  </Box>
);

type DigitsProps = {
  children: number;
  count?: number;
};

const Digits = ({ children, count = 4 }: DigitsProps): JSX.Element => {
  let str = children.toString();

  while (str.length < count) {
    str = `${0}${str}`;
  }

  return (
    <>
      {str.split('').map((digit, index) => (
        <Typography component='span' sx={styles.digit} key={index}>
          {digit}
        </Typography>
      ))}
    </>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '376px'
  },

  score: {
    position: 'relative',
    fontFamily: 'monospace',
    fontSize: '18px',
    color: '#888',

    display: 'flex',
    alignItems: 'center'
  },

  half: {
    width: '50%'
  },

  gameboardContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px'
  },

  pieceQueue: {
    width: '88px'
  },
  gameboard: {
    width: '200px'
  },

  digit: {
    fontFamily: 'monospace',
    padding: '1px',
    margin: '1px',
    fontSize: '24px'
  }
};

export default GamePanel;

import { useState } from 'react';
import { Button, Box, Dialog, Typography, useTheme } from '@mui/material';

import Controller from './Controller';
import Tetris from './react-tetris/components/Tetris';
import { Piece } from './react-tetris/models/Piece';

import {
  KeyboardArrowDownOutlined,
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
  KeyboardArrowUpOutlined
} from '@mui/icons-material';

type Props = {
  isDesktop: boolean;
  initialQueue?: Piece[];
};

const keyMap = [
  {
    text: 'drop',
    component: (
      <Typography variant='overline' color='primary' fontWeight={700} sx={{ lineHeight: 0.75, fontSize: '0.6rem' }}>
        space
      </Typography>
    )
  },
  {
    text: 'down',
    component: <KeyboardArrowDownOutlined />
  },
  {
    text: 'left',
    component: <KeyboardArrowLeftOutlined />
  },
  {
    text: 'right',
    component: <KeyboardArrowRightOutlined />
  },
  {
    text: 'rotate right',
    component: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <KeyboardArrowUpOutlined />
        <Typography variant='subtitle1' color='grey' fontWeight={700} sx={{ lineHeight: 0.75, fontSize: '0.6rem' }}>
          or
        </Typography>

        <Typography variant='overline' color='primary' fontWeight={700} sx={{ lineHeight: 0.75, fontSize: '0.6rem' }}>
          X
        </Typography>
      </Box>
    )
  },
  {
    text: 'rotate left',
    component: (
      <Typography variant='overline' color='primary' fontWeight={700} sx={{ lineHeight: 0.75, fontSize: '0.6rem' }}>
        Z
      </Typography>
    )
  },
  {
    text: 'pause',
    component: (
      <Typography variant='overline' color='primary' fontWeight={700} sx={{ lineHeight: 0.75, fontSize: '0.6rem' }}>
        p
      </Typography>
    )
  },
  {
    text: 'restart',
    component: (
      <Typography variant='overline' color='primary' fontWeight={700} sx={{ lineHeight: 0.75, fontSize: '0.6rem' }}>
        r
      </Typography>
    )
  }
];

const GamePanel = (props: Props): JSX.Element => {
  const initialQueue = props.initialQueue ? props.initialQueue : undefined;
  const { isDesktop } = props;

  const theme = useTheme();
  const [isNewGame, setIsNewGame] = useState(true);

  return (
    <Box sx={styles.container}>
      <Tetris initialQueue={initialQueue}>
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

              {isDesktop && (
                <>
                  <Typography variant='subtitle2' sx={{ color: 'grey' }} mt={0.5} mb={0.85}>
                    Keys
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {keyMap.map((key) => (
                      <Box
                        key={key.text}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '& .MuiSvgIcon-root': {
                            fill: theme.palette.primary.main,
                            fontSize: '1rem'
                          }
                        }}
                      >
                        <Typography
                          variant='overline'
                          color='grey'
                          sx={{ lineHeight: 0.75, fontSize: '0.6rem' }}
                          fontWeight={700}
                        >
                          {key.text}
                        </Typography>
                        {key.component}
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              {/* TODO: find a way to handle keyboard click restart without interuptting process */}
              {isDesktop && (
                <>
                  {initialQueue && isNewGame && (
                    <Box sx={{ display: 'grid', placeItems: 'center' }}>
                      <Typography variant='subtitle2' sx={{ fontSize: '0.75rem' }} color='grey' mt={2}>
                        Extracted Pieces
                      </Typography>

                      <Box sx={{ display: 'flex' }}>
                        {initialQueue.map((piece, i) => (
                          <Typography
                            mr={1}
                            key={`${piece}${i}`}
                            color='primary'
                            sx={{ fontSize: '0.7rem', fontWeight: 900 }}
                          >
                            {piece}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
              )}

              {!isDesktop && <Controller controller={controller} />}
            </Box>

            <Dialog open={state === 'PAUSED'}>
              <Typography variant='h6'>Paused</Typography>
              <Button variant='contained' size='small' onClick={controller.resume}>
                Resume
              </Button>
            </Dialog>

            <Dialog open={state === 'LOST'}>
              <Typography variant='h6'>Game Over</Typography>
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  controller.restart();
                  setIsNewGame(false);
                }}
              >
                Restart
              </Button>
            </Dialog>
          </Box>
        )}
      </Tetris>
    </Box>
  );
};

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
    justifyContent: 'center',
    gap: '15px',
    height: '100%'
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

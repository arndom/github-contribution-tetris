import { Box } from '@mui/material';
import GamePanel from './GamePanel';
import { Piece } from './react-tetris/models/Piece';

interface Props {
  initialQueue: Piece[];
  isDesktop: boolean;
}

const Tetris = (props: Props) => {
  return (
    <Box sx={styles.root}>
      <GamePanel initialQueue={props.initialQueue} isDesktop={props.isDesktop} />
    </Box>
  );
};

const styles = {
  root: {
    '& .game-block': {
      margin: 0,
      padding: 0,
      width: '21px',
      height: '21px',
      background: '#161b22'
    },

    '& .piece-view .game-block': {
      width: '18px',
      height: '18px'
    },

    '& .piece-i, .piece-j, .piece-l, .piece-o, .piece-s, .piece-t, .piece-z': {
      backgroundColor: '#10983d'
    },

    '& .piece-preview': {
      backgroundColor: '#003820'
    }
  }
};

export default Tetris;

import React from 'react';
import PieceView from './PieceView';
import { Context } from '../context';
import { Box } from '@mui/material';

export default function PieceQueue(): JSX.Element {
  const { queue } = React.useContext(Context);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      {queue.queue.slice(0, 4).map((piece, i) => (
        <PieceView piece={piece} key={i} />
      ))}
    </Box>
  );
}

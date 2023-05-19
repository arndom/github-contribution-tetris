import React from 'react';
import PieceView from './PieceView';
import { Context } from '../context';

export default function PieceQueue(): JSX.Element {
  const { queue } = React.useContext(Context);

  return (
    <div>
      {queue.queue.slice(0, 3).map((piece, i) => (
        <PieceView piece={piece} key={i} />
      ))}
    </div>
  );
}

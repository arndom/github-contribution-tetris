import Gameboard from './Gameboard';
import * as Game from '../models/Game';
import HeldPiece from './HeldPiece';
import PieceQueue from './PieceQueue';
import { Context } from '../context';
import { KeyboardMap, useKeyboardControls } from '../hooks/useKeyboardControls';
import { useEffect, useMemo, useReducer } from 'react';
import { Piece } from '../models/Piece';

export type RenderFn = (params: {
  HeldPiece: React.ComponentType;
  Gameboard: React.ComponentType;
  PieceQueue: React.ComponentType;
  points: number;
  linesCleared: number;
  level: number;
  state: Game.State;
  controller: Controller;
}) => React.ReactElement;

export type Controller = {
  pause: () => void;
  resume: () => void;
  hold: () => void;
  hardDrop: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  flipClockwise: () => void;
  flipCounterclockwise: () => void;
  restart: () => void;
};

type Props = {
  keyboardControls?: KeyboardMap;
  initialQueue?: Piece[];
  children: RenderFn;
};

const defaultKeyboardMap: KeyboardMap = {
  arrowdown: 'MOVE_DOWN',
  arrowleft: 'MOVE_LEFT',
  arrowright: 'MOVE_RIGHT',
  arrowup: 'FLIP_CLOCKWISE',
  ' ': 'HARD_DROP', // spacebar

  z: 'FLIP_COUNTERCLOCKWISE',
  x: 'FLIP_CLOCKWISE',
  p: 'TOGGLE_PAUSE',
  r: 'RESTART'

  // archived atm as they offer no use
  // c: 'HOLD',
  // shift: 'HOLD'
};

// https://harddrop.com/wiki/Tetris_Worlds#Gravity
const tickSeconds = (level: number) => (0.8 - (level - 1) * 0.007) ** (level - 1);

export default function Tetris(props: Props): JSX.Element {
  const gameInit = props.initialQueue ? Game.init(props.initialQueue) : Game.init();
  const [game, dispatch] = useReducer(Game.update, gameInit);
  const keyboardMap = props.keyboardControls ?? defaultKeyboardMap;
  useKeyboardControls(keyboardMap, dispatch);

  const moveSound = useMemo(() => new Audio('sound/move3.mp3'), []);
  const gameOverSound = useMemo(() => new Audio('sound/gameOver.mp3'), []);
  const dropSound = useMemo(() => new Audio('sound/drop.mp3'), []);

  const level = Game.getLevel(game);

  useEffect(() => {
    let interval: number | undefined;
    if (game.state === 'PLAYING') {
      interval = window.setInterval(() => {
        dispatch('TICK');
      }, tickSeconds(level) * 1000);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [game.state, level]);

  useEffect(() => {
    if (game.state === 'LOST') {
      gameOverSound.play();
    }
  }, [game, gameOverSound]);

  const controller = useMemo(
    () => ({
      pause: () => dispatch('PAUSE'),
      resume: () => dispatch('RESUME'),
      hold: () => dispatch('HOLD'),
      hardDrop: () => {
        dropSound.play();
        dispatch('HARD_DROP');
      },
      moveDown: () => {
        moveSound.play();
        dispatch('MOVE_DOWN');
      },
      moveLeft: () => {
        moveSound.play();
        dispatch('MOVE_LEFT');
      },
      moveRight: () => {
        moveSound.play();
        dispatch('MOVE_RIGHT');
      },
      flipClockwise: () => {
        moveSound.play();
        dispatch('FLIP_CLOCKWISE');
      },
      flipCounterclockwise: () => {
        moveSound.play();
        dispatch('FLIP_COUNTERCLOCKWISE');
      },
      restart: () => dispatch('RESTART')
    }),
    [dispatch, moveSound, dropSound]
  );

  return (
    <Context.Provider value={game}>
      {props.children({
        HeldPiece,
        Gameboard,
        PieceQueue,
        points: game.points,
        linesCleared: game.lines,
        state: game.state,
        level,
        controller
      })}
    </Context.Provider>
  );
}

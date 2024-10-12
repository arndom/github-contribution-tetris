import { useEffect, useMemo } from 'react';
import { Action } from '../models/Game';

type KeyboardDispatch = Record<string, () => void>;
export type KeyboardMap = Record<string, Action>;

export const useKeyboardControls = (keyboardMap: KeyboardMap, dispatch: React.Dispatch<Action>) => {
  const moveSound = useMemo(() => new Audio('sound/move3.mp3'), []);
  const dropSound = useMemo(() => new Audio('sound/drop.mp3'), []);

  useEffect(() => {
    const keyboardDispatch = Object.entries(keyboardMap).reduce<KeyboardDispatch>((output, [key, action]) => {
      output[key] = () => {
        dispatch(action);

        if (
          action === 'MOVE_DOWN' ||
          action === 'MOVE_LEFT' ||
          action === 'MOVE_RIGHT' ||
          action === 'FLIP_CLOCKWISE' ||
          action === 'FLIP_COUNTERCLOCKWISE'
        ) {
          moveSound.play();
        }

        if (action === 'HARD_DROP') {
          dropSound.play();
        }
      };

      return output;
    }, {});

    const handleKeyDown = (event: KeyboardEvent) => {
      Object.keys(keyboardDispatch).forEach((k: keyof KeyboardDispatch) => {
        const fn = keyboardDispatch[k];

        if (event.key.toLowerCase() === k) {
          event.preventDefault();
          fn();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
};

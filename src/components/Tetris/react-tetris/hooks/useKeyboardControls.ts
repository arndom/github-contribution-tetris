import { useEffect } from 'react';
import { Action } from '../models/Game';

type KeyboardDispatch = Record<string, () => void>;
export type KeyboardMap = Record<string, Action>;

export const useKeyboardControls = (keyboardMap: KeyboardMap, dispatch: React.Dispatch<Action>) => {
  useEffect(() => {
    const keyboardDispatch = Object.entries(keyboardMap).reduce<KeyboardDispatch>((output, [key, action]) => {
      output[key] = () => dispatch(action);

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

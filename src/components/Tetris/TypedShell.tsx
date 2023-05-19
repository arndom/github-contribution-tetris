import { Box } from '@mui/material';
import React from 'react';

export default function TypedShell({ children }: { children: string }): JSX.Element {
  const [lettersToShow, setLettersToShow] = React.useState(0);

  React.useEffect(() => {
    let id: NodeJS.Timeout | undefined;
    const addLetters = () => {
      const wait = Math.random() * 200 + 40;

      id = setTimeout(() => {
        setLettersToShow((current) => current + 1);

        if (lettersToShow < children.length) {
          addLetters();
        }
      }, wait);
    };

    addLetters();

    return () => {
      id && clearTimeout(id);
    };
  }, [lettersToShow, setLettersToShow, children]);

  return <Box sx={styles.shell}>$ {children.slice(0, lettersToShow)}</Box>;
}

const styles = {
  shell: {
    display: 'inline-block',
    margin: '18px 0',
    fontFamily:
      "Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier, monospace",
    borderRadius: '5px',
    background: '#fff',
    border: '1px solid #eaeaea',
    padding: '12px 18px'
  }
};

import React from 'react';
import type { Controller } from './react-tetris/components/Tetris';
import { Box, Button } from '@mui/material';
import { ArrowDropDown, ArrowLeft, ArrowRight, KeyboardDoubleArrowDown, Pause, Refresh } from '@mui/icons-material';

type Props = {
  controller: Controller;
};

export default function Controller({ controller }: Props): JSX.Element {
  return (
    <Box
      mt={2.5}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 0.5,

        '& .MuiButton-root': {
          p: 0.5,
          minWidth: 42,
          width: 42,
          height: 42,
          borderRadius: '100%',

          '& .MuiSvgIcon-root': {
            width: '1.25em',
            height: '1.25em'
          }
        }
      }}
    >
      <Box sx={{ flexBasis: '50%', display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'center' }}>
        <Button variant='contained' onClick={controller.flipClockwise}>
          <Refresh />
        </Button>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' onClick={controller.moveLeft}>
            <ArrowLeft />
          </Button>

          <Button variant='contained' onClick={controller.moveRight}>
            <ArrowRight />
          </Button>
        </Box>

        <Button variant='contained' onClick={controller.moveDown}>
          <ArrowDropDown />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button />
          <Button color='warning' variant='contained' onClick={controller.pause}>
            <Pause />
          </Button>
        </Box>

        <Button color='warning' variant='contained' onClick={controller.hardDrop}>
          <KeyboardDoubleArrowDown />
        </Button>
      </Box>
    </Box>
  );
}

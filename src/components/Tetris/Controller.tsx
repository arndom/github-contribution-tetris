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
      mt={2}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 0.5,

        '& .MuiButton-root': {
          p: 0.5,
          minWidth: 40,
          width: 40,
          height: 38,

          '& .MuiSvgIcon-root': {
            width: '1.25em',
            height: '1.25em'
          }
        }
      }}
    >
      <Box sx={{ flexBasis: '50%', display: 'flex', gap: 1.25, flexDirection: 'column', alignItems: 'center' }}>
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

      <Box sx={{ display: 'flex', gap: 1.25, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button sx={{ width: 46, height: 46 }} />
          <Button color='warning' variant='contained' onClick={controller.pause}>
            <Pause />
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-start' }}>
          <Button color='warning' variant='contained' onClick={controller.hardDrop}>
            <KeyboardDoubleArrowDown />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

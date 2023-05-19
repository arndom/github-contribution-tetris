import React from 'react';
import type { Controller } from '../../modules/react-tetris/components/Tetris';
import { Box } from '@mui/material';

type Props = {
  controller: Controller;
};

export default function Controller({ controller }: Props): JSX.Element {
  if (true) return <></>;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 12px'
      }}
    >
      <Box
        sx={{
          padding: '18px',
          border: '1px solid #DDD',
          borderRadius: '72px'
        }}
      >
        <Box sx={styles.dpadRow}>
          <button style={styles.upDown} onClick={controller.flipClockwise} />
        </Box>
        <Box sx={[styles.dpadRow, styles.dpadMidRow]}>
          <button style={styles.leftRight} onClick={controller.moveLeft} />
          <button style={styles.leftRight} onClick={controller.moveRight} />
        </Box>
        <Box sx={styles.dpadRow}>
          <button style={styles.upDown} onClick={controller.moveDown} />
        </Box>
      </Box>

      <Box>
        <Box sx={styles.row}>
          <button style={styles.roundBtn} onClick={controller.hardDrop} />
        </Box>
        <Box sx={[styles.row, styles.midRow]}>
          <button style={styles.roundBtn} onClick={controller.hold} />
          <button style={styles.roundBtn} onClick={controller.flipClockwise} />
        </Box>
        <Box sx={styles.row}>
          <button style={styles.roundBtn} onClick={controller.flipCounterclockwise} />
        </Box>
      </Box>
    </Box>
  );
}

const dpadSize = 36;

const styles = {
  dpadRow: {
    display: 'flex',
    justifyContent: 'center',
    height: `${dpadSize}px`,
    width: `${dpadSize * 3}px`
  },
  dpadMidRow: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftRight: {
    width: `${dpadSize}px`,
    height: `${dpadSize}px`,
    border: '2px solid #ddd'
  },
  upDown: {
    width: `${dpadSize}px`,
    height: `${dpadSize}px`,
    border: '2px solid #ddd'
  },
  roundBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    border: '2px solid #ddd'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    height: '48px',
    width: '144px'
  },
  midRow: {
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

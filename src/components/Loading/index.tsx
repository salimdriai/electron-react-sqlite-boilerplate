import React from 'react';
import { CircularProgress, Stack } from '@mui/material';

function Loading() {
  return (
    <Stack height="90vh" justifyContent="center" alignItems="center">
      <CircularProgress color="primary" />
    </Stack>
  );
}

export default Loading;

import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

function Loading() {
  return (
    <Stack height="90vh" justifyContent="center" alignItems="center">
      <CircularProgress color="primary" />
    </Stack>
  );
}

export default Loading;

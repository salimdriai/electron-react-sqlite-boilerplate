import * as React from 'react';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode;
}

export default function PageSection({ children }: Props) {
  return <Box sx={{ my: 4 }}>{children}</Box>;
}

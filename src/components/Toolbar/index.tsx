import React from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface ToolbarProps {
  title: string;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  buttonOnClick?: () => void;
}

export default function PageToolbar({
  title,
  buttonIcon,
  buttonLabel,
  buttonOnClick,
}: ToolbarProps) {
  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: '0!important',
      }}
    >
      <Typography variant="h4">{title}</Typography>
      {buttonLabel && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={buttonOnClick}
          startIcon={buttonIcon}
        >
          {buttonLabel}
        </Button>
      )}
    </Toolbar>
  );
}

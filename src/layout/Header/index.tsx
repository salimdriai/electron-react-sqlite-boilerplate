import React from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import SyncIcon from '@mui/icons-material/Sync';

import AccountMenu from './AccountMenu';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  // zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Header({
  openFreeSessionModal,
  open,
}: {
  openFreeSessionModal: () => void;
  open: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <AppBar
      open={open}
      elevation={0}
      position="fixed"
      color="transparent"
      sx={{
        width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 72px)`,
        backgroundColor: 'background.default',
      }}
    >
      <Toolbar>
        <Stack width="100%" direction="row" spacing={2}>
          <Button
            onClick={() => navigate('/users/add')}
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
          >
            {t('user.add')}
          </Button>

          <Button
            onClick={openFreeSessionModal}
            variant="contained"
            color="success"
            startIcon={<LoginIcon />}
          >
            {t('common.freeSession')}
          </Button>
        </Stack>
        <Stack
          direction="row"
          justifyContent="end"
          alignItems="center"
          spacing={2}
        >
          <IconButton onClick={() => window.location.reload()}>
            <SyncIcon />
          </IconButton>
          <AccountMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

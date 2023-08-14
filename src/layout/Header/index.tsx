import React from 'react';

import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import UserEntry from 'modules/users/UserEntry';

import AccountMenu from './AccountMenu';

const drawerWidth = 240;

export default function Header({
  openFreeSessionModal,
}: {
  openFreeSessionModal: () => void;
}) {
  const navigate = useNavigate();
  return (
    <AppBar
      elevation={0}
      position="fixed"
      color="transparent"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backdropFilter: 'blur(10px)',
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
            New user
          </Button>

          <Button
            onClick={openFreeSessionModal}
            variant="contained"
            color="success"
            startIcon={<LoginIcon />}
          >
            free session
          </Button>
          <UserEntry />
        </Stack>
        <Stack direction="row" justifyContent="end" alignItems="center">
          <AccountMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
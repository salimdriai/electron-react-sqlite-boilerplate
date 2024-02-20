import * as React from 'react';

import Box from '@mui/material/Box';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FreeSession from 'modules/free-session';
import SideNavigation from './SideNavigation';
import Header from './Header';

import logo from '../../assets/icon.png';

const drawerWidth = 240;

interface Props {
  page: React.ReactNode;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function SidebarLayout({ page }: Props) {
  const [freeSessionsModalOpen, setFreeSessionModalOpen] =
    React.useState(false);

  const [open, setOpen] = React.useState(false);

  const onFreeSessionModalClose = () => {
    setFreeSessionModalOpen(false);
  };
  const openFreeSessionModal = () => setFreeSessionModalOpen(true);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header openFreeSessionModal={openFreeSessionModal} open={open} />

      <Drawer open={open} variant="permanent" anchor="left">
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Toolbar sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
          <img
            src={logo}
            width={150}
            alt="logo"
            style={{ visibility: open ? 'visible' : 'hidden' }}
          />
        </Toolbar>
        <Box flex={1}>
          <SideNavigation />
        </Box>
      </Drawer>

      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Toolbar />
        <Box flex={1}>{page}</Box>
        <Box>
          <Typography variant="body2" color="text.secondary" align="right">
            developed by : @SalimDriai / TechSprintLabs | All rights reserved ©
            2024
          </Typography>
        </Box>
      </Stack>

      <FreeSession
        freeSessionsModalOpen={freeSessionsModalOpen}
        onFreeSessionModalClose={onFreeSessionModalClose}
      />
    </Box>
  );
}

export default SidebarLayout;

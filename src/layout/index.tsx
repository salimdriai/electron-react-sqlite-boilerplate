import * as React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import FreeSession from 'modules/free-session';
import SideNavigation from './SideNavigation';
import Header from './Header';

import logo from '../../assets/icon.png';

const drawerWidth = 240;

const drawerStyle = {
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
};

interface Props {
  page: React.ReactNode;
}

function SidebarLayout({ page }: Props) {
  const [freeSessionsModalOpen, setFreeSessionModalOpen] =
    React.useState(false);
  const onFreeSessionModalClose = () => {
    setFreeSessionModalOpen(false);
  };
  const openFreeSessionModal = () => setFreeSessionModalOpen(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header openFreeSessionModal={openFreeSessionModal} />

      <Drawer sx={drawerStyle} variant="permanent" anchor="left">
        <Toolbar sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
          <img src={logo} width={150} alt="logo" />
        </Toolbar>
        <Box flex={1}>
          <SideNavigation />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {page}
      </Box>

      <FreeSession
        freeSessionsModalOpen={freeSessionsModalOpen}
        onFreeSessionModalClose={onFreeSessionModalClose}
      />
    </Box>
  );
}

export default SidebarLayout;

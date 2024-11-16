/* eslint-disable promise/always-return */
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import createDarkTheme from '../theme/dark';
import '../i18n';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function App() {
  const darkTheme = createDarkTheme();

  const handleAction = () => {
    console.log('Action triggered!'); // Example action for navigation or database query
  };

  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <>
          {/* Navbar */}
          <AppBar position="static">
            <Toolbar>
              <HomeIcon sx={{ mr: 2 }} />
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Electron-React-SQLite App
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h3" gutterBottom>
              Electron-React-SQLite
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              This is a boilerplate for your Electron, SQLite, and React
              application.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAction}
            >
              Get Started
            </Button>
          </Container>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              mt: 6,
              py: 2,
              backgroundColor: '#f5f5f5',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} My App. All rights reserved.
            </Typography>
          </Box>
        </>
      </ThemeProvider>
    </Router>
  );
}

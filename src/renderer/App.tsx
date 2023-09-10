import { useEffect } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppDispatch, useAppSelector } from 'features/store';
import { getSettings } from 'features/settings/reducers';
import { currentUser } from 'features/authentication';
import { Themes } from 'types';
import Loading from 'components/Loading';
import Alert from 'components/Alert';

import createDarkTheme from '../theme/dark';
import createLightTheme from '../theme/light';
import Pages from '../pages';

export default function App() {
  const {
    settings: { theme },
    loading: settingsLoading,
  } = useAppSelector((state) => state.settings);

  const { loading: authLoading } = useAppSelector(
    (state) => state.authentication
  );

  const darkTheme = createDarkTheme();
  const lightTheme = createLightTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(currentUser());
    dispatch(getSettings());
  }, [dispatch]);

  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={theme === Themes.Dark ? darkTheme : lightTheme}>
        {settingsLoading || authLoading ? <Loading /> : <Pages />}
        <Alert />
      </ThemeProvider>
    </Router>
  );
}

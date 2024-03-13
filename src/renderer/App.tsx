import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppDispatch, useAppSelector } from 'features/store';
import { switchTheme, switchLanguage } from 'features/settings';
import { currentUser } from 'features/authentication';
import { Themes } from 'types';
import Loading from 'components/Loading';
import Alert from 'components/Alert';
import UserAccess from 'modules/users/UserEntry';

import createDarkTheme from '../theme/dark';
import createLightTheme from '../theme/light';
import Pages from '../pages';
import '../i18n';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function App() {
  const {
    settings: { theme },
    loading: settingsLoading,
  } = useAppSelector((state) => state.settings);

  const { loading: authLoading } = useAppSelector(
    (state) => state.authentication
  );

  const { i18n } = useTranslation();

  const darkTheme = createDarkTheme();
  const lightTheme = createLightTheme();
  const dispatch = useAppDispatch();

  const initSettings = async () => {
    const settings = await window.electron.getStoreData('settings');
    i18n.changeLanguage(settings.language || 'en');
    dispatch(switchLanguage(settings.language || 'en'));
    dispatch(switchTheme(settings.theme || Themes.Dark));
  };

  useEffect(() => {
    dispatch(currentUser());
    initSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const activate = async () => {
      const res = await window.electron.getAllAccounts();
      if (!res.length) {
        await window.electron.activateApp();
      }
    };
    activate();
  }, []);

  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={theme === Themes.Dark ? darkTheme : lightTheme}>
        {settingsLoading || authLoading ? <Loading /> : <Pages />}
        <Alert />
        <UserAccess />
      </ThemeProvider>
    </Router>
  );
}

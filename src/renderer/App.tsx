/* eslint-disable promise/always-return */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppDispatch, useAppSelector } from 'features/store';
import {
  switchTheme,
  switchLanguage,
  showAccessInput,
  initActivationData,
} from 'features/settings';
import { currentUser } from 'features/authentication';
import { Themes } from 'types';
import Loading from 'components/Loading';
import Alert from 'components/Alert';

import createDarkTheme from '../theme/dark';
import createLightTheme from '../theme/light';
import Pages from '../pages';
import '../i18n';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
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
    dispatch(switchLanguage(settings.language || 'en'));
    dispatch(switchTheme(settings.theme || Themes.Dark));
    dispatch(showAccessInput(settings.accessInput || false));
  };

  const initAdminAcount = async () => {
    const accounts = await window.electron.getAllAccounts();
    if (!accounts.length) {
      window.electron.initAdminAcount();
    }
  };

  useEffect(() => {
    dispatch(currentUser());
    initAdminAcount();
    initSettings();
    setIsLoading(true);
    window.electron
      .getLicenseData()
      .then((licenseData) => {
        console.log('licenseData', licenseData);
        dispatch(initActivationData(licenseData));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('ERRR', err);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <CssBaseline />
      <ThemeProvider theme={theme === Themes.Dark ? darkTheme : lightTheme}>
        {settingsLoading || authLoading || isLoading ? <Loading /> : <Pages />}
        <Alert />
      </ThemeProvider>
    </Router>
  );
}

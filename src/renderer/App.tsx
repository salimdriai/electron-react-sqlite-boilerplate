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
  setAppId,
} from 'features/settings';
import { currentUser } from 'features/authentication';
import { initActivationData } from 'features/settings/reducers';
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
    i18n.changeLanguage(settings.language || 'en');
    dispatch(switchLanguage(settings.language || 'en'));
    dispatch(switchTheme(settings.theme || Themes.Dark));
    dispatch(showAccessInput(settings.accessInput || false));
    dispatch(setAppId(settings.appId));
  };

  const initAdminAcount = async () => {
    const accounts = await window.electron.getAllAccounts();
    if (!accounts.length) {
      window.electron.initAdminAcount();
    }
  };

  // const licensing = async () => {
  //   setIsLoading(true);
  //   await dispatch(initActivationData());
  //   setIsLoading(false);
  // };

  useEffect(() => {
    // licensing();
    dispatch(currentUser());
    initAdminAcount();
    initSettings();
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

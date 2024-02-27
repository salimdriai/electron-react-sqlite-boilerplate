import * as React from 'react';

import { useTranslation } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { Themes } from 'types';
import { switchTheme } from 'features/settings';
import { useAppDispatch, useAppSelector } from 'features/store';

function Theme() {
  const { t } = useTranslation();
  const { settings } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const onChange = async (e: any) => {
    const isDark = e.target.checked;
    dispatch(switchTheme(isDark ? Themes.Dark : Themes.Light));
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <DarkModeIcon color="secondary" />
        <Typography variant="h6">{t('common.theme')}</Typography>
      </Stack>
      <FormControlLabel
        control={
          <Switch
            onChange={onChange}
            checked={settings.theme === Themes.Dark}
          />
        }
        label={t(`settings.theme.${Themes.Dark}`)}
      />
    </Stack>
  );
}
export default Theme;

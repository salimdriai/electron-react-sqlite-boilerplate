import * as React from 'react';

import { useTranslation } from 'react-i18next';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
    <Card variant="outlined" sx={{ width: 200 }}>
      <CardHeader
        title={t('common.theme')}
        action={<DarkModeIcon color="secondary" />}
      />
      <CardContent>
        <FormControlLabel
          control={
            <Switch
              onChange={onChange}
              checked={settings.theme === Themes.Dark}
            />
          }
          label={Themes.Dark}
        />
      </CardContent>
    </Card>
  );
}
export default Theme;

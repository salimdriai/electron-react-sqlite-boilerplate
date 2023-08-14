import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'features/store';
import { Themes } from 'types';
import { updateSettings } from 'features/settings/reducers';
import { displayFormat } from 'utils';

function Settings() {
  const { settings } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const switchTheme = async (e: any) => {
    const isDark = e.target.checked;
    const updatedSettings = { ...settings };
    updatedSettings.theme = isDark ? Themes.Dark : Themes.Light;
    dispatch(updateSettings(updatedSettings));
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardHeader
          title="Subscriptions"
          action={
            <Button variant="outlined" size="small">
              Add new subscription
            </Button>
          }
        />
        <CardContent>
          {settings?.subscriptions.map((sub) => (
            <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {sub.name}
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                {Object.keys(sub).map((key) => (
                  <TextField
                    // @ts-ignore
                    defaultValue={sub[key]}
                    label={displayFormat(key)}
                    // @ts-ignore
                    value={sub[key]}
                  />
                ))}
              </Stack>
            </Card>
          ))}
        </CardContent>
      </Card>
      <Stack direction="row" spacing={2}>
        <Card sx={{ width: '200px' }}>
          <CardHeader title="Theme" />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  onChange={switchTheme}
                  checked={settings.theme === Themes.Dark}
                />
              }
              label={Themes.Dark}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Gym info" />
          <CardContent>
            <TextField
              label="gym name"
              defaultValue={settings?.gymName}
              value={settings?.gymName}
            />
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}

export default Settings;

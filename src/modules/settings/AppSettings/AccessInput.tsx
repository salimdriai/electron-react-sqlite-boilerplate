import * as React from 'react';

import { useTranslation } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { showAccessInput } from 'features/settings';
import { useAppDispatch, useAppSelector } from 'features/store';

function AccessInput() {
  const { t } = useTranslation();
  const { settings } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const onChange = async (e: any) => {
    const show = e.target.checked;
    dispatch(showAccessInput(show));
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <KeyboardIcon color="info" />
        <Typography variant="h6">{t(`settings.accessInput.show`)}</Typography>
      </Stack>
      <FormControlLabel
        label=""
        control={<Switch onChange={onChange} checked={settings.accessInput} />}
      />
    </Stack>
  );
}
export default AccessInput;

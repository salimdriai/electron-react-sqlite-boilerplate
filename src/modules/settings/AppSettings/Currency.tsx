import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useAppDispatch /* useAppSelector */ } from 'features/store';
import { switchLanguage } from 'features/settings';

function Currency() {
  const { t, i18n } = useTranslation();
  //  const { settings } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const onChange = async (e: any) => {
    const lang = e.target.value || 'en';
    dispatch(switchLanguage(lang));
    i18n.changeLanguage(lang);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <AttachMoneyIcon color="secondary" />
        <Typography variant="h6">{t('common.currency')}</Typography>
      </Stack>
      <Select disabled sx={{ width: 200 }} value="DZ" onChange={onChange}>
        <MenuItem value="DZ">DZ</MenuItem>
      </Select>
    </Stack>
  );
}

export default Currency;

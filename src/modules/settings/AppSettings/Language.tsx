import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';

import { Lang } from 'types';
import { useAppDispatch, useAppSelector } from 'features/store';
import { switchLanguage } from 'features/settings';

function Language() {
  const { t, i18n } = useTranslation();
  const { settings } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const onChange = async (e: any) => {
    const lang = e.target.value || 'en';
    dispatch(switchLanguage(lang));
    i18n.changeLanguage(lang);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <LanguageIcon color="info" />
        <Typography variant="h6">{t('common.language')}</Typography>
      </Stack>
      <Select
        size="small"
        sx={{ width: 200 }}
        value={settings.lang}
        onChange={onChange}
      >
        {Object.entries(Lang).map(([key, value]) => (
          <MenuItem key={key} value={value}>
            {t(`settings.language.${value}`)}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}

export default Language;

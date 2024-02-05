import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
    <Card variant="outlined">
      <CardHeader
        title={t('common.language')}
        action={<LanguageIcon color="secondary" />}
      />
      <CardContent>
        <Select sx={{ width: 200 }} value={settings.lang} onChange={onChange}>
          {Object.keys(Lang).map((key: string) => (
            <MenuItem key={key} value={(Lang as any)[key]}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </CardContent>
    </Card>
  );
}

export default Language;

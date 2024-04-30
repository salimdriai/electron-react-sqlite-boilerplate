import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import rfidImg from 'assets/images/rfid-key.png';
import tripod from 'assets/images/tripod-turnstile.jpg';
import nfc from 'assets/images/nfc-mobile.jpg';

const imgStyle: any = {
  borderRadius: 12,
  width: 150,
  height: 150,
  objectFit: 'cover',
};

function AccessType() {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack spacing={1}>
        <Typography variant="h6">{t(`settings.accessType`)}</Typography>
        <Stack spacing={1} direction="row">
          <Stack>
            <Button sx={{ p: '8px!important' }} variant="outlined" value="rfid">
              <img alt="rfid" src={rfidImg} style={imgStyle} />
            </Button>
            <Typography variant="body2" align="center">
              {t('info.selected')}
            </Typography>
          </Stack>
          <Stack>
            <Button
              disabled
              sx={{ p: '8px!important', opacity: 0.6 }}
              variant="outlined"
              value="tripod"
            >
              <img alt="tripod" src={tripod} style={imgStyle} />
            </Button>
            <Typography variant="body2" align="center">
              {t('info.available.soon')}
            </Typography>
          </Stack>
          <Stack>
            <Button
              disabled
              sx={{ p: '8px!important', opacity: 0.6 }}
              variant="outlined"
              value="tripod"
            >
              <img alt="nfc" src={nfc} style={imgStyle} />
            </Button>
            <Typography variant="body2" align="center">
              {t('info.available.soon')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
export default AccessType;

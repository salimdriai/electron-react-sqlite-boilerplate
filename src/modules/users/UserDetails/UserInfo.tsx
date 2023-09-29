import React from 'react';

import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { User } from 'types';
import { getAge } from 'utils';

function UserInfo({ user }: { user: User }) {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row">
          <Box flex={1}>
            <Typography>
              {t('info.age')} : {getAge(user.birthDate)}
            </Typography>
            <Typography>
              {t('info.phoneNumber')} : {user.phoneNumber}
            </Typography>
            <Typography>
              {t('info.sex')} : {user.sex || 'N/A'}
            </Typography>
            <Typography>
              {t('info.weight')} : {user.weight || 'N/A'} kg
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography>
              {t('info.height')} : {user.height || 'N/A'} cm
            </Typography>
            <Typography>
              {t('info.bloodType')} : {user.bloodType || 'N/A'}
            </Typography>
            <Typography>
              {t('info.registeredAt')} : {user.registeredAt}
            </Typography>
            <Typography>
              {t('info.allTimeSessions')} : {user.allTimeSessions}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default UserInfo;

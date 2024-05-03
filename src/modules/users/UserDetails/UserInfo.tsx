import React, { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import QrCode from 'components/Qrcode';
import { User } from 'types';
import { formatDate, getAge } from 'utils';
import { useAppDispatch, useAppSelector } from 'features/store';
import { getUserPayments } from 'features/payments/reducers';

function UserInfo({ user }: { user: User }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { userPayments = [] } = useAppSelector((state) => state.payments);
  const { settings } = useAppSelector((state) => state.settings);

  const latestPayment = useMemo(() => {
    const sortedPayments = [...userPayments]?.sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );

    const res = sortedPayments.length > 0 ? sortedPayments[0] : null;
    return res;
  }, [userPayments]);

  const getQrCodeData = (): string => {
    const { id, firstName, lastName, registeredAt, subscriptions } = user;

    const formattedSubs = subscriptions?.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ id: ID, userId, planId, ...rest }) => rest
    );

    return JSON.stringify({
      id: `${settings.appId}:${id}`,
      name: `${firstName} ${lastName}`,
      registeredAt,
      subscriptions: formattedSubs,
    });
  };

  useEffect(() => {
    dispatch(getUserPayments(user.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Stack direction="row" spacing={2}>
      <Card sx={{ flex: 2 }} variant="outlined">
        <CardHeader
          sx={{ pb: 0 }}
          title={<Typography variant="h6">Info</Typography>}
        />
        <CardContent>
          <Stack direction="row">
            <Box flex={1}>
              <Typography variant="body2">
                {t('info.age')} : <b> {getAge(user.birthDate)}</b>
              </Typography>
              <Typography variant="body2">
                {t('info.phoneNumber')} :<b> {user.phoneNumber}</b>
              </Typography>
              <Typography variant="body2">
                {t('info.sex')} :<b> {user.sex || 'N/A'}</b>
              </Typography>
              <Typography variant="body2">
                {t('info.weight')} :<b> {user.weight || 'N/A'} kg</b>
              </Typography>
              <Typography variant="body2">
                {t('info.height')} :<b> {user.height || 'N/A'} cm</b>
              </Typography>
              <Typography variant="body2">
                {t('info.bloodType')} :<b> {user.bloodType || 'N/A'}</b>
              </Typography>
              <Typography variant="body2">
                {t('info.registeredAt')} :<b> {user.registeredAt}</b>
              </Typography>
            </Box>
            <Box>
              <QrCode value={getQrCodeData()} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1 }} variant="outlined">
        <CardHeader
          sx={{ pb: 0 }}
          title={<Typography variant="h6">{t('common.history')}</Typography>}
        />
        <CardContent>
          <Stack spacing={1}>
            {user.lastEntryTimestamp !== 0 && (
              <Box>
                <Typography variant="body2">
                  {t('common.latestEntry')}
                </Typography>
                {formatDate(user.lastEntryTimestamp)}
                {' - '}
                {new Date(user.lastEntryTimestamp).toLocaleTimeString()}
              </Box>
            )}
            <Box>
              <Typography variant="body2">
                {t('common.latestPayment')}
              </Typography>
              {latestPayment && (
                <Typography fontSize={14}>
                  {`${formatDate(latestPayment.paidAt)} | ${
                    latestPayment.amount
                  } DA`}{' '}
                  <br />
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body2">{t('common.latestEntry')}</Typography>
              {user.lastEntryTimestamp ? (
                <Typography fontSize={14}>
                  {formatDate(user.lastEntryTimestamp)}
                  <br />
                </Typography>
              ) : (
                <Typography fontSize={14}>{t('common.empty')}</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body2">
                {t('common.lastNotified')}
              </Typography>
              {user?.lastNotified ? (
                <Typography fontSize={14}>
                  {formatDate(user.lastNotified)}
                  <br />
                </Typography>
              ) : (
                <Typography fontSize={14}>{t('common.empty')}</Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default UserInfo;

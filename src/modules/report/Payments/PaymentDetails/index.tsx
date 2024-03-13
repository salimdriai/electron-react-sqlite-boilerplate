import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { FreeSession, Payment } from 'types';
import { getStats, StatData } from '../helpers';

const PaymentDetails = ({
  payments,
  freeSessions,
}: {
  payments: Payment[];
  freeSessions: FreeSession[];
}) => {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const paymentData = payments.map((payment) => ({
      paidAt: payment.paidAt,
      amount: payment.amount,
    })) as StatData[];

    const freeSessionsData = freeSessions.map((session) => ({
      paidAt: session.enteredAt,
      amount: session.totalPaid,
    }));

    const paymentsStats = getStats(paymentData);
    const freeSessionsStats = getStats(freeSessionsData);

    return { paymentsStats, freeSessionsStats };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, freeSessions]);

  return (
    <Stack
      flex={2}
      variant="outlined"
      component={Card}
      flexWrap="wrap"
      p={2}
      gap={2}
      spacing={4}
    >
      <Stack spacing={1}>
        <Typography color="secondary">
          {t('subscriptions.subscriptions')}
        </Typography>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.lastMonth')}
          </Typography>
          <Typography variant="h6">
            {stats.paymentsStats.revenueLastMonth} DA
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.currentMonth')}
          </Typography>
          <Typography variant="h6">
            {stats.paymentsStats.revenueThisMonth} DA
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.lastYear')}
          </Typography>
          <Typography variant="h6">
            {stats.paymentsStats.revenueLastYear} DA
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.currentYear')}
          </Typography>
          <Typography variant="h6">
            {stats.paymentsStats.revenueThisYear} DA
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Typography color="secondary">{t('common.freeSession')}</Typography>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.lastMonth')}
          </Typography>
          <Typography variant="h6">
            {stats.freeSessionsStats.revenueLastMonth} DA
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.currentMonth')}
          </Typography>
          <Typography variant="h6">
            {stats.freeSessionsStats.revenueThisMonth} DA
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.lastYear')}
          </Typography>
          <Typography variant="h6">
            {stats.freeSessionsStats.revenueLastYear} DA
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('payments.currentYear')}
          </Typography>
          <Typography variant="h6">
            {stats.freeSessionsStats.revenueThisYear} DA
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PaymentDetails;

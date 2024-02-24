import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatCard from 'components/StatCard';
import { FreeSession, Payment } from 'types';
import { getStats, StatData } from '../helpers';

const PaymentStats = ({
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

    const freeSessionsStats = getStats(freeSessionsData);
    const paymentsStats = getStats(paymentData);

    const revenueLastMonth =
      freeSessionsStats.revenueLastMonth + paymentsStats.revenueLastMonth;
    const revenueThisMonth =
      freeSessionsStats.revenueThisMonth + paymentsStats.revenueThisMonth;
    const revenueLastYear =
      freeSessionsStats.revenueLastYear + paymentsStats.revenueLastYear;
    const revenueThisYear =
      freeSessionsStats.revenueThisYear + paymentsStats.revenueThisYear;

    return [
      {
        id: 'last_month',
        value: `${revenueLastMonth} DA`,
        label: t('payments.lastMonth'),
        icon: <AttachMoneyIcon />,
        color: 'primary.main',
        maxWidth: 'unset',
      },
      {
        id: 'current_month',
        value: `${revenueThisMonth} DA`,
        label: t('payments.currentMonth'),
        icon: <AttachMoneyIcon />,
        color: 'primary.main',
        maxWidth: 'unset',
      },
      {
        id: 'last_year',
        value: `${revenueLastYear} DA`,
        label: `${t('payments.lastYear')}  ( ${new Date().getFullYear() - 1} )`,
        icon: <AttachMoneyIcon />,
        color: 'secondary.main',
        maxWidth: 'unset',
      },
      {
        id: 'current_year',
        value: `${revenueThisYear} DA`,
        label: `${t('payments.currentYear')}  ( ${new Date().getFullYear()} )`,
        icon: <AttachMoneyIcon />,
        color: 'secondary.main',
        maxWidth: 'unset',
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, freeSessions]);

  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      {stats.map((stat) => (
        <Box sx={{ minWidth: 350 }}>
          <StatCard
            key={stat.id}
            maxWidth="unset"
            label={stat.label}
            icon={stat.icon}
            value={stat.value}
            color={stat.color}
            valueTag="h5"
          />
        </Box>
      ))}
    </Stack>
  );
};

export default PaymentStats;

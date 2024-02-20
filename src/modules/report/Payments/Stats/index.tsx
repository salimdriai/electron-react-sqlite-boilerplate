import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatCard from 'components/StatCard';
import { Payment } from 'types';

const PaymentStats = ({ payments }: { payments: Payment[] }) => {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const currentDate = new Date();
    const firstDayOfLastYear = new Date(currentDate.getFullYear() - 1, 0, 1);
    const lastDayOfLastYear = new Date(currentDate.getFullYear(), 0, 0);
    const firstDayOfCurrentYear = new Date(currentDate.getFullYear(), 0, 1);

    const firstDayOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    const lastDayOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const revenueLastMonth = payments.reduce((acc, current) => {
      const paymentDate = new Date(current.paidAt);
      if (
        paymentDate >= firstDayOfLastMonth &&
        paymentDate <= lastDayOfLastMonth
      ) {
        return acc + Number(current.amount);
      }
      return acc;
    }, 0);

    // Filter payments made within this month and sum their amounts
    const revenueThisMonth = payments.reduce((acc, current) => {
      const paymentDate = new Date(current.paidAt);
      if (paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth) {
        return acc + Number(current.amount);
      }
      return acc;
    }, 0);

    const revenueLastYear = payments.reduce((acc, current) => {
      const paymentDate = new Date(current.paidAt);
      if (
        paymentDate >= firstDayOfLastYear &&
        paymentDate <= lastDayOfLastYear
      ) {
        return acc + Number(current.amount);
      }
      return acc;
    }, 0);

    const revenueThisYear = payments.reduce((acc, current) => {
      const paymentDate = new Date(current.paidAt);
      if (paymentDate >= firstDayOfCurrentYear && paymentDate <= currentDate) {
        return acc + Number(current.amount);
      }
      return acc;
    }, 0);

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
  }, [payments]);

  return (
    <Stack flex={2} spacing={2}>
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          maxWidth="unset"
          label={stat.label}
          icon={stat.icon}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </Stack>
  );
};

export default PaymentStats;

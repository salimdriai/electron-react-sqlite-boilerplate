import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ManIcon from '@mui/icons-material/Man';
import WcIcon from '@mui/icons-material/Wc';
import WomanIcon from '@mui/icons-material/Woman';
import LoginIcon from '@mui/icons-material/Login';
import StatCard from 'components/StatCard';
import { Sex, User } from 'types';

const UsersStats = ({ users }: { users: User[] }) => {
  const { t } = useTranslation();
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(({ subscriptions }) =>
      subscriptions.find(
        (sub) => new Date(sub.endsAt).getTime() > new Date().getTime()
      )
    ).length;
    const male = users.filter((user) => user.sex === Sex.Male).length;
    const female = users.filter((user) => user.sex === Sex.Female).length;

    return [
      {
        id: 'total',
        value: `${total}`,
        label: t('user.total'),
        icon: <WcIcon />,
        color: 'primary.main',
        maxWidth: 'unset',
      },
      {
        id: 'active',
        value: `${active}`,
        label: t('user.active'),
        icon: <LoginIcon />,
        color: 'success.main',
        maxWidth: 'unset',
      },
      {
        id: 'male',
        value: `${male}`,
        label: t('user.male'),
        icon: <ManIcon />,
        color: 'secondary.main',
        maxWidth: 'unset',
      },
      {
        id: 'femal',
        value: `${female}`,
        label: t('user.female'),
        icon: <WomanIcon />,
        color: 'info.main',
        maxWidth: 'unset',
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      {stats.map((stat) => (
        <Box key={stat.id} sx={{ minWidth: 350 }}>
          <StatCard
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

export default UsersStats;

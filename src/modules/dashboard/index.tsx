import * as React from 'react';
import Stack from '@mui/material/Stack';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { StatCardProps } from '../../types';
import StatCard from '../../components/StatCard';
import Overview from './Overview';
import Traffic from './Traffic';

const stats: StatCardProps[] = [
  {
    value: '164',
    label: 'entries',
    icon: <LoginIcon />,
    color: 'primary.main',
  },
  {
    value: '12',
    label: 'free sessions',
    icon: <AccessAlarmIcon />,
    color: 'secondary.main',
  },
  {
    value: '14',
    label: 'new users',
    icon: <PersonAddIcon />,
    color: 'info.dark',
  },
];

export default function Dashbaors() {
  return (
    <Stack spacing={5}>
      <Stack direction="row" spacing={5}>
        {stats.map(({ value, label, icon, color }) => (
          <StatCard
            key={label}
            value={value}
            label={label}
            icon={icon}
            color={color}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={5} sx={{ maxWidth: '100%' }}>
        <Overview />
        <Traffic />
      </Stack>
    </Stack>
  );
}

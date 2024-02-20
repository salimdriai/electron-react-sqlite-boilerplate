import React from 'react';
import Stack from '@mui/material/Stack';
import { useAppSelector } from 'features/store';
import { Permission } from 'types';
import NewUsersChart from './NewUsersChart';
import SexChart from './SexChart';

const UsersAnalytics = () => {
  const { permission } = useAppSelector((state) => state.authentication);
  return (
    <Stack direction="row" spacing={5} sx={{ maxWidth: '100%' }}>
      <NewUsersChart />
      {(permission === Permission.Admin || permission === Permission.All) && (
        <SexChart />
      )}
    </Stack>
  );
};

export default UsersAnalytics;

import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { useAppDispatch, useAppSelector } from 'features/store';
import { fetchUsers } from 'features/users/reducers';
import { Permission } from 'types';
import NewUsersChart from './NewUsersChart';
import SexChart from './SexChart';
import UsersStats from './UsersStats';

const UsersAnalytics = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers(Permission.Admin));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={4}>
      <UsersStats users={users} />
      <Stack direction="row" spacing={2} sx={{ maxWidth: '100%' }}>
        <NewUsersChart users={users} />
        <SexChart users={users} />
      </Stack>
    </Stack>
  );
};

export default UsersAnalytics;

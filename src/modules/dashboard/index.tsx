import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAppDispatch, useAppSelector } from 'features/store';
import { User, StatCardProps } from 'types';
import img1 from 'assets/images/img-6.jpg';
import img2 from 'assets/images/img-2.png';
import img3 from 'assets/images/img-4.jpg';
import Clock from 'components/Clock';
import { fetchUsers } from 'features/users/reducers';
import StatCard from '../../components/StatCard';

import UsersTable from './UsersTable';
import SessionsTable from './SessionsTable';
import AccessTimeChart from './AccessTimeChart';

export default function Dashbaors() {
  const { t } = useTranslation();
  const { permission } = useAppSelector((state) => state.authentication);
  const [latestEnteredUsers, setLatestEnteredUsers] = useState<User[]>([]);

  const [statistics, setStatistics] = useState<StatCardProps[]>([
    {
      id: 'entries',
      value: latestEnteredUsers.length.toString(),
      label: t('stats.today.entries'),
      icon: <LoginIcon />,
      color: 'primary.main',
      img: img1,
    },
    {
      id: 'free_sessions',
      value: '0',
      label: t('stats.today.freeSession'),
      icon: <AccessAlarmIcon />,
      color: 'secondary.main',
      img: img2,
    },
    {
      id: 'new_users',
      value: '0',
      label: t('stats.today.newUsers'),
      icon: <PersonAddIcon />,
      color: 'info.dark',
      img: img3,
    },
  ]);

  const { users, isLoading } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getDayNewUsers = async () => {
      let newUsersCount = 0;
      let todayFreeSessions = 0;

      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);

      // const users = await window.electron.getAllUsers(permission);
      if (!Array.isArray(users)) return toast.error('somthing went wrong !');

      users.forEach((user: User) => {
        const registrationTime = new Date(user.registeredAt).getTime();
        if (registrationTime === dayStart.getTime()) {
          newUsersCount += 1;
        }

        let isEnteredToday = false;

        if (user.lastEntryTimestamp > dayStart.getTime()) {
          isEnteredToday = true;
        }

        if (isEnteredToday) {
          const isUserExist = latestEnteredUsers.find((u) => u.id === user.id);

          if (!isUserExist) {
            setLatestEnteredUsers((prev) => [...prev, user]);
          }
        }
      });

      const freeSessions = await window.electron.getFreeSessions();
      if (!Array.isArray(users)) return toast.error('somthing went wrong !');

      freeSessions.forEach((session: any) => {
        const entryTime = new Date(session.enteredAt).getTime();

        if (entryTime > dayStart.getTime()) {
          todayFreeSessions += 1;
        }
      });

      const updatedNewUser = statistics.map((stat) =>
        stat.id === 'new_users'
          ? { ...stat, value: newUsersCount.toString() }
          : stat
      );

      const updatedStatistics = updatedNewUser.map((stat) =>
        stat.id === 'free_sessions'
          ? { ...stat, value: todayFreeSessions.toString() }
          : stat
      );

      setStatistics(updatedStatistics);
      return null;
    };

    if (!isLoading) {
      getDayNewUsers();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    dispatch(fetchUsers(permission));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={5}>
      <Stack direction="row" spacing={5}>
        {statistics.map(({ value, label, icon, color, img, id }) => (
          <StatCard
            key={label}
            value={
              id === 'entries' ? latestEnteredUsers.length.toString() : value
            }
            label={t(label)}
            icon={icon}
            color={color}
            img={img}
          />
        ))}
        <Clock />
      </Stack>

      <Stack direction="row" spacing={4}>
        <Box flex={4}>
          <AccessTimeChart latestEnteredUsers={latestEnteredUsers} />
        </Box>
        <Box flex={2}>
          <SessionsTable />
        </Box>
      </Stack>
      <UsersTable latestEnteredUsers={latestEnteredUsers} />
    </Stack>
  );
}

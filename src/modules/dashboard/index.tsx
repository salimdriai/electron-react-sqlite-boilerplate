import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAppSelector } from 'features/store';
import { User, StatCardProps, FreeSession } from 'types';
import img1 from 'assets/images/img-6.jpg';
import img2 from 'assets/images/img-2.png';
import img3 from 'assets/images/img-4.jpg';
import StatCard from '../../components/StatCard';
import NewUsersChart from './NewUsersChart';
import SexChart from './SexChart';
import UsersTable from './UsersTable';
import SessionsTable from './SessionsTable';

export default function Dashbaors() {
  const { t } = useTranslation();
  const { permission } = useAppSelector((state) => state.authentication);
  const [latestEnteredUsers, setLatestEnteredUsers] = useState<User[]>([]);
  const [latestFreeSessions, setLatestFreeSessions] = useState<FreeSession[]>(
    []
  );
  const [statistics, setStatistics] = useState<StatCardProps[]>([
    {
      id: 'entries',
      value: '0',
      label: t('common.entries'),
      icon: <LoginIcon />,
      color: 'primary.main',
      img: img1,
    },
    {
      id: 'free_sessions',
      value: '0',
      label: t('common.freeSession'),
      icon: <AccessAlarmIcon />,
      color: 'secondary.main',
      img: img2,
    },
    {
      id: 'new_users',
      value: '0',
      label: t('user.newUsers'),
      icon: <PersonAddIcon />,
      color: 'info.dark',
      img: img3,
    },
  ]);

  useEffect(() => {
    const getDayNewUsers = async () => {
      let newUsersCount = 0;
      let todayEntries = 0;
      let todayFreeSessions = 0;

      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);

      const allUsers = await window.electron.getAllUsers(permission);
      if (!Array.isArray(allUsers)) return toast.error('somthing went wrong !');

      allUsers.forEach((user: User) => {
        const registrationTime = new Date(user.registeredAt).getTime();
        if (registrationTime === dayStart.getTime()) {
          newUsersCount += 1;
        }

        let isEnteredToday = false;
        user.currentSubscriptions.forEach((sub) => {
          if (sub.lastEntryTimestamp > dayStart.getTime()) {
            isEnteredToday = true;
          }
        });

        if (isEnteredToday) {
          setLatestEnteredUsers((prev) => [...prev, user]);
          todayEntries += 1;
        }
      });

      const freeSessions = await window.electron.getFreeSessions();
      if (!Array.isArray(allUsers)) return toast.error('somthing went wrong !');

      freeSessions.forEach((session: any) => {
        const entryTime = new Date(session.enteredAt).getTime();
        if (entryTime === dayStart.getTime()) {
          todayFreeSessions += 1;
          setLatestFreeSessions((prev) => [...prev, session]);
        }
      });

      const updatedNewUser = statistics.map((stat) =>
        stat.id === 'new_users'
          ? { ...stat, value: newUsersCount.toString() }
          : stat
      );

      const updatedTodayEntries = updatedNewUser.map((stat) =>
        stat.id === 'entries'
          ? { ...stat, value: todayEntries.toString() }
          : stat
      );

      const updatedStatistics = updatedTodayEntries.map((stat) =>
        stat.id === 'free_sessions'
          ? { ...stat, value: todayFreeSessions.toString() }
          : stat
      );

      setStatistics(updatedStatistics);
      return null;
    };

    getDayNewUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={5}>
      <Stack direction="row" spacing={5}>
        {statistics.map(({ value, label, icon, color, img }) => (
          <StatCard
            key={label}
            value={value}
            label={t(label)}
            icon={icon}
            color={color}
            img={img}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={5} sx={{ maxWidth: '100%' }}>
        <NewUsersChart />
        <SexChart />
      </Stack>
      <Stack direction="row" spacing={5}>
        <Box flex={4}>
          <UsersTable latestEnteredUsers={latestEnteredUsers} />
        </Box>
        <Box flex={2}>
          <SessionsTable latestFreeSessions={latestFreeSessions} />
        </Box>
      </Stack>
    </Stack>
  );
}

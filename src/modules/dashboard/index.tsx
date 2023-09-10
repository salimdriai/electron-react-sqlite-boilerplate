import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Permission, User, StatCardProps } from 'types';
import img1 from 'assets/images/img-6.jpg';
import img2 from 'assets/images/img-2.png';
import img3 from 'assets/images/img-4.jpg';
import StatCard from '../../components/StatCard';
import NewUsersChart from './NewUsersChart';
import SexChart from './SexChart';

export default function Dashbaors() {
  const [statistics, setStatistics] = useState<StatCardProps[]>([
    {
      id: 'entries',
      value: '164',
      label: 'entries',
      icon: <LoginIcon />,
      color: 'primary.main',
      img: img1,
    },
    {
      id: 'free_sessions',
      value: '12',
      label: 'free sessions',
      icon: <AccessAlarmIcon />,
      color: 'secondary.main',
      img: img2,
    },
    {
      id: 'new_users',
      value: '14',
      label: 'new users',
      icon: <PersonAddIcon />,
      color: 'info.dark',
      img: img3,
    },
  ]);

  useEffect(() => {
    const getDayNewUsers = async () => {
      let newUsersCount = 0;
      let todayEntries = 0;

      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);

      const allUsers = await window.electron.getAllUsers(Permission.Admin);
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
          todayEntries += 1;
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

      setStatistics(updatedTodayEntries);
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
            label={label}
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
    </Stack>
  );
}

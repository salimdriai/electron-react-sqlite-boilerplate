import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import { sessionsEntry } from 'features/users/reducers';
import { useAppDispatch, useAppSelector } from 'features/store';
import { setUser } from 'features/users';
import UserDetails from '../UserDetails';

function UserEntry() {
  const [isUserAccessed, setIsUserAccessed] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user: accessedUser } = useAppSelector((state) => state.users);
  const {
    settings: { accessInput },
  } = useAppSelector((state) => state.settings);
  const handleclose = () => {
    dispatch(setUser(null));
    setIsUserAccessed(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAccess = (id: any) => {
    dispatch(sessionsEntry(id))
      .unwrap()
      .then(
        ({
          user,
          isEnteredThreeHoursAgo,
          isMaxSessionsSpent,
          isSubscriptionExpired,
          message,
        }) => {
          if (!user) return null;
          if (
            isEnteredThreeHoursAgo ||
            isMaxSessionsSpent ||
            isSubscriptionExpired
          ) {
            toast.error(t(message));
          } else {
            toast.success(t(message));
          }

          setIsUserAccessed(true);
          dispatch(setUser(user));
          return null;
        }
      )
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    let scannedValue = '';
    let typingTimstamps: number[] = [];
    // const refusedTypingSpeed = 25;

    const accessListener = (e: any) => {
      if (e.target.localName === 'input') return;

      const pressedKey = e.key;

      if (pressedKey && pressedKey.length === 1) {
        const now = new Date().getTime();
        typingTimstamps.push(now);
        scannedValue += pressedKey;
      }
      // const diffs = getTypingDiffs(typingTimstamps);

      if (pressedKey === 'Enter' && scannedValue.length > 3) {
        setTimeout(() => {
          handleAccess(scannedValue);

          scannedValue = '';
          typingTimstamps = [];
        }, 500);
      }
    };
    document.addEventListener('keydown', accessListener);

    return () => document.removeEventListener('keydown', accessListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [userId, setUserId] = useState('');

  const handleChange = (e: any) => {
    setUserId(e.target.value);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAccess(userId);
          setUserId('');
        }}
        style={{ display: accessInput ? 'block' : 'none' }}
      >
        <TextField onChange={handleChange} value={userId} size="small" />
      </form>
      <Drawer
        anchor="right"
        sx={{
          '& > .MuiPaper-root': {
            width: '70%',
            p: 5,
            backgroundColor: 'background.default',
            overflowY: 'auto',
          },
        }}
        open={!!accessedUser && isUserAccessed}
        onClose={handleclose}
      >
        {accessedUser && <UserDetails />}
      </Drawer>
    </>
  );
}

export default UserEntry;

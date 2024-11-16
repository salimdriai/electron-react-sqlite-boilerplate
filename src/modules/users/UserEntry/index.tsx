import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { sessionsEntry } from 'features/users/reducers';
import { useAppDispatch, useAppSelector } from 'features/store';
import { setUser } from 'features/users';
import { removeZerosFromId } from 'utils';
import UserDetails from '../UserDetails';

function UserEntry() {
  const [isUserAccessed, setIsUserAccessed] = useState(false);
  const [userId, setUserId] = useState('');

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { user: accessedUser } = useAppSelector((state) => state.users);
  const {
    settings: { accessInput, removeZeros },
  } = useAppSelector((state) => state.settings);

  const handleChange = (e: any) => {
    setUserId(e.target.value);
  };

  const handleclose = () => {
    setIsUserAccessed(false);
    dispatch(setUser(null));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAccess = (id: any) => {
    const idWithoutZeros = removeZeros ? removeZerosFromId(id) : id;
    dispatch(sessionsEntry(idWithoutZeros))
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
          //  setTimeout(() => handleclose(), 10000);
          return null;
        }
      )
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    let scannedValue = '';
    let typingTimstamps: number[] = [];

    const accessListener = (e: any) => {
      if (e.target.localName === 'input') return;

      const pressedKey = e.key;

      if (pressedKey && pressedKey.length === 1) {
        const now = new Date().getTime();
        typingTimstamps.push(now);
        scannedValue += pressedKey;
      }

      if (pressedKey === 'Enter' && scannedValue.length > 3) {
        setTimeout(() => {
          handleAccess(scannedValue);

          scannedValue = '';
          typingTimstamps = [];
        }, 500);
      }
    };
    document.addEventListener('keydown', accessListener);

    return () => {
      setIsUserAccessed(false);
      document.removeEventListener('keydown', accessListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        anchor="top"
        sx={{
          '& > .MuiPaper-root': {
            width: '100%',
            p: 5,
            backgroundColor: 'background.default',
            overflowY: 'auto',
          },
        }}
        open={!!accessedUser && isUserAccessed}
        onClose={handleclose}
      >
        {accessedUser && <UserDetails />}
        <Stack alignItems="center">
          <IconButton onClick={handleclose}>
            <KeyboardArrowUpIcon color="primary" />
          </IconButton>
        </Stack>
      </Drawer>
    </>
  );
}

export default UserEntry;

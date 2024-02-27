import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Drawer from '@mui/material/Drawer';
import { sessionsEntry } from 'features/users/reducers';
import { useAppDispatch, useAppSelector } from 'features/store';
import { setUser } from 'features/users';
import UserDetails from '../UserDetails';

const getTypingDiffs = (timestamps: number[]): number[] => {
  const diffs: number[] = [];
  timestamps.forEach((time, i) => {
    if (timestamps[i + 1]) {
      const diff = timestamps[i + 1] - time;
      diffs.push(diff);
    }
  });

  return diffs;
};

function UserEntry() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user: userDetails } = useAppSelector((state) => state.users);

  const handleclose = () => {
    dispatch(setUser(null));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAccess = (e: any) => {
    const id = e.replace(/^0+/, '').trim();

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
          if (
            isEnteredThreeHoursAgo ||
            isMaxSessionsSpent ||
            isSubscriptionExpired
          ) {
            toast.error(t(message));
          } else {
            toast.success(t(message));
          }

          dispatch(setUser(user));

          return null;
        }
      )
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    let scannedValue = '';
    let typingTimstamps: number[] = [];
    const refusedTypingSpeed = 25;

    const accessListener = (e: any) => {
      if (e.target.localName === 'input') return;

      const pressedKey = e.key;

      if (pressedKey && pressedKey.length === 1) {
        const now = new Date().getTime();
        typingTimstamps.push(now);
        scannedValue += pressedKey;
      }
      const diffs = getTypingDiffs(typingTimstamps);
      const isLargeDiffExist = diffs.some((diff) => diff > refusedTypingSpeed);

      if (
        pressedKey === 'Enter' &&
        scannedValue.length > 5 &&
        !isLargeDiffExist
      ) {
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

  return (
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
      open={!!userDetails}
      onClose={handleclose}
    >
      {userDetails && <UserDetails />}
    </Drawer>
  );
}

export default UserEntry;

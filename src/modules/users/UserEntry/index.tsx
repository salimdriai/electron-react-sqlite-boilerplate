import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { sessionsEntry } from 'features/users/reducers';
import { useAppDispatch, useAppSelector } from 'features/store';
import { setUser } from 'features/users';
import UserDetails from '../UserDetails';

function UserEntry() {
  const [userId, setUserId] = useState('');

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user: userDetails } = useAppSelector((state) => state.users);

  const handleclose = () => {
    dispatch(setUser(null));
    setUserId('');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEntry = (e: any) => {
    const id = e.target.value.replace(/^0+/, '').trim();
    setUserId(id);

    setTimeout(() => {
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

            setUserId('');
            dispatch(setUser(user));

            return null;
          }
        )
        .catch((err) => toast.error(err));
    }, 1000);
  };

  return (
    <>
      <TextField
        sx={{ height: '40px' }}
        size="small"
        value={userId}
        onChange={handleEntry}
        onBlur={(e) => {
          if (e.relatedTarget === null) {
            e.target.focus();
          }
        }}
      />
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
        <Stack direction="row" justifyContent="end">
          <TextField
            sx={{ height: '40px' }}
            size="small"
            value={userId}
            id="entry-input"
            onChange={handleEntry}
            onBlur={(e) => {
              if (e.relatedTarget === null) {
                e.target.focus();
              }
            }}
          />
        </Stack>
        {userDetails && <UserDetails />}
      </Drawer>
    </>
  );
}

export default UserEntry;

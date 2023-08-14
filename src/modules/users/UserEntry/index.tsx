import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

import { sessionsEntry } from 'features/users/reducers';
import { useAppDispatch } from 'features/store';

import UserStatus from 'components/UserStatus';
import { User } from 'types';

function UserEntry() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const dispatch = useAppDispatch();

  const handleChangeUserId = (e: any) => {
    const id = e.target.value;
    setUserId(id);
    dispatch(sessionsEntry(id))
      .unwrap()
      // eslint-disable-next-line promise/always-return
      .then((res) => {
        setUser(res.user);
        console.log(res);
      })
      .catch((err) => console.log('ERRERE', err));
  };

  const handleclose = () => {
    setUser(null);
    setUserId('');
  };

  return (
    <>
      <TextField size="small" value={userId} onChange={handleChangeUserId} />
      <Modal
        open={!!user}
        onClose={handleclose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ width: '60%', p: 5 }}>
          {user && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Card
                variant="outlined"
                sx={{ height: '100px', width: '100px', borderRadius: '50%' }}
              >
                <img
                  src={user.photo as unknown as string}
                  width="100%"
                  height="100%"
                  alt={user.firstName}
                />
              </Card>
              <Stack>
                <Typography fontSize={32} fontWeight={500}>
                  {`${user.firstName} ${user.lastName}`}{' '}
                  <span>
                    <UserStatus status={user.status} />
                  </span>
                </Typography>
                <Typography>id : {user.id} </Typography>
              </Stack>
            </Stack>
          )}
        </Card>
      </Modal>
    </>
  );
}

export default UserEntry;

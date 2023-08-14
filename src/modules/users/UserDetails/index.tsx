import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import UserStatus from 'components/UserStatus';
import { User } from 'types';
import { useAppDispatch } from 'features/store';
import { sessionsEntry } from 'features/users/reducers';

import UserInfo from './UserInfo';
import UserSubscriptions from './UserSubscriptions';

function UserDetails({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/users/add', { state: user });
  };

  const handleEntry = (id: string) => () => {
    dispatch(sessionsEntry(id));
  };

  if (!user) return <Box>Something went wrong !</Box>;

  return (
    <Stack spacing={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
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

        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
      </Stack>

      <UserInfo user={user} />
      <UserSubscriptions user={user} />
    </Stack>
  );
}

export default UserDetails;

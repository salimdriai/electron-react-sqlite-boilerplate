import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { User } from 'types';

import Subscription from 'components/Subscription';
import { useAppSelector, useAppDispatch } from 'features/store';
import { fetchUsers } from 'features/users/reducers';
import UserInfo from './UserInfo';

function UserDetails({
  usersDetails,
  setUsersDetails,
  manualEntry,
}: {
  usersDetails: User;
  setUsersDetails: (user: User | null) => void;
  manualEntry?: (id: string) => void;
}) {
  const [deleteUser, setDeleteUser] = useState<null | string>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { permission } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

  const handleEdit = () => {
    navigate('/users/add', { state: usersDetails });
  };

  const handleDelete = async () => {
    setDeleteUser(usersDetails.id);
  };

  const confirmDeleteUser = async () => {
    await window.electron.removeUser(deleteUser as string);
    setDeleteUser(null);
    toast.success('success');
  };

  const refetchData = async () => {
    const data = await window.electron.getOneUser(usersDetails.id);
    setUsersDetails(data);
    await dispatch(fetchUsers(permission));
  };

  return (
    <Stack spacing={4} height="100%">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Card
            variant="outlined"
            sx={{ height: '100px', width: '100px', borderRadius: '50%' }}
          >
            {usersDetails?.photo ? (
              <img
                src={usersDetails.photo as string}
                width="100%"
                height="100%"
                alt={usersDetails.firstName}
              />
            ) : (
              <Avatar
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'secondary.main',
                  fontSize: 32,
                  colro: '#fff',
                }}
              >
                {usersDetails.firstName.charAt(0).toLocaleUpperCase()}
              </Avatar>
            )}
          </Card>
          <Stack>
            <Typography fontSize={32} fontWeight={500}>
              {`${usersDetails.firstName} ${usersDetails.lastName}`}{' '}
            </Typography>
            <Typography>id : {usersDetails.id} </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon color="error" />}
            onClick={handleDelete}
          >
            {t('actions.delete')}
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            {t('actions.edit')}
          </Button>
        </Stack>
      </Stack>

      <Box>
        <UserInfo user={usersDetails} />
      </Box>
      <Box>
        <Stack spacing={1} component={Card} variant="outlined">
          <CardHeader
            sx={{ pb: 0 }}
            title={
              <Typography variant="h6">
                {t('subscriptions.subscriptions')}
              </Typography>
            }
          />
          <CardContent>
            {usersDetails.subscriptions.map((sub) => (
              <Subscription
                subscription={sub}
                user={usersDetails}
                refetchData={refetchData}
              />
            ))}
          </CardContent>
        </Stack>
      </Box>

      <Box flex={1} />
      <Stack pb={2}>
        <Button
          onClick={() => manualEntry && manualEntry(usersDetails.id)}
          variant="contained"
        >
          {t('actions.manualEntry')}
        </Button>
      </Stack>

      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <DialogTitle>{t('user.delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('user.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)}>
            {t('actions.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDeleteUser}
            autoFocus
          >
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default UserDetails;

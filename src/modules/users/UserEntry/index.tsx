import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { sessionsEntry, fetchUsers } from 'features/users/reducers';
import { useAppDispatch, useAppSelector } from 'features/store';
import { User } from 'types';
import Subscription from 'components/Subscription';

function UserEntry() {
  const [userId, setUserId] = useState('');

  const [enteredUser, setEnteredUser] = React.useState<{
    open: boolean;
    user: null | User;
    message: string;
  }>({
    open: false,
    user: null,
    message: '',
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { permission } = useAppSelector((state) => state.authentication);
  const handleclose = () => {
    setEnteredUser({
      open: false,
      user: null,
      message: '',
    });
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
            user: entered,
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
              toast.warning(t(message));
            } else {
              toast.success(t(message));
            }

            setUserId('');
            setEnteredUser({
              open: true,
              user: entered,
              message,
            });
            return null;
          }
        )
        .catch((err) => toast.error(err));
    }, 1000);
  };

  const navigateToUser = () => {
    navigate('/users/add', { state: enteredUser.user });
    handleclose();
  };

  const refetchData = async () => {
    const user = await window.electron.getOneUser(
      enteredUser.user?.id as string
    );
    setEnteredUser(user);
    dispatch(fetchUsers(permission));
  };

  return (
    <>
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
      <Modal
        disableAutoFocus
        open={enteredUser.open}
        onClose={handleclose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Card sx={{ width: '60%', p: 3 }}>
          {enteredUser.user && (
            <>
              <>
                <Stack gap={2} direction="row" justifyContent="end" mb={2}>
                  <TextField
                    autoFocus
                    id="hidden-input"
                    size="small"
                    value={userId}
                    onChange={handleEntry}
                  />
                  <IconButton onClick={handleclose}>
                    <CloseIcon />
                  </IconButton>
                </Stack>
                <Divider />
              </>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                mt={2}
                mb={4}
              >
                <Card
                  variant="outlined"
                  sx={{ height: '100px', width: '100px', borderRadius: '50%' }}
                >
                  {enteredUser.user.photo ? (
                    <img
                      src={enteredUser.user.photo as unknown as string}
                      width="100%"
                      height="100%"
                      alt={enteredUser.user.firstName}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'secondary.main',
                      }}
                    >
                      {enteredUser.user.firstName.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </Card>
                <Stack flex={1}>
                  <Typography fontSize={32} fontWeight={500}>
                    {`${enteredUser.user.firstName} ${enteredUser.user.lastName}`}{' '}
                    <span>
                      {/* <UserStatus status={enteredUser.user.status} /> */}
                    </span>
                  </Typography>
                  <Typography>id : {enteredUser.user.id} </Typography>
                </Stack>
              </Stack>
              {enteredUser.user.subscriptions.map((sub) => (
                <Subscription
                  subscription={sub}
                  user={enteredUser.user as User}
                  key={sub.id}
                  refetchData={refetchData}
                />
              ))}
            </>
          )}
          <Stack direction="row" justifyContent="end" spacing={2} mt={2}>
            <Button variant="outlined" color="secondary" onClick={handleclose}>
              {t('actions.close')}
            </Button>
            <Button
              endIcon={<ArrowRightAltIcon />}
              variant="contained"
              onClick={navigateToUser}
            >
              {t('actions.goToUserInfo')}
            </Button>
          </Stack>
        </Card>
      </Modal>
    </>
  );
}

export default UserEntry;

import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Divider, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FreeSession as FreeSessionType, Subscription } from 'types';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(1.5),

    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  '& .MuiButtonBase-root': {
    textTransform: 'none',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 16,
    border: '1px solid!important',
    borderColor: `${theme.palette.primary.light}!important`,
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
    borderColor: `${theme.palette.primary.main}!important`,
  },
}));

interface Props {
  freeSessionsModalOpen: boolean;
  onFreeSessionModalClose: () => void;
}

const getTotal = (subscription: Subscription[], selected: string[]): number => {
  let total = 0;
  subscription.forEach((sub) => {
    if (selected.includes(sub.name)) {
      total += Number(sub.sessionPrice);
    }
  });
  return total;
};

function FreeSession({
  freeSessionsModalOpen,
  onFreeSessionModalClose,
}: Props) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selected, setSelected] = React.useState<any>(() => []);
  const [fullName, setFullName] = useState({ firstName: '', lastName: '' });

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    session: string[]
  ) => {
    setSelected(session);
  };

  const handleAddSession = async () => {
    const session: FreeSessionType = {
      id: new Date().getTime().toString(),
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      sessionType: subscriptions.filter((sub) => selected.includes(sub.name)),
      enteredAt: new Date().toDateString(),
      totalPaid: getTotal(subscriptions, selected).toString(),
    };

    await window.electron.createFreeSessions(session);
    toast.success('Sessions succesfully added !');
    onFreeSessionModalClose();
  };

  useEffect(() => {
    const getSettings = async () => {
      const res = await window.electron.getSettings();
      setSubscriptions(res.subscriptions);
    };
    getSettings();
  }, []);

  return (
    <Modal
      open={freeSessionsModalOpen}
      onClose={onFreeSessionModalClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ p: 5 }}>
        <Typography gutterBottom align="center" variant="h5">
          Free session entry
        </Typography>
        <StyledToggleButtonGroup
          // orientation="vertical"
          value={selected}
          onChange={handleFormat}
          aria-label="text formatting"
          sx={{
            '& .MuiButtonBase-root': {
              margin: '0px!important',
              borderColor: 'lightblue!important',
            },
            mt: 2,
            gap: 2,
          }}
        >
          {subscriptions?.map((subscription: Subscription) => (
            <ToggleButton
              sx={{ minWidth: '200px' }}
              key={subscription.name}
              value={subscription.name}
            >
              {/* @ts-ignore */}
              {/*  <img src={images[subscription.name]} width={40} alt="icon" /> */}
              <Stack alignItems="start">
                <Typography variant="h5">{subscription.name}</Typography>
                <Typography color="secondary">
                  {subscription.sessionPrice} DZD
                </Typography>
              </Stack>
            </ToggleButton>
          ))}
        </StyledToggleButtonGroup>

        {/*    <Stack direction="row" spacing={2} my={2}>
          <TextField
            sx={{ maxWidth: '200px' }}
            onChange={(e) =>
              setFullName({ ...fullName, firstName: e.target.value })
            }
            variant="outlined"
            label="first name"
            value={fullName.firstName}
          />
          <TextField
            sx={{ maxWidth: '200px' }}
            onChange={(e) =>
              setFullName({ ...fullName, lastName: e.target.value })
            }
            variant="outlined"
            label="last name"
            value={fullName.lastName}
          />
        </Stack> */}
        <Stack spacing={2} mt={2}>
          <Card sx={{ p: 1 }} variant="outlined">
            <Typography color="text.secondary" variant="h6" align="center">
              Total :{' '}
              <Typography variant="h5" component="span" color="secondary">
                {getTotal(subscriptions, selected)} DZD
              </Typography>
            </Typography>
          </Card>
          <Button onClick={handleAddSession} variant="contained" size="large">
            Confirm
          </Button>
        </Stack>
      </Card>
    </Modal>
  );
}

export default FreeSession;

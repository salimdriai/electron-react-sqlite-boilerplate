import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { FreeSession as FreeSessionType, SubscriptionPlan } from 'types';

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

const style = {
  '& .MuiButtonBase-root': {
    margin: '0px!important',
    borderColor: 'lightblue!important',
  },
  mt: 2,
  gap: 2,
};

interface Props {
  freeSessionsModalOpen: boolean;
  onFreeSessionModalClose: () => void;
}

const getTotal = (plans: SubscriptionPlan[], selected: string[]): number => {
  let total = 0;
  plans.forEach((plan) => {
    if (selected.includes(plan.name)) {
      total += Number(plan.sessionPrice);
    }
  });
  return total;
};

function FreeSession({
  freeSessionsModalOpen,
  onFreeSessionModalClose,
}: Props) {
  const [subscriptionsPlans, setSubscriptionsPlans] = useState<
    SubscriptionPlan[]
  >([]);

  const [selected, setSelected] = React.useState<any>(() => []);
  const [fullName, setFullName] = useState({ firstName: '', lastName: '' });

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    session: string[]
  ) => {
    setSelected(session);
  };

  const handleChangeName = (e: any) => {
    setFullName((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSession = async () => {
    const session: FreeSessionType = {
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      plansIds: subscriptionsPlans.map(({ id }) => id).join(','),
      enteredAt: new Date().toISOString(),
      totalPaid: getTotal(subscriptionsPlans, selected),
    };

    await window.electron.createFreeSessions(session);
    toast.success('Sessions succesfully added !');
    onFreeSessionModalClose();
  };

  useEffect(() => {
    const getPlans = async () => {
      const res = await window.electron.getSubscriptionPlans();
      setSubscriptionsPlans(res);
    };
    getPlans();
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
        <Typography gutterBottom variant="h5">
          Free session entry
        </Typography>
        <Divider />

        <Stack direction="row" spacing={2} my={2}>
          <TextField
            value={fullName.firstName}
            label="first name"
            name="firstName"
            onChange={handleChangeName}
            fullWidth
          />
          <TextField
            value={fullName.lastName}
            label="last name"
            name="lastName"
            onChange={handleChangeName}
            fullWidth
          />
        </Stack>
        <Divider />
        <StyledToggleButtonGroup
          value={selected}
          onChange={handleFormat}
          sx={style}
        >
          {subscriptionsPlans!.map((subscription: SubscriptionPlan) => (
            <ToggleButton
              sx={{ minWidth: '200px' }}
              key={subscription.id}
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

        <Stack spacing={2} mt={2}>
          <Card sx={{ p: 1 }} variant="outlined">
            <Typography color="text.secondary" variant="h6" align="center">
              Total :{' '}
              <Typography variant="h5" component="span" color="secondary">
                {getTotal(subscriptionsPlans, selected)} DZD
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

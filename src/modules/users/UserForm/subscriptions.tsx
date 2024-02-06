/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Subscription, SubscriptionPlan, User } from 'types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export interface IForm extends User {
  subscriptions: Subscription[];
}

interface ISubscriptions {
  subscriptions: Subscription[];
  setSubscriptions: (arg: any) => void;
  setDeletedSubscriptions: (subIds: any) => void;
}

export const monthsMsTimestamp = (monthsNumber: number): number => {
  return monthsNumber * 30 * 24 * 60 * 60 * 1000;
};

const dateAfterOneMonth = () => {
  const now = new Date().getTime() + monthsMsTimestamp(1);
  return new Date(now).toDateString();
};

const getSubscriptionInitial = (plan: SubscriptionPlan) => ({
  planId: plan.id as string,
  startedAt: new Date().toDateString(),
  endsAt: dateAfterOneMonth(),
  paid: plan.monthPrice,
  sessionsAvailable: plan.sessionsPerMonth,
  sessionsSpent: 0,
});

const Subscriptions = ({
  subscriptions,
  setSubscriptions,
  setDeletedSubscriptions,
}: ISubscriptions) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [targetDeleteId, setTargetDeleteId] = useState<string | undefined>(
    undefined
  );

  const onDateChange = (name: string, planId: string) => (value: Date) => {
    const date = new Date(value).toDateString();

    setSubscriptions((prev: Subscription[]) =>
      prev.map((subscription: Subscription) =>
        subscription.planId === planId
          ? { ...subscription, [name]: date }
          : subscription
      )
    );
  };

  const getPlan = (planId: string) => plans.find((plan) => plan.id === planId);

  const confirmRemoveSubscription = () => {
    setSubscriptions((prev: Subscription[]) =>
      prev.filter((sub) => sub.id !== targetDeleteId)
    );
    setDeletedSubscriptions((prev: any) => [...prev, targetDeleteId]);

    setTargetDeleteId(undefined);
  };

  const handleChangePlan = (_: any, node: any) => {
    const planId = node.props.value;
    const isExist = subscriptions.find((sub) => sub.planId === planId);

    if (isExist) {
      if (isExist.id) {
        setTargetDeleteId(isExist.id);
      } else {
        setSubscriptions((prev: Subscription[]) =>
          prev.filter((sub) => sub.planId !== planId)
        );
      }
    } else {
      const plan = getPlan(planId);
      const newSubscription = getSubscriptionInitial(plan as SubscriptionPlan);
      setSubscriptions((prev: Subscription[]) => [...prev, newSubscription]);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await window.electron.getSubscriptionPlans();
        setPlans(res);
      } catch (error) {
        console.log('ERR', error);
      }
    })();
  }, [subscriptions]);

  return (
    <Stack flex={1} spacing={2} component={Card} variant="outlined" p={2}>
      <Typography variant="h6" gutterBottom>
        Subscription
      </Typography>

      <Stack spacing={2}>
        <div>
          <FormControl fullWidth>
            <InputLabel>Subscription plans</InputLabel>
            <Select
              multiple
              value={subscriptions.map(({ planId }) => planId)}
              onChange={handleChangePlan}
              input={<OutlinedInput label="Subscription plans" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      color="primary"
                      key={value}
                      label={getPlan(value)?.name}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {plans.map((plan) => (
                <MenuItem
                  key={plan.id}
                  value={plan.id}
                  // style={getStyles(JSON.stringify(plan), selectedPlans, theme)}
                >
                  {plan.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {subscriptions.map((subscription) => (
          <Card
            key={subscription.id}
            component={Stack}
            p={2}
            spacing={2}
            variant="outlined"
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography color="primary" variant="h6">
                {getPlan(subscription.planId)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ( {getPlan(subscription.planId)?.monthPrice} / month )
              </Typography>
              <Box flex={1} />
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ '& .MuiOutlinedInput-input': { width: 130 } }}
            >
              <DatePicker
                name="startedAt"
                dateFormat="dd-MM-yyyy"
                customInput={<TextField fullWidth label="starts at" />}
                selected={new Date(subscription.startedAt ?? new Date())}
                onChange={onDateChange('startedAt', subscription.planId)}
                // disabled={!isPlanSelected(plan.id!)}
              />

              <DatePicker
                name="endsAt"
                dateFormat="dd-MM-yyyy"
                customInput={<TextField fullWidth label="ends at" />}
                selected={new Date(subscription.endsAt ?? new Date())}
                onChange={onDateChange('endsAt', subscription.planId)}
                // disabled={!isPlanSelected(plan.id!)}
              />
            </Stack>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={!!targetDeleteId}
        onClose={() => setTargetDeleteId(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>confirm remove subscription</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            do you really want to remove this
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTargetDeleteId(undefined)}>cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmRemoveSubscription}
            autoFocus
          >
            confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Subscriptions;

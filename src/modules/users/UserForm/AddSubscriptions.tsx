/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
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

export const monthsMsTimestamp = (monthsNumber: number): number => {
  return monthsNumber * 30 * 24 * 60 * 60 * 1000;
};

const onMonthFromDate = (date: Date | string) => {
  const oneMonthTimestamp = 30 * 24 * 60 * 60 * 1000;
  const start = new Date(date).getTime();
  return new Date(start + oneMonthTimestamp).toDateString();
};

const getSubscriptionInitial = (plan: SubscriptionPlan) => ({
  planId: plan.id as string,
  startedAt: new Date().toDateString(),
  endsAt: onMonthFromDate(new Date()),
  paid: plan.monthPrice,
  sessionsAvailable: plan.sessionsPerMonth,
  sessionsSpent: 0,
});

export interface IForm extends User {
  subscriptions: Subscription[];
}

interface IAddSubscriptions {
  subscriptions: Subscription[];
  setSubscriptions: (arg: any) => void;
  setDeletedSubscriptions: (subIds: any) => void;
  saveSubscriptions: () => void;
  cancelAddsubscription: () => void;
}

const AddSubscriptions = ({
  subscriptions,
  setSubscriptions,
  setDeletedSubscriptions,
  saveSubscriptions,
  cancelAddsubscription,
}: IAddSubscriptions) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [targetDeleteId, setTargetDeleteId] = useState<string | undefined>(
    undefined
  );

  const { t } = useTranslation();

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

  const deleteSubscription = (planId: string, subscriptionId?: string) => {
    if (subscriptionId) {
      setTargetDeleteId(subscriptionId);
    } else {
      setSubscriptions((prev: Subscription[]) =>
        prev.filter((sub) => sub.planId !== planId)
      );
    }
  };

  const handleChangePlan = (_: any, node: any) => {
    const planId = node.props.value;
    const existing = subscriptions.find((sub) => sub.planId === planId);

    if (existing) {
      deleteSubscription(planId, existing.id);
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
    <Stack spacing={2} component={Card} variant="outlined" p={4}>
      <Typography variant="h6" gutterBottom>
        {t('subscriptions.subscriptions')}
      </Typography>

      <Stack spacing={2}>
        <div>
          <FormControl fullWidth>
            <InputLabel> {t('settings.plans.plans')}</InputLabel>
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
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {subscriptions.length === 0 && (
          <Typography sx={{ py: 4 }} align="center">
            No plan selected
          </Typography>
        )}
        {subscriptions.map((subscription, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Card key={i} component={Stack} p={2} spacing={2} variant="outlined">
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
                ( {getPlan(subscription.planId)?.monthPrice} DA /{' '}
                {t('common.month')} )
              </Typography>
              <Box flex={1} />

              <IconButton
                onClick={() =>
                  deleteSubscription(subscription.planId, subscription.id)
                }
              >
                <DeleteIcon color="error" />
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
                customInput={<TextField fullWidth label={t('info.startsAt')} />}
                selected={new Date(subscription.startedAt ?? new Date())}
                onChange={onDateChange('startedAt', subscription.planId)}
              />

              <DatePicker
                name="endsAt"
                dateFormat="dd-MM-yyyy"
                customInput={<TextField fullWidth label={t('info.endsAt')} />}
                selected={new Date(subscription.endsAt ?? new Date())}
                onChange={onDateChange('endsAt', subscription.planId)}
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
        <DialogTitle>{t('subscriptions.delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('subscriptions.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTargetDeleteId(undefined)}>
            {t('actions.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmRemoveSubscription}
            autoFocus
          >
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Stack direction="row" spacing={2} pt={4}>
        <Button
          fullWidth
          onClick={cancelAddsubscription}
          size="large"
          variant="outlined"
        >
          {t('actions.cancel')}
        </Button>
        <Button
          fullWidth
          onClick={saveSubscriptions}
          size="large"
          variant="contained"
          color="secondary"
        >
          {t('actions.save')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddSubscriptions;

/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from '@mui/icons-material/Sync';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProgressBar from 'components/ProgressBar';
import RemainigDays from 'components/RemainingDays';
import { Payment, Subscription, SubscriptionPlan, User } from 'types';
import { formatDate } from 'utils';
import { useAppDispatch } from 'features/store';
import { createPayment } from 'features/payments/reducers';
import { getOneUser } from 'features/users/reducers';
import { calculateProgress } from './helpers';

enum StartFrom {
  Now = 'now',
  Expiration = 'expiration',
}

const onMonthFromDate = (date: Date | string) => {
  const oneMonthTimestamp = 30 * 24 * 60 * 60 * 1000;
  const start = new Date(date).getTime();
  return new Date(start + oneMonthTimestamp).toDateString();
};

interface IUserSubscription {
  subscription: Subscription;
  user: User;
  refetchData?: (arg: any) => void;
}

const UserSubscription = ({
  subscription,
  user,
  refetchData,
}: IUserSubscription) => {
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [renewType, setRenewType] = useState<StartFrom>(StartFrom.Now);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [renewSubscription, setRenewSubscription] =
    React.useState<Subscription | null>(null);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const calculateSessions = (spent: number, available: number) => {
    if (spent > available) {
      return spent - available;
    }
    return 0;
  };

  const savePayment = async (sub: Subscription) => {
    const payment: Payment = {
      subscriptionId: sub.id as string,
      userId: sub.userId,
      username: `${user.firstName} ${user.lastName}`,
      amount: paidAmount,
      paidAt: new Date().toDateString(),
      startedAt: sub.startedAt,
      endsAt: sub.endsAt,
    };
    dispatch(createPayment(payment));
  };

  const onChangeRenewType = (e: any) => {
    const type = e.target.value;
    setRenewType(type);
    const sub = user.subscriptions.find((s) => s.id === renewSubscription?.id)!;

    let startedAt: string;
    let endsAt: string;
    let sessionsSpent: number = 0;

    if (type === StartFrom.Now) {
      startedAt = new Date().toDateString();
      endsAt = onMonthFromDate(startedAt);
    } else {
      startedAt = sub.endsAt;
      endsAt = onMonthFromDate(sub.endsAt);
      sessionsSpent = calculateSessions(
        sub.sessionsSpent,
        sub.sessionsAvailable
      );
    }

    setRenewSubscription((prev: any) => ({
      ...prev,
      startedAt,
      endsAt,
      sessionsSpent,
    }));
  };

  const onDateChange = (name: string) => (value: Date) => {
    const date = new Date(value).toDateString();

    setRenewSubscription((prev: any) => ({
      ...prev,
      [name]: date,
    }));
  };

  const isExpired = (date: string) => {
    return new Date(date).getTime() < new Date().getTime();
  };

  const getPlan = (planId: string) => {
    return plans.find((plan) => plan.id === planId);
  };

  const confirmRenew = async () => {
    if (!paidAmount) {
      toast.error('Please add payment amount !');
      return;
    }

    setIsLoading(true);
    window.electron
      .updateSubscription(renewSubscription as Subscription)
      .then(() => {
        toast.success('success');
        savePayment(renewSubscription as Subscription);
        dispatch(getOneUser(renewSubscription?.userId as string));
      })
      .then(() => {
        if (refetchData) {
          refetchData(renewSubscription);
        }
        setRenewSubscription(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    (async () => {
      const res = await window.electron.getSubscriptionPlans();
      setPlans(res);
    })();
  }, [user, subscription]);

  if (isLoading) return <p>is Loading ...</p>;

  return (
    <>
      <Card
        variant="outlined"
        key={subscription.id}
        sx={{
          mb: 1,
          ...(isExpired(subscription.endsAt) && { borderColor: 'error.main' }),
        }}
      >
        <Stack
          p={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h6" color="primary" alignItems="center">
            {getPlan(subscription.planId)?.name}
          </Typography>
          <RemainigDays date={subscription.endsAt} />
          <Box flex={1} />
          <Button
            endIcon={<SyncIcon />}
            variant="contained"
            size="small"
            color="success"
            onClick={() => {
              setRenewSubscription({
                ...subscription,
                startedAt: new Date().toDateString(),
                endsAt: onMonthFromDate(new Date()),
              });
              const planPrice = getPlan(subscription.planId)?.monthPrice;
              setPaidAmount(planPrice || 0);
            }}
          >
            {t('actions.renew')}
          </Button>
        </Stack>
        <Divider />

        <CardContent sx={{ py: 0, display: 'flex', gap: 4, mb: 1 }}>
          <Typography variant="body2">
            {t('info.startsAt')} :<br />{' '}
            <b>{formatDate(subscription.startedAt)}</b>
          </Typography>
          <Typography variant="body2">
            {t('info.endsAt')} :<br /> <b>{formatDate(subscription.endsAt)}</b>
          </Typography>
          <Typography variant="body2">
            {t('info.sessionsSpent')} :<br />
            <b> {subscription.sessionsSpent}</b>
          </Typography>
        </CardContent>
        <ProgressBar
          progress={calculateProgress(
            subscription.startedAt,
            subscription.endsAt
          )}
        />
      </Card>
      <Modal
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        open={!!renewSubscription}
        onClose={() => setRenewSubscription(null)}
      >
        <Card sx={{ minWidth: '40%', p: 2, overflow: 'visible' }}>
          <CardHeader
            title={`${t('actions.renew')} ${t('subscriptions.subscriptions')}`}
            action={
              <IconButton onClick={() => setRenewSubscription(null)}>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent sx={{ py: 1 }}>
            <FormControl>
              <RadioGroup
                defaultValue="now"
                onChange={onChangeRenewType}
                value={renewType}
                name="renew"
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value={StartFrom.Now}
                  control={<Radio />}
                  label={`${t('subscriptions.startFromNow')} | ${formatDate(
                    new Date()
                  )}`}
                />
                <FormControlLabel
                  value={StartFrom.Expiration}
                  control={<Radio />}
                  label={`${t(
                    'subscriptions.startFromExpiration'
                  )} | ${formatDate(
                    user.subscriptions?.find(
                      (sub) => sub.id === renewSubscription?.id
                    )?.endsAt || new Date()
                  )}`}
                />
              </RadioGroup>

              <Stack
                direction="row"
                spacing={1}
                sx={{ '& .MuiOutlinedInput-input': { width: 130 } }}
              >
                <DatePicker
                  name="startedAt"
                  dateFormat="dd-MM-yyyy"
                  customInput={
                    <TextField fullWidth label={t('info.startsAt')} />
                  }
                  selected={
                    new Date(renewSubscription?.startedAt ?? new Date())
                  }
                  onChange={onDateChange('startedAt')}
                />

                <DatePicker
                  name="endsAt"
                  dateFormat="dd-MM-yyyy"
                  minDate={
                    new Date(renewSubscription?.startedAt ?? new Date()) ||
                    new Date()
                  }
                  customInput={<TextField fullWidth label={t('info.endsAt')} />}
                  selected={new Date(renewSubscription?.endsAt ?? new Date())}
                  onChange={onDateChange('endsAt')}
                />
                <TextField
                  label={t('payments.amount')}
                  type="number"
                  value={paidAmount}
                  InputProps={{ endAdornment: <>DA</> }}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                />
              </Stack>
            </FormControl>
          </CardContent>

          <CardActions sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setRenewSubscription(null)}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={confirmRenew}
            >
              {t('actions.confirm')}
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
};

export default UserSubscription;

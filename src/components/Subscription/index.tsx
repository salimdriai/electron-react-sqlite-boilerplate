/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React, { useEffect, useMemo, useState } from 'react';

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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from '@mui/icons-material/Sync';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProgressBar from 'components/ProgressBar';
import RemainigDays from 'components/RemainingDays';
import { Payment, Subscription, SubscriptionPlan, User } from 'types';
import { formatDate } from 'utils';
import { useAppDispatch, useAppSelector } from 'features/store';
import { createPayment, getUserPayments } from 'features/payments/reducers';
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
  const [payRemaining, setPayRemaining] = useState({
    open: false,
    amount: 0,
    payment: null,
  });
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [renewType, setRenewType] = useState<StartFrom>(StartFrom.Now);
  const [payment, setPayment] = useState<{
    paid: null | number;
    remaining: null | number;
  }>({
    paid: null,
    remaining: null,
  });

  const [renewSubscription, setRenewSubscription] =
    React.useState<Subscription | null>(null);

  const { t } = useTranslation();
  const { userPayments } = useAppSelector((state) => state.payments);
  const paymentsWithCredit = useMemo(
    () =>
      userPayments.filter(
        (p) => p.subscriptionId === subscription.id && p.remaining! > 0
      ),
    [userPayments, subscription]
  );

  const dispatch = useAppDispatch();

  const calculateSessions = (spent: number, available: number) => {
    if (spent > available) {
      return spent - available;
    }
    return 0;
  };

  const savePayment = async (sub: Subscription) => {
    const paymentData: Payment = {
      subscriptionId: sub.id as string,
      userId: sub.userId,
      username: `${user.firstName} ${user.lastName}`,
      amount: payment.paid,
      remaining: payment.remaining,
      paidAt: new Date().toDateString(),
      startedAt: sub.startedAt,
      endsAt: sub.endsAt,
    };
    dispatch(createPayment(paymentData));
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

  const confimPayRemaining = async () => {
    const oldPaid = Number((payRemaining.payment as any)?.amount);
    const oldRemaining = Number((payRemaining.payment as any)?.remaining);

    const peymentData = {
      ...(payRemaining.payment as any),
      amount: oldPaid + payRemaining.amount,
      remaining: oldRemaining - payRemaining.amount,
    };

    await window.electron.updatePayment(peymentData);
    dispatch(getUserPayments(user.id));
    setPayRemaining({ amount: 0, open: false, payment: null });
  };

  useEffect(() => {
    (async () => {
      const res = await window.electron.getSubscriptionPlans();
      setPlans(res);
    })();
    dispatch(getUserPayments(user.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              setPayment({ paid: planPrice || 0, remaining: 0 });
            }}
          >
            {t('actions.renew')}
          </Button>
        </Stack>
        <Divider />

        <CardContent sx={{ display: 'flex', gap: 4, mb: 1 }}>
          <Stack flex={4} direction="row" spacing={4}>
            <Typography variant="body2">
              {t('info.startsAt')} :<br />{' '}
              <b>{formatDate(subscription.startedAt)}</b>
            </Typography>
            <Typography variant="body2">
              {t('info.endsAt')} :<br />{' '}
              <b>{formatDate(subscription.endsAt)}</b>
            </Typography>
            <Typography variant="body2">
              {t('info.sessionsSpent')} :<br />
              <b>
                {' '}
                {subscription.sessionsSpent} /{' '}
                {getPlan(subscription.planId)?.sessionsPerMonth}
              </b>
            </Typography>
          </Stack>
          <Stack flex={2}>
            <Typography variant="body2">
              {t('payments.remaining')} :<br />
              {paymentsWithCredit.length === 0 && <b> 0 DA</b>}
            </Typography>
            {paymentsWithCredit.map((p) => (
              <Stack
                component={Card}
                variant="outlined"
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                spacing={2}
                pl={1}
                mb={0.5}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Typography variant="h6" color="error">
                  {' '}
                  {p.remaining} DA{' '}
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() =>
                    setPayRemaining({
                      open: true,
                      amount: Number(p.remaining),
                      payment: p as any,
                    })
                  }
                >
                  {t('payments.pay')}
                </Button>{' '}
              </Stack>
            ))}
          </Stack>
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
                  value={payment.paid}
                  InputProps={{ endAdornment: <>DA</> }}
                  onChange={(e) =>
                    setPayment({ ...payment, paid: Number(e.target.value) })
                  }
                />
                <TextField
                  label={t('payments.remaining')}
                  type="number"
                  value={payment.remaining}
                  InputProps={{ endAdornment: <>DA</> }}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      remaining: Number(e.target.value),
                    })
                  }
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
      <Dialog
        open={payRemaining.open}
        onClose={() =>
          setPayRemaining({ amount: 0, open: false, payment: null })
        }
        maxWidth="md"
        sx={{ '& .MuiPaper-root': { minWidth: '400px' } }}
      >
        <DialogTitle>{t('info.confirmPayment')}</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ my: 2 }}
            label={t('payments.amount')}
            fullWidth
            type="number"
            value={payRemaining.amount}
            onChange={(e) =>
              setPayRemaining({
                ...payRemaining,
                amount: Number(e.target.value),
              })
            }
            InputProps={{
              endAdornment: <>DA</>,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() =>
              setPayRemaining({ amount: 0, open: false, payment: null })
            }
          >
            {t('actions.cancel')}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={confimPayRemaining}
          >
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSubscription;

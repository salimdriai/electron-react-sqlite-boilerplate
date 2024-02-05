/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useState } from 'react';

import { UseFormReturn } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Subscription, SubscriptionPlan, User } from 'types';

export interface IForm extends User {
  subscriptions: Subscription[];
}

interface ISubscriptions {
  formMethods: UseFormReturn<IForm>;
  subscriptions: Subscription[];
  setSubscriptions: (arg: any) => void;
}

export const monthsMsTimestamp = (monthsNumber: number): number => {
  return monthsNumber * 30 * 24 * 60 * 60 * 1000;
};

const dateAfterOneMonth = () => {
  const now = new Date().getTime() + monthsMsTimestamp(1);
  return new Date(now).toDateString();
};

const getSubscriptionInitial = (plan: SubscriptionPlan, userId: string) => ({
  userId,
  planId: plan.id as string,
  startedAt: new Date().toDateString(),
  endsAt: dateAfterOneMonth(),
  paid: plan.monthPrice,
  sessionsAvailable: plan.sessionsPerMonth,
  sessionsSpent: 0,
  lastEntryTimestamp: 0,
});

const Subscriptions = ({
  formMethods,
  subscriptions,
  setSubscriptions,
}: ISubscriptions) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [age, setAge] = useState('1');
  const [quickDuration, setquickDuration] = useState<string[]>([]);

  const { watch } = formMethods;

  const handleChangeDuration = (plan) => (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  const onClickManuaDuration = (planId: string) => (e: any) => {
    e.preventDefault();
    setquickDuration((prev) => prev.filter((id) => id !== planId));
  };

  // const onClickSelection = (planId: string) => (e: any) => {
  //   e.preventDefault();
  //   setquickDuration((prev) => [...prev, planId]);
  // };

  const onCheckPlan = (plan: SubscriptionPlan) => (e: any) => {
    const { checked } = e.target;
    if (checked) {
      const initialSubscription = getSubscriptionInitial(plan, watch('id'));
      setSubscriptions((prev) => [...prev, initialSubscription]);
    } else {
      setSubscriptions((prev) =>
        prev.filter(({ planId }) => planId !== plan.id!)
      );
    }
  };

  const onDateChange =
    ({ id }: SubscriptionPlan, name: string) =>
    (value: Date) => {
      const date = new Date(value).toDateString();
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.planId === id ? { ...sub, [name]: date } : sub))
      );
    };

  const isPlanSelected = useCallback(
    (id: string) => subscriptions.some(({ planId }) => planId === id),
    [subscriptions]
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await window.electron.getSubscriptionPlans();
        setPlans(res);
      } catch (error) {
        console.log('ERR', error);
      }
    })();
  }, []);

  return (
    <Stack flex={1} spacing={2} component={Card} variant="outlined" p={2}>
      <Typography variant="h6" gutterBottom>
        Subscription
      </Typography>

      <Stack spacing={1}>
        {plans.map((plan) => (
          <Card
            variant={isPlanSelected(plan.id!) ? 'outlined' : 'elevation'}
            key={plan.id}
            component={Stack}
            p={2}
            spacing={2}
            sx={{ borderColor: 'success.main' }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="start"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size={'large' as any}
                    name={plan.id}
                    checked={subscriptions.some(
                      ({ planId }) => planId === plan.id
                    )}
                    onChange={onCheckPlan(plan)}
                  />
                }
                label={plan.name}
              />

              {quickDuration.includes(plan.id!) ? (
                <FormControl sx={{ width: 160 }}>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={age}
                    label="Months"
                    size="medium"
                    onChange={handleChangeDuration}
                    disabled={!isPlanSelected(plan.id!)}
                  >
                    {Array.from(Array(12).keys()).map((_, i) => (
                      <MenuItem value={i + 1}>{i + 1} month</MenuItem>
                    ))}
                  </Select>
                  <Link
                    component="button"
                    align="right"
                    variant="body2"
                    onClick={onClickManuaDuration(plan.id as string)}
                  >
                    custom duration
                  </Link>
                </FormControl>
              ) : (
                <Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ '& .MuiOutlinedInput-input': { width: 130 } }}
                  >
                    <DatePicker
                      name="startedAt"
                      dateFormat="dd-MM-yyyy"
                      customInput={<TextField fullWidth label="starts at" />}
                      selected={
                        new Date(
                          subscriptions.find(
                            ({ planId }) => planId === plan.id!
                          )?.startedAt ?? new Date()
                        )
                      }
                      onChange={onDateChange(plan, 'startedAt')}
                      disabled={!isPlanSelected(plan.id!)}
                    />
                    <DatePicker
                      name="endsAt"
                      dateFormat="dd-MM-yyyy"
                      customInput={<TextField fullWidth label="ends at" />}
                      selected={
                        new Date(
                          subscriptions.find(
                            ({ planId }) => planId === plan.id!
                          )?.endsAt ?? new Date()
                        )
                      }
                      onChange={onDateChange(plan, 'endsAt')}
                      disabled={!isPlanSelected(plan.id!)}
                    />
                  </Stack>
                  {/* <Link
                    component="button"
                    align="right"
                    variant="body2"
                    onClick={onClickSelection(plan.id as string)}
                  >
                    quick selection
                  </Link> */}
                </Stack>
              )}
            </Stack>
            <Typography variant="body2">
              Month price : {plan.monthPrice}
            </Typography>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default Subscriptions;

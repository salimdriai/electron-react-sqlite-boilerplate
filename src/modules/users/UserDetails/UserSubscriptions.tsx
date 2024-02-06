import React, { useEffect, useState } from 'react';

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
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { Subscription, SubscriptionPlan, User } from 'types';

enum StartFrom {
  Now = 'now',
  LastSub = 'last_sub',
}

const getDateRange = (
  startFrom: string,
  amount: number,
  lastSubDate: string
) => {
  const thirtyDays = 2_592_000_000;
  const monthsAdded = thirtyDays * Number(amount);

  if (startFrom === StartFrom.Now) {
    const startDate = new Date().getTime();
    const endDate = startDate + monthsAdded;

    return `${new Date(startDate).toDateString()} - ${new Date(
      endDate
    ).toDateString()}`;
  }
  const startDate = new Date(lastSubDate).getTime();
  const endDate = startDate + monthsAdded;
  return `${new Date(startDate).toDateString()} - ${new Date(
    endDate
  ).toDateString()}`;
};

type Extend = {
  name: string;
  amount: number;
  startFrom: StartFrom;
  lastSubEndDate: string;
};

function UserSubscriptions({ user }: { user: User }) {
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  const [extend, setExtend] = React.useState<Extend[]>([]);
  const { t } = useTranslation();

  const handleStartFromChange = (e: any) => {
    const { name, value } = e.target;
    setExtend((prev: any) =>
      prev.map((p: Extend) => {
        if (p.name === name) {
          return { ...p, startFrom: value };
        }
        return p;
      })
    );
  };

  const getPlan = (planId: string) => {
    return plans.find((plan) => plan.id === planId);
  };

  useEffect(() => {
    const getPlans = async () => {
      const res = await window.electron.getSubscriptionPlans();
      setPlans(res);
    };
    getPlans();
  }, [user]);

  return (
    <Stack spacing={1}>
      {user.subscriptions!.map((sub: Subscription) => (
        <Card variant="outlined" key={sub.id}>
          <Stack p={2}>
            <Typography gutterBottom variant="h6" color="primary">
              {getPlan(sub.planId)?.name}
            </Typography>
            <Divider />
          </Stack>

          <CardContent sx={{ py: 0, display: 'flex', gap: 4 }}>
            <Typography>
              {t('info.startsAt')} : {sub.startedAt}
            </Typography>
            <Typography>
              {t('info.endsAt')} : {sub.endsAt}
            </Typography>
            <Typography>
              {t('info.sessionsSpent')} : {sub.sessionsSpent}
            </Typography>
          </CardContent>
        </Card>
      ))}
      {/* <Button
        variant="contained"
        disabled={!extend.find((e) => e.amount !== 0)}
        onClick={() => setConfirmationModalOpen(true)}
      >
        Confirm
      </Button> */}
      <Modal
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
      >
        <Card sx={{ minWidth: '40%', p: 4 }}>
          <CardHeader
            title="Confirm subscription extend ."
            action={
              <IconButton onClick={() => setConfirmationModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent sx={{ py: 1 }}>
            {extend.map(
              (e) =>
                e.amount !== 0 && (
                  <Card variant="outlined" sx={{ p: 2, mb: 1 }}>
                    <Typography variant="subtitle1">
                      {e.name} : <b>+{e.amount}</b> month
                    </Typography>
                    <FormControl>
                      <RadioGroup
                        row
                        defaultValue="now"
                        onChange={handleStartFromChange}
                        name={e.name}
                      >
                        <FormControlLabel
                          value={StartFrom.Now}
                          control={<Radio size="small" />}
                          label="Start from now"
                        />
                        <FormControlLabel
                          disabled={!e.lastSubEndDate}
                          value={StartFrom.LastSub}
                          control={<Radio size="small" />}
                          label="Start from last end date"
                        />
                      </RadioGroup>
                    </FormControl>
                    <Typography variant="body2" color="text.secondary">
                      {getDateRange(e.startFrom, e.amount, e.lastSubEndDate)}
                    </Typography>
                  </Card>
                )
            )}
          </CardContent>
          <CardActions sx={{ p: 2 }}>
            <Button fullWidth variant="contained">
              Confirm
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </Stack>
  );
}

export default UserSubscriptions;

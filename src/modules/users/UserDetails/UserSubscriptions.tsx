import React from 'react';
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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { User, UserSubscription } from 'types';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: 12,
  '& .MuiToggleButtonGroup-grouped': {
    textTransform: 'none',
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
    '&.Mui-disabled': {
      border: 0,
    },
    border: '1px solid!important',
  },
  '& .Mui-selected': {
    borderColor: `${theme.palette.success.dark}!important`,
  },
}));

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

  const [extend, setExtend] = React.useState<Extend[]>(
    user.currentSubscriptions.map((sub) => ({
      name: sub.subscription.name,
      amount: 0,
      startFrom: StartFrom.Now,
      lastSubEndDate: sub.endsAt,
    }))
  );

  const handleExtend =
    (targetName: string) =>
    (event: React.MouseEvent<HTMLElement>, value: string) => {
      if (value === null) {
        setExtend((prev: any) =>
          prev.map((p: Extend) => {
            if (p.name === targetName) {
              return { ...p, amount: 0 };
            }
            return p;
          })
        );
        return;
      }

      const [name, amount] = value.split('.');
      setExtend((prev: any) =>
        prev.map((p: Extend) => {
          if (p.name === name) {
            return { ...p, amount: Number(amount) };
          }
          return p;
        })
      );
    };

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
    console.log('e', extend);
  };

  return (
    <Stack spacing={1}>
      {user.currentSubscriptions.map((sub: UserSubscription, i) => (
        <Card variant="outlined" key={sub.subscription.name}>
          <CardHeader
            sx={{ pt: 2 }}
            title={sub.subscription.name}
            action={
              <Stack direction="row" spacing={1}>
                <StyledToggleButtonGroup
                  size="small"
                  value={`${extend[i].name}.${extend[i].amount}`}
                  exclusive
                  onChange={handleExtend(sub.subscription.name)}
                >
                  <ToggleButton value={`${sub.subscription.name}.1`}>
                    +1 Month
                  </ToggleButton>
                  <ToggleButton value={`${sub.subscription.name}.2`}>
                    +2 Months
                  </ToggleButton>
                  <ToggleButton value={`${sub.subscription.name}.3`}>
                    +3 Months
                  </ToggleButton>
                </StyledToggleButtonGroup>
              </Stack>
            }
          />

          <CardContent sx={{ py: 0, display: 'flex', gap: 4 }}>
            <Typography>started at : {sub.startedAt}</Typography>
            <Typography>ends at : {sub.endsAt}</Typography>
            <Typography>sessions spent : {sub.sessionsSpent}</Typography>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        disabled={!extend.find((e) => e.amount !== 0)}
        onClick={() => setConfirmationModalOpen(true)}
      >
        Confirm
      </Button>
      <Modal
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
      >
        <Card sx={{ minWidth: '40%' }}>
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

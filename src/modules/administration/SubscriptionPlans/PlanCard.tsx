import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { SubscriptionPlan } from 'types';

export interface Props {
  subscriptionPlan: SubscriptionPlan;
  editPlan: null | SubscriptionPlan;
  setEditPlan: (edit: null | SubscriptionPlan) => void;
  updatePlan: () => void;
}

function PlanCard(props: Props) {
  const { subscriptionPlan, setEditPlan, editPlan, updatePlan } = props;
  const { t } = useTranslation();

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setEditPlan({ ...editPlan, [name]: value } as any);
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <CardHeader
        sx={{ p: 0, mb: 1 }}
        title={<Typography>{subscriptionPlan.name}</Typography>}
        action={
          <Stack direction="row" spacing={2}>
            {editPlan && editPlan.id === subscriptionPlan.id && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={updatePlan}
              >
                {t('actions.save')}
              </Button>
            )}
            <IconButton
              onClick={() => setEditPlan(editPlan ? null : subscriptionPlan)}
            >
              {editPlan && editPlan.id === subscriptionPlan.id ? (
                <CloseIcon />
              ) : (
                <EditIcon />
              )}
            </IconButton>
          </Stack>
        }
      />
      <Divider />
      <Stack direction="row" spacing={2} mt={2}>
        {editPlan && editPlan.id === subscriptionPlan.id ? (
          <>
            <TextField
              size="small"
              name="name"
              label={t(`common.name`)}
              value={editPlan.name}
              onChange={onChange}
            />
            <TextField
              size="small"
              name="monthPrice"
              label={t(`settings.plans.monthPrice`)}
              value={editPlan.monthPrice}
              onChange={onChange}
              InputProps={{ endAdornment: <>DA</> }}
            />
            <TextField
              size="small"
              name="sessionPrice"
              label={t(`settings.plans.sessionPrice`)}
              value={editPlan.sessionPrice}
              onChange={onChange}
              InputProps={{ endAdornment: <>DA</> }}
            />
            <TextField
              size="small"
              name="sessionsPerMonth"
              label={t(`settings.plans.sessionsPerMonth`)}
              value={editPlan.sessionsPerMonth}
              onChange={onChange}
            />
          </>
        ) : (
          Object.entries(subscriptionPlan).map(
            ([key, value]) =>
              key !== 'id' &&
              key !== 'name' && (
                <ListItemText
                  key={key}
                  sx={{ width: 80 }}
                  primary={
                    <Typography color="text.secondary" variant="body2">
                      {t(`settings.plans.${key}`)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1">
                      {value} {key !== 'sessionsPerMonth' && 'DA'}
                    </Typography>
                  }
                />
              )
          )
        )}
      </Stack>
    </Card>
  );
}

export default PlanCard;

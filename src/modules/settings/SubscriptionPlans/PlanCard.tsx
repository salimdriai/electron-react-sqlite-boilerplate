import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import CardHeader from '@mui/material/CardHeader';
import { SubscriptionPlan } from 'types';

export interface Props {
  subscriptionPlan: SubscriptionPlan;
}

function PlanCard(props: Props) {
  const { subscriptionPlan } = props;
  const { t } = useTranslation();

  return (
    <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
      <CardHeader sx={{ p: 0 }} title={subscriptionPlan.name} />
      <Stack direction="row" spacing={2} mt={2}>
        {Object.entries(subscriptionPlan).map(([key, value]) => (
          <ListItemText
            sx={{ width: 80 }}
            primary={
              <Typography color="text.secondary" variant="body2">
                {t(key)}
              </Typography>
            }
            secondary={<Typography variant="body1">{value}</Typography>}
          />
        ))}
      </Stack>
    </Card>
  );
}

export default PlanCard;

import * as React from 'react';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import DeleteIcon from '@mui/icons-material/Delete';

import { Subscription } from 'types';
import { displayFormat } from 'utils';

export interface Props {
  subscription: Subscription;
  onChange: (i: any) => void;
  onClickDelete: () => void;
}

function SubscriptionCard(props: Props) {
  const { subscription, onChange, onClickDelete } = props;
  return (
    <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
      <CardHeader
        sx={{ p: 0 }}
        title={subscription.name}
        action={
          <IconButton onClick={onClickDelete}>
            <DeleteIcon color="error" />
          </IconButton>
        }
      />
      <Stack direction="row" spacing={2} mt={2}>
        {Object.keys(subscription).map((key) => (
          <TextField
            type={key === 'name' ? 'text' : 'number'}
            name={key}
            onChange={onChange}
            // @ts-ignore
            defaultValue={subscription[key]}
            label={displayFormat(key)}
            // @ts-ignore
            value={subscription[key]}
          />
        ))}
      </Stack>
    </Card>
  );
}

export default SubscriptionCard;

import * as React from 'react';

import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import { Subscription } from 'types';

export interface Props {
  newSub: Subscription;
  onChange: (e: any) => void;
}

function NewSubscription(props: Props) {
  const { newSub, onChange } = props;
  const { t } = useTranslation();

  return (
    <CardContent>
      <Card elevation={5} sx={{ p: 2, mt: 2 }}>
        <Stack direction="row" spacing={2} mt={2}>
          {Object.keys(newSub).map((key) => (
            <TextField
              type={key === 'name' ? 'text' : 'number'}
              name={key}
              onChange={onChange}
              // @ts-ignore
              defaultValue={newSub[key]}
              label={t(key)}
              // @ts-ignore
              value={newSub[key]}
            />
          ))}
        </Stack>
      </Card>
    </CardContent>
  );
}

export default NewSubscription;

import * as React from 'react';

import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import InfoIcon from '@mui/icons-material/Info';

export interface Props {
  value: string;
  onChange: (e: any) => void;
}

function GymInfo(props: Props) {
  const { value, onChange } = props;

  return (
    <Card variant="outlined">
      <CardHeader title="Gym info" action={<InfoIcon color="secondary" />} />
      <CardContent>
        <TextField
          label="gym name"
          defaultValue={value}
          value={value}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
}

export default GymInfo;

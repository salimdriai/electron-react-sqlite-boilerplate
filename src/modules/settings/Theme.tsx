import * as React from 'react';

import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { Themes } from 'types';

export interface IAppProps {
  checked: boolean;
  onChange: (e: any) => void;
}

function Theme(props: IAppProps) {
  const { checked, onChange } = props;

  return (
    <Card variant="outlined" sx={{ width: 200 }}>
      <CardHeader title="Theme" action={<DarkModeIcon color="secondary" />} />
      <CardContent>
        <FormControlLabel
          control={<Switch onChange={onChange} checked={checked} />}
          label={Themes.Dark}
        />
      </CardContent>
    </Card>
  );
}
export default Theme;

import * as React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import LanguageIcon from '@mui/icons-material/Language';

import { Lang } from 'types';

export interface Props {
  value: string;
  onChange: (e: any) => void;
}

function Language(props: Props) {
  const { value, onChange } = props;
  return (
    <Card variant="outlined">
      <CardHeader
        title="Language"
        action={<LanguageIcon color="secondary" />}
      />
      <CardContent>
        <Select sx={{ width: 200 }} value={value} onChange={onChange}>
          {Object.keys(Lang).map((key: string) => (
            <MenuItem key={key} value={(Lang as any)[key]}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </CardContent>
    </Card>
  );
}

export default Language;
